# ================= BUILD STAGE =================
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files first for caching dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code
COPY . .

# Build Vite app (output will go to /app/dist)
RUN npm run build

# ================= PRODUCTION STAGE =================
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy build output
COPY --from=build /app/build/client /usr/share/nginx/html
# Copy custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
