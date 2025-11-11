import { sqliteTable, text, integer, real, primaryKey } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { relations } from 'drizzle-orm';

export const departments = sqliteTable('departments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull().unique(),
  code: text('code').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const subjects = sqliteTable('subjects', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  code: text('code').notNull(),
  departmentId: integer('department_id').notNull().references(() => departments.id),
  credits: integer('credits').default(3),
  type: text('type', { enum: ['theory', 'lab', 'project'] }).default('theory'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  password: text('password').notNull(),
  role: text('role', { enum: ['admin', 'faculty'] }).notNull().default('faculty'),
  departmentId: integer('department_id').references(() => departments.id),
  employeeId: text('employee_id').unique(),
  designation: text('designation'),
  hourlyRate: real('hourly_rate').default(500),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const workloadLogs = sqliteTable('workload_logs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  subjectId: integer('subject_id').references(() => subjects.id),
  date: integer('date', { mode: 'timestamp' }).notNull(),
  timeIn: text('time_in').notNull(),
  timeOut: text('time_out').notNull(),
  totalHours: real('total_hours').notNull(),
  activity: text('activity').notNull(),
  category: text('category', { 
    enum: ['lecture', 'lab', 'evaluation', 'admin_work', 'research_work'] 
  }).notNull(),
  description: text('description'),
  location: text('location'),
  isValidated: integer('is_validated', { mode: 'boolean' }).default(false),
  validationNotes: text('validation_notes'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const aiValidationLogs = sqliteTable('ai_validation_logs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  workloadLogId: integer('workload_log_id').notNull().references(() => workloadLogs.id),
  validationType: text('validation_type', { 
    enum: ['overlap', 'impossible_hours', 'suspicious_pattern', 'auto_classification'] 
  }).notNull(),
  confidence: real('confidence'),
  detectedIssues: text('detected_issues', { mode: 'json' }),
  suggestions: text('suggestions', { mode: 'json' }),
  isAnomaly: integer('is_anomaly', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const billingCycles = sqliteTable('billing_cycles', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  startDate: integer('start_date', { mode: 'timestamp' }).notNull(),
  endDate: integer('end_date', { mode: 'timestamp' }).notNull(),
  status: text('status', { enum: ['open', 'processing', 'closed'] }).default('open'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const billingReports = sqliteTable('billing_reports', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').notNull().references(() => users.id),
  billingCycleId: integer('billing_cycle_id').notNull().references(() => billingCycles.id),
  totalHours: real('total_hours').notNull(),
  totalAmount: real('total_amount').notNull(),
  hourlyRate: real('hourly_rate').notNull(),
  status: text('status', { enum: ['draft', 'approved', 'paid'] }).default('draft'),
  generatedAt: integer('generated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  approvedAt: integer('approved_at', { mode: 'timestamp' }),
  paidAt: integer('paid_at', { mode: 'timestamp' }),
});

// Relations
export const departmentsRelations = relations(departments, ({ many }) => ({
  subjects: many(subjects),
  users: many(users),
}));

export const subjectsRelations = relations(subjects, ({ one, many }) => ({
  department: one(departments, {
    fields: [subjects.departmentId],
    references: [departments.id],
  }),
  workloadLogs: many(workloadLogs),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  department: one(departments, {
    fields: [users.departmentId],
    references: [departments.id],
  }),
  workloadLogs: many(workloadLogs),
  billingReports: many(billingReports),
}));

export const workloadLogsRelations = relations(workloadLogs, ({ one, many }) => ({
  user: one(users, {
    fields: [workloadLogs.userId],
    references: [users.id],
  }),
  subject: one(subjects, {
    fields: [workloadLogs.subjectId],
    references: [subjects.id],
  }),
  aiValidationLogs: many(aiValidationLogs),
}));

export const aiValidationLogsRelations = relations(aiValidationLogs, ({ one }) => ({
  workloadLog: one(workloadLogs, {
    fields: [aiValidationLogs.workloadLogId],
    references: [workloadLogs.id],
  }),
}));

export const billingCyclesRelations = relations(billingCycles, ({ many }) => ({
  billingReports: many(billingReports),
}));

export const billingReportsRelations = relations(billingReports, ({ one }) => ({
  user: one(users, {
    fields: [billingReports.userId],
    references: [users.id],
  }),
  billingCycle: one(billingCycles, {
    fields: [billingReports.billingCycleId],
    references: [billingCycles.id],
  }),
}));

// Zod schemas for validation
export const insertDepartmentSchema = createInsertSchema(departments);
export const selectDepartmentSchema = createSelectSchema(departments);
export const insertSubjectSchema = createInsertSchema(subjects);
export const selectSubjectSchema = createSelectSchema(subjects);
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const insertWorkloadLogSchema = createInsertSchema(workloadLogs);
export const selectWorkloadLogSchema = createSelectSchema(workloadLogs);
export const insertAiValidationLogSchema = createInsertSchema(aiValidationLogs);
export const selectAiValidationLogSchema = createSelectSchema(aiValidationLogs);
export const insertBillingCycleSchema = createInsertSchema(billingCycles);
export const selectBillingCycleSchema = createSelectSchema(billingCycles);
export const insertBillingReportSchema = createInsertSchema(billingReports);
export const selectBillingReportSchema = createSelectSchema(billingReports);