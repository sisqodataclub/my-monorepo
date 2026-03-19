# ================= BUILD STAGE =================
FROM node:20-alpine AS build

# Install pnpm globally
RUN npm install -g pnpm

WORKDIR /app

# 1. Copy workspace-wide configuration files
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./

# 2. Copy the package.json of the app and all shared packages
# This allows pnpm to link dependencies correctly before the full source copy
COPY apps/project_3D/frontend/package.json ./apps/project_3D/frontend/
COPY packages/ ./packages/

# 3. Install dependencies for the whole workspace
RUN pnpm install --frozen-lockfile

# 4. Copy the rest of the app source code
COPY apps/project_3D/frontend/ ./apps/project_3D/frontend/

# 5. Build the app (running from the root using filter)
RUN pnpm --filter @my-repo/3d-portfolio build

# ================= PRODUCTION STAGE =================
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy build output (Vite defaults to dist)
COPY --from=build /app/apps/project_3D/frontend/dist /usr/share/nginx/html

# Copy your custom Nginx config
COPY apps/project_3D/frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
