import 'server-only';
import { apiRequest } from '@/lib/api-client';
import type { AuthTokens, RefreshResponse } from '../types';

// Server-side wrappers around backend /auth/* endpoints. These are imported
// by Server Actions only — never by Client Components — because they live
// behind `server-only`. Cookie handoff (capturing backend's `refresh_token`
// Set-Cookie and forwarding it on /auth/refresh) is handled here so the
// action layer stays focused on Zod validation + frontend cookie setting.

const REFRESH_COOKIE_NAME = 'refresh_token';

/**
 * Pluck the value of a single Set-Cookie header by name. Next.js' fetch
 * Response exposes cookies via `headers.getSetCookie()` (Node 18+).
 */
function extractCookieValue(
  setCookieHeaders: string[],
  name: string,
): string | undefined {
  for (const header of setCookieHeaders) {
    // "name=value; Path=/...; HttpOnly; ..."  → split off "name=value"
    const [pair] = header.split(';');
    const eq = pair.indexOf('=');
    if (eq === -1) continue;
    if (pair.slice(0, eq) === name) return pair.slice(eq + 1);
  }
  return undefined;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface AuthHandshake {
  tokens: AuthTokens;
  /** httpOnly refresh-token cookie value from the backend response. */
  refreshToken: string;
}

export async function loginRequest(input: LoginPayload): Promise<AuthHandshake> {
  const { data, response } = await apiRequest<AuthTokens>('/auth/login', {
    method: 'POST',
    body: input,
  });
  const refreshToken = extractCookieValue(
    response.headers.getSetCookie(),
    REFRESH_COOKIE_NAME,
  );
  if (!refreshToken) {
    throw new Error('Backend did not return a refresh_token cookie');
  }
  return { tokens: data, refreshToken };
}

export async function registerRequest(
  input: RegisterPayload,
): Promise<AuthHandshake> {
  const { data, response } = await apiRequest<AuthTokens>('/auth/register', {
    method: 'POST',
    body: input,
  });
  const refreshToken = extractCookieValue(
    response.headers.getSetCookie(),
    REFRESH_COOKIE_NAME,
  );
  if (!refreshToken) {
    throw new Error('Backend did not return a refresh_token cookie');
  }
  return { tokens: data, refreshToken };
}

interface RefreshResult {
  tokens: RefreshResponse;
  refreshToken: string;
}

export async function refreshRequest(
  storedRefreshToken: string,
): Promise<RefreshResult> {
  const { data, response } = await apiRequest<RefreshResponse>('/auth/refresh', {
    method: 'POST',
    cookieHeader: `${REFRESH_COOKIE_NAME}=${storedRefreshToken}`,
  });
  const refreshToken = extractCookieValue(
    response.headers.getSetCookie(),
    REFRESH_COOKIE_NAME,
  );
  if (!refreshToken) {
    throw new Error('Backend did not rotate refresh_token cookie');
  }
  return { tokens: data, refreshToken };
}

export async function logoutRequest(
  storedRefreshToken: string | undefined,
): Promise<void> {
  await apiRequest<void>('/auth/logout', {
    method: 'POST',
    ...(storedRefreshToken
      ? { cookieHeader: `${REFRESH_COOKIE_NAME}=${storedRefreshToken}` }
      : {}),
  });
}
