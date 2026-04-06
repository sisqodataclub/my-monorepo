# ================= BUILD STAGE =================
FROM node:20-alpine AS build

# Install pnpm globally
RUN npm install -g pnpm

WORKDIR /app

# 1. Copy workspace-wide configuration files
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./

# 2. Copy the package.json of the app and all shared packages
COPY apps/dashboards/package.json ./apps/dashboards/
COPY packages/ ./packages/

# 3. Install dependencies for the whole workspace
RUN pnpm install --frozen-lockfile

# 4. Copy the rest of the app source code
COPY apps/dashboards/ ./apps/dashboards/

# 5. Build the app (ensure the filter matches your package.json name!)
RUN pnpm --filter dashboards build

# ================= PRODUCTION STAGE =================
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy build output (Vite default output is 'dist')
COPY --from=build /app/apps/dashboards/dist /usr/share/nginx/html

# Copy your custom Nginx config for client-side routing
COPY apps/dashboards/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
