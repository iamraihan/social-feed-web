'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { ApiClientError } from '@/lib/api-client';
import { loginRequest } from '../api/auth-api';
import { setSessionCookies } from '../lib/session';
import { loginSchema } from '../schemas/auth-schemas';

// Discriminated-union result so the form can render either field errors,
// a global form error, or trigger a success-side effect. Server actions can
// return values to Client Components via useFormState / useActionState.

export type LoginActionResult =
  | { ok: true }
  | {
      ok: false;
      fieldErrors?: Partial<Record<'email' | 'password', string[]>>;
      formError?: string;
    };

export async function loginAction(
  _prev: LoginActionResult | null,
  formData: FormData,
): Promise<LoginActionResult> {
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });
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
      // Backend semantic codes → human-friendly form errors.
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
        return {
          ok: false,
          formError: err.details?.[0] ?? err.message,
        };
      }
      return { ok: false, formError: err.message };
    }
    return { ok: false, formError: 'Something went wrong. Try again.' };
  }

  // `redirect` throws — must run outside try/catch so it isn't swallowed.
  redirect('/');
}
