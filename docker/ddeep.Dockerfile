# ================= BUILD STAGE =================
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files first for caching dependencies
COPY apps/ddeep/src/package.json apps/ddeep/src/package-lock.json ./
RUN npm ci

# Copy source code
COPY apps/ddeep/src ./src

# Build Vite app (output will go to /app/dist)
WORKDIR /app/src
RUN npm run build

# ================= PRODUCTION STAGE =================
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy build output
COPY --from=build /app/src/build/client /usr/share/nginx/html
# Copy custom Nginx config
COPY apps/ddeep/src/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
