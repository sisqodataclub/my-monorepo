# 🏢 My Agency Monorepo

A modern, high-performance hybrid workspace designed for scale. This repository houses multiple isolated full-stack applications (React/Vite frontends + Django backends) and shared Node packages under a single, unified dependency tree.

## 📂 Project Structure

We follow the Self-Contained Full-Stack App architecture. Each app contains its own Frontend, Backend, and `docker-compose.yml`, while frontends utilize shared pnpm packages for maximum code reuse.
```text
my-monorepo/
├── apps/                  # Deployable, standalone applications
│   ├── forms/             # Forms App (Dual-email contact & bookings)
│   │   ├── frontend/      # React + Vite + Tailwind 
│   │   ├── backend/       # Django API + SQLite/Postgres
│   │   └── docker-compose.yml
│   ├── project_3D/        # 3D Portfolio App
│   └── dashboards/        # Analytics Dashboards (Tailwind v4)
├── packages/              # Shared internal frontend libraries
│   ├── ui/                # Shared Tailwind components & UI elements
│   ├── utils/             # Shared helper functions and hooks (e.g., seo.ts)
│   └── config/            # Shared ESLint, TS configs, and formatting rules
├── git_push.py            # Custom Python script for safe GitHub pushes
├── package.json           # Root package defining workspace tools
├── pnpm-workspace.yaml    # Defines the apps/*/frontend and packages/* routing
└── pnpm-lock.yaml         # Single source of truth for all frontend dependencies
```

## 🚀 Getting Started (Local Development)

When returning to the project or setting up a new machine, setup is instant.

### Frontend Setup

Run this once at the root of the project to link all apps and shared packages:
```bash
# 1. Install all dependencies and link packages globally
pnpm install

# 2. Run a specific app's frontend (Always filter by EXACT FOLDER PATH)
pnpm --filter ./apps/forms/frontend dev
```

### Backend Setup (Django)
```bash
cd apps/forms/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 manage.py runserver 8080
```

## ☁️ Automated Git Workflow (git_push.py)

We use a custom Python script to safely stage, check for case-mismatches, commit, and push code. Never use standard git push commands to avoid breaking the Linux server with Windows/Mac case-insensitivity bugs.
```bash
# From the root of the monorepo:
python3 git_push.py
```

> **Note:** The script will prompt you for the folder path (use `.`) and your GitHub URL, check for file name mismatches, and force push to the main branch.

## 🏗️ Docker & Production Builds

Our deployment strategy uses isolated `docker-compose.yml` files located inside each app's folder.

## ⚠️ The Golden Rules of Adding a New App

If you duplicate an app to create a new one, you MUST update these three things, or the server will crash and overwrite your other live apps:

### 1. Container Names (`docker-compose.yml`):

Ensure `container_name` is strictly unique (e.g., `newapp-frontend` and `newapp-backend`).

### 2. Frontend Dockerfile Context:

The frontend Dockerfile must run its build step using the exact folder path so pnpm doesn't get confused by package names.
```dockerfile
# Do NOT use: RUN pnpm --filter my-app build
# ALWAYS USE THIS FORMAT:
RUN pnpm --filter ./apps/new_app_name/frontend build
```

### 3. Docker Compose Build Context:

Because the frontend needs access to the `packages/` folder and root `pnpm-lock.yaml`, the `docker-compose.yml` must point the frontend build context up two levels to the root:
```yaml
services:
  frontend:
    build:
      context: ../..
      dockerfile: apps/new_app_name/frontend/Dockerfile
```

## ⚙️ Automated Server Deployment

On your production server (e.g., `srv934821`), we use a custom bash script (`/opt/deploy_mr.sh`) to pull the latest code and deploy specific apps.

To deploy an app:

1. SSH into the server.
2. Edit `/opt/deploy_mr.sh` and update `APP_NAME` and `CONTAINER_NAME` to match the app you want to update (e.g., `APP_NAME="forms"`).
3. Run the script:
```bash
bash /opt/deploy_mr.sh
```

The script will automatically:

- Pull the latest code from GitHub.
- Navigate precisely into `/opt/my-monorepo/apps/<APP_NAME>`.
- Run `docker compose up -d --build --remove-orphans`.
- Verify the container started and check the SSL certificate via Nginx Proxy Manager.

## 🔍 Enterprise-Grade SEO Architecture

Our frontends utilize React Router v7 with a highly optimized, server-rendered SEO strategy. We do not rely on basic client-side hooks; instead, we engineer our SEO to dominate local search results and provide instant data to Googlebot.

### 1. Server-Rendered Meta Tags (No useEffect)

We never use client-side hooks (like `usePageSEO` or `useEffect`) to inject meta tags. Client-side injection is too slow for web crawlers. Instead, we exclusively use React Router's native `export function meta()` API. This ensures all SEO data is injected during the server build process, meaning Googlebot receives perfectly formatted HTML the millisecond it requests the page.

### 2. The seo.ts Utility

To keep our route files clean and maintain DRY principles, all pages utilize a centralized `getSeoMeta()` helper. This utility automatically generates:

- **Standard Meta:** Titles and descriptions.
- **Open Graph & Twitter Cards:** Ensures rich, beautiful image previews appear when links are shared via iMessage, WhatsApp, Facebook, or LinkedIn.
- **Canonical URLs:** Injects `<link rel="canonical">` tags to explicitly tell Google which page is the "master" version, protecting us from duplicate content penalties caused by URL tracking parameters.

### 3. Rich JSON-LD Structured Data (Schema.org)

We heavily utilize Schema arrays to communicate directly with Google's algorithm. We inject this data directly into the `<head>` via the meta array using `"script:ld+json"`.

- **LocalBusiness & Service Schema:** We map out our exact GPS coordinates and use the `areaServed` property to list specific cities. This is our "Near Me" hack. It allows us to rank for local searches without spamming the outdated (and penalized) keywords meta tag.
- **FAQPage Schema:** We map our React FAQ arrays directly into Schema JSON. This allows Google to display our Questions and Answers directly on the Google Search Results page, pushing competitors further down the screen.

### 4. Programmatic Local SEO (Location Pages)

To capture high-intent local traffic (e.g., "Deep cleaning in Liverpool"), we utilize dynamic routing (e.g., `locations.$city.tsx`).

The route reads the URL parameter (`Liverpool`), dynamically injects the city name into the H1 tags, the copywriting, and the localized FAQ Schema.

This provides Google with a dedicated, hyper-relevant page for every city we service, avoiding keyword cannibalization while maximizing local reach.

## ⚡ Our Monorepo Superpowers

- **Zero-Friction Code Sharing (`packages/`):** We build a React component exactly once in `packages/ui`. If we change it, all connected apps update instantly.
- **Single Frontend Dependency Tree:** One `pnpm-lock.yaml` at the root means all apps share the exact same installation of React, Vite, and Tailwind. No version conflicts.
- **App Ejection:** Because backends are localized to their specific app folder, spinning off an app to sell it or host it separately is as easy as dragging the folder out of `apps/`.
- **Prerendered SEO Dominance:** Our React Router setup ensures we get the speed of a Single Page Application with the perfect SEO grading of a static HTML site.
