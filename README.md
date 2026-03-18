# 🌌 My Agency Monorepo

A modern, high-performance `pnpm` workspace monorepo designed for scale. This repository houses multiple isolated frontend applications and shared packages under a single, unified dependency tree.

## 📂 Project Structure

We follow the **Self-Contained App** architecture. Each app contains its own source code, Dockerfile, and deployment scripts, while heavily utilizing shared packages for maximum code reuse.

```text
my-monorepo/
├── apps/                  # Deployable, standalone applications
│   ├── ddeep/             # Example App (Contains its own Dockerfile & config)
│   ├── marketing-site/
│   ├── saas-dashboard/
│   ├── blog/
│   └── admin/
├── packages/              # Shared internal libraries (Zero-friction code sharing)
│   ├── ui/                # Shared Tailwind components & UI elements
│   ├── utils/             # Shared helper functions and hooks
│   └── config/            # Shared ESLint, TS configs, and formatting rules
├── git_push.sh            # Automated safe-push script
├── package.json           # Root package defining workspace tools
├── pnpm-workspace.yaml    # Defines the apps/* and packages/* routing
└── pnpm-lock.yaml         # The single source of truth for all dependencies
```

## 🚀 Getting Started

When a new developer (or AI agent) joins the team, setup is instant. Run this **once** at the root of the project to link all 5 apps and shared packages:

```bash
# 1. Install all dependencies and link packages
pnpm install

# 2. Run a specific app (e.g., ddeep)
pnpm --filter @my-repo/ddeep dev

# OR: Run all apps in parallel
pnpm -r dev
```

## 📦 Active Applications

| App | Scope Name | Local Port |
|-----|------------|------------|
| `ddeep` | `@my-repo/ddeep` | 3000 |
| `marketing-site` | `@my-repo/marketing-site` | 3001 |
| `saas-dashboard` | `@my-repo/saas-dashboard` | 3002 |
| `blog` | `@my-repo/blog` | 3003 |
| `admin` | `@my-repo/admin` | 3004 |

---

## 🏗️ Docker & Production Builds

Docker images must be built from the **root** of the monorepo so they have access to the `packages/` folder and the root `pnpm-lock.yaml`.

```bash
# Build the production image for 'ddeep'
docker build -f apps/ddeep/Dockerfile -t my-ddeep-app .

# Run the container locally to test
docker run -p 3000:80 my-ddeep-app
```

## ☁️ Automated Git Workflow

Use the included push script to safely stage, commit, and push your code to GitHub.

```bash
# Auto-commit with a timestamp
./git_push.sh

# Commit with a custom message
./git_push.sh "feat: added shared UI button to ddeep app"
```

---

## ⚡ Our Monorepo Superpowers

This architecture provides massive enterprise-grade benefits for our agency:

* **Zero-Friction Code Sharing (`packages/`)**: We build a component (like a Navbar) exactly once in `packages/ui`. If we change its color, all 5 apps update instantly. No copy-pasting code.
* **Single Dependency Tree (No Version Hell)**: Because we have one `pnpm-lock.yaml` at the root, all apps share the exact same installation of React, Tailwind, etc., on the hard drive.
* **Atomic Commits**: We can update a shared database schema in `packages/` and update the `admin` frontend to use that new schema in a single, perfectly synced Git commit.
* **Massive CI/CD Speed Up**: If a developer only edits code inside `apps/ddeep`, the build system knows the other apps were untouched and will *only* test and deploy `ddeep`, saving massive compute time.
* **Easy App Ejection**: Because we enforce the **"No App-to-App Imports"** rule, if we ever need to sell an app or spin it off into its own repository, we can simply drag the folder out of `apps/`, publish our shared `packages/` to a private NPM registry, and run it instantly.
