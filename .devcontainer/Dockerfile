FROM mcr.microsoft.com/devcontainers/javascript-node:20
RUN apt-get update -q \
 && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends mariadb-server \
 && rm -rf /var/lib/apt/lists/*
