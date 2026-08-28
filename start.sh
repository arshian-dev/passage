#!/bin/sh
set -e

echo "Starting FastAPI Backend on internal port 8000..."
cd /app/backend
uvicorn main:app --host 0.0.0.0 --port 8000 &

# Wait briefly for FastAPI to initialize
sleep 2

echo "Starting Next.js Frontend on port ${PORT:-3000}..."
cd /app/frontend
exec npm run start -- -p ${PORT:-3000} -H 0.0.0.0
