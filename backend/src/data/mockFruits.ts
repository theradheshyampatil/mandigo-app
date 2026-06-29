/**
 * Mock data for the /fruits endpoint until PR #6 wires up Postgres.
 *
 * Shape mirrors what the frontend (frontend/src/data/mockFruits.ts) expects,
 * but the backend will eventually be the source of truth. Once Drizzle +
 * Postgres land, this file becomes the seed script for the `fruits` table.
 */

export interface Fruit {
  id: string;
  name: string;
  nameHi: string;
  variety?: string;
  region: string;
  sellerName: string;
  pricePerKg: number;
  currency: 'INR';
  minOrderKg: number;
  gstIncluded: boolean;
  imageUrl?: string;
}

export const mockFruits: Fruit[] = [
  {
    id: 'mango-alphonso-ratnagiri',
    name: 'Alphonso Mango',
    nameHi: 'अल्फांसो आम',
    variety: 'Alphonso',
    region: 'Ratnagiri, Maharashtra',
    sellerName: 'Konkan Fruit Co-op',
    pricePerKg: 850,
    currency: 'INR',
    minOrderKg: 5,
    gstIncluded: false,
  },
  {
    id: 'mango-kesar-junagadh',
    name: 'Kesar Mango',
    nameHi: 'केसर आम',
    variety: 'Kesar',
    region: 'Junagadh, Gujarat',
    sellerName: 'Gir Growers',
    pricePerKg: 320,
    currency: 'INR',
    minOrderKg: 10,
    gstIncluded: false,
  },
  {
    id: 'pomegranate-anar-solapur',
    name: 'Pomegranate',
    nameHi: 'अनार',
    variety: 'Bhagwa',
    region: 'Solapur, Maharashtra',
    sellerName: 'Maha Fruits Direct',
    pricePerKg: 180,
    currency: 'INR',
    minOrderKg: 20,
    gstIncluded: true,
  },
  {
    id: 'banana-robusta-tirupati',
    name: 'Banana',
    nameHi: 'केला',
    variety: 'Robusta',
    region: 'Tirupati, Andhra Pradesh',
    sellerName: 'AP Fruit Trading',
    pricePerKg: 45,
    currency: 'INR',
    minOrderKg: 50,
    gstIncluded: true,
  },
  {
    id: 'guava-allahabadi-prayagraj',
    name: 'Guava',
    nameHi: 'अमरूद',
    variety: 'Allahabadi Safeda',
    region: 'Prayagraj, Uttar Pradesh',
    sellerName: 'Sangam Fruits',
    pricePerKg: 60,
    currency: 'INR',
    minOrderKg: 25,
    gstIncluded: false,
  },
  {
    id: 'sapota-chiku-bhavnagar',
    name: 'Sapota',
    nameHi: 'चीकू',
    variety: 'Kalipatti',
    region: 'Bhavnagar, Gujarat',
    sellerName: 'Saurashtra Farms',
    pricePerKg: 70,
    currency: 'INR',
    minOrderKg: 15,
    gstIncluded: false,
  },
];
