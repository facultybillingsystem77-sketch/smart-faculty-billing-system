import { createServerClient } from './supabase/server';

export interface UserPayload {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'faculty' | 'hod' | 'super_admin' | 'accountant';
  department_id?: string;
  employee_id?: string;
  designation?: string;
  is_active: boolean;
}

export async function getSession(): Promise<{ user: UserPayload } | null> {
  const supabase = createServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) return null;

  const { data: userData, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', session.user.id)
    .single();

  if (error || !userData) return null;

  return {
    user: userData as UserPayload,
  };
}