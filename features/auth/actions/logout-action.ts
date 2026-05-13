'use server';

import { redirect } from 'next/navigation';
import { logoutRequest } from '../api/auth-api';
import { clearSessionCookies, getRefreshToken } from '../lib/session';

// Best-effort logout: clear local cookies even if the backend call fails so
// the user is never stuck in a "looks logged in but actually invalid" limbo.
// The backend invalidates the refresh token; missing the call just means a
// rotated token stays alive until its 7-day TTL.

export async function logoutAction(): Promise<never> {
  const refreshToken = await getRefreshToken();
  try {
    await logoutRequest(refreshToken ?? undefined);
  } catch {
    // swallow — clearing local cookies is what matters for UX
  }
  await clearSessionCookies();
  redirect('/login');
}
