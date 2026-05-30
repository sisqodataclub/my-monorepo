# ================= BUILD STAGE =================
FROM node:20-alpine AS build

# ---> ADDED: Install Chromium for the Vite Prerenderer (Puppeteer) <---
RUN apk add --no-cache chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
# ----------------------------------------------------------------------

# Install pnpm globally
RUN npm install -g pnpm

WORKDIR /app

# 1. Copy workspace-wide configuration files
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./

# 2. Copy the package.json of the app and all shared packages
# This allows pnpm to link dependencies correctly before the full source copy
COPY apps/forms/frontend/package.json ./apps/forms/frontend/
COPY packages/ ./packages/

# 3. Install dependencies for the whole workspace
RUN pnpm install --frozen-lockfile

# 4. Copy the rest of the app source code
COPY apps/forms/frontend/ ./apps/forms/frontend/

# Accept the build argument from docker-compose and set it for Vite
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# 5. Build the app (running from the root using filter)
RUN pnpm --filter ./apps/forms/frontend build

# ================= PRODUCTION STAGE =================
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy build output (Vite defaults to dist)
COPY --from=build /app/apps/forms/frontend/dist /usr/share/nginx/html

# Copy your custom Nginx config
COPY apps/forms/frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
