#!/usr/bin/env bash
# ==============================================================================
# Espresso Cockpit - Pterodactyl Panel Theme Installer
# Designed with Warm Charcoal Espresso Aesthetics & Bento Cockpit
# GitHub: https://github.com/bytenodeshost/pterodactyl-espresso-theme
# ==============================================================================

set -e

# Terminal Colors
CYAN='\033[1;36m'
GREEN='\033[1;32m'
YELLOW='\033[1;33m'
RED='\033[1;31m'
NC='\033[0m'

clear

echo -e "${CYAN}"
cat << "EOF"
   ______                                    ______           __            _ __ 
  / ____/________  ________  ______________ / ____/___  _____/ /______  (_) /_
 / __/ / ___/ __ \/ ___/ _ \/ ___/ ___/ __ \/ /   / __ \/ ___/ //_/ __ \/ / __/
/ /___(__  ) /_/ / /  /  __(__  |__  ) /_/ / /___/ /_/ / /__/ ,< / /_/ / / /_  
/_____/____/ .___/_/   \___/____/____/\____/\____/\____/\___/_/|_/ .___/_/\__/  
          /_/                                                   /_/             
             ⚡ Warm-Minimalist Game Hosting Cockpit Theme ⚡
EOF
echo -e "${NC}"
echo -e "${YELLOW}Starting installation of Espresso Cockpit for Pterodactyl Panel...${NC}\n"

# 1. Root check
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}[ERROR] This installer must be executed as root (or with sudo).${NC}"
  exit 1
fi

# 2. Locate Pterodactyl root directory
PTERO_DIR="/var/www/pterodactyl"
if [ ! -d "$PTERO_DIR" ]; then
  echo -e "${RED}[ERROR] Pterodactyl panel directory not found at $PTERO_DIR!${NC}"
  echo -e "Please ensure Pterodactyl is installed before applying this theme."
  exit 1
fi

# 3. Prerequisites check (Node, Yarn, PHP)
echo -e "${CYAN}[1/5] Checking environment dependencies...${NC}"
if ! command -v node > /dev/null 2>&1; then
  echo -e "${RED}[ERROR] Node.js is not installed. Please install Node.js 16/18/20 first.${NC}"
  exit 1
fi

if ! command -v yarn > /dev/null 2>&1; then
  echo -e "${YELLOW}[!] Yarn not found. Installing Yarn globally...${NC}"
  npm install -g yarn
fi

echo -e "${GREEN}✓ Node.js ($(node -v)) and Yarn ($(yarn -v)) detected.${NC}\n"

# 4. Create Backup
BACKUP_DIR="$PTERO_DIR/.espresso-theme-backup/$(date +%Y%m%d_%H%M%S)"
echo -e "${CYAN}[2/5] Creating safe backup of current resources...${NC}"
mkdir -p "$BACKUP_DIR"
if [ -d "$PTERO_DIR/resources" ]; then
  cp -r "$PTERO_DIR/resources" "$BACKUP_DIR/"
  echo -e "${GREEN}✓ Current resources backed up to: $BACKUP_DIR${NC}\n"
fi

# 5. Copy Theme Files
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
echo -e "${CYAN}[3/5] Applying Espresso Cockpit theme components...${NC}"

if [ -d "$SCRIPT_DIR/resources" ]; then
  cp -r "$SCRIPT_DIR/resources/"* "$PTERO_DIR/resources/"
  echo -e "${GREEN}✓ Theme React TSX components & Blade views copied successfully.${NC}\n"
else
  echo -e "${RED}[ERROR] Theme resources directory not found in $SCRIPT_DIR!${NC}"
  exit 1
fi

# 6. Rebuilding Assets
echo -e "${CYAN}[4/5] Building production assets (this may take 1-3 minutes)...${NC}"
cd "$PTERO_DIR"
yarn install --frozen-lockfile || yarn install
yarn build:production

echo -e "${GREEN}✓ Production bundle compiled successfully.${NC}\n"

# 7. Permissions & Cache Clear
echo -e "${CYAN}[5/5] Finalizing permissions and flushing Laravel cache...${NC}"
chown -R www-data:www-data "$PTERO_DIR"
chmod -R 755 "$PTERO_DIR/storage" "$PTERO_DIR/bootstrap/cache"

php artisan view:clear 2>/dev/null || true
php artisan config:clear 2>/dev/null || true
php artisan cache:clear 2>/dev/null || true

echo -e "\n${GREEN}==============================================================${NC}"
echo -e "${GREEN}  🎉 Espresso Cockpit Theme successfully installed!${NC}"
echo -e "${GREEN}==============================================================${NC}"
echo -e "Refresh your Pterodactyl Panel in your browser (Ctrl + F5 or Shift + Reload)."
echo -e "Need to revert? Run the uninstaller at: ./scripts/uninstall.sh"
