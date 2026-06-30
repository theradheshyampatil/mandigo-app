-- Migration: 0002_marketplace_shape
--
-- Replaces the simple v0 fruits table with the full marketplace shape
-- aligned to the Lovable-generated frontend's Fruit type:
--   - new display columns: emoji, image_url, description
--   - new seller columns: seller_type, seller_rating, seller_gstin
--   - new location column: state
--   - tiered pricing in JSONB
--   - gst changes from BOOLEAN -> TEXT enum ('included' | 'extra')
--   - new in_season flag
--
-- The v0 data was seed/mock data only, so we DROP + CREATE rather than
-- ALTER. seedFruitsIfEmpty() in the boot sequence will repopulate after.
-- For real production data, you'd never do this — you'd use a series of
-- ALTER TABLE ADD COLUMN + UPDATE + ALTER COLUMN SET NOT NULL steps.

DROP TABLE IF EXISTS fruits CASCADE;

CREATE TABLE fruits (
  -- Identity
  id              TEXT        PRIMARY KEY,

  -- Display
  name            TEXT        NOT NULL,
  name_hi         TEXT        NOT NULL,
  variety         TEXT,
  emoji           TEXT        NOT NULL DEFAULT '🍎',
  image_url       TEXT        NOT NULL,
  description     TEXT        NOT NULL DEFAULT '',

  -- Seller (flat columns; nested at API boundary)
  seller_name     TEXT        NOT NULL,
  seller_type     TEXT        NOT NULL DEFAULT 'Wholesaler',
  seller_rating   REAL        NOT NULL DEFAULT 0,
  seller_gstin    TEXT        NOT NULL DEFAULT '',

  -- Location
  region          TEXT        NOT NULL,
  state           TEXT        NOT NULL,

  -- Pricing
  price_per_kg    INTEGER     NOT NULL,
  currency        TEXT        NOT NULL DEFAULT 'INR',
  min_order_kg    INTEGER     NOT NULL,
  tiers           JSONB       NOT NULL DEFAULT '[]'::jsonb,

  -- Other attributes
  gst             TEXT        NOT NULL DEFAULT 'extra'
                              CHECK (gst IN ('included', 'extra')),
  in_season       BOOLEAN     NOT NULL DEFAULT TRUE,

  -- Bookkeeping
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_fruits_region      ON fruits(region);
CREATE INDEX idx_fruits_state       ON fruits(state);
CREATE INDEX idx_fruits_seller_name ON fruits(seller_name);
