import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const secretKey = process.env.JWT_SECRET || 'your-secret-key';
const key = new TextEncoder().encode(secretKey);

export interface UserPayload {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'faculty';
  departmentId?: number;
}

export async function encrypt(payload: UserPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(key);
}

export async function decrypt(token: string): Promise<UserPayload | null> {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ['HS256'],
    });
    return payload as UserPayload;
  } catch (error) {
    return null;
  }
}

export async function createSession(user: UserPayload) {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const session = await encrypt(user);
  
  cookies().set('session', session, {
    expires,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
}

export async function getSession(): Promise<UserPayload | null> {
  const session = cookies().get('session')?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  if (!session) return;

  const parsed = await decrypt(session);
  if (!parsed) return;

  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  
  return;
}

export async function deleteSession() {
  cookies().delete('session');
}