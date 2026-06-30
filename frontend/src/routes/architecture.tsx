import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Activity,
  ArrowRight,
  Boxes,
  CloudCog,
  Cpu,
  Database,
  Github,
  Globe,
  LineChart,
  PackageCheck,
  Rocket,
  Server,
  ShieldCheck,
  Workflow,
} from "lucide-react";

export const Route = createFileRoute("/architecture")({
  component: ArchitecturePage,
});

// -----------------------------------------------------------------------------
// Live status — small panel that pings the real backend to prove the diagram
// matches reality. If recruiters click Architecture while the EC2 is off,
// the green dot turns amber and reveals "site is sleeping".
// -----------------------------------------------------------------------------

interface HealthPayload {
  status: string;
  service: string;
  version: string;
  uptimeSeconds: number;
  timestamp: string;
}

function useBackendHealth() {
  const [health, setHealth] = useState<HealthPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const ctrl = new AbortController();
    const apiBase = import.meta.env.VITE_API_URL?.replace(/\/api\/v\d+$/, "") ?? "";
    const url = apiBase ? `${apiBase}/healthz` : "";
    if (!url) {
      setError("VITE_API_URL not set; live ping skipped");
      return;
    }
    fetch(url, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((data) => !cancelled && setHealth(data as HealthPayload))
      .catch((e) => !cancelled && setError(String(e?.message ?? e)));
    return () => {
      cancelled = true;
      ctrl.abort();
    };
  }, []);

  return { health, error };
}

// -----------------------------------------------------------------------------
// Data — tech stack content. Kept in a const so it can be expanded as the
// project grows without touching JSX.
// -----------------------------------------------------------------------------

const TECH_STACK = [
  {
    title: "Frontend",
    icon: Globe,
    items: [
      "React 19",
      "Vite 6",
      "TypeScript",
      "TanStack Router (SPA mode)",
      "TanStack Query",
      "Tailwind v4",
      "shadcn/ui (Radix)",
      "react-hook-form + Zod",
    ],
  },
  {
    title: "Backend",
    icon: Server,
    items: [
      "Node.js 20 LTS",
      "Hono v4 (HTTP router)",
      "Drizzle ORM (type-safe SQL)",
      "Zod (env + schema validation)",
      "PostgreSQL 16",
      "Custom SQL migrations",
    ],
  },
  {
    title: "Infrastructure",
    icon: Boxes,
    items: [
      "AWS EC2 (c7i-flex.large, ap-south-1)",
      "Amazon ECR (private images)",
      "K3s (lightweight Kubernetes)",
      "Traefik (ingress + TLS)",
      "Let's Encrypt (auto-renew)",
      "Terraform (ECR repos as code)",
      "GoDaddy DNS",
    ],
  },
  {
    title: "CI / CD / Ops",
    icon: Workflow,
    items: [
      "GitHub Actions (build + push to ECR)",
      "Cross-repo write-back (auto-bump GitOps)",
      "ArgoCD (declarative continuous delivery)",
      "K3s HelmChart CRD (managed charts)",
      "Prometheus + Grafana (metrics)",
      "EC2 cron pre-puller (ECR auth shim)",
    ],
  },
] as const;

// -----------------------------------------------------------------------------
// Deploy pipeline steps — used in both the timeline and the hover descriptions.
// -----------------------------------------------------------------------------

const PIPELINE_STEPS = [
  {
    icon: Github,
    title: "git push",
    detail: "Developer pushes a feature branch / merges a PR.",
  },
  {
    icon: PackageCheck,
    title: "GitHub Actions",
    detail: "Builds Docker image, pushes :<sha> + :latest to ECR.",
  },
  {
    icon: CloudCog,
    title: "Auto-bump GitOps",
    detail: "Second job rewrites image tag in mandigo-gitops/k8s/.../deployment.yaml and commits as github-actions[bot].",
  },
  {
    icon: Activity,
    title: "EC2 cron pre-pull",
    detail: "ecr-sync.sh (every 1 min, flock-guarded) pulls the new tag into K3s containerd cache, bypassing K3s's broken native ECR auth.",
  },
  {
    icon: Rocket,
    title: "ArgoCD reconcile",
    detail: "Detects the gitops commit (~30s polling), applies the new manifest, K3s rolls the deployment with maxUnavailable=0.",
  },
  {
    icon: ShieldCheck,
    title: "Live",
    detail: "Readiness probe (/readyz, DB-aware) returns 200; Service starts routing. Zero downtime.",
  },
] as const;

