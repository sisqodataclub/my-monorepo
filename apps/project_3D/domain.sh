#!/bin/bash

# Check if domain name is provided
if [ -z "$1" ]; then
    echo "Usage: $0 yourdomain.com"
    exit 1
fi

DOMAIN=$1
WEBROOT="/var/www/$DOMAIN/html"
NGINX_CONF="/etc/nginx/sites-available/$DOMAIN"
EMAIL="your-email@example.com"  # replace with your email

SUMMARY=()

# Check if Nginx config already exists
if [ -f "$NGINX_CONF" ]; then
    echo "❌ Nginx configuration for $DOMAIN already exists!"
    exit 1
fi

# Create web root
mkdir -p $WEBROOT
echo "<h1>Hello from $DOMAIN!</h1>" > $WEBROOT/index.html
chown -R www-data:www-data /var/www/$DOMAIN
chmod -R 755 /var/www/$DOMAIN
SUMMARY+=("Web root created at $WEBROOT")

# Create Nginx config
cat > $NGINX_CONF <<EOL
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    root $WEBROOT;
    index index.html index.htm;

    access_log /var/log/nginx/$DOMAIN.access.log;
    error_log /var/log/nginx/$DOMAIN.error.log;

    location / {
        try_files \$uri \$uri/ =404;
    }
}
EOL
SUMMARY+=("Nginx config created at $NGINX_CONF")

# Enable site
ln -s $NGINX_CONF /etc/nginx/sites-enabled/
SUMMARY+=("Site enabled in sites-enabled")

# Test and reload Nginx
if nginx -t && systemctl reload nginx; then
    SUMMARY+=("Nginx reloaded successfully")
else
    SUMMARY+=("⚠️ Nginx reload failed")
fi

# Install certbot if not installed
if ! command -v certbot &> /dev/null; then
    echo "Certbot not found. Installing..."
    apt update && apt install -y certbot python3-certbot-nginx
    SUMMARY+=("Certbot installed")
fi

# Request SSL certificate
if certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos -m $EMAIL; then
    SUMMARY+=("SSL certificate issued for $DOMAIN")
else
    SUMMARY+=("⚠️ SSL certificate request failed")
fi

# Print summary
echo
echo "===== SUMMARY ====="
for item in "${SUMMARY[@]}"; do
    echo "- $item"
done
echo "==================="

# Print enabled Nginx sites
echo
echo "===== ENABLED NGINX SITES ====="
ls -1 /etc/nginx/sites-enabled/
echo "==============================="
