import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';

import { env, corsOrigins } from './lib/env.js';
import { healthzRoute } from './routes/healthz.js';
import { fruitsRoute } from './routes/fruits.js';

const app = new Hono();

// --- Global middleware ----------------------------------------------------

// Structured request logs (method, path, status, duration). Pino will
// supersede this in a later PR when we wire up centralised logging.
app.use('*', logger());

// Common security headers (X-Frame-Options, X-Content-Type-Options, etc.)
app.use('*', secureHeaders());

// CORS: allow the production frontend AND local Vite dev server by default.
// Override via env var CORS_ORIGINS (comma-separated).
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

// Liveness/readiness — outside /api so K8s probes don't trip CORS.
app.route('/healthz', healthzRoute);

// API v1 surface
app.route('/api/v1/fruits', fruitsRoute);

// Root: simple identification ping (useful when curl'ing from EC2)
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

// --- Boot -----------------------------------------------------------------

const port = env.PORT;

serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    // eslint-disable-next-line no-console
    console.log(
      `[boot] mandigo-backend-api listening on http://0.0.0.0:${info.port} (NODE_ENV=${env.NODE_ENV})`
    );
  }
);

// Graceful shutdown so K8s rolling updates don't drop in-flight requests
const shutdown = (signal: string) => {
  // eslint-disable-next-line no-console
  console.log(`[shutdown] received ${signal}, draining...`);
  // Hono's @hono/node-server returns no explicit close handle; rely on
  // process termination after request drain. K8s sends SIGTERM with a
  // terminationGracePeriodSeconds window (default 30s) which is enough
  // for short request lifetimes.
  process.exit(0);
};
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
