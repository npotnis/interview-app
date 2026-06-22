#!/bin/bash
set -e

echo "[1/4] Installing MySQL..."
sudo apt-get update -q
DEBIAN_FRONTEND=noninteractive sudo apt-get install -y mysql-server

echo "[2/4] Configuring MySQL..."
sudo service mysql start
sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'interview'; FLUSH PRIVILEGES; CREATE DATABASE IF NOT EXISTS shopdb;"
sudo mysql -uroot -pinterview shopdb < db/schema.sql

echo "[3/4] Installing dependencies..."
cd backend && npm install
cd ../frontend && npm install

echo "[4/4] Setting up environment..."
cp backend/.env.example backend/.env

echo "Setup complete. Run: bash start.sh"
