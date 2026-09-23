#!/usr/bin/env bash
# ==============================================================================
# Espresso Cockpit - Pterodactyl Panel Theme Uninstaller
# Restores original panel files from backup
# ==============================================================================

set -e

GREEN='\033[1;32m'
YELLOW='\033[1;33m'
RED='\033[1;31m'
NC='\033[0m'

if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}[ERROR] Run this script as root or with sudo.${NC}"
  exit 1
fi

PTERO_DIR="/var/www/pterodactyl"
if [ ! -d "$PTERO_DIR" ]; then
  echo -e "${RED}[ERROR] Pterodactyl directory not found at $PTERO_DIR.${NC}"
  exit 1
fi

BACKUP_BASE="$PTERO_DIR/.espresso-theme-backup"
if [ ! -d "$BACKUP_BASE" ]; then
  echo -e "${YELLOW}No backup folder found at $BACKUP_BASE.${NC}"
  echo -e "Attempting git checkout revert if panel is a git clone..."
  cd "$PTERO_DIR"
  git checkout -- resources/ 2>/dev/null || {
    echo -e "${RED}[ERROR] Cannot revert without a backup or git history.${NC}"
    exit 1
  }
else
  LATEST_BACKUP=$(ls -td "$BACKUP_BASE"/* 2>/dev/null | head -n 1)
  if [ -z "$LATEST_BACKUP" ] || [ ! -d "$LATEST_BACKUP/resources" ]; then
    echo -e "${RED}[ERROR] No valid backup found in $BACKUP_BASE.${NC}"
    exit 1
  fi

  echo -e "Restoring backup from $LATEST_BACKUP..."
  rm -rf "$PTERO_DIR/resources"
  cp -r "$LATEST_BACKUP/resources" "$PTERO_DIR/"
  echo -e "${GREEN}Resources restored.${NC}"
fi

echo -e "\nRebuilding default assets..."
cd "$PTERO_DIR"
yarn build:production

chown -R www-data:www-data "$PTERO_DIR"
php artisan view:clear 2>/dev/null || true
php artisan config:clear 2>/dev/null || true

echo -e "\n${GREEN}Theme uninstalled. Panel restored to original state.${NC}\n"
