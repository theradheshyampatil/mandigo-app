import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  index,
} from 'drizzle-orm/pg-core';

/**
 * fruits — the catalog of fruits offered on the marketplace.
 *
 * Primary key is a human-readable slug (e.g. 'mango-alphonso-ratnagiri')
 * rather than a UUID so URLs at /fruit/:id stay readable and shareable.
 * Once we add seller authentication (PR #7), each fruit will also carry
 * a sellerId -> sellers.id foreign key.
 */
export const fruits = pgTable(
  'fruits',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    nameHi: text('name_hi').notNull(),
    variety: text('variety'),
    region: text('region').notNull(),
    sellerName: text('seller_name').notNull(),
    pricePerKg: integer('price_per_kg').notNull(),
    currency: text('currency').notNull().default('INR'),
    minOrderKg: integer('min_order_kg').notNull(),
    gstIncluded: boolean('gst_included').notNull().default(false),
    imageUrl: text('image_url'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    regionIdx: index('idx_fruits_region').on(table.region),
    sellerIdx: index('idx_fruits_seller').on(table.sellerName),
  })
);

// Inferred TS types — use these in route handlers, services, etc.
export type Fruit = typeof fruits.$inferSelect;
export type NewFruit = typeof fruits.$inferInsert;
