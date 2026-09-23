# Espresso Cockpit Theme for Pterodactyl

A warm dark theme and extension suite for Pterodactyl Panel (v1.11.x).

[![Powered By ByteNodes.id](https://img.shields.io/badge/Powered%20By-ByteNodes.id-BFA89E?style=for-the-badge&logoColor=141211&labelColor=25211e)](https://bytenodes.id)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-panel.bytenodes.id-52b788?style=for-the-badge)](https://panel.bytenodes.id)
[![Discord Community](https://img.shields.io/badge/Discord-Join%20Community-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://dsc.gg/bytenodes)

[![Release: v1.2.0](https://img.shields.io/badge/release-v1.2.0-BFA89E.svg)](https://github.com/suzirz/pterodactyl-espresso-theme/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-EBF5EE.svg)](https://opensource.org/licenses/MIT)
[![Pterodactyl](https://img.shields.io/badge/Pterodactyl-v1.11.x-38bdf8)](https://pterodactyl.io/)
[![React](https://img.shields.io/badge/React-17%2B-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9%2B-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v3.x-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

---

## Overview

Espresso Cockpit replaces Pterodactyl's default blue-grey palette with warm charcoal surfaces, khaki beige accents, and high-contrast mint typography. It bundles interface improvements for both the client dashboard and the admin area, including dedicated server management extensions and a live UI customizer.

---

## Live Demo

Test the interface in production:
- **URL**: [https://panel.bytenodes.id](https://panel.bytenodes.id)
- **Username**: `demo`
- **Password**: `demo12345`

The demo account runs in read-only mode to prevent modifications to test instances.

---

## Features

### Interface & Design
- **Warm Obsidian Palette**: `#141211` canvas, `#1c1917` surface, and `#25211e` card containers paired with Khaki Beige (`#BFA89E`) accents and Mint Cream (`#EBF5EE`) text.
- **Telemetry Cards**: Live CPU, memory, NVMe disk, and network stats with progress bars.
- **Warm Terminal**: 16-color Xterm.js palette calibrated for dark environments.
- **Game Detection Badges**: Automatic server tags for Minecraft (Paper, Purpur, Forge, Fabric), SA-MP, Node.js, Python, Rust, Palworld, and FiveM.

### ByteNodes UI Editor (Admin)
- **Branding & Accent Colors**: Change panel title, logo URL, and accent color directly from the admin panel using presets (*Warm Khaki, Emerald, Sky Blue, Violet, Amber, Rose*) or a custom hex value.
- **Global Footer Credit**: Set custom footer credit text and target links (defaults to `Powered By ByteNodes.id`), synchronized across client and admin sidebars.
- **Dashboard Hub Links**: Toggle links to billing, Discord, status page, or custom URLs.
- **Custom CSS**: Inject stylesheet rules directly into `<head>` without recompiling frontend assets.

### Server Extensions
- **Plugin Manager (`PluginsContainer.tsx`)**:
  - Search and install plugins from Modrinth, SpigotMC, and CurseForge.
  - Filter by server software (Paper, Purpur, Spigot, Fabric, Folia, NeoForge) and game version.
  - Enable, disable, or delete installed plugins with one click.
- **Modpack Installer (`ModpacksContainer.tsx`)**:
  - Browse Modrinth and CurseForge modpacks.
  - Install selected versions directly to the server.
- **Resource Partitioning**:
  - **Node Splitter**: Divide physical host allocations into private sub-nodes.
  - **Server Splitter**: Allow clients to split existing server resources into smaller child instances.

### Admin Tools
- **Categorized Sidebar**: Grouped into Overview, Fleet & Infrastructure, Extensions & Modules, Services & Mounts, and System & UI Settings.
- **Persistent Sidebar Scroll**: Preserves scroll position across page reloads via `sessionStorage`.
- **Searchable Select2 Dropdowns**: Replaces default select inputs with styled, searchable dropdown menus.
- **Node Health Monitor**: Background ping checks querying Wings daemons with live status indicators.

---

## Design Tokens

| Token | Hex Value | Usage |
| :--- | :---: | :--- |
| `--bn-bg-base` | `#141211` | Page background |
| `--bn-bg-surface` | `#1c1917` | Navigation headers, sidebar backgrounds, table headers |
| `--bn-bg-card` | `#25211e` | Cards, elevated containers, modals |
| `--bn-bg-card-hover` | `#302b27` | Hover state for cards and list rows |
| `--bn-accent` / `--bn-khaki` | `#BFA89E` | Primary accent, buttons, active highlights |
| `--bn-mint` | `#EBF5EE` | Primary text and headings |
| `--bn-taupe` | `#8B786D` | Subtitles, metadata labels, borders |
| `--bn-status-online` | `#52b788` | Running servers and online nodes |
| `--bn-status-offline` | `#f87171` | Stopped servers and offline nodes |

---

## Installation

### Option 1: One-Line Installer

Run as `root` on your Pterodactyl host:

```bash
bash <(curl -s https://raw.githubusercontent.com/suzirz/pterodactyl-espresso-theme/main/scripts/install.sh)
```

The script backs up your existing `resources/` directory to `.espresso-theme-backup/` before installing.

---

### Option 2: Manual Installation

1. Navigate to the panel root:
   ```bash
   cd /var/www/pterodactyl
   ```

2. Back up existing resources:
   ```bash
   mkdir -p .espresso-theme-backup
   cp -r resources .espresso-theme-backup/
   ```

3. Download the theme files:
   ```bash
   git clone https://github.com/suzirz/pterodactyl-espresso-theme.git /tmp/espresso-theme
   ```

4. Copy theme files into the panel:
   ```bash
   cp -r /tmp/espresso-theme/resources/* /var/www/pterodactyl/resources/
   cp -r /tmp/espresso-theme/public/* /var/www/pterodactyl/public/
   rm -rf /tmp/espresso-theme
   ```

5. Install dependencies and build assets:
   ```bash
   yarn install
   yarn build:production
   ```

6. Fix permissions and clear cache:
   ```bash
   chown -R www-data:www-data /var/www/pterodactyl
   php artisan view:clear
   php artisan cache:clear
   php artisan config:clear
   ```

---

## Uninstallation

To restore default Pterodactyl files from backup:

```bash
cd /var/www/pterodactyl
cp -r .espresso-theme-backup/resources/* ./resources/
yarn build:production
chown -R www-data:www-data /var/www/pterodactyl
php artisan view:clear
php artisan cache:clear
```

---

## System Requirements

- **Pterodactyl Panel**: `v1.11.x`
- **Node.js**: `16.x`, `18.x`, or `20.x`
- **Yarn**: `1.22.x`
- **PHP**: `8.1` or `8.2`

---

## Credits

Developed and maintained by the **[ByteNodes.id](https://bytenodes.id)** team.

- **[ByteNodes.id](https://bytenodes.id)**: Infrastructure, hosting, and panel customizations.
- **[Pterodactyl Software](https://pterodactyl.io/)**: Base game server management panel.
- **[Modrinth API](https://modrinth.com/)** & **[CurseForge](https://curseforge.com/)**: Plugin and modpack catalog APIs.

### Contact & Support
- Website: [https://bytenodes.id](https://bytenodes.id)
- Billing: [https://billing.bytenodes.id](https://billing.bytenodes.id)
- Discord: [https://dsc.gg/bytenodes](https://dsc.gg/bytenodes)
- Status: [https://status.bytenodes.id](https://status.bytenodes.id)

---

## License

This project is released under the [MIT License](LICENSE).
