import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/sell")({
  head: () => ({ meta: [{ title: "Sell on MandiGo" }, { name: "description", content: "Onboard as a wholesaler or farmer co-op on MandiGo." }] }),
  component: () => (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="font-display text-3xl font-extrabold">Sell on MandiGo</h1>
        <p className="mt-2 text-muted-foreground">Onboarding form coming next — we'll wire it up in the next iteration.</p>
        <Button asChild className="mt-6"><Link to="/">Back home</Link></Button>
      </div>
      <SiteFooter />
    </div>
  ),
});
