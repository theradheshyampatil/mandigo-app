import {
  pgTable,
  text,
  integer,
  boolean,
  real,
  jsonb,
  timestamp,
  index,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { nanoid } from 'nanoid';

/**
 * Price tier — discount as buyer quantity grows.
 * Stored in fruits.tiers as JSONB. The .$type<>() generic tells Drizzle
 * (and TypeScript) the shape; at runtime it's just JSON.
 */
export interface PriceTier {
  minQtyKg: number;
  pricePerKg: number;
}

export const roleEnum = pgEnum('role', ['BUYER', 'SELLER']);

export const users = pgTable('users', {
  id: text('id').primaryKey().$defaultFn(() => nanoid(10)),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: roleEnum('role').notNull().default('BUYER'),
  name: text('name').notNull(),
  companyName: text('company_name'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

/**
 * fruits — the catalog of fruits offered on the marketplace.
 *
 * v2 schema (PR #7) — expanded to match the rich Fruit shape the
 * Lovable-generated frontend was designed for. Columns are still
 * flat (no joins yet); the route handler in src/routes/fruits.ts
 * reshapes the row into the nested {seller: {...}} object the
 * frontend expects.
 *
 * Primary key is a human-readable slug ('alphonso-mango') rather than
 * a UUID so /fruit/:id URLs stay shareable.
 *
 * Future PRs:
 *  - sellers table         seller_* columns -> FK
 *  - inventory snapshots   for live stock
 *  - audit (changed_by)    once auth lands
 */
export const fruits = pgTable(
  'fruits',
  {
    // Identity
    id: text('id').primaryKey(),

    // Display
    name: text('name').notNull(),
    nameHi: text('name_hi').notNull(),
    variety: text('variety'), // nullable — not every fruit has a named variety
    emoji: text('emoji').notNull().default('🍎'),
    imageUrl: text('image_url').notNull(),
    description: text('description').notNull().default(''),

    // Seller (flat columns; nested into { seller: { ... } } at API boundary)
    sellerName: text('seller_name').notNull(),
    sellerType: text('seller_type').notNull().default('Wholesaler'),
    sellerRating: real('seller_rating').notNull().default(0),
    sellerGstin: text('seller_gstin').notNull().default(''),

    // Location
    region: text('region').notNull(),
    state: text('state').notNull(),

    // Pricing
    pricePerKg: integer('price_per_kg').notNull(),
    currency: text('currency').notNull().default('INR'),
    minOrderKg: integer('min_order_kg').notNull(),
    tiers: jsonb('tiers').$type<PriceTier[]>().notNull().default([]),

    // Other attributes
    gst: text('gst', { enum: ['included', 'extra'] })
      .notNull()
      .default('extra'),
    inSeason: boolean('in_season').notNull().default(true),

    // Bookkeeping
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    regionIdx: index('idx_fruits_region').on(table.region),
    stateIdx: index('idx_fruits_state').on(table.state),
    sellerIdx: index('idx_fruits_seller_name').on(table.sellerName),
  })
);

// Inferred TS types — use these in route handlers, services, etc.
export type Fruit = typeof fruits.$inferSelect;
export type NewFruit = typeof fruits.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
