export type WorkloadCategory = 'lecture' | 'lab' | 'evaluation' | 'admin_work' | 'research_work';

interface ClassificationResult {
  category: WorkloadCategory;
  confidence: number;
}

export class WorkloadClassifier {
  private keywords: Record<WorkloadCategory, string[]> = {
    lecture: [
      'lecture', 'teach', 'class', 'lesson', 'instruction', 'seminar', 'tutorial',
      'deliver', 'present', 'explain', 'demonstrate', 'conduct', 'course', 'subject'
    ],
    lab: [
      'lab', 'laboratory', 'practical', 'experiment', 'workshop', 'hands-on',
      'demonstration', 'session', 'exercise', 'project work', 'technical'
    ],
    evaluation: [
      'exam', 'test', 'assessment', 'evaluation', 'grading', 'marking', 'checking',
      'correction', 'paper', 'quiz', 'viva', 'practical exam', 'oral test'
    ],
    admin_work: [
      'meeting', 'committee', 'administrative', 'coordination', 'planning',
      'scheduling', 'documentation', 'report', 'department work', 'faculty meeting'
    ],
    research_work: [
      'research', 'publication', 'paper', 'journal', 'conference', 'project',
      'innovation', 'development', 'study', 'investigation', 'analysis'
    ]
  };

  classify(activity: string): ClassificationResult {
    const text = activity.toLowerCase();
    const scores: Record<WorkloadCategory, number> = {
      lecture: 0,
      lab: 0,
      evaluation: 0,
      admin_work: 0,
      research_work: 0
    };

    // Calculate scores for each category
    for (const [category, keywords] of Object.entries(this.keywords)) {
      for (const keyword of keywords) {
        if (text.includes(keyword)) {
          scores[category as WorkloadCategory] += 1;
        }
      }
    }

    // Find the category with highest score
    let maxScore = 0;
    let predictedCategory: WorkloadCategory = 'lecture';
    
    for (const [category, score] of Object.entries(scores)) {
      if (score > maxScore) {
        maxScore = score;
        predictedCategory = category as WorkloadCategory;
      }
    }

    // Calculate confidence based on score and text length
    const totalKeywords = Object.values(this.keywords).flat().length;
    const confidence = maxScore > 0 ? Math.min(maxScore / 3, 1) : 0.3;

    return {
      category: predictedCategory,
      confidence: Math.max(confidence, 0.3) // Minimum 30% confidence
    };
  }

  // Enhanced classification with context
  classifyWithContext(activity: string, subject?: string, duration?: number): ClassificationResult {
    const baseResult = this.classify(activity);
    
    // Adjust based on duration
    if (duration) {
      if (duration <= 1 && baseResult.category === 'lecture') {
        // Short duration might indicate admin work or evaluation
        baseResult.confidence *= 0.8;
      } else if (duration >= 3 && baseResult.category === 'lab') {
        // Long duration strengthens lab classification
        baseResult.confidence *= 1.2;
      }
    }

    // Adjust based on subject context
    if (subject) {
      const subjectLower = subject.toLowerCase();
      if (subjectLower.includes('lab') && baseResult.category === 'lecture') {
        baseResult.category = 'lab';
        baseResult.confidence *= 1.1;
      }
    }

    return {
      category: baseResult.category,
      confidence: Math.min(baseResult.confidence, 1)
    };
  }
}