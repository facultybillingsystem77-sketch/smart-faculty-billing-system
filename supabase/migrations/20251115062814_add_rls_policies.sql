/*
  # Add Row Level Security Policies

  ## Security Implementation
  This migration enables RLS and creates comprehensive policies for all tables.
  
  ## Policy Strategy
  - Faculty can view/edit their own data
  - Admins and Super Admins have full access
  - HODs can manage their department
  - Accountants can view salary data
  
  ## Tables Secured
  All 16 tables with appropriate access controls
*/

-- 1. DEPARTMENTS RLS
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active departments"
  ON departments FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage departments"
  ON departments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'super_admin')
    )
  );

-- 2. ACADEMIC YEARS RLS
ALTER TABLE academic_years ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active academic years"
  ON academic_years FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage academic years"
  ON academic_years FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'super_admin')
    )
  );

-- 3. USERS RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'super_admin', 'hod', 'accountant')
    )
  );

CREATE POLICY "Admins can manage users"
  ON users FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'super_admin')
    )
  );

-- 4. SUBJECTS RLS
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active subjects"
  ON subjects FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Admins and HODs can manage subjects"
  ON subjects FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u
      LEFT JOIN departments d ON u.department_id = d.id
      WHERE u.id = auth.uid()
      AND (
        u.role IN ('admin', 'super_admin')
        OR (u.role = 'hod' AND d.id = subjects.department_id)
      )
    )
  );

-- 5. SALARY RATE CONFIGURATIONS RLS
ALTER TABLE salary_rate_configurations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active rate configurations"
  ON salary_rate_configurations FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage rate configurations"
  ON salary_rate_configurations FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'super_admin')
    )
  );

-- 6. FACULTY SUBJECT ASSIGNMENTS RLS
ALTER TABLE faculty_subject_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Faculty can view own assignments"
  ON faculty_subject_assignments FOR SELECT
  TO authenticated
  USING (
    faculty_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'super_admin', 'hod', 'accountant')
    )
  );

CREATE POLICY "Admins and HODs can manage assignments"
  ON faculty_subject_assignments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u
      LEFT JOIN subjects s ON s.id = faculty_subject_assignments.subject_id
      WHERE u.id = auth.uid()
      AND (
        u.role IN ('admin', 'super_admin')
        OR (u.role = 'hod' AND u.department_id = s.department_id)
      )
    )
  );

-- 7. WORKLOAD ENTRIES RLS
ALTER TABLE workload_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Faculty can view own workload entries"
  ON workload_entries FOR SELECT
  TO authenticated
  USING (
    faculty_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'super_admin', 'hod', 'accountant')
    )
  );

CREATE POLICY "Faculty can create own workload entries"
  ON workload_entries FOR INSERT
  TO authenticated
  WITH CHECK (faculty_id = auth.uid());

CREATE POLICY "Faculty can update own draft workload entries"
  ON workload_entries FOR UPDATE
  TO authenticated
  USING (
    faculty_id = auth.uid() AND status IN ('draft', 'rejected')
  )
  WITH CHECK (
    faculty_id = auth.uid() AND status IN ('draft', 'submitted', 'rejected')
  );

CREATE POLICY "Admins can manage all workload entries"
  ON workload_entries FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'super_admin', 'hod')
    )
  );

-- 8. WORKLOAD APPROVALS RLS
ALTER TABLE workload_approvals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view approvals for their workload"
  ON workload_approvals FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workload_entries we
      WHERE we.id = workload_approvals.workload_entry_id
      AND we.faculty_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'super_admin', 'hod', 'accountant')
    )
  );

CREATE POLICY "Admins and HODs can create approvals"
  ON workload_approvals FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'super_admin', 'hod')
    )
  );

-- 9. LEAVE RECORDS RLS
ALTER TABLE leave_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Faculty can view own leave records"
  ON leave_records FOR SELECT
  TO authenticated
  USING (
    faculty_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'super_admin', 'hod')
    )
  );

CREATE POLICY "Faculty can create own leave records"
  ON leave_records FOR INSERT
  TO authenticated
  WITH CHECK (faculty_id = auth.uid());

CREATE POLICY "Admins can manage leave records"
  ON leave_records FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'super_admin', 'hod')
    )
  );

-- 10. SALARY CALCULATIONS RLS
ALTER TABLE salary_calculations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Faculty can view own salary calculations"
  ON salary_calculations FOR SELECT
  TO authenticated
  USING (
    faculty_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'super_admin', 'accountant')
    )
  );

CREATE POLICY "Admins and accountants can manage salary calculations"
  ON salary_calculations FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'super_admin', 'accountant')
    )
  );

-- 11. SALARY ADJUSTMENTS RLS
ALTER TABLE salary_adjustments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Faculty can view own salary adjustments"
  ON salary_adjustments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM salary_calculations sc
      WHERE sc.id = salary_adjustments.salary_calculation_id
      AND sc.faculty_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'super_admin', 'accountant')
    )
  );

CREATE POLICY "Admins can manage salary adjustments"
  ON salary_adjustments FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'super_admin', 'accountant')
    )
  );

-- 12. SALARY SLIPS RLS
ALTER TABLE salary_slips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Faculty can view own salary slips"
  ON salary_slips FOR SELECT
  TO authenticated
  USING (
    faculty_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'super_admin', 'accountant')
    )
  );

CREATE POLICY "Admins can manage salary slips"
  ON salary_slips FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'super_admin', 'accountant')
    )
  );

-- 13. MESSAGES RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own messages"
  ON messages FOR SELECT
  TO authenticated
  USING (
    sender_id = auth.uid() OR recipient_id = auth.uid()
  );

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Recipients can update message read status"
  ON messages FOR UPDATE
  TO authenticated
  USING (recipient_id = auth.uid())
  WITH CHECK (recipient_id = auth.uid());

-- 14. NOTIFICATIONS RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 15. MONTHLY REPORTS RLS
ALTER TABLE monthly_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins and HODs can view monthly reports"
  ON monthly_reports FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid()
      AND (
        u.role IN ('admin', 'super_admin', 'accountant')
        OR (u.role = 'hod' AND u.department_id = monthly_reports.department_id)
      )
    )
  );

CREATE POLICY "Admins can manage monthly reports"
  ON monthly_reports FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'super_admin')
    )
  );

-- 16. AUDIT LOGS RLS
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit logs"
  ON audit_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "System can create audit logs"
  ON audit_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);
