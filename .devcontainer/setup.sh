#!/bin/bash
set -e

echo "[1/4] Installing MariaDB..."
sudo apt-get update -q
DEBIAN_FRONTEND=noninteractive sudo apt-get install -y mariadb-server

echo "[2/4] Configuring MariaDB..."
sudo service mariadb start

# /etc/mysql/debian.cnf holds a maintenance user with full access —
# more reliable than unix_socket auth in non-interactive environments.
sudo mariadb --defaults-file=/etc/mysql/debian.cnf -e "
  ALTER USER 'root'@'localhost' IDENTIFIED BY 'interview';
  FLUSH PRIVILEGES;
  CREATE DATABASE IF NOT EXISTS shopdb;
"
sudo mariadb -uroot -pinterview shopdb < db/schema.sql

echo "[3/4] Installing dependencies..."
cd backend && npm install
cd ../frontend && npm install

echo "[4/4] Setting up environment..."
cp -n backend/.env.example backend/.env

echo "Setup complete. Run: bash start.sh"
