# my-monorepo

Monorepo for multiple frontend apps with isolated deployments.

## Structure

```
my-monorepo/
├── apps/          # Deployable applications
├── packages/      # Shared internal libraries
├── docker/        # Per-app Dockerfiles
├── package.json
├── pnpm-workspace.yaml
└── .npmrc
```

## Apps

| App | Host port |
|-----|-----------|
| `marketing-site` | 3000 |
| `saas-dashboard` | 3001 |
| `blog` | 3002 |
| `admin` | 3003 |

## Packages

- `packages/ui` → `@my-monorepo/ui`
- `packages/utils` → `@my-monorepo/utils`
- `packages/config` → `@my-monorepo/config`

## Getting started

```bash
# Install all dependencies
pnpm install

# Build everything
pnpm build

# Run all apps in dev mode (parallel)
pnpm dev
```

## Docker

Each app has its own `docker-compose.yml`. Build and run an app in isolation:

```bash
cd apps/marketing-site
docker compose up --build
```

> **Note:** Run `pnpm install` at the monorepo root first to generate
> `pnpm-lock.yaml`, which is required for `--frozen-lockfile` in Docker.
