# ================= BUILD STAGE =================
FROM node:20-alpine AS build

# Install pnpm globally
RUN npm install -g pnpm

WORKDIR /app

# 1. Copy workspace-wide configuration files
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./

# 2. Copy the package.json of the app and all shared packages
# This allows pnpm to link dependencies correctly before the full source copy
COPY apps/ddeep/package.json ./apps/ddeep/
COPY packages/ ./packages/

# 3. Install dependencies for the whole workspace
# --frozen-lockfile ensures the build is reproducible
RUN pnpm install --frozen-lockfile

# 4. Copy the rest of the app source code
COPY apps/ddeep/ ./apps/ddeep/

# 5. Declare R2 build args. These are consumed by scripts/generate-gallery.mjs
#    (run via the prebuild hook) to list the bucket and generate the gallery
#    at build time. They live only in the build stage — the production image
#    copies only build/client, so no credentials ship to runtime.
ARG R2_ACCOUNT_ID
ARG R2_BUCKET
ARG R2_ACCESS_KEY_ID
ARG R2_SECRET_ACCESS_KEY
ARG R2_PUBLIC_BASE_URL
ENV R2_ACCOUNT_ID=$R2_ACCOUNT_ID \
    R2_BUCKET=$R2_BUCKET \
    R2_ACCESS_KEY_ID=$R2_ACCESS_KEY_ID \
    R2_SECRET_ACCESS_KEY=$R2_SECRET_ACCESS_KEY \
    R2_PUBLIC_BASE_URL=$R2_PUBLIC_BASE_URL

# 6. Build the app (pnpm auto-runs prebuild → generate-gallery.mjs → build)
RUN pnpm --filter @my-repo/ddeep build

# ================= PRODUCTION STAGE =================
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy build output (React Router v7 with ssr:false outputs to build/client)
COPY --from=build /app/apps/ddeep/build/client /usr/share/nginx/html

# Copy your custom Nginx config
COPY apps/ddeep/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
