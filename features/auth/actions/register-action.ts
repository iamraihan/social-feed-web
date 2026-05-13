'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { ApiClientError } from '@/lib/api-client';
import { registerRequest } from '../api/auth-api';
import { setSessionCookies } from '../lib/session';
import { registerSchema, type RegisterInput } from '../schemas/auth-schemas';

export type RegisterActionResult =
  | { ok: true }
  | {
      ok: false;
      fieldErrors?: Partial<Record<keyof RegisterInput, string[]>>;
      formError?: string;
    };

export async function registerAction(
  input: RegisterInput,
): Promise<RegisterActionResult> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  try {
    // confirmPassword is a client-only check — strip it before hitting the backend.
    const { confirmPassword, ...payload } = parsed.data;
    void confirmPassword;
    const { tokens, refreshToken } = await registerRequest(payload);
    await setSessionCookies({
      accessToken: tokens.accessToken,
      expiresInSeconds: tokens.expiresIn,
      refreshToken,
      user: tokens.user,
    });
  } catch (err) {
    if (err instanceof ApiClientError) {
      if (err.code === 'CONFLICT') {
        return {
          ok: false,
          fieldErrors: { email: ['An account with this email already exists.'] },
        };
      }
      if (err.code === 'TOO_MANY_REQUESTS') {
        return {
          ok: false,
          formError: 'Too many sign-up attempts. Please wait a minute.',
        };
      }
      if (err.code === 'VALIDATION_FAILED') {
        return { ok: false, formError: err.details?.[0] ?? err.message };
      }
      return { ok: false, formError: err.message };
    }
    return { ok: false, formError: 'Something went wrong. Try again.' };
  }

  redirect('/');
}
