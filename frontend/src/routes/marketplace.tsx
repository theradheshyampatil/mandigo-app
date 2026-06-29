import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { api } from "@/lib/api";
import { regions } from "@/data/mockFruits";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { FruitCard } from "@/components/FruitCard";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const fruitsQuery = queryOptions({
  queryKey: ["fruits"],
  queryFn: () => api.listFruits(),
});

export const Route = createFileRoute("/marketplace")({
  head: () => ({
    meta: [
      { title: "Marketplace — MandiGo" },
      { name: "description", content: "Browse bulk fruit listings from Indian wholesalers and farmer co-operatives. Filter by fruit, region, price and MOQ." },
      { property: "og:title", content: "Marketplace — MandiGo" },
      { property: "og:description", content: "Bulk fruit listings from Indian wholesalers and farmer co-ops." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(fruitsQuery),
  component: MarketplacePage,
});

function MarketplacePage() {
  const { data: fruits } = useSuspenseQuery(fruitsQuery);

  const [q, setQ] = useState("");
  const [region, setRegion] = useState<(typeof regions)[number]>("All");
  const [type, setType] = useState<string>("All");
  const [maxPrice, setMaxPrice] = useState<number>(500);
  const [maxMoq, setMaxMoq] = useState<number>(5000);
  const [showFilters, setShowFilters] = useState(false);

  const fruitTypes = useMemo(
    () => ["All", ...Array.from(new Set(fruits.map((f) => f.name)))],
    [fruits],
  );

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return fruits.filter((f) => {
      if (region !== "All" && f.region !== region) return false;
      if (type !== "All" && f.name !== type) return false;
      if (f.pricePerKg > maxPrice) return false;
      if (f.moqKg > maxMoq) return false;
      if (ql) {
        const hay = `${f.name} ${f.nameHi} ${f.variety ?? ""} ${f.state} ${f.seller.name}`.toLowerCase();
        if (!hay.includes(ql)) return false;
      }
      return true;
    });
  }, [fruits, q, region, type, maxPrice, maxMoq]);

  const reset = () => {
    setQ(""); setRegion("All"); setType("All"); setMaxPrice(500); setMaxMoq(5000);
  };

  const activeChips: { label: string; clear: () => void }[] = [];
  if (region !== "All") activeChips.push({ label: `Region: ${region}`, clear: () => setRegion("All") });
  if (type !== "All") activeChips.push({ label: `Fruit: ${type}`, clear: () => setType("All") });
  if (maxPrice < 500) activeChips.push({ label: `≤ ₹${maxPrice}/kg`, clear: () => setMaxPrice(500) });
  if (maxMoq < 5000) activeChips.push({ label: `MOQ ≤ ${maxMoq}kg`, clear: () => setMaxMoq(5000) });

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Top bar */}
      <div className="border-b border-border bg-gradient-warm">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
          <h1 className="font-display text-2xl font-extrabold sm:text-3xl">Marketplace</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} of {fruits.length} listings</p>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search fruit, variety, state, seller…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="h-11 pl-9"
              />
            </div>
            <Button
              variant="outline"
              className="h-11 sm:w-auto"
              onClick={() => setShowFilters((v) => !v)}
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>

          {activeChips.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {activeChips.map((c) => (
                <Badge key={c.label} variant="secondary" className="gap-1.5 pl-2.5 pr-1.5 py-1">
                  {c.label}
                  <button onClick={c.clear} className="rounded p-0.5 hover:bg-foreground/10" aria-label="Clear">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              <button onClick={reset} className="text-xs font-medium text-primary hover:underline">
                Reset all
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[260px_1fr]">
        {/* Filters */}
        <aside className={`${showFilters ? "block" : "hidden"} lg:block`}>
          <div className="sticky top-20 space-y-6 rounded-2xl border border-border bg-card p-5 shadow-card">
            <FilterGroup label="Region">
              <div className="flex flex-wrap gap-1.5">
                {regions.map((r) => (
                  <Chip key={r} active={region === r} onClick={() => setRegion(r)}>{r}</Chip>
                ))}
              </div>
            </FilterGroup>

            <FilterGroup label="Fruit type">
              <div className="flex flex-wrap gap-1.5">
                {fruitTypes.map((t) => (
                  <Chip key={t} active={type === t} onClick={() => setType(t)}>{t}</Chip>
                ))}
              </div>
            </FilterGroup>

            <FilterGroup label={`Max price · ₹${maxPrice}/kg`}>
              <Slider value={[maxPrice]} min={10} max={500} step={10} onValueChange={(v) => setMaxPrice(v[0])} />
            </FilterGroup>

            <FilterGroup label={`Max MOQ · ${maxMoq}kg`}>
              <Slider value={[maxMoq]} min={50} max={5000} step={50} onValueChange={(v) => setMaxMoq(v[0])} />
              <p className="mt-1 text-xs text-muted-foreground">{Math.round(maxMoq / 100)} quintal</p>
            </FilterGroup>

            <Button variant="outline" className="w-full" onClick={reset}>Reset filters</Button>
          </div>
        </aside>

        {/* Results */}
        <section>
          {filtered.length === 0 ? (
            <div className="grid place-items-center rounded-2xl border border-dashed border-border p-16 text-center">
              <div className="text-4xl">🍂</div>
              <h3 className="mt-3 font-display text-lg font-bold">No listings match</h3>
              <p className="mt-1 text-sm text-muted-foreground">Try widening your filters or clearing the search.</p>
              <Button className="mt-4" onClick={reset}>Reset filters</Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((f) => <FruitCard key={f.id} fruit={f} />)}
            </div>
          )}
        </section>
      </div>

      <SiteFooter />
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      {children}
    </div>
  );
}

function Chip({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background text-foreground hover:border-primary/60"
      }`}
    >
      {children}
    </button>
  );
}
