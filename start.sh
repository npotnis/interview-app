#!/bin/bash
set -e

echo "Waiting for MySQL to be ready..."
until (echo > /dev/tcp/db/3306) 2>/dev/null; do
  echo "  still waiting..."
  sleep 2
done
echo "MySQL is ready."

echo "Seeding database..."
node db/seed.js

echo ""
echo "Starting API on http://localhost:3000 ..."
cd backend && npm run dev &

echo "Starting frontend on http://localhost:5173 ..."
cd /workspace/frontend && npm run dev
