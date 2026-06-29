import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — MandiGo" }, { name: "description", content: "Your orders, saved sellers and price alerts." }] }),
  component: () => (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <h1 className="font-display text-3xl font-extrabold">Buyer dashboard</h1>
        <p className="mt-2 text-muted-foreground">Recent orders, saved sellers and price alerts will land here.</p>
        <Button asChild className="mt-6"><Link to="/marketplace">Go to marketplace</Link></Button>
      </div>
      <SiteFooter />
    </div>
  ),
});
