# =============================================================================
# MandiGo Backend API - Multi-stage Docker build
# Stage 1: Compile TypeScript -> JS with Node 20
# Stage 2: Slim runtime with only production deps
# =============================================================================

# ---------- Stage 1: Builder ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Install all deps (incl. dev: tsx, typescript, @types/node) for compilation
COPY package*.json ./
RUN if [ -f package-lock.json ]; then \
      echo ">>> Lockfile found: running npm ci" && \
      npm ci --no-audit --no-fund; \
    else \
      echo ">>> No lockfile: running npm install" && \
      npm install --no-audit --no-fund; \
    fi

# Copy source and tsconfig, then compile to /app/dist
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ---------- Stage 2: Runner ----------
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Install ONLY production deps for a small runtime image (~80-100 MB total)
COPY package*.json ./
RUN if [ -f package-lock.json ]; then \
      npm ci --omit=dev --no-audit --no-fund; \
    else \
      npm install --omit=dev --no-audit --no-fund; \
    fi && \
    npm cache clean --force

# Copy compiled JS from the builder stage
COPY --from=builder /app/dist ./dist

# Run as non-root user (node:node is pre-created in the alpine image)
USER node

EXPOSE 3000

# Note: K8s liveness/readiness probes handle health-checking from outside,
# so no in-container HEALTHCHECK directive (avoids duplicate probe traffic).

CMD ["node", "dist/index.js"]
