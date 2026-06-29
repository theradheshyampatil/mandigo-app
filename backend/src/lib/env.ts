import { z } from 'zod';

/**
 * Strictly-typed environment config.
 * Validates process.env at startup; if any required var is missing or
 * malformed, the process crashes with a clear error message BEFORE the
 * server starts accepting traffic.
 *
 * Add new env vars here as the API grows. Optional vars will be filled in
 * by later PRs:
 *   - DATABASE_URL    (PR #6 - Drizzle + Postgres)
 *   - AUTH_SECRET     (PR #7 - Better Auth session signing)
 *   - GOOGLE_CLIENT_*  (PR #7 - Google OAuth)
 *   - MSG91_AUTH_KEY  (PR #7 - phone OTP)
 */
const EnvSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  PORT: z.coerce.number().int().positive().default(3000),

  // Comma-separated list of allowed origins for CORS.
  // Default covers the production frontend + Vite dev server.
  CORS_ORIGINS: z
    .string()
    .default('https://projectbyradhe.xyz,http://localhost:5173'),

  // To be required in PR #6 once Drizzle is wired up.
  DATABASE_URL: z.string().url().optional(),

  // To be required in PR #7 once Better Auth lands.
  AUTH_SECRET: z.string().min(32).optional(),
});

function parseEnv() {
  const result = EnvSchema.safeParse(process.env);
  if (!result.success) {
    console.error('Invalid environment variables:');
    console.error(result.error.flatten().fieldErrors);
    process.exit(1);
  }
  return result.data;
}

export const env = parseEnv();

export const corsOrigins = env.CORS_ORIGINS.split(',').map((o) => o.trim());
