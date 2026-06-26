export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div>
          <div className="font-display text-lg font-extrabold">
            Mandi<span className="text-primary">Go</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            India's B2B fruit marketplace. Direct from farmers and wholesalers to your shop.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold">For buyers</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>Retailers</li><li>Restaurants</li><li>Juice shops</li><li>Hotels</li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">For sellers</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>Wholesalers</li><li>Farmer co-ops</li><li>GST onboarding</li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Company</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>About</li><li>Contact</li><li>Pricing</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} MandiGo. Prices indicative; GST as per listing.
      </div>
    </footer>
  );
}
