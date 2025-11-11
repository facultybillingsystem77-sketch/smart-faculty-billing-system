import { WorkloadClassifier } from './classifier';

export interface ValidationIssue {
  type: 'overlap' | 'impossible_hours' | 'suspicious_pattern' | 'anomaly';
  severity: 'low' | 'medium' | 'high';
  message: string;
  suggestions: string[];
}

export interface ValidationResult {
  isValid: boolean;
  issues: ValidationIssue[];
  confidence: number;
  suggestions: string[];
}

interface WorkloadEntry {
  id?: number;
  date: Date;
  timeIn: string;
  timeOut: string;
  totalHours: number;
  activity: string;
  userId: number;
}

export class WorkloadValidator {
  private classifier: WorkloadClassifier;

  constructor() {
    this.classifier = new WorkloadClassifier();
  }

  async validateWorkload(
    entry: WorkloadEntry,
    existingEntries: WorkloadEntry[] = []
  ): Promise<ValidationResult> {
    const issues: ValidationIssue[] = [];
    const suggestions: string[] = [];

    // 1. Check for time overlaps
    const overlapIssues = this.checkTimeOverlaps(entry, existingEntries);
    issues.push(...overlapIssues);

    // 2. Check for impossible hours
    const impossibleIssues = this.checkImpossibleHours(entry);
    issues.push(...impossibleIssues);

    // 3. Check for suspicious patterns
    const patternIssues = await this.checkSuspiciousPatterns(entry, existingEntries);
    issues.push(...patternIssues);

    // 4. Check for anomalies using ML approach
    const anomalyIssues = await this.detectAnomalies(entry, existingEntries);
    issues.push(...anomalyIssues);

    // 5. Auto-classify activity
    const classification = this.classifier.classify(entry.activity);
    if (classification.confidence > 0.7) {
      suggestions.push(`Activity appears to be: ${classification.category} (${Math.round(classification.confidence * 100)}% confidence)`);
    }

    // Calculate overall confidence
    const highSeverityIssues = issues.filter(i => i.severity === 'high').length;
    const mediumSeverityIssues = issues.filter(i => i.severity === 'medium').length;
    const confidence = Math.max(0, 1 - (highSeverityIssues * 0.5 + mediumSeverityIssues * 0.3));

    return {
      isValid: highSeverityIssues === 0,
      issues,
      confidence,
      suggestions
    };
  }

  private checkTimeOverlaps(entry: WorkloadEntry, existingEntries: WorkloadEntry[]): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    
    for (const existing of existingEntries) {
      if (existing.id === entry.id) continue;
      
      if (this.isSameDay(entry.date, existing.date)) {
        const entryStart = this.parseTime(entry.timeIn);
        const entryEnd = this.parseTime(entry.timeOut);
        const existingStart = this.parseTime(existing.timeIn);
        const existingEnd = this.parseTime(existing.timeOut);

        if (this.isOverlapping(entryStart, entryEnd, existingStart, existingEnd)) {
          issues.push({
            type: 'overlap',
            severity: 'high',
            message: `Time overlap detected with existing entry (${existing.timeIn}-${existing.timeOut})`,
            suggestions: [
              'Adjust time to avoid overlap',
              'Check if this is a continuation of previous work',
              'Consider combining entries if same activity'
            ]
          });
        }
      }
    }

    return issues;
  }

  private checkImpossibleHours(entry: WorkloadEntry): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    
    // Check if timeIn is before timeOut
    const startTime = this.parseTime(entry.timeIn);
    const endTime = this.parseTime(entry.timeOut);
    
    if (endTime <= startTime) {
      issues.push({
        type: 'impossible_hours',
        severity: 'high',
        message: 'End time must be after start time',
        suggestions: ['Correct the time-out to be after time-in']
      });
    }

    // Check for unrealistically long sessions
    if (entry.totalHours > 12) {
      issues.push({
        type: 'impossible_hours',
        severity: 'medium',
        message: 'Work session exceeds 12 hours',
        suggestions: [
          'Break into multiple shorter sessions',
          'Verify if this includes breaks',
          'Consider splitting across multiple days'
        ]
      });
    }

    // Check for very short sessions (less than 15 minutes)
    if (entry.totalHours < 0.25) {
      issues.push({
        type: 'impossible_hours',
        severity: 'low',
        message: 'Work session is very short (less than 15 minutes)',
        suggestions: [
          'Consider if this is worth logging',
          'Check if time was rounded incorrectly'
        ]
      });
    }

    return issues;
  }

  private async checkSuspiciousPatterns(entry: WorkloadEntry, existingEntries: WorkloadEntry[]): Promise<ValidationIssue[]> {
    const issues: ValidationIssue[] = [];
    
    // Check for identical entries
    const identicalEntries = existingEntries.filter(e => 
      e.id !== entry.id &&
      e.activity.toLowerCase() === entry.activity.toLowerCase() &&
      e.totalHours === entry.totalHours &&
      this.isSameDay(e.date, entry.date)
    );

    if (identicalEntries.length > 0) {
      issues.push({
        type: 'suspicious_pattern',
        severity: 'medium',
        message: 'Identical work entry already exists for this day',
        suggestions: [
          'Verify if this is a duplicate entry',
          'Consider if work was actually repeated'
        ]
      });
    }

    // Check for excessive hours in a day
    const sameDayEntries = existingEntries.filter(e => 
      e.id !== entry.id && this.isSameDay(e.date, entry.date)
    );
    
    const totalHoursForDay = sameDayEntries.reduce((sum, e) => sum + e.totalHours, 0) + entry.totalHours;
    
    if (totalHoursForDay > 16) {
      issues.push({
        type: 'suspicious_pattern',
        severity: 'high',
        message: `Total work hours for day exceed 16 hours (${totalHoursForDay.toFixed(1)}h)`,
        suggestions: [
          'Review all entries for this day',
          'Ensure breaks are accounted for',
          'Check for data entry errors'
        ]
      });
    }

    return issues;
  }

  private async detectAnomalies(entry: WorkloadEntry, existingEntries: WorkloadEntry[]): Promise<ValidationIssue[]> {
    const issues: ValidationIssue[] = [];
    
    if (existingEntries.length < 5) {
      return issues; // Need more data for anomaly detection
    }

    // Simple statistical anomaly detection
    const sameUserEntries = existingEntries.filter(e => 
      e.userId === entry.userId && e.id !== entry.id
    );

    if (sameUserEntries.length >= 5) {
      // Check for unusual duration
      const durations = sameUserEntries.map(e => e.totalHours).sort((a, b) => a - b);
      const q1 = durations[Math.floor(durations.length * 0.25)];
      const q3 = durations[Math.floor(durations.length * 0.75)];
      const iqr = q3 - q1;
      const lowerBound = q1 - 1.5 * iqr;
      const upperBound = q3 + 1.5 * iqr;

      if (entry.totalHours < lowerBound || entry.totalHours > upperBound) {
        issues.push({
          type: 'anomaly',
          severity: 'medium',
          message: 'Work duration is unusual compared to typical patterns',
          suggestions: [
            'Verify the accuracy of time logged',
            'Consider if this represents exceptional circumstances',
            'Check for data entry errors'
          ]
        });
      }
    }

    return issues;
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.toDateString() === date2.toDateString();
  }

  private parseTime(timeStr: string): number {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private isOverlapping(start1: number, end1: number, start2: number, end2: number): boolean {
    return start1 < end2 && start2 < end1;
  }
}