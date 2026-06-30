import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';

import { env, corsOrigins } from './lib/env.js';
import { closeDb } from './db/client.js';
import { runMigrations, waitForDb } from './db/migrate.js';
import { seedFruitsIfEmpty } from './db/seed.js';
import { healthzRoute } from './routes/healthz.js';
import { readyzRoute } from './routes/readyz.js';
import { fruitsRoute } from './routes/fruits.js';

const app = new Hono();

// --- Global middleware ----------------------------------------------------

app.use('*', logger());
app.use('*', secureHeaders());

app.use(
  '/api/*',
  cors({
    origin: corsOrigins,
    credentials: true,
    allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    maxAge: 86400,
  })
);

// --- Routes ---------------------------------------------------------------

// Probes — outside /api so K8s probes don't trip CORS.
app.route('/healthz', healthzRoute);
app.route('/readyz', readyzRoute);

// API v1 surface
app.route('/api/v1/fruits', fruitsRoute);

app.get('/', (c) =>
  c.json({
    service: 'mandigo-backend-api',
    docs: 'https://api.projectbyradhe.xyz/healthz',
  })
);

// --- Error handling -------------------------------------------------------

app.notFound((c) => c.json({ error: 'Not found', path: c.req.path }, 404));

app.onError((err, c) => {
  console.error('[unhandled]', err);
  return c.json({ error: 'Internal server error' }, 500);
});

// --- Boot sequence --------------------------------------------------------
//
// The order matters:
//   1. waitForDb           - retry SELECT 1 until Postgres accepts us
//   2. runMigrations       - apply pending /app/migrations/*.sql
//   3. seedFruitsIfEmpty   - one-shot insert if table is empty
//   4. serve               - bind the port; readiness probe will now pass
//
// If any of steps 1-3 throws, the process exits and K8s restarts the pod.
// That's intentional - the pod is not ready to serve traffic if any of
// these failed, and a fresh attempt is usually all it takes (e.g. DB pod
// is still booting on a fresh EC2 start).

async function main() {
  try {
    await waitForDb();
    await runMigrations();
    await seedFruitsIfEmpty();
  } catch (err) {
    console.error('[boot] initialisation failed:', err);
    process.exit(1);
  }

  serve(
    {
      fetch: app.fetch,
      port: env.PORT,
    },
    (info) => {
      console.log(
        `[boot] mandigo-backend-api listening on http://0.0.0.0:${info.port} (NODE_ENV=${env.NODE_ENV})`
      );
    }
  );
}

// --- Graceful shutdown ----------------------------------------------------

const shutdown = async (signal: string) => {
  console.log(`[shutdown] received ${signal}, draining...`);
  try {
    await closeDb();
  } catch (err) {
    console.error('[shutdown] error closing db:', err);
  }
  process.exit(0);
};
process.on('SIGTERM', () => void shutdown('SIGTERM'));
process.on('SIGINT', () => void shutdown('SIGINT'));

// Top-level await would also work since "type": "module", but a named
// async main() makes the error path explicit.
void main();