// -----------------------------------------------------------------------------
// The page
// -----------------------------------------------------------------------------

function ArchitecturePage() {
  const { health, error } = useBackendHealth();
  const liveOK = !!health && health.status === "ok";

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero ---------------------------------------------------------- */}
      <section className="mx-auto max-w-7xl px-4 pb-12 pt-10 sm:px-6 sm:pt-16">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs font-medium text-muted-foreground">
              <Cpu className="h-3.5 w-3.5" />
              How it's actually built
            </div>
            <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
              From <span className="text-primary">git push</span> to <span className="text-primary">live</span>
              <br />
              in under <span className="bg-gradient-hero bg-clip-text text-transparent">5 minutes</span>
            </h1>
            <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
              A complete full-stack GitOps deployment running on a single AWS EC2 instance.
              Two repos, three pods, one cron, zero manual <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-xs">kubectl apply</code>.
            </p>
          </div>

          {/* Live status pill */}
          <div className="flex shrink-0 items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-sm">
            <span className="relative inline-flex h-3 w-3">
              <span
                className={
                  liveOK
                    ? "absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"
                    : ""
                }
              />
              <span
                className={`relative inline-flex h-3 w-3 rounded-full ${
                  liveOK ? "bg-emerald-500" : error ? "bg-amber-500" : "bg-muted-foreground/40"
                }`}
              />
            </span>
            <div className="text-xs leading-tight">
              <div className="font-semibold text-foreground">
                {liveOK ? "Backend live" : error ? "Backend unreachable" : "Checking…"}
              </div>
              <div className="text-muted-foreground">
                {health
                  ? `v${health.version} · up ${formatUptime(health.uptimeSeconds)}`
                  : "ping in flight"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech stack grid ----------------------------------------------- */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <h2 className="font-display text-2xl font-bold tracking-tight">The stack</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Picked for type safety, low memory footprint, and how cleanly each piece fits with everything else.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {TECH_STACK.map((group) => (
            <Card
              key={group.title}
              className="border-border/60 transition-shadow hover:shadow-glow"
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                    <group.icon className="h-4 w-4" />
                  </span>
                  {group.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-1.5 pt-0">
                {group.items.map((item) => (
                  <Badge
                    key={item}
                    variant="secondary"
                    className="border border-border/40 bg-secondary/60 font-normal"
                  >
                    {item}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Runtime architecture diagram ---------------------------------- */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <h2 className="font-display text-2xl font-bold tracking-tight">Request flow</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          What happens when a buyer's browser opens a fruit detail page. Animated dots show the live traffic direction.
        </p>

        <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-card p-4 sm:p-8">
          <RuntimeDiagram />
        </div>
      </section>

      {/* Deploy pipeline ----------------------------------------------- */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <h2 className="font-display text-2xl font-bold tracking-tight">Deploy pipeline</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Every push to{" "}
          <a
            href="https://github.com/theradheshyampatil/mandigo-app"
            className="font-medium text-primary hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            mandigo-app
          </a>{" "}
          flows through these six steps. No human intervention after the merge button.
        </p>

        <ol className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {PIPELINE_STEPS.map((step, i) => (
            <li
              key={step.title}
              className="group relative flex gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/60"
            >
              <div className="flex shrink-0 flex-col items-center">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground shadow-glow">
                  <step.icon className="h-4 w-4" />
                </span>
                <span className="mt-1 text-xs font-mono text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold">{step.title}</div>
                <div className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {step.detail}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* See it live --------------------------------------------------- */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="grid gap-4 md:grid-cols-2">
          <a
            href="/monitoring"
            className="group flex items-center gap-4 rounded-2xl border border-border bg-gradient-hero p-6 text-primary-foreground transition-transform hover:scale-[1.01]"
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/15 backdrop-blur">
              <LineChart className="h-6 w-6" />
            </span>
            <div className="flex-1">
              <div className="text-lg font-bold">Live cluster metrics</div>
              <div className="mt-0.5 text-sm text-primary-foreground/80">
                Grafana dashboards on Prometheus — pods, nodes, requests, latency. Anonymous view, no login.
              </div>
            </div>
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </a>

          <a
            href="https://api.projectbyradhe.xyz/api/v1/fruits"
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/60"
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
              <Database className="h-6 w-6" />
            </span>
            <div className="flex-1">
              <div className="text-lg font-bold">Raw API response</div>
              <div className="mt-0.5 text-sm text-muted-foreground">
                JSON from the live Hono backend. Postgres-backed via Drizzle ORM. 10 seeded fruits.
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground hover:underline">
            ← Back to the marketplace
          </Link>
          <span aria-hidden>·</span>
          <a
            href="https://github.com/theradheshyampatil/mandigo-app"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-foreground hover:underline"
          >
            <Github className="h-3.5 w-3.5" />
            mandigo-app
          </a>
          <span aria-hidden>·</span>
          <a
            href="https://github.com/theradheshyampatil/mandigo-gitops"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-foreground hover:underline"
          >
            <Github className="h-3.5 w-3.5" />
            mandigo-gitops
          </a>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

// -----------------------------------------------------------------------------
// The runtime architecture SVG — drawn by hand so it's responsive via viewBox
// and uses <animateMotion> for the traffic dots (no JS animation loop).
// -----------------------------------------------------------------------------

function RuntimeDiagram() {
  return (
    <svg
      viewBox="0 0 900 460"
      className="h-auto w-full max-w-full"
      role="img"
      aria-label="System architecture diagram"
    >
      <defs>
        <linearGradient id="podGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.96 0.02 80)" />
          <stop offset="100%" stopColor="oklch(0.92 0.04 70)" />
        </linearGradient>
        <linearGradient id="primaryGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.82 0.16 58)" />
          <stop offset="100%" stopColor="oklch(0.68 0.21 45)" />
        </linearGradient>
        <linearGradient id="dbGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.6 0.15 155)" />
          <stop offset="100%" stopColor="oklch(0.45 0.13 155)" />
        </linearGradient>
        <marker
          id="arrow"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="oklch(0.6 0.05 80)" />
        </marker>
      </defs>

      {/* Cluster boundary */}
      <rect
        x="180"
        y="80"
        width="700"
        height="360"
        rx="20"
        fill="oklch(0.98 0.005 80)"
        stroke="oklch(0.92 0.01 80)"
        strokeWidth="1.5"
        strokeDasharray="4 6"
      />
      <text x="200" y="110" fontSize="13" fill="oklch(0.55 0.02 80)" fontWeight="600">
        EC2 · K3s cluster · ap-south-1
      </text>

      {/* Database namespace */}
      <rect
        x="630"
        y="270"
        width="220"
        height="130"
        rx="12"
        fill="oklch(0.97 0.01 155)"
        stroke="oklch(0.85 0.04 155)"
        strokeWidth="1"
      />
      <text x="645" y="290" fontSize="11" fill="oklch(0.5 0.06 155)" fontWeight="600">
        namespace: database
      </text>

      {/* Default namespace */}
      <rect
        x="210"
        y="170"
        width="400"
        height="230"
        rx="12"
        fill="oklch(0.98 0.005 80)"
        stroke="oklch(0.9 0.02 70)"
        strokeWidth="1"
      />
      <text x="225" y="190" fontSize="11" fill="oklch(0.55 0.04 70)" fontWeight="600">
        namespace: default
      </text>

      {/* Monitoring namespace (smaller) */}
      <rect
        x="630"
        y="160"
        width="220"
        height="90"
        rx="12"
        fill="oklch(0.97 0.015 280)"
        stroke="oklch(0.85 0.05 280)"
        strokeWidth="1"
      />
      <text x="645" y="180" fontSize="11" fill="oklch(0.5 0.08 280)" fontWeight="600">
        namespace: monitoring
      </text>

      {/* === Nodes === */}

      {/* Browser */}
      <Node x={20} y={180} width={130} height={60} label="Browser" sub="React 19 SPA" />

      {/* Traefik */}
      <Node
        x={240}
        y={210}
        width={140}
        height={60}
        label="Traefik"
        sub="TLS · Let's Encrypt"
        accent
      />

      {/* Frontend pod */}
      <Node
        x={240}
        y={320}
        width={150}
        height={60}
        label="Frontend Pod"
        sub="nginx · static"
      />

      {/* Backend pod */}
      <Node
        x={420}
        y={320}
        width={170}
        height={60}
        label="Backend Pod"
        sub="Hono · Drizzle"
        accent
      />

      {/* Postgres */}
      <Node
        x={660}
        y={310}
        width={170}
        height={70}
        label="Postgres 16"
        sub="PVC · gp3 EBS"
        db
      />

      {/* Grafana + Prometheus */}
      <Node
        x={660}
        y={190}
        width={170}
        height={50}
        label="Prometheus + Grafana"
        sub="/monitoring"
      />

      {/* === Edges with animated dots === */}

      <Edge d="M 150 210 L 240 230" label="HTTPS" />
      <Edge d="M 310 270 L 310 320" label="" />
      <Edge d="M 380 270 L 420 350" label="" />
      <Edge d="M 590 350 L 660 345" label="pg pool" />
      <Edge d="M 590 320 Q 620 270 660 215" label="metrics" dashed />
      <Edge d="M 150 220 Q 60 380 590 360" label="" hide />

      {/* === Static labels === */}

      <text x="170" y="200" fontSize="9" fill="oklch(0.55 0.02 80)">
        TLS handshake
      </text>
      <text x="295" y="300" fontSize="9" fill="oklch(0.55 0.02 80)">
        path / → SPA
      </text>
      <text x="345" y="305" fontSize="9" fill="oklch(0.55 0.02 80)">
        api.projectbyradhe.xyz
      </text>
      <text x="601" y="343" fontSize="9" fill="oklch(0.45 0.06 155)">
        cross-NS DNS
      </text>
    </svg>
  );
}

interface NodeProps {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  sub?: string;
  accent?: boolean;
  db?: boolean;
}

function Node({ x, y, width, height, label, sub, accent, db }: NodeProps) {
  const fill = db
    ? "url(#dbGrad)"
    : accent
      ? "url(#primaryGrad)"
      : "url(#podGrad)";
  const labelColor = db || accent ? "oklch(0.99 0.01 80)" : "oklch(0.25 0.02 80)";
  const subColor = db || accent ? "oklch(0.92 0.05 80)" : "oklch(0.55 0.02 80)";
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={10}
        fill={fill}
        stroke="oklch(0.85 0.02 60)"
        strokeWidth={1}
      />
      <text
        x={x + width / 2}
        y={y + (sub ? height / 2 - 2 : height / 2 + 4)}
        textAnchor="middle"
        fontSize={13}
        fontWeight={700}
        fill={labelColor}
      >
        {label}
      </text>
      {sub && (
        <text
          x={x + width / 2}
          y={y + height / 2 + 14}
          textAnchor="middle"
          fontSize={10}
          fill={subColor}
        >
          {sub}
        </text>
      )}
    </g>
  );
}

interface EdgeProps {
  d: string;
  dashed?: boolean;
  hide?: boolean;
  // `label` is consumed in the JSX via static <text> elements next to each
  // edge rather than rendered inside the Edge component (positioning differs
  // per edge); the prop name is intentionally unused here so the call-site
  // documentation stays self-describing.
  label?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Edge({ d, dashed, hide, label: _label }: EdgeProps) {
  if (hide) return null;
  const pathId = `edge-${d.replace(/[^a-z0-9]/gi, "").slice(0, 12)}`;
  return (
    <>
      <path
        id={pathId}
        d={d}
        fill="none"
        stroke="oklch(0.75 0.05 70)"
        strokeWidth={1.5}
        strokeDasharray={dashed ? "4 4" : undefined}
        markerEnd="url(#arrow)"
      />
      <circle r={4} fill="oklch(0.68 0.21 45)">
        <animateMotion dur="3s" repeatCount="indefinite">
          <mpath href={`#${pathId}`} />
        </animateMotion>
      </circle>
    </>
  );
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function formatUptime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  return `${Math.floor(seconds / 86400)}d`;
}
