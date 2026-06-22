#!/bin/bash
set -e

echo "Waiting for MySQL to be ready..."
until docker compose exec -T db mysqladmin ping -uroot -pinterview --silent 2>/dev/null; do
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
