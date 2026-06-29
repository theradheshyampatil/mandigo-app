import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login — MandiGo" }, { name: "description", content: "Sign in to MandiGo." }] }),
  component: () => (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto grid max-w-md gap-4 px-4 py-16 sm:px-6">
        <h1 className="font-display text-3xl font-extrabold">Welcome back</h1>
        <p className="text-sm text-muted-foreground">UI only — auth wires up later.</p>
        <form className="mt-2 grid gap-3 rounded-2xl border border-border bg-card p-6 shadow-card" onSubmit={(e) => e.preventDefault()}>
          <div className="grid gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@shop.in" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="pwd">Password</Label>
            <Input id="pwd" type="password" placeholder="••••••••" />
          </div>
          <Button type="submit" className="mt-2">Sign in</Button>
          <Link to="/" className="text-center text-xs text-muted-foreground hover:underline">Back home</Link>
        </form>
      </div>
    </div>
  ),
});
