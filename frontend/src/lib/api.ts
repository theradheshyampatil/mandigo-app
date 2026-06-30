// Single entry point for all data fetching.
//
// When VITE_API_URL is set at build time (production CI), this talks
// to the Hono backend at https://api.projectbyradhe.xyz/api/v1.
// When unset (e.g. `npm run dev` without an .env), it falls back to
// frontend/src/data/mockFruits.ts so offline dev still works.
import { mockFruits, type Fruit } from "@/data/mockFruits";

const BASE_URL = import.meta.env.VITE_API_URL ?? "";

const useMock = !BASE_URL;

async function request<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

// Backend (Hono) wraps list responses in an envelope so we can add
// pagination metadata later without breaking clients.
interface FruitListEnvelope {
  fruits: Fruit[];
  count: number;
}

export const api = {
  async listFruits(): Promise<Fruit[]> {
    if (useMock) return Promise.resolve(mockFruits);
    const { fruits } = await request<FruitListEnvelope>("/fruits");
    return fruits;
  },
  async getFruit(id: string): Promise<Fruit | undefined> {
    if (useMock) return Promise.resolve(mockFruits.find((f) => f.id === id));
    try {
      return await request<Fruit>(`/fruits/${id}`);
    } catch {
      // 404 -> undefined matches the mock-path semantics
      return undefined;
    }
  },
};

export const formatINR = (n: number) =>
  `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
