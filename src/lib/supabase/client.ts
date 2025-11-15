import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export type Database = {
  public: {
    Tables: {
      departments: any;
      academic_years: any;
      users: any;
      subjects: any;
      salary_rate_configurations: any;
      faculty_subject_assignments: any;
      workload_entries: any;
      workload_approvals: any;
      leave_records: any;
      salary_calculations: any;
      salary_adjustments: any;
      salary_slips: any;
      messages: any;
      notifications: any;
      monthly_reports: any;
      audit_logs: any;
    };
  };
};
