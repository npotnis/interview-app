#!/bin/bash
set -e

echo "Seeding database..."
node db/seed.js

echo ""
echo "Starting API on http://localhost:3000 ..."
cd backend && npm run dev &

echo "Starting frontend on http://localhost:5173 ..."
cd /workspace/frontend && npm run dev
