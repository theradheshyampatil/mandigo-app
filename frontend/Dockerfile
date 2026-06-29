# =============================================================================
# MandiGo Frontend - Multi-stage Docker build
# Stage 1: Build the Vite/React app with Node 20
# Stage 2: Serve the static bundle with Nginx (SPA-aware)
# =============================================================================

# ---------- Stage 1: Builder ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first for better Docker layer caching.
# Copying only manifests means `npm install` only re-runs when deps change,
# not on every source code edit.
COPY package*.json ./

# Use `npm ci` when a lockfile exists (deterministic, faster, CI-friendly).
# Fall back to `npm install` for the transitional skeleton before Lovable's
# export brings its own package-lock.json.
RUN if [ -f package-lock.json ]; then \
      echo ">>> Lockfile found: running npm ci" && \
      npm ci --no-audit --no-fund; \
    else \
      echo ">>> No lockfile: running npm install" && \
      npm install --no-audit --no-fund; \
    fi

# Copy the rest of the source tree (respects .dockerignore)
COPY . .

# Build the production bundle. Vite outputs to /app/dist by default.
RUN npm run build

# ---------- Stage 2: Runner ----------
FROM nginx:1.27-alpine AS runner

# Replace the default Nginx server block with our SPA-aware config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built static assets from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# K3s expects containers to expose 80 (matches deployment.yaml containerPort)
EXPOSE 80

# Run Nginx in the foreground so it stays as PID 1
CMD ["nginx", "-g", "daemon off;"]
