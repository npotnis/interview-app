#!/bin/bash
set -e

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Starting MySQL..."
sudo service mysql start

echo "Waiting for MySQL to be ready..."
until mysqladmin ping -uroot -pinterview --silent 2>/dev/null; do
  sleep 1
done

echo "Seeding database..."
node "$ROOT/db/seed.js"

echo ""
echo "Starting API on http://localhost:3000 ..."
cd "$ROOT/backend" && npm run dev &

echo "Starting frontend on http://localhost:5173 ..."
cd "$ROOT/frontend" && npm run dev
