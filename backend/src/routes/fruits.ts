import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { db } from '../db/client.js';
import { fruits } from '../db/schema.js';

/**
 * /api/v1/fruits — backed by Postgres via Drizzle ORM as of PR #6.
 *
 *   GET  /          -> { fruits: Fruit[], count: number }
 *   GET  /:id       -> Fruit  (404 if not found)
 *
 * Drizzle's `db.select()` returns fully-typed rows — try hovering over
 * `allFruits` or `fruit` below in your editor; TS infers each field from
 * the schema in src/db/schema.ts. No DTO boilerplate, no manual mapping.
 */
export const fruitsRoute = new Hono();

fruitsRoute.get('/', async (c) => {
  const allFruits = await db.select().from(fruits);
  return c.json({
    fruits: allFruits,
    count: allFruits.length,
  });
});

fruitsRoute.get('/:id', async (c) => {
  const id = c.req.param('id');

  const [fruit] = await db
    .select()
    .from(fruits)
    .where(eq(fruits.id, id))
    .limit(1);

  if (!fruit) {
    return c.json({ error: 'Fruit not found', id }, 404);
  }

  return c.json(fruit);
});
