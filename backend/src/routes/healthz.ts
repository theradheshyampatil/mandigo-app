import { Hono } from 'hono';

/**
 * Liveness + readiness endpoint.
 * - Returns 200 OK with a tiny JSON body whenever the process is up.
 * - K8s probes (configured in mandigo-gitops/k8s/backend/deployment.yaml)
 *   poll this path to decide whether to route traffic to the pod.
 * - Once Drizzle lands (PR #6), this can be extended to also ping
 *   Postgres so readiness reflects DB connectivity.
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
