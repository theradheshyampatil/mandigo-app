import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { queryOptions } from "@tanstack/react-query";
import { ArrowRight, Leaf, ShieldCheck, Truck, BadgePercent, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { FruitCard } from "@/components/FruitCard";
import { api } from "@/lib/api";

const fruitsQuery = queryOptions({
  queryKey: ["fruits"],
  queryFn: () => api.listFruits(),
});

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MandiGo — India's B2B fruit marketplace" },
      {
        name: "description",
        content:
          "Source mangoes, anar, banana, papaya and more directly from Indian wholesalers and farmer co-ops. Bulk pricing, GST invoices, MOQ from 50kg.",
      },
      { property: "og:title", content: "MandiGo — India's B2B fruit marketplace" },
      { property: "og:description", content: "Bulk fruits from wholesalers and farmer co-ops across India." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(fruitsQuery),
  component: LandingPage,
});

function LandingPage() {
  const { data: fruits } = useSuspenseQuery(fruitsQuery);
  const featured = fruits.slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-warm" />
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-trust/15 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.1fr_1fr] md:py-20">
          <div className="flex flex-col justify-center">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Leaf className="h-3.5 w-3.5" /> Live mandi prices · 9 states
            </span>
            <h1 className="mt-4 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
              Fresh fruits.{" "}
              <span className="bg-gradient-hero bg-clip-text text-transparent">Bulk prices.</span>
              <br />
              Straight from the mandi.
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              MandiGo connects retailers, restaurants and juice shops with wholesalers and farmer
              co-ops across India. Order by the quintal, pay with GST invoices, deliver to your shop.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow">
                <Link to="/marketplace">
                  I want to buy <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-trust text-trust hover:bg-trust hover:text-trust-foreground">
                <Link to="/sell">I want to sell</Link>
              </Button>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-border pt-6 text-sm">
              <Stat value="1,200+" label="Verified sellers" />
              <Stat value="9" label="States" />
              <Stat value="50kg" label="Min order" />
            </div>
          </div>

          {/* Search-card visual */}
          <div className="relative">
            <div className="rounded-3xl border border-border bg-card p-5 shadow-card">
              <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5">
                <Search className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Search: alphonso, anar, kela…</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {fruits.slice(0, 4).map((f) => (
                  <Link
                    key={f.id}
                    to="/fruit/$id"
                    params={{ id: f.id }}
                    className="group flex items-center gap-3 rounded-xl border border-border bg-background p-3 transition hover:border-primary"
                  >
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-gradient-warm text-2xl">
                      {f.emoji}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold">{f.name}</div>
                      <div className="text-xs text-muted-foreground">₹{f.pricePerKg}/kg · {f.state}</div>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between rounded-xl bg-trust/10 px-3 py-2 text-xs font-medium text-trust">
                <span>GST invoice on every order</span>
                <ShieldCheck className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-4 md:grid-cols-4">
          <ValueProp icon={<BadgePercent className="h-5 w-5" />} title="Volume pricing" desc="Tiered rates from 50kg up to multi-quintal orders." />
          <ValueProp icon={<ShieldCheck className="h-5 w-5" />} title="Verified sellers" desc="GSTIN-checked wholesalers and registered farmer co-ops." />
          <ValueProp icon={<Truck className="h-5 w-5" />} title="Mandi to shop" desc="Aggregated logistics across major fruit-belt states." />
          <ValueProp icon={<Leaf className="h-5 w-5" />} title="Seasonal alerts" desc="Get notified when alphonso, anar, or sitaphal hit peak." />
        </div>
      </section>

      {/* Featured fruits */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-extrabold sm:text-3xl">Trending in the mandi</h2>
            <p className="text-sm text-muted-foreground">Fresh picks moving fast this week.</p>
          </div>
          <Button asChild variant="ghost" className="text-primary hover:text-primary">
            <Link to="/marketplace">View all <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((f) => <FruitCard key={f.id} fruit={f} />)}
        </div>
      </section>

      {/* Dual CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="grid gap-4 md:grid-cols-2">
          <CtaCard
            tone="primary"
            eyebrow="For buyers"
            title="Stock your shop, your way."
            desc="Browse 100+ fruit listings, compare prices across mandis, place bulk orders in minutes."
            href="/marketplace"
            cta="Browse marketplace"
          />
          <CtaCard
            tone="trust"
            eyebrow="For sellers"
            title="Sell beyond your mandi."
            desc="Reach retailers, restaurants and juice shops across India. List your fruits in 5 minutes."
            href="/sell"
            cta="Start selling"
          />
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-display text-2xl font-extrabold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function ValueProp({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">{icon}</div>
      <div className="mt-4 font-display text-base font-bold">{title}</div>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}

function CtaCard({
  tone, eyebrow, title, desc, href, cta,
}: { tone: "primary" | "trust"; eyebrow: string; title: string; desc: string; href: "/marketplace" | "/sell"; cta: string }) {
  const accent = tone === "primary" ? "bg-gradient-hero" : "bg-trust";
  return (
    <div className={`relative overflow-hidden rounded-3xl ${accent} p-8 text-primary-foreground shadow-glow`}>
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/15 blur-2xl" />
      <span className="text-xs font-semibold uppercase tracking-wider opacity-90">{eyebrow}</span>
      <h3 className="mt-2 font-display text-2xl font-extrabold sm:text-3xl">{title}</h3>
      <p className="mt-2 max-w-md text-sm opacity-95">{desc}</p>
      <Button asChild size="lg" variant="secondary" className="mt-6 bg-background text-foreground hover:bg-background/90">
        <Link to={href}>{cta} <ArrowRight className="ml-1 h-4 w-4" /></Link>
      </Button>
    </div>
  );
}
