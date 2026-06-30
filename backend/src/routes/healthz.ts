import { Hono } from 'hono';

/**
 * /healthz — LIVENESS probe target.
 *
 * Returns 200 as long as the Node process is running. Intentionally
 * does NOT check Postgres — see /readyz for that.
 *
 * Why split liveness vs readiness?
 *   - Liveness controls whether K8s RESTARTS the pod.
 *   - Readiness controls whether K8s ROUTES TRAFFIC to the pod.
 *
 * If Postgres briefly hiccups, we want K8s to stop routing traffic
 * (readiness fail) but NOT restart the pod (a restart can't fix a
 * downstream dependency). Restart storms during a DB outage are a
 * classic incident-amplifier — the split probe design avoids them.
 */
export const healthzRoute = new Hono();

healthzRoute.get('/', (c) => {
  return c.json({
    status: 'ok',
    service: 'mandigo-backend-api',
    version: process.env.npm_package_version ?? 'dev',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.round(process.uptime()),
  });
});
