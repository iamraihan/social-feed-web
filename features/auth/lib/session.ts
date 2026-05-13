import 'server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { env } from '@/config/env';
import type { SessionUser } from '../types';

// Frontend session cookies — set by server actions after a successful auth
// handshake, read by Server Components / middleware. The three cookies serve
// different purposes:
//
//   access_token    — sent as Bearer to the backend; lives only as long as
//                     the access token TTL the backend issued (expiresIn).
//                     httpOnly so JS can't read it.
//   refresh_token   — the cookie value the backend issued. Forwarded back to
//                     the backend on refresh. httpOnly, long-lived (7 days).
//   session_user    — JSON-encoded SessionUser. NOT httpOnly so Client
//                     Components can render the profile without an extra
//                     fetch. It's a CACHE not a credential; the access_token
//                     is the only thing that grants API access.

export const COOKIE_ACCESS_TOKEN = 'access_token';
export const COOKIE_REFRESH_TOKEN = 'refresh_token';
export const COOKIE_SESSION_USER = 'session_user';
const REFRESH_TTL_DAYS = 7;

interface SetSessionInput {
  accessToken: string;
  expiresInSeconds: number;
  refreshToken: string;
  user: SessionUser;
}

export async function setSessionCookies(input: SetSessionInput): Promise<void> {
  const jar = await cookies();
  const commonOptions = {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: 'lax' as const,
    path: '/',
  };

  jar.set(COOKIE_ACCESS_TOKEN, input.accessToken, {
    ...commonOptions,
    maxAge: input.expiresInSeconds,
  });
  jar.set(COOKIE_REFRESH_TOKEN, input.refreshToken, {
    ...commonOptions,
    maxAge: REFRESH_TTL_DAYS * 24 * 60 * 60,
  });
  jar.set(COOKIE_SESSION_USER, JSON.stringify(input.user), {
    ...commonOptions,
    httpOnly: false, // see comment above — readable by Client Components
    maxAge: REFRESH_TTL_DAYS * 24 * 60 * 60,
  });
}

export async function clearSessionCookies(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE_ACCESS_TOKEN);
  jar.delete(COOKIE_REFRESH_TOKEN);
  jar.delete(COOKIE_SESSION_USER);
}

export async function getSession(): Promise<SessionUser | null> {
  const jar = await cookies();
  const raw = jar.get(COOKIE_SESSION_USER)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    // Cookie was tampered with / corrupted — treat as no session.
    return null;
  }
}

export async function requireSession(): Promise<SessionUser> {
  const session = await getSession();
  if (!session) redirect('/login');
  return session;
}

export async function getAccessToken(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(COOKIE_ACCESS_TOKEN)?.value ?? null;
}

export async function getRefreshToken(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(COOKIE_REFRESH_TOKEN)?.value ?? null;
}
