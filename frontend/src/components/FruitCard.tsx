import { Link } from "@tanstack/react-router";
import { MapPin, Package, Star } from "lucide-react";
import type { Fruit } from "@/data/mockFruits";
import { formatINR } from "@/lib/api";
import { Badge } from "@/components/ui/badge";

export function FruitCard({ fruit }: { fruit: Fruit }) {
  return (
    <Link
      to="/fruit/$id"
      params={{ id: fruit.id }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all hover:-translate-y-0.5 hover:shadow-glow"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-warm">
        <img
          src={fruit.image}
          alt={`${fruit.name} (${fruit.nameHi})`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex gap-2">
          {fruit.inSeason && (
            <Badge className="bg-trust text-trust-foreground hover:bg-trust">In season</Badge>
          )}
        </div>
        <div className="absolute right-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium backdrop-blur">
          {fruit.gst === "included" ? "GST included" : "GST extra"}
        </div>
        <div className="absolute bottom-2 right-3 text-3xl drop-shadow">{fruit.emoji}</div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="min-w-0">
          <div className="flex items-baseline gap-2">
            <h3 className="truncate font-display text-base font-bold">{fruit.name}</h3>
            <span className="shrink-0 text-sm text-muted-foreground">{fruit.nameHi}</span>
          </div>
          {fruit.variety && (
            <p className="text-xs text-muted-foreground">{fruit.variety}</p>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <span className="inline-flex min-w-0 items-center gap-1">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{fruit.state}</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-primary text-primary" />
            {fruit.seller.rating}
          </span>
        </div>

        <div className="truncate text-sm">
          <span className="text-muted-foreground">by </span>
          <span className="font-medium">{fruit.seller.name}</span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-2 border-t border-border pt-3">
          <div>
            <div className="text-lg font-extrabold text-foreground">
              {formatINR(fruit.pricePerKg)}
              <span className="text-xs font-medium text-muted-foreground">/kg</span>
            </div>
            <div className="text-[11px] text-muted-foreground">
              from {formatINR(fruit.tiers[fruit.tiers.length - 1].pricePerKg)}/kg at scale
            </div>
          </div>
          <div className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-xs font-medium">
            <Package className="h-3.5 w-3.5" />
            MOQ {fruit.moqKg}kg
          </div>
        </div>
      </div>
    </Link>
  );
}
