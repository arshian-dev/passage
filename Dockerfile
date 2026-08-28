FROM python:3.11-slim

# Install system packages, Tesseract OCR, and Node.js 20
RUN apt-get update && apt-get install -y --no-install-recommends \
    tesseract-ocr \
    tesseract-ocr-eng \
    libpq-dev \
    gcc \
    curl \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 1. Install Backend Python dependencies
COPY backend/requirements.txt /app/backend/
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

# 2. Install Frontend Node dependencies
COPY frontend/package*.json /app/frontend/
WORKDIR /app/frontend
RUN npm install --omit=optional

# 3. Copy full application source code
WORKDIR /app
COPY backend/ /app/backend/
COPY frontend/ /app/frontend/
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# 4. Build Next.js production frontend
WORKDIR /app/frontend
RUN npm run build

WORKDIR /app

EXPOSE 3000 8000

CMD ["/app/start.sh"]
