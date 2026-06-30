import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Download,
  ExternalLink,
  FileText,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

// -----------------------------------------------------------------------------
// Content lives in const arrays so it's easy to keep fresh without diving
// into JSX. Replace anything below as the project / resume evolves.
// -----------------------------------------------------------------------------

const ME = {
  name: "Radheshyam Patil",
  title: "Full-stack developer · DevOps · Cloud",
  location: "India",
  pitch:
    "I build production systems end-to-end — from React UIs to AWS infrastructure to GitOps pipelines. " +
    "MandiGo is my latest project: a B2B Fruit Marketplace running on a single cost-optimised EC2 with full Kubernetes + ArgoCD discipline.",
  email: "radheshyam9096@gmail.com",
  github: "https://github.com/theradheshyampatil",
  linkedin: "https://www.linkedin.com/in/theradheshyampatil",
  resumePath: "/resume.pdf", // serve from frontend/public/resume.pdf
} as const;

const HIGHLIGHTS = [
  {
    title: "Built MandiGo solo",
    body:
      "A B2B fruit marketplace targeting Indian retailers, restaurants, and juice shops. Postgres-backed catalog with 10 seeded fruits, tiered B2B pricing, GST-aware listings, and a Lovable-generated React 19 / Tailwind v4 frontend.",
  },
  {
    title: "Full GitOps deploy chain",
    body:
      "Two-repo separation (mandigo-app + mandigo-gitops). Every push triggers Docker build → ECR → cross-repo auto-bump → ArgoCD reconcile → K3s rolling update. Zero manual kubectl apply.",
  },
  {
    title: "Cost-engineered for AWS credits",
    body:
      "One c7i-flex.large running K3s, Postgres, Hono, nginx, ArgoCD, Traefik, Prometheus, and Grafana under 4 GiB used. Elastic IP keeps DNS stable across stop/start cycles.",
  },
  {
    title: "Production-grade observability",
    body:
      "Prometheus + Grafana via K3s HelmChart CRD. Anonymous read-only dashboards at /monitoring so anyone can see live cluster health without a login wall.",
  },
] as const;

const SKILLS = [
  {
    category: "Frontend",
    items: [
      "TypeScript",
      "React 18 / 19",
      "Vite",
      "TanStack Router + Query",
      "Tailwind CSS",
      "shadcn/ui (Radix)",
      "Zod + react-hook-form",
    ],
  },
  {
    category: "Backend",
    items: [
      "Node.js (Hono, Express)",
      "TypeScript everywhere",
      "Drizzle ORM",
      "PostgreSQL",
      "REST API design",
      "Zod for runtime validation",
    ],
  },
  {
    category: "DevOps / Cloud",
    items: [
      "AWS (EC2, ECR, IAM, EBS)",
      "Kubernetes (K3s)",
      "ArgoCD (GitOps)",
      "Helm",
      "Terraform",
      "GitHub Actions",
      "Docker (multi-stage)",
      "Traefik + Let's Encrypt",
      "Prometheus + Grafana",
    ],
  },
  {
    category: "Practices",
    items: [
      "Twelve-factor app discipline",
      "Trunk-based dev + PRs",
      "Conventional Commits",
      "Sealed Secrets / IaC hygiene",
      "Liveness vs readiness probes",
    ],
  },
] as const;

// -----------------------------------------------------------------------------
// The page
// -----------------------------------------------------------------------------

function AboutPage() {
  const initials = ME.name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero ---------------------------------------------------------- */}
      <section className="mx-auto max-w-5xl px-4 pb-12 pt-10 sm:px-6 sm:pt-16">
        <div className="flex flex-col items-start gap-8 md:flex-row md:items-center">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="grid h-32 w-32 place-items-center rounded-3xl bg-gradient-hero text-4xl font-bold text-primary-foreground shadow-glow sm:h-36 sm:w-36">
              {initials}
            </div>
            <span className="absolute -bottom-2 -right-2 flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium shadow-sm">
              <Sparkles className="h-3 w-3 text-primary" />
              Open to work
            </span>
          </div>

          <div className="flex-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs font-medium text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              {ME.location}
            </div>
            <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
              {ME.name}
            </h1>
            <p className="mt-2 text-base font-medium text-primary">{ME.title}</p>
            <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
              {ME.pitch}
            </p>

            {/* Quick contact row */}
            <div className="mt-6 flex flex-wrap gap-2">
              <ContactPill
                href={`mailto:${ME.email}`}
                icon={Mail}
                label={ME.email}
              />
              <ContactPill
                href={ME.github}
                icon={Github}
                label="GitHub"
                external
              />
              <ContactPill
                href={ME.linkedin}
                icon={Linkedin}
                label="LinkedIn"
                external
              />
            </div>
          </div>
        </div>
      </section>

      {/* Resume CTA ---------------------------------------------------- */}
      <section className="mx-auto max-w-5xl px-4 pb-12 sm:px-6">
        <Card className="overflow-hidden border-border/60 bg-gradient-to-br from-card to-secondary/40">
          <CardContent className="flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div className="flex items-center gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                <FileText className="h-6 w-6" />
              </span>
              <div>
                <div className="font-display text-xl font-bold">Resume</div>
                <div className="text-sm text-muted-foreground">
                  One-page PDF · Updated recently
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href={ME.resumePath}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
              >
                <ExternalLink className="h-4 w-4" />
                View
              </a>
              <a
                href={ME.resumePath}
                download
                className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </a>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Highlights ---------------------------------------------------- */}
      <section className="mx-auto max-w-5xl px-4 pb-12 sm:px-6">
        <h2 className="font-display text-2xl font-bold tracking-tight">
          What I've built recently
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          This very site is the live demo. Click around — everything you see is shipping in production.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {HIGHLIGHTS.map((h) => (
            <Card key={h.title} className="border-border/60">
              <CardContent className="p-5">
                <div className="font-semibold">{h.title}</div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {h.body}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/architecture"
            className="group inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            See the architecture deep-dive
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <a
            href="/monitoring"
            className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
          >
            Live cluster metrics
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      {/* Skills -------------------------------------------------------- */}
      <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
        <h2 className="font-display text-2xl font-bold tracking-tight">
          Things I'm fluent in
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Picked based on what actually ships in MandiGo, not aspirational JD-padding.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {SKILLS.map((group) => (
            <Card key={group.category} className="border-border/60">
              <CardContent className="p-5">
                <div className="font-semibold">{group.category}</div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <Badge
                      key={item}
                      variant="secondary"
                      className="border border-border/40 bg-secondary/60 font-normal"
                    >
                      {item}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

interface ContactPillProps {
  href: string;
  icon: React.ElementType;
  label: string;
  external?: boolean;
}

function ContactPill({ href, icon: Icon, label, external }: ContactPillProps) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium transition-colors hover:border-primary/60 hover:bg-secondary"
    >
      <Icon className="h-4 w-4 text-muted-foreground" />
      {label}
    </a>
  );
}
