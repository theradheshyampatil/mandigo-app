import { readdir, readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from './client.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Migration runner — applies every .sql file in /app/migrations that
 * hasn't already been recorded in the `_migrations` table.
 *
 * Why not drizzle-kit's runtime migrator?
 *   - Keeps the production image smaller (no drizzle-kit dep)
 *   - Migrations are plain readable SQL, no Drizzle-specific snapshot json
 *   - Easy to inspect, easy to debug, easy to roll back by hand
 *
 * Migrations are applied in lexical filename order. Convention:
 *   migrations/0001_init.sql
 *   migrations/0002_add_sellers_table.sql
 *   etc.
 *
 * Each migration runs inside a transaction; if it throws the entire
 * file is rolled back and the runner aborts with the error.
 */
export async function runMigrations(): Promise<void> {
  // The /app/migrations directory is copied by the Dockerfile from
  // backend/migrations. At runtime the compiled JS lives at
  // /app/dist/db/migrate.js, so we go up two levels.
  const migrationsDir = join(__dirname, '..', '..', 'migrations');

  // Ensure the tracking table exists.
  await pool.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id          TEXT PRIMARY KEY,
      applied_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  let files: string[];
  try {
    files = (await readdir(migrationsDir))
      .filter((f) => f.endsWith('.sql'))
      .sort();
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      console.log(`[migrate] no migrations directory at ${migrationsDir}`);
      return;
    }
    throw err;
  }

  if (files.length === 0) {
    console.log('[migrate] no .sql files to apply');
    return;
  }

  const { rows: appliedRows } = await pool.query<{ id: string }>(
    'SELECT id FROM _migrations'
  );
  const applied = new Set(appliedRows.map((r) => r.id));

  let appliedThisRun = 0;

  for (const file of files) {
    const id = file.replace(/\.sql$/, '');

    if (applied.has(id)) {
      console.log(`[migrate] ${id} already applied — skip`);
      continue;
    }

    console.log(`[migrate] applying ${id}...`);
    const sql = await readFile(join(migrationsDir, file), 'utf-8');
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(sql);
      await client.query('INSERT INTO _migrations (id) VALUES ($1)', [id]);
      await client.query('COMMIT');
      console.log(`[migrate] ${id} OK`);
      appliedThisRun++;
    } catch (err) {
      await client.query('ROLLBACK').catch(() => {});
      console.error(`[migrate] FAILED ${id}:`, err);
      throw err;
    } finally {
      client.release();
    }
  }

  console.log(
    `[migrate] done — applied ${appliedThisRun} new, ${applied.size} previously, total ${files.length}`
  );
}

/**
 * Retry SELECT 1 until the database accepts connections, or give up.
 * Handles cold starts where the Postgres pod is still booting when
 * the backend pod starts.
 */
export async function waitForDb(opts?: {
  maxAttempts?: number;
  delayMs?: number;
}): Promise<void> {
  const maxAttempts = opts?.maxAttempts ?? 30;
  const delayMs = opts?.delayMs ?? 2_000;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await pool.query('SELECT 1');
      console.log(`[db] connected on attempt ${attempt}`);
      return;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (attempt === maxAttempts) {
        console.error(
          `[db] giving up after ${maxAttempts} attempts: ${msg}`
        );
        throw err;
      }
      console.log(
        `[db] not ready (attempt ${attempt}/${maxAttempts}): ${msg}, retrying in ${delayMs}ms`
      );
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
}
