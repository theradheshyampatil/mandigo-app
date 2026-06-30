import { Hono } from 'hono';
import { sql } from 'drizzle-orm';
import { db } from '../db/client.js';

/**
 * /readyz — READINESS probe target.
 *
 * Returns 200 only if `SELECT 1` against Postgres succeeds. K8s uses
 * this to decide whether to add the pod to the Service's load-balanced
 * endpoints. If Postgres goes down, this pod temporarily stops getting
 * traffic; once the DB recovers, the next probe (10s loop in
 * deployment.yaml) re-adds it. No pod restart involved.
 *
 * Distinct from /healthz to avoid restart storms during a DB outage —
 * see the comment in healthz.ts for the rationale.
 */
export const readyzRoute = new Hono();

readyzRoute.get('/', async (c) => {
  try {
    await db.execute(sql`SELECT 1`);
    return c.json({ status: 'ready', database: 'ok' });
  } catch (err) {
    console.error('[readyz] db ping failed:', err);
    return c.json(
      {
        status: 'not_ready',
        database: 'fail',
        error: err instanceof Error ? err.message : String(err),
      },
      503
    );
  }
});
