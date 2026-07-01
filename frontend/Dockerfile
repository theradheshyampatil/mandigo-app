# =============================================================================
# MandiGo Frontend - Multi-stage Docker build
# Stage 1: Build the Vite/React app with Node 20
# Stage 2: Serve the static bundle with Nginx (SPA-aware)
# =============================================================================

# ---------- Stage 1: Builder ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Public build-time config.
# Vite inlines any env var prefixed with VITE_ into the static bundle
# at build time as `import.meta.env.VITE_*`. ARG comes from the CI
# step's `build-args:` block; ENV makes it visible to `npm run build`.
#
# Default empty so a local `docker build .` without --build-arg falls
# back to api.ts's mock-data path instead of pointing at undefined.
ARG VITE_API_URL=""
ENV VITE_API_URL=$VITE_API_URL

# Install dependencies first for better Docker layer caching.
# Copying only manifests means `npm install` only re-runs when deps change,
# not on every source code edit.
COPY package*.json ./

# Use `npm ci` when a lockfile exists (deterministic, faster, CI-friendly).
# Fall back to `npm install` for the transitional skeleton before Lovable's
# export brings its own package-lock.json.
RUN echo ">>> Force running npm install with legacy peer deps" && \
    npm install --no-audit --no-fund --legacy-peer-deps

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
