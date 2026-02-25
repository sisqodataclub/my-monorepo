# Dockerfile for marketing-site
# Build context: monorepo root

# ── deps stage ──────────────────────────────────────────────
FROM node:18-alpine AS deps
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy manifests needed to resolve the full workspace
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY packages/ ./packages/
COPY apps/marketing-site/package.json ./apps/marketing-site/package.json

# Install all workspace deps (frozen for reproducibility)
RUN pnpm install --frozen-lockfile

# ── build stage ──────────────────────────────────────────────
FROM deps AS builder
COPY apps/marketing-site/ ./apps/marketing-site/
RUN pnpm --filter @my-monorepo/marketing-site build

# ── runtime stage ────────────────────────────────────────────
FROM node:18-alpine AS runner
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate

# Only copy what's needed to run
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-workspace.yaml ./
COPY --from=builder /app/.npmrc ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/marketing-site ./apps/marketing-site

EXPOSE 3000
CMD ["node", "apps/marketing-site/index.js"]
