-- Migration: 0001_init
-- Creates the initial `fruits` table for the marketplace catalog.
--
-- Use TEXT for ids (human-readable slugs like `mango-alphonso-ratnagiri`).
-- Use TIMESTAMPTZ for all timestamps so they roundtrip across time zones.

CREATE TABLE IF NOT EXISTS fruits (
  id            TEXT        PRIMARY KEY,
  name          TEXT        NOT NULL,
  name_hi       TEXT        NOT NULL,
  variety       TEXT,
  region        TEXT        NOT NULL,
  seller_name   TEXT        NOT NULL,
  price_per_kg  INTEGER     NOT NULL,
  currency      TEXT        NOT NULL DEFAULT 'INR',
  min_order_kg  INTEGER     NOT NULL,
  gst_included  BOOLEAN     NOT NULL DEFAULT FALSE,
  image_url     TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fruits_region ON fruits(region);
CREATE INDEX IF NOT EXISTS idx_fruits_seller_name ON fruits(seller_name);
