import { Hono } from 'hono';
import { mockFruits } from '../data/mockFruits.js';

/**
 * /api/v1/fruits
 *
 * v0 contract (mock backed):
 *   GET  /              -> { fruits: Fruit[] }
 *   GET  /:id           -> Fruit  (404 if not found)
 *
 * v1 (PR #6) will replace mockFruits with Drizzle queries against the
 * `fruits` table in Postgres. Request/response shape stays identical so
 * the frontend doesn't need a coordinated change.
 */
export const fruitsRoute = new Hono();

fruitsRoute.get('/', (c) => {
  return c.json({
    fruits: mockFruits,
    count: mockFruits.length,
  });
});

fruitsRoute.get('/:id', (c) => {
  const id = c.req.param('id');
  const fruit = mockFruits.find((f) => f.id === id);

  if (!fruit) {
    return c.json({ error: 'Fruit not found', id }, 404);
  }

  return c.json(fruit);
});
