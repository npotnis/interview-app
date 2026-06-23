#!/bin/bash
set -e

echo "[1/4] Installing MariaDB..."
sudo apt-get update -q
DEBIAN_FRONTEND=noninteractive sudo apt-get install -y mariadb-server

echo "[2/4] Configuring MariaDB..."
sudo service mariadb start || true

# Try each auth method in order: already-configured password, debian
# maintenance user (fresh install), unix_socket (some fresh installs).
mariadb_exec() {
  sudo mariadb -uroot -pinterview          -e "$1" 2>/dev/null && return 0
  sudo mariadb --defaults-file=/etc/mysql/debian.cnf -e "$1" 2>/dev/null && return 0
  sudo mariadb -u root                     -e "$1" 2>/dev/null && return 0
  echo "ERROR: cannot connect to MariaDB" >&2; return 1
}

mariadb_exec "ALTER USER 'root'@'localhost' IDENTIFIED BY 'interview'; FLUSH PRIVILEGES; CREATE DATABASE IF NOT EXISTS shopdb;"
sudo mariadb -uroot -pinterview shopdb < db/schema.sql

echo "[3/4] Installing dependencies..."
cd backend && npm install
cd ../frontend && npm install

echo "[4/4] Setting up environment..."
cp -n backend/.env.example backend/.env

echo "Setup complete. Run: bash start.sh"
