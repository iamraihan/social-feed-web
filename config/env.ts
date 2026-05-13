import { z } from 'zod';

// Validate and type server-only env at boot. Importing this module from a
// Client Component is a compile-time error (it lives behind `server-only`).
// If a required env var is missing, the app crashes early with a useful
// message rather than failing deep inside a fetch call later.
import 'server-only';

const envSchema = z.object({
  API_URL: z.url('API_URL must be a valid URL'),
  COOKIE_SECURE: z
    .union([z.literal('true'), z.literal('false')])
    .default('false')
    .transform((v) => v === 'true'),
});

export const env = envSchema.parse({
  API_URL: process.env.API_URL,
  COOKIE_SECURE: process.env.COOKIE_SECURE,
});

export type Env = z.infer<typeof envSchema>;
