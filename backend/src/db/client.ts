import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { env } from '../lib/env.js';
import * as schema from './schema.js';

if (!env.DATABASE_URL) {
  // env.ts already enforces this in production via Zod; this is belt-and-
  // suspenders for cases where the module is imported in a context where
  // env validation was skipped.
  throw new Error('DATABASE_URL is required but missing');
}

/**
 * Pooled pg connection — shared across all routes via the exported `db`.
 *
 * max: 10 is plenty for a single-replica backend on a c7i-flex.large.
 * Postgres default max_connections is 100; raise the pool here only if
 * concurrent traffic warrants it.
 */
export const pool = new pg.Pool({
  connectionString: env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

// Surface pool errors instead of silently crashing the process.
pool.on('error', (err) => {
  console.error('[db] unexpected pool error', err);
});

export const db = drizzle(pool, { schema });

/**
 * Cleanly close the pool on shutdown so in-flight queries get a chance
 * to finish during K8s rolling updates (terminationGracePeriodSeconds).
 */
export async function closeDb() {
  console.log('[db] closing pool');
  await pool.end();
}
