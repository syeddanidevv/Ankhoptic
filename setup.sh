#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# Ankhoptics — Ubuntu 24 Full Setup Script
# Run as root: bash setup.sh
# ─────────────────────────────────────────────────────────────────────────────
set -e

echo ""
echo "======================================"
echo "  Ankhoptics Server Setup"
echo "======================================"
echo ""

# ─── 1. System Update ────────────────────────────────────────────────────────
echo "[1/5] Updating system packages..."
apt-get update -y && apt-get upgrade -y
apt-get install -y curl git nano ufw

# ─── 2. Install Docker ───────────────────────────────────────────────────────
echo "[2/5] Installing Docker..."
if ! command -v docker &> /dev/null; then
  curl -fsSL https://get.docker.com | sh
  systemctl enable docker
  systemctl start docker
  echo "Docker installed successfully."
else
  echo "Docker already installed, skipping."
fi

# ─── 3. Clone the project ────────────────────────────────────────────────────
echo "[3/5] Cloning project to /opt/ankhoptics..."
mkdir -p /opt/ankhoptics
cd /opt/ankhoptics

if [ -d ".git" ]; then
  echo "Repo already cloned, pulling latest..."
  git pull origin main
else
  git clone https://github.com/ankhoptic/Ankhoptic.git .
fi

# ─── 4. Setup .env file ──────────────────────────────────────────────────────
echo "[4/5] Setting up environment file..."
if [ ! -f ".env" ]; then
  cp .env.production.example .env
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "  ACTION REQUIRED: Edit .env file with your real values"
  echo "  Run: nano /opt/ankhoptics/.env"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  read -p "Press ENTER after you have edited the .env file to continue..."
else
  echo ".env already exists, skipping."
fi

# ─── 5. Setup Firewall ───────────────────────────────────────────────────────
echo "[5/5] Configuring firewall..."
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw allow 3000/tcp  # Next.js app
ufw allow 8080/tcp  # phpMyAdmin
ufw --force enable

# ─── 6. Start everything with Docker Compose ─────────────────────────────────
echo ""
echo "Starting all services (MariaDB + phpMyAdmin + Next.js)..."
cd /opt/ankhoptics
docker compose up --build -d

# ─── Done ────────────────────────────────────────────────────────────────────
echo ""
echo "======================================"
echo "  Setup Complete!"
echo "======================================"
SERVER_IP=$(hostname -I | awk '{print $1}')
echo ""
echo "  App:        http://$SERVER_IP:3000"
echo "  phpMyAdmin: http://$SERVER_IP:8080"
echo ""
echo "  To view logs:  docker compose logs -f"
echo "  To restart:    docker compose restart"
echo ""
