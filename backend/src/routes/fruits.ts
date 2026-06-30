import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { db } from '../db/client.js';
import { fruits, type Fruit } from '../db/schema.js';

/**
 * /api/v1/fruits — Postgres-backed catalog of marketplace fruits.
 *
 *   GET  /          -> { fruits: ApiFruit[], count: number }
 *   GET  /:id       -> ApiFruit  (404 if not found)
 *
 * Schema columns are FLAT (seller_name, seller_type, seller_rating, ...)
 * for cleaner SQL and easier future migrations. The API SHAPE is
 * NESTED ({ seller: { name, type, rating, gstin } }) because that's
 * what the frontend's `Fruit` type expects.
 *
 * The transform happens in toApiFruit() below — a single seam between
 * "what's good for the DB" and "what's good for the UI." Add more
 * fields here; never let raw DB rows leak into the API surface.
 */
export const fruitsRoute = new Hono();

fruitsRoute.get('/', async (c) => {
  const rows = await db.select().from(fruits);
  return c.json({
    fruits: rows.map(toApiFruit),
    count: rows.length,
  });
});

fruitsRoute.get('/:id', async (c) => {
  const id = c.req.param('id');

  const [row] = await db
    .select()
    .from(fruits)
    .where(eq(fruits.id, id))
    .limit(1);

  if (!row) {
    return c.json({ error: 'Fruit not found', id }, 404);
  }

  return c.json(toApiFruit(row));
});

/**
 * DB row -> API response shape.
 *
 * - `imageUrl` -> `image` (frontend uses the shorter name)
 * - `minOrderKg` -> `moqKg` (Minimum Order Quantity — domain term)
 * - Flat seller_* columns -> nested `seller` object
 * - Drop `createdAt`/`updatedAt` (frontend doesn't need them)
 */
function toApiFruit(row: Fruit) {
  return {
    id: row.id,
    name: row.name,
    nameHi: row.nameHi,
    variety: row.variety,
    emoji: row.emoji,
    image: row.imageUrl,
    description: row.description,
    seller: {
      name: row.sellerName,
      type: row.sellerType,
      rating: row.sellerRating,
      gstin: row.sellerGstin,
    },
    region: row.region,
    state: row.state,
    pricePerKg: row.pricePerKg,
    moqKg: row.minOrderKg,
    gst: row.gst,
    inSeason: row.inSeason,
    tiers: row.tiers,
  };
}
