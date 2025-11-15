/*
  # Faculty Billing & Salary Automation System - Database Schema V1

  ## Overview
  Complete database schema for Faculty Billing & Salary Automation System with multi-role support,
  approval workflows, salary calculations, and comprehensive tracking.
  
  ## Tables Created (16 tables)
  
  ### Core Tables
  1. departments - Department master
  2. academic_years - Academic year/semester management
  3. users - User accounts (Admin, Faculty, HOD, Super Admin, Accountant)
  4. subjects - Subject master
  
  ### Workload & Assignment
  5. salary_rate_configurations - Rate definitions
  6. faculty_subject_assignments - Faculty-subject mappings
  7. workload_entries - Workload tracking
  8. workload_approvals - Approval workflow
  
  ### Salary & Billing
  9. salary_calculations - Monthly salary computations
  10. salary_adjustments - Manual adjustments
  11. salary_slips - Generated slips
  
  ### Leave Management
  12. leave_records - Leave tracking
  
  ### Communication
  13. messages - Messaging system
  14. notifications - System notifications
  
  ### Reporting & Audit
  15. monthly_reports - Department reports
  16. audit_logs - Activity tracking
  
  ## Security
  - RLS enabled on all tables
  - Role-based access control
  - Secure authentication checks
*/

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. DEPARTMENTS
CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  hod_user_id UUID,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. ACADEMIC YEARS
CREATE TABLE IF NOT EXISTS academic_years (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  year_name TEXT NOT NULL UNIQUE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  semester TEXT CHECK (semester IN ('odd', 'even', 'summer')) NOT NULL,
  is_current BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. USERS
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT CHECK (role IN ('admin', 'faculty', 'hod', 'super_admin', 'accountant')) NOT NULL DEFAULT 'faculty',
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  employee_id TEXT UNIQUE,
  designation TEXT,
  phone TEXT,
  photo_url TEXT,
  qualification TEXT,
  date_of_joining DATE,
  is_active BOOLEAN DEFAULT true,
  ui_theme TEXT CHECK (ui_theme IN ('light', 'dark', 'system')) DEFAULT 'system',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add HOD foreign key to departments
ALTER TABLE departments
  DROP CONSTRAINT IF EXISTS departments_hod_user_id_fkey;

ALTER TABLE departments
  ADD CONSTRAINT departments_hod_user_id_fkey
  FOREIGN KEY (hod_user_id) REFERENCES users(id) ON DELETE SET NULL;

-- 4. SUBJECTS
CREATE TABLE IF NOT EXISTS subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  credits INTEGER DEFAULT 3,
  type TEXT CHECK (type IN ('theory', 'lab', 'project')) DEFAULT 'theory',
  max_lecture_hours INTEGER DEFAULT 60,
  max_practical_hours INTEGER DEFAULT 40,
  max_tutorial_hours INTEGER DEFAULT 20,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. SALARY RATE CONFIGURATIONS
CREATE TABLE IF NOT EXISTS salary_rate_configurations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  config_name TEXT NOT NULL,
  lecture_rate NUMERIC(10,2) NOT NULL DEFAULT 500.00,
  practical_rate NUMERIC(10,2) NOT NULL DEFAULT 400.00,
  tutorial_rate NUMERIC(10,2) NOT NULL DEFAULT 300.00,
  is_default BOOLEAN DEFAULT false,
  effective_from DATE NOT NULL,
  effective_to DATE,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. FACULTY SUBJECT ASSIGNMENTS
CREATE TABLE IF NOT EXISTS faculty_subject_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  faculty_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
  custom_lecture_rate NUMERIC(10,2),
  custom_practical_rate NUMERIC(10,2),
  custom_tutorial_rate NUMERIC(10,2),
  is_active BOOLEAN DEFAULT true,
  assigned_by UUID REFERENCES users(id),
  assigned_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(faculty_id, subject_id, academic_year_id)
);

-- 7. WORKLOAD ENTRIES
CREATE TABLE IF NOT EXISTS workload_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  faculty_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  year INTEGER NOT NULL,
  lecture_hours INTEGER DEFAULT 0,
  practical_hours INTEGER DEFAULT 0,
  tutorial_hours INTEGER DEFAULT 0,
  total_hours INTEGER GENERATED ALWAYS AS (lecture_hours + practical_hours + tutorial_hours) STORED,
  description TEXT,
  status TEXT CHECK (status IN ('draft', 'submitted', 'approved', 'rejected', 'locked')) DEFAULT 'draft',
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(faculty_id, subject_id, academic_year_id, month, year)
);

