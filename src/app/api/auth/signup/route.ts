import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, role, departmentId, employeeId, designation } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role: role || 'faculty',
        },
      },
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    if (authData.user) {
      const { error: profileError } = await supabase.from('users').insert({
        id: authData.user.id,
        email,
        name,
        role: role || 'faculty',
        department_id: departmentId || null,
        employee_id: employeeId || null,
        designation: designation || null,
        is_active: true,
      });

      if (profileError) {
        return NextResponse.json(
          { error: 'Failed to create user profile' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      user: authData.user,
      message: 'User created successfully',
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
