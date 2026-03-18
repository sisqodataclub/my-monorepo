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



## The packages/ Folder (Zero-Friction Code Sharing)
- Shared UI: You can build a packages/ui folder with your customized buttons, navbars, and Tailwind configs. All 5 of your apps import the exact same button. If you change the button's color in the package, all 5 apps update instantly.
- Shared Types/Configs: You can share TypeScript interfaces, ESLint rules, and database schemas across the entire company without having to publish private npm packages.

## Single Dependency Tree (No Version Hell)

- Notice how you have one pnpm-lock.yaml at the very root of the project?
If your blog uses React 18, and your admin dashboard uses React 18, pnpm hoists them so they share the exact same installation on your hard drive. You will never run into bugs where "App A works but App B is broken because they are using different versions of the same library."

## Atomic Commits (Cross-Project Refactoring)

- Imagine you change the structure of your database user model. In a multi-repo setup, you have to update the backend repo, make a PR, then go to the frontend repo, make a PR, and hope they deploy at the same time.
In your monorepo, you can update the shared database type in packages/ and update the ddeep frontend to use the new type in a single Git commit.

## Massive CI/CD Speed Up

- Because everything is in one place, you can use build systems like Turborepo or Nx. If a developer only edits code inside apps/ddeep/src, the build system is smart enough to know that admin, blog, and marketing-site were untouched. Your CI/CD pipeline will only build and test ddeep, saving you massive amounts of server compute time.

# Unified Developer Experience

- When a new developer (or one of your AI agents) joins the team, they run pnpm install exactly once at the root. Instantly, all 5 apps and all shared packages are linked and ready to run locally. They can open the entire company's codebase in a single VS Code window and easily trace a function from the frontend dashboard all the way down to the shared backend logic.