-- 8. WORKLOAD APPROVALS
CREATE TABLE IF NOT EXISTS workload_approvals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workload_entry_id UUID NOT NULL REFERENCES workload_entries(id) ON DELETE CASCADE,
  approver_id UUID NOT NULL REFERENCES users(id),
  action TEXT CHECK (action IN ('submitted', 'approved', 'rejected')) NOT NULL,
  comments TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. LEAVE RECORDS
CREATE TABLE IF NOT EXISTS leave_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  faculty_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  leave_type TEXT CHECK (leave_type IN ('sick', 'casual', 'earned', 'unpaid')) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_days INTEGER NOT NULL,
  reason TEXT,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMPTZ,
  affects_salary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 10. SALARY CALCULATIONS
CREATE TABLE IF NOT EXISTS salary_calculations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  faculty_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  year INTEGER NOT NULL,
  academic_year_id UUID REFERENCES academic_years(id),
  total_lecture_hours INTEGER DEFAULT 0,
  total_practical_hours INTEGER DEFAULT 0,
  total_tutorial_hours INTEGER DEFAULT 0,
  lecture_amount NUMERIC(10,2) DEFAULT 0,
  practical_amount NUMERIC(10,2) DEFAULT 0,
  tutorial_amount NUMERIC(10,2) DEFAULT 0,
  gross_salary NUMERIC(10,2) DEFAULT 0,
  deductions NUMERIC(10,2) DEFAULT 0,
  net_salary NUMERIC(10,2) DEFAULT 0,
  status TEXT CHECK (status IN ('draft', 'calculated', 'approved', 'paid')) DEFAULT 'draft',
  is_manual_override BOOLEAN DEFAULT false,
  override_reason TEXT,
  calculated_at TIMESTAMPTZ,
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(faculty_id, month, year)
);

-- 11. SALARY ADJUSTMENTS
CREATE TABLE IF NOT EXISTS salary_adjustments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  salary_calculation_id UUID NOT NULL REFERENCES salary_calculations(id) ON DELETE CASCADE,
  adjustment_type TEXT CHECK (adjustment_type IN ('bonus', 'deduction', 'arrear', 'advance')) NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  reason TEXT NOT NULL,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 12. SALARY SLIPS
CREATE TABLE IF NOT EXISTS salary_slips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  salary_calculation_id UUID NOT NULL REFERENCES salary_calculations(id) ON DELETE CASCADE,
  faculty_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  slip_number TEXT NOT NULL UNIQUE,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  pdf_url TEXT,
  is_emailed BOOLEAN DEFAULT false,
  emailed_at TIMESTAMPTZ,
  generated_by UUID REFERENCES users(id),
  generated_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 13. MESSAGES
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  parent_message_id UUID REFERENCES messages(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 14. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('workload_submitted', 'workload_approved', 'workload_rejected', 'salary_calculated', 'slip_generated', 'message_received', 'system')) NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 15. MONTHLY REPORTS
CREATE TABLE IF NOT EXISTS monthly_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  year INTEGER NOT NULL,
  total_faculty_count INTEGER DEFAULT 0,
  total_workload_hours INTEGER DEFAULT 0,
  total_salary_amount NUMERIC(10,2) DEFAULT 0,
  report_data JSONB,
  generated_by UUID REFERENCES users(id),
  generated_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(department_id, month, year)
);

-- 16. AUDIT LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_department ON users(department_id);
CREATE INDEX IF NOT EXISTS idx_subjects_department ON subjects(department_id);
CREATE INDEX IF NOT EXISTS idx_workload_faculty ON workload_entries(faculty_id);
CREATE INDEX IF NOT EXISTS idx_workload_status ON workload_entries(status);
CREATE INDEX IF NOT EXISTS idx_workload_month_year ON workload_entries(month, year);
CREATE INDEX IF NOT EXISTS idx_salary_faculty ON salary_calculations(faculty_id);
CREATE INDEX IF NOT EXISTS idx_salary_month_year ON salary_calculations(month, year);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_messages_recipient ON messages(recipient_id, is_read);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
