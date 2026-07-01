# =============================================================================
# MandiGo Backend API - Multi-stage Docker build
# Stage 1: Compile TypeScript -> JS with Node 20
# Stage 2: Slim runtime with only production deps + migrations
# =============================================================================

# ---------- Stage 1: Builder ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Install all deps (incl. dev: tsx, typescript, @types/node, drizzle-kit)
COPY package*.json ./
RUN echo ">>> Force running npm install with legacy peer deps" && \
    npm install --no-audit --no-fund --legacy-peer-deps

# Copy source and tsconfig, compile to /app/dist
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ---------- Stage 2: Runner ----------
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Install ONLY production deps (drops drizzle-kit, tsx, typescript, etc.)
COPY package*.json ./
RUN echo ">>> Force running npm install with legacy peer deps (prod)" && \
    npm install --omit=dev --no-audit --no-fund --legacy-peer-deps && \
    npm cache clean --force

# Copy the compiled JS from the builder stage
COPY --from=builder /app/dist ./dist

# Copy the SQL migration files. The runtime migrator in src/db/migrate.ts
# reads from /app/migrations at boot. NOT under /app/dist because they
# aren't TypeScript and tsc doesn't move them.
COPY migrations ./migrations

# Run as non-root user (node:node is pre-created in the alpine image)
USER node

EXPOSE 3000

# K8s liveness/readiness probes handle health-checking from outside,
# so no in-container HEALTHCHECK directive.

CMD ["node", "dist/index.js"]
