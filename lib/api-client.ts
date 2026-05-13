import 'server-only';
import { env } from '@/config/env';
import type { ApiError, ApiErrorCode, ApiSuccess } from './api-types';

// Thin typed wrapper around `fetch` that talks to the backend.
//
// What it does:
//   - Sets the base URL + JSON headers once (so call sites stay short).
//   - Unwraps the canonical `{success, data}` envelope so callers receive plain
//     payloads, not envelope wrappers.
//   - On failure, throws an `ApiClientError` carrying the backend's semantic
//     code, message, and field-level details — server actions catch and
//     translate this into form-level error state.
//   - Optionally forwards a Bearer token (caller supplies one — keeps the
//     client agnostic so it can be used both for the auth handshake and for
//     authenticated requests later).
//   - Optionally returns the raw `Response` (for endpoints whose Set-Cookie
//     header we need to capture, e.g. /auth/login → refresh_token cookie).

export class ApiClientError extends Error {
  readonly code: ApiErrorCode;
  readonly status: number;
  readonly details?: string[];

  constructor(args: {
    code: ApiErrorCode;
    message: string;
    status: number;
    details?: string[];
  }) {
    super(args.message);
    this.name = 'ApiClientError';
    this.code = args.code;
    this.status = args.status;
    this.details = args.details;
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  accessToken?: string;
  cookieHeader?: string; // for forwarding the refresh cookie to /auth/refresh
  signal?: AbortSignal;
}

interface RequestResult<TData> {
  data: TData;
  /** Raw response — exposed so callers can read Set-Cookie etc. */
  response: Response;
}

export async function apiRequest<TData>(
  path: string,
  options: RequestOptions = {},
): Promise<RequestResult<TData>> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };
  if (options.body !== undefined) headers['Content-Type'] = 'application/json';
  if (options.accessToken) headers.Authorization = `Bearer ${options.accessToken}`;
  if (options.cookieHeader) headers.Cookie = options.cookieHeader;

  const response = await fetch(`${env.API_URL}${path}`, {
    method: options.method ?? 'GET',
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    cache: 'no-store',
    signal: options.signal,
  });

  // 204 No Content — endpoints like /auth/logout return empty body. Treat
  // `undefined` as TData; callers that don't care about the payload typecheck
  // it as `void`.
  if (response.status === 204) {
    return { data: undefined as TData, response };
  }

  const raw = (await response.json()) as ApiSuccess<TData> | ApiError;

  if (!raw.success) {
    throw new ApiClientError({
      code: raw.error.code,
      message: raw.error.message,
      status: response.status,
      details: raw.error.details,
    });
  }

  return { data: raw.data, response };
}
