// Single entry point for all data fetching. Today it returns mock data;
// later, point VITE_API_URL at a real backend and swap the impls.
import { mockFruits, type Fruit } from "@/data/mockFruits";

const BASE_URL = import.meta.env.VITE_API_URL ?? "";

const useMock = !BASE_URL;

async function request<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

export const api = {
  async listFruits(): Promise<Fruit[]> {
    if (useMock) return Promise.resolve(mockFruits);
    return request<Fruit[]>("/fruits");
  },
  async getFruit(id: string): Promise<Fruit | undefined> {
    if (useMock) return Promise.resolve(mockFruits.find((f) => f.id === id));
    return request<Fruit>(`/fruits/${id}`);
  },
};

export const formatINR = (n: number) =>
  `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
