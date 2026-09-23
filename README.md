# Espresso Cockpit Theme for Pterodactyl

A dark warm-minimalist theme for Pterodactyl Panel (v1.11.x) with a bento-style server overview, custom terminal colors, and adaptive game badges.

[![Release: v1.0.0](https://img.shields.io/badge/version-1.0.0-emerald.svg)](https://github.com/suzirz/pterodactyl-espresso-theme/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Pterodactyl](https://img.shields.io/badge/Pterodactyl-v1.11.x-blue)](https://pterodactyl.io/)
[![React](https://img.shields.io/badge/React-17%2B-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9%2B-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

---

## Live Demo

A live showcase of this theme is accessible at:
- **URL**: [https://panel.bytenodes.id](https://panel.bytenodes.id)
- **Username**: `demo`
- **Password**: `demo12345`

> **Note**: The demo account is strictly configured in read-only mode. All write actions (power operations, file modifications, console input, account settings) are blocked.

---

## What It Looks Like & Features


- **Dark Espresso Palette**: Uses warm charcoal surfaces (`#141211`, `#1c1917`, `#25211e`) with khaki beige (`#BFA89E`) accents and high-contrast mint cream (`#EBF5EE`) text instead of the default cold blue/grey.
- **Bento Telemetry Cards**: Reorganizes server metrics (CPU, Memory, Disk, Network) into a compact grid layout with clear real-time numbers.
- **Warm Terminal Theme**: Preconfigured 16-color palette for Xterm.js matching the charcoal background.
- **Game Type Badges**: Automatically detects and shows badges for Minecraft, SA-MP, Node.js, Discord bots, and general servers.
- **Responsive Navigation**: Mobile-ready layout for phones and tablets.

---

## Installation

### Method 1: Automatic Script (Recommended)

Log in to your server as `root` and run:

```bash
bash <(curl -s https://raw.githubusercontent.com/suzirz/pterodactyl-espresso-theme/main/scripts/install.sh)
```

The script backs up your existing `resources/` directory to `.espresso-theme-backup/`, copies the theme files, and rebuilds the panel assets with `yarn build:production`.

---

### Method 2: Manual Setup

1. Go to your Pterodactyl installation:
   ```bash
   cd /var/www/pterodactyl
   ```

2. Back up your current `resources` folder:
   ```bash
   mkdir -p .espresso-theme-backup
   cp -r resources .espresso-theme-backup/
   ```

3. Clone this repo:
   ```bash
   git clone https://github.com/suzirz/pterodactyl-espresso-theme.git /tmp/espresso-theme
   ```

4. Copy the theme files into place:
   ```bash
   cp -r /tmp/espresso-theme/resources/* /var/www/pterodactyl/resources/
   rm -rf /tmp/espresso-theme
   ```

5. Rebuild panel assets:
   ```bash
   yarn install
   yarn build:production
   ```

6. Fix permissions and clear cache:
   ```bash
   chown -R www-data:www-data /var/www/pterodactyl
   php artisan view:clear
   php artisan config:clear
   ```

---

## Customizing Colors

Colors are defined in `resources/scripts/index.css`:

```css
:root {
  --bn-bg-base: #141211;       /* Main page background */
  --bn-bg-surface: #1c1917;    /* Navigation bars */
  --bn-bg-card: #25211e;       /* Card surfaces */
  --bn-mint: #ebf5ee;          /* Primary text */
  --bn-khaki: #bfa89e;         /* Focus rings and active buttons */
  --bn-taupe: #8b786d;         /* Secondary text and borders */
}
```

After modifying variables, rebuild assets with:
```bash
yarn build:production
```

---

## Uninstall

To revert back to the default Pterodactyl theme:

```bash
bash scripts/uninstall.sh
```

Or restore manually from the backup:
```bash
cp -r /var/www/pterodactyl/.espresso-theme-backup/resources/* /var/www/pterodactyl/resources/
yarn build:production
chown -R www-data:www-data /var/www/pterodactyl
```

---

## Requirements

- Pterodactyl Panel `1.11.x`
- Node.js `16.x`, `18.x`, or `20.x`
- Yarn `1.22.x`

---

## License

Distributed under the [MIT License](LICENSE).
