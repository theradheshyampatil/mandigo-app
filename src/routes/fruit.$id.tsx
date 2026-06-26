import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { ArrowLeft, MapPin, Package, ShieldCheck, Star } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api, formatINR } from "@/lib/api";

const fruitQuery = (id: string) =>
  queryOptions({
    queryKey: ["fruit", id],
    queryFn: async () => {
      const f = await api.getFruit(id);
      if (!f) throw notFound();
      return f;
    },
  });

export const Route = createFileRoute("/fruit/$id")({
  loader: ({ context, params }) => context.queryClient.ensureQueryData(fruitQuery(params.id)),
  head: ({ params }) => ({
    meta: [
      { title: `Fruit · ${params.id} — MandiGo` },
      { name: "description", content: "Bulk fruit listing on MandiGo." },
    ],
  }),
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
        <h1 className="font-display text-2xl font-extrabold">Listing not found</h1>
        <Button asChild className="mt-4"><Link to="/marketplace">Back to marketplace</Link></Button>
      </div>
    </div>
  ),
  component: FruitDetail,
});

function FruitDetail() {
  const { id } = Route.useParams();
  const { data: f } = useSuspenseQuery(fruitQuery(id));

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <Link to="/marketplace" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to marketplace
        </Link>

        <div className="mt-4 grid gap-8 md:grid-cols-2">
          <div className="overflow-hidden rounded-3xl border border-border bg-gradient-warm shadow-card">
            <img src={f.image} alt={f.name} className="aspect-[4/3] w-full object-cover" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              {f.inSeason && <Badge className="bg-trust text-trust-foreground hover:bg-trust">In season</Badge>}
              <Badge variant="secondary">{f.gst === "included" ? "GST included" : "GST extra"}</Badge>
              {f.variety && <Badge variant="outline">{f.variety}</Badge>}
            </div>

            <h1 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">
              {f.name} <span className="text-muted-foreground">{f.nameHi}</span>
            </h1>

            <p className="mt-3 text-muted-foreground">{f.description}</p>

            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <Info icon={<MapPin className="h-4 w-4" />} label="Origin" value={`${f.state} · ${f.region}`} />
              <Info icon={<Package className="h-4 w-4" />} label="MOQ" value={`${f.moqKg} kg`} />
              <Info icon={<Star className="h-4 w-4 fill-primary text-primary" />} label="Seller rating" value={`${f.seller.rating} / 5`} />
              <Info icon={<ShieldCheck className="h-4 w-4 text-trust" />} label="GSTIN" value={f.seller.gstin} />
            </div>

            <div className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-card">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Volume pricing</div>
              <div className="mt-3 divide-y divide-border">
                {f.tiers.map((t) => (
                  <div key={t.minQtyKg} className="flex items-center justify-between py-2.5">
                    <span className="text-sm">
                      {t.minQtyKg}+ kg <span className="text-muted-foreground">({(t.minQtyKg / 100).toFixed(t.minQtyKg % 100 ? 1 : 0)} quintal)</span>
                    </span>
                    <span className="font-display text-base font-bold">{formatINR(t.pricePerKg)}/kg</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow">
                Place order
              </Button>
              <Button size="lg" variant="outline">Contact seller</Button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Sold by <span className="font-medium text-foreground">{f.seller.name}</span> · {f.seller.type}</p>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}

function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">{icon}{label}</div>
      <div className="mt-0.5 truncate text-sm font-medium">{value}</div>
    </div>
  );
}
