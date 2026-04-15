FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install system dependencies
# Install wkhtmltopdf for Debian 12 (Bookworm)
RUN apt-get update && apt-get install -y wget \
    && wget https://github.com/wkhtmltopdf/packaging/releases/download/0.12.6.1-3/wkhtmltox_0.12.6.1-3.bookworm_amd64.deb \
    && apt-get install -y ./wkhtmltox_0.12.6.1-3.bookworm_amd64.deb \
    && rm wkhtmltox_0.12.6.1-3.bookworm_amd64.deb \
    && apt-get clean

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8080

# 🌟 UPDATED: Swapped Gunicorn (WSGI) for Daphne (ASGI) to support WebSockets
CMD ["sh", "-c", "python manage.py migrate && daphne -b 0.0.0.0 -p 8080 backend.asgi:application"]
