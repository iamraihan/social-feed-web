'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { ApiClientError } from '@/lib/api-client';
import { loginRequest } from '../api/auth-api';
import { setSessionCookies } from '../lib/session';
import { loginSchema, type LoginInput } from '../schemas/auth-schemas';

// Server Action invoked directly by RHF's onSubmit with typed input —
// no FormData round-trip, no useActionState. The action re-validates with
// the same Zod schema (the client check is for UX; the server is the
// source of truth) before touching the backend.

export type LoginActionResult =
  | { ok: true }
  | {
      ok: false;
      fieldErrors?: Partial<Record<keyof LoginInput, string[]>>;
      formError?: string;
    };

export async function loginAction(input: LoginInput): Promise<LoginActionResult> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  try {
    const { tokens, refreshToken } = await loginRequest(parsed.data);
    await setSessionCookies({
      accessToken: tokens.accessToken,
      expiresInSeconds: tokens.expiresIn,
      refreshToken,
      user: tokens.user,
    });
  } catch (err) {
    if (err instanceof ApiClientError) {
      if (err.code === 'UNAUTHORIZED') {
        return { ok: false, formError: 'Invalid email or password.' };
      }
      if (err.code === 'TOO_MANY_REQUESTS') {
        return {
          ok: false,
          formError: 'Too many login attempts. Please wait a minute.',
        };
      }
      if (err.code === 'VALIDATION_FAILED') {
        return { ok: false, formError: err.details?.[0] ?? err.message };
      }
      return { ok: false, formError: err.message };
    }
    return { ok: false, formError: 'Something went wrong. Try again.' };
  }

  // `redirect` throws — keep it outside try/catch so it isn't swallowed.
  redirect('/');
}
