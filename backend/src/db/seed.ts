import { db } from './client.js';
import { fruits } from './schema.js';
import { mockFruits } from '../data/mockFruits.js';

/**
 * One-shot seed: insert the canonical six fruits IF the table is empty.
 * Re-runs on every pod boot but is a no-op once data exists.
 *
 * When we add an admin UI (or build a CSV import), this becomes
 * unnecessary. For now it makes a fresh deploy + empty DB combo
 * instantly demoable.
 */
export async function seedFruitsIfEmpty(): Promise<void> {
  const existing = await db.select({ id: fruits.id }).from(fruits).limit(1);

  if (existing.length > 0) {
    console.log('[seed] fruits already populated, skipping');
    return;
  }

  console.log(`[seed] inserting ${mockFruits.length} seed fruits...`);
  await db.insert(fruits).values(mockFruits);
  console.log('[seed] done');
}
