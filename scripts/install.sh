#!/usr/bin/env bash
# ==============================================================================
# Espresso Cockpit - Pterodactyl Panel Theme Installer
# GitHub: https://github.com/suzirz/pterodactyl-espresso-theme
# ==============================================================================

set -e

GREEN='\033[1;32m'
YELLOW='\033[1;33m'
RED='\033[1;31m'
NC='\033[0m'

echo -e "\n${YELLOW}=== Installing Espresso Cockpit Theme ===${NC}\n"

# 1. Root check
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}[ERROR] Run this script as root or with sudo.${NC}"
  exit 1
fi

# 2. Check Pterodactyl directory
PTERO_DIR="/var/www/pterodactyl"
if [ ! -d "$PTERO_DIR" ]; then
  echo -e "${RED}[ERROR] Pterodactyl directory not found at $PTERO_DIR.${NC}"
  exit 1
fi

# 3. Check dependencies
echo -e "[1/5] Checking dependencies..."
if ! command -v node > /dev/null 2>&1; then
  echo -e "${RED}[ERROR] Node.js is not installed. Install Node.js 16/18/20 first.${NC}"
  exit 1
fi

if ! command -v yarn > /dev/null 2>&1; then
  echo -e "${YELLOW}Yarn not found. Installing yarn globally via npm...${NC}"
  npm install -g yarn
fi

echo -e "${GREEN}Node.js ($(node -v)) and Yarn ($(yarn -v)) found.${NC}"

# 4. Create backup
BACKUP_DIR="$PTERO_DIR/.espresso-theme-backup/$(date +%Y%m%d_%H%M%S)"
echo -e "\n[2/5] Backing up existing resources to $BACKUP_DIR..."
mkdir -p "$BACKUP_DIR"
if [ -d "$PTERO_DIR/resources" ]; then
  cp -r "$PTERO_DIR/resources" "$BACKUP_DIR/"
  echo -e "${GREEN}Backup created.${NC}"
fi

# 5. Acquire theme files (handles both local git clone and curl | bash)
echo -e "\n[3/5] Applying theme files..."
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." 2>/dev/null && pwd || echo "")"
TEMP_DIR=""

if [ -n "$SCRIPT_DIR" ] && [ -d "$SCRIPT_DIR/resources" ]; then
  SOURCE_DIR="$SCRIPT_DIR/resources"
else
  TEMP_DIR="/tmp/espresso-theme-$(date +%s)"
  echo -e "Downloading latest theme files from GitHub..."
  mkdir -p "$TEMP_DIR"
  curl -sSL "https://github.com/suzirz/pterodactyl-espresso-theme/archive/refs/heads/main.tar.gz" | tar -xz -C "$TEMP_DIR" --strip-components=1
  SOURCE_DIR="$TEMP_DIR/resources"
fi

cp -r "$SOURCE_DIR/"* "$PTERO_DIR/resources/"
echo -e "${GREEN}Theme files copied.${NC}"

if [ -n "$TEMP_DIR" ] && [ -d "$TEMP_DIR" ]; then
  rm -rf "$TEMP_DIR"
fi

# 6. Rebuild assets
echo -e "\n[4/5] Building production assets (may take 1-2 minutes)..."
cd "$PTERO_DIR"
yarn install --frozen-lockfile || yarn install
yarn build:production
echo -e "${GREEN}Production bundle compiled.${NC}"

# 7. Permissions and cache clear
echo -e "\n[5/5] Resetting permissions and clearing cache..."
chown -R www-data:www-data "$PTERO_DIR"
chmod -R 755 "$PTERO_DIR/storage" "$PTERO_DIR/bootstrap/cache"

php artisan view:clear 2>/dev/null || true
php artisan config:clear 2>/dev/null || true

echo -e "\n${GREEN}=== Installation Complete ===${NC}"
echo -e "Theme applied. Refresh your browser (Ctrl+F5 or Shift+Reload) to view changes."
echo -e "To uninstall, run: ./scripts/uninstall.sh\n"
