🌌 My Agency Monorepo

A modern, high-performance hybrid workspace designed for scale. This repository houses multiple isolated full-stack applications (React/Vite frontends + Django backends) and shared Node packages under a single, unified dependency tree.

📂 Project Structure

We follow the Self-Contained Full-Stack App architecture. Each app contains its own Frontend, Backend, and docker-compose.yml, while frontends utilize shared pnpm packages for maximum code reuse.

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
│   ├── utils/             # Shared helper functions and hooks
│   └── config/            # Shared ESLint, TS configs, and formatting rules
├── git_push.py            # Custom Python script for safe GitHub pushes
├── package.json           # Root package defining workspace tools
├── pnpm-workspace.yaml    # Defines the apps/*/frontend and packages/* routing
└── pnpm-lock.yaml         # Single source of truth for all frontend dependencies


🚀 Getting Started (Local Development)

When returning to the project or setting up a new machine, setup is instant.

Frontend Setup

Run this once at the root of the project to link all apps and shared packages:
```bash
# 1. Install all dependencies and link packages globally
pnpm install

# 2. Run a specific app's frontend (Always filter by EXACT FOLDER PATH)
pnpm --filter ./apps/forms/frontend dev
` ` `

Backend Setup (Django)

` ` `bash
cd apps/forms/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 manage.py runserver 8080
` ` `

☁️ Automated Git Workflow (git_push.py)

We use a custom Python script to safely stage, check for case-mismatches, commit, and push code. Never use standard git push commands to avoid breaking the Linux server with Windows/Mac case-insensitivity bugs.

` ` `bash
# From the root of the monorepo:
python3 git_push.py
` ` `

Note: The script will prompt you for the folder path (use .) and your GitHub URL, check for file name mismatches, and force push to the main branch.

🏗️ Docker & Production Builds

Our deployment strategy uses isolated docker-compose.yml files located inside each app's folder.

⚠️ The Golden Rules of Adding a New App

If you duplicate an app to create a new one, you MUST update these three things, or the server will crash and overwrite your other live apps:

1. Container Names (docker-compose.yml):
Ensure container_name is strictly unique (e.g., newapp-frontend and newapp-backend).

2. Frontend Dockerfile Context:
The frontend Dockerfile must run its build step using the exact folder path so pnpm doesn't get confused by package names.

` ` `dockerfile
# Do NOT use: RUN pnpm --filter my-app build
# ALWAYS USE THIS FORMAT:
RUN pnpm --filter ./apps/new_app_name/frontend build
` ` `

3. Docker Compose Build Context:
Because the frontend needs access to the packages/ folder and root pnpm-lock.yaml, the docker-compose.yml must point the frontend build context up two levels to the root:

` ` `yaml
services:
  frontend:
    build:
      context: ../..
      dockerfile: apps/new_app_name/frontend/Dockerfile
` ` `

🚢 Automated Server Deployment

On your production server (e.g., srv934821), we use a custom bash script (/opt/deploy_mr.sh) to pull the latest code and deploy specific apps.

To deploy an app:

SSH into the server.

Edit /opt/deploy_mr.sh and update APP_NAME and CONTAINER_NAME to match the app you want to update (e.g., APP_NAME="forms").

Run the script:

` ` `bash
bash /opt/deploy_mr.sh
` ` `

The script will automatically:

Pull the latest code from GitHub.

Navigate precisely into /opt/my-monorepo/apps/<APP_NAME>.

Run docker compose up -d --build --remove-orphans.

Verify the container started and check the SSL certificate via Nginx Proxy Manager.

⚡ Our Monorepo Superpowers

Zero-Friction Code Sharing (packages/): We build a React component exactly once in packages/ui. If we change it, all connected apps update instantly.

Single Frontend Dependency Tree: One pnpm-lock.yaml at the root means all apps share the exact same installation of React, Vite, and Tailwind. No version conflicts.

App Ejection: Because backends are localized to their specific app folder, spinning off an app to sell it or host it separately is as easy as dragging the folder out of apps/.
```

Note: I added spaces inside the triple backtick code fences (` ` `` instead of ` ``` ``) so they display as raw text rather than rendering. When you use this, replace those spaced-out backticks with normal triple backticks.
