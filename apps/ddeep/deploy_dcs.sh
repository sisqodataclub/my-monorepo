#!/bin/bash

set -e  # Exit immediately if any command fails

# ================= CONFIG =================
REPO_URL="https://github.com/sisqodataclub/react-forms.git"
PROJECT_DIR="/opt/react-forms"      # VPS path for your project
DOMAIN="dcs.franciscodes.com"
FRONTEND_CONTAINER="dcs"

# Paths to Dockerfile and nginx.conf on VPS (local copy)
LOCAL_DOCKERFILE="/opt/react-forms/frontend/Dockerfile"
LOCAL_NGINXCONF="/opt/react-forms/frontend/nginx.conf"

echo "🚀 Starting deployment for $DOMAIN..."

# ================= CLONE OR UPDATE REPO =================
if [ ! -d "$PROJECT_DIR" ]; then
    echo "📂 Cloning repository..."
    git clone "$REPO_URL" "$PROJECT_DIR"
else
    echo "📂 Updating repository..."
    cd "$PROJECT_DIR"
    git fetch --all
    DEFAULT_BRANCH=$(git symbolic-ref --short refs/remotes/origin/HEAD | cut -d'/' -f2)
    git reset --hard origin/$DEFAULT_BRANCH
    git clean -fd
fi

cd "$PROJECT_DIR"

# ================= ENSURE FRONTEND FOLDER EXISTS =================
if [ ! -d "./frontend" ]; then
    echo "📂 Creating frontend folder..."
    mkdir -p ./frontend
fi

# ================= COPY DOCKERFILE & NGINX.CONF IF MISSING =================
if [ ! -f "./frontend/Dockerfile" ]; then
    echo "📄 Dockerfile missing, copying..."
    cp "$LOCAL_DOCKERFILE" ./frontend/Dockerfile
fi

if [ ! -f "./frontend/nginx.conf" ]; then
    echo "📄 nginx.conf missing, copying..."
    cp "$LOCAL_NGINXCONF" ./frontend/nginx.conf
fi

# ================= BUILD DOCKER =================
echo "🛠️ Building Docker images..."
docker compose build --no-cache

# ================= RESTART CONTAINERS =================
echo "🔄 Restarting containers..."
docker compose up -d --remove-orphans

# ================= CONTAINER STATUS =================
echo "🔍 Checking frontend container status..."
if docker ps --format '{{.Names}}' | grep -q "^$FRONTEND_CONTAINER$"; then
    echo "✅ $FRONTEND_CONTAINER is running"
else
    echo "❌ $FRONTEND_CONTAINER failed to start!"
    exit 1
fi

# ================= SSL CHECK =================
echo "🔐 Checking SSL certificate for $DOMAIN..."
if command -v curl >/dev/null 2>&1; then
    SSL_STATUS=$(curl -skI https://$DOMAIN | grep -i "HTTP/1.1 200 OK" || true)
    if [ -z "$SSL_STATUS" ]; then
        echo "⚠️ SSL not active or certificate missing for $DOMAIN!"
        echo "   Please verify in Nginx Proxy Manager and request a Let's Encrypt certificate."
    else
        echo "✅ SSL appears active for $DOMAIN"
    fi
else
    echo "⚠️ curl not installed. Skipping SSL check."
fi

echo "✅ Deployment finished successfully!"
