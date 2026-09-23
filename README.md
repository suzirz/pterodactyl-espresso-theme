# Espresso Cockpit Theme for Pterodactyl
### *The Agency-Grade Warm Obsidian Theme & Management Suite*

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

## 🌟 Overview

**Espresso Cockpit Theme** is a dark, warm-minimalist interface and extended feature suite for **Pterodactyl Panel (v1.11.x)**. Built on the signature **ByteNodes Warm Obsidian** design philosophy, it replaces the conventional cold blue-grey palette with warm charcoal tones, tactile khaki beige accents, and high-legibility mint typography.

Engineered with performance, aesthetics, and user experience at its core, this theme delivers a seamless pair of client dashboard workflows and admin fleet management interfaces.

---

## 🌐 Live Showcase

Experience the interface directly in production:
- **Demo URL**: [https://panel.bytenodes.id](https://panel.bytenodes.id)
- **Username**: `demo`
- **Password**: `demo12345`

> **Note**: The public demo account operates strictly in read-only mode to preserve cluster stability. All destructive actions (console input, power toggles, file modifications) are safeguarded.

---

## ✨ Key Highlights & Features

### 1. 🎨 ByteNodes Warm Obsidian Design System
- **Curated Palette**: Deep charcoal canvas (`#141211`), slate surface (`#1c1917`), and card containers (`#25211e`) paired with Khaki Beige (`#BFA89E`) accents and Mint Cream (`#EBF5EE`) typography.
- **Bento Telemetry Cards**: Compact, high-density server metric cards for CPU, Memory, NVMe Disk, and Network IO with real-time gradient progress bars.
- **Custom Warm Terminal**: Pre-calibrated 16-color Xterm.js palette tuned specifically for prolonged console sessions without eye strain.
- **Automatic Game Badges**: Dynamic detection and badges for Minecraft (Paper/Purpur/Forge/Fabric), SA-MP, Node.js, Python bots, Rust, Palworld, and FiveM.

### 2. 🛠️ Integrated ByteNodes UI Editor (Admin Panel)
- **Live Theme Customizer**: Configure brand identity, panel title, custom logo URLs, and primary accent colors with a visual color picker and 1-click presets (*Warm Khaki, Emerald, Sky Blue, Violet, Amber, Rose*).
- **Global Footer Credit Control**: Customize footer credit text and target links (defaulting to `Powered By ByteNodes.id`) that seamlessly synchronize across client and admin sidebars.
- **Quick Hub & External Links**: Toggle and route client dashboard quick-action cards (Billing Portal, Discord Community, Uptime Status, Priority Support, and Custom Links).
- **Live Custom CSS Injection**: Direct `<head>` stylesheet injection for on-the-fly style overrides without recompilation.

### 3. 🧩 Server Extension Ecosystem
- **Modern Plugins Manager (`PluginsContainer.tsx`)**:
  - Tri-provider browse engine supporting **Modrinth**, **SpigotMC**, and **CurseForge**.
  - Dynamic loader filters (Paper, Purpur, Spigot, Fabric, Folia, NeoForge) & Minecraft version selectors.
  - Installed plugin manager with 1-click enable/disable, file size metrics, and deletion safeguards.
- **Automated Modpacks Manager (`ModpacksContainer.tsx`)**:
  - Direct integration with Modrinth and CurseForge modpack indices.
  - One-click version installer with automatic backup reminders.
- **Multi-Tenant Partitioning**:
  - **Node Splitter**: Partition large physical hosts into isolated private sub-nodes with dedicated resource quotas.
  - **Server Splitter**: Enable clients to subdivide existing servers into smaller sub-instances.

### 4. ⚡ Admin UX & Quality-of-Life Upgrades
- **Categorized Admin Sidebar**: Clean hierarchy divided into *Overview*, *Fleet & Infrastructure*, *Extensions & Modules*, *Services & Mount*, and *System & UI Settings*.
- **Persistent Sidebar Scroll**: State-aware `sessionStorage` scroll restoration ensures the sidebar never snaps back to the top when navigating between admin subpages.
- **Select2 Warm Obsidian Dropdowns**: Comprehensive override eliminating native Windows OS blue popups in favor of dark, search-enabled dropdown menus.
- **Real-Time Node Health Ping**: Background AJAX monitoring querying Wings daemons directly with live status indicators and error tooltips.

---

## 🎨 Design Tokens & Palette

| Token | Hex Value | Role & Usage |
| :--- | :---: | :--- |
| `--bn-bg-base` | `#141211` | Deep warm charcoal body background |
| `--bn-bg-surface` | `#1c1917` | Navigation headers, sidebar backgrounds, table headers |
| `--bn-bg-card` | `#25211e` | Bento cards, elevated containers, modal windows |
| `--bn-bg-card-hover` | `#302b27` | Interactive hover states for cards and list rows |
| `--bn-accent` / `--bn-khaki` | `#BFA89E` | Primary brand accent, CTA buttons, active highlights |
| `--bn-mint` | `#EBF5EE` | Primary headline and body text (high contrast) |
| `--bn-taupe` | `#8B786D` | Subtitles, metadata labels, icon accents, borders |
| `--bn-status-online` | `#52b788` | Active running states, online nodes, success alerts |
| `--bn-status-offline` | `#f87171` | Stopped servers, offline nodes, danger alerts |

---

## 🚀 Installation

### Option 1: Automatic Installer (Recommended)

Connect to your Pterodactyl server via SSH as `root` and execute:

```bash
bash <(curl -s https://raw.githubusercontent.com/suzirz/pterodactyl-espresso-theme/main/scripts/install.sh)
```

> **Safety Notice**: The script creates a backup of your original `resources/` folder at `.espresso-theme-backup/` prior to installing any files.

---

### Option 2: Manual Installation

1. **Navigate to your Pterodactyl root directory**:
   ```bash
   cd /var/www/pterodactyl
   ```

2. **Create a safe backup**:
   ```bash
   mkdir -p .espresso-theme-backup
   cp -r resources .espresso-theme-backup/
   ```

3. **Clone the theme repository**:
   ```bash
   git clone https://github.com/suzirz/pterodactyl-espresso-theme.git /tmp/espresso-theme
   ```

4. **Copy the theme assets and views into place**:
   ```bash
   cp -r /tmp/espresso-theme/resources/* /var/www/pterodactyl/resources/
   cp -r /tmp/espresso-theme/public/* /var/www/pterodactyl/public/
   rm -rf /tmp/espresso-theme
   ```

5. **Install dependencies and compile production assets**:
   ```bash
   yarn install
   yarn build:production
   ```

6. **Reset permissions and clear Laravel caches**:
   ```bash
   chown -R www-data:www-data /var/www/pterodactyl
   php artisan view:clear
   php artisan cache:clear
   php artisan config:clear
   ```

---

## 🔄 Reverting / Uninstallation

To restore default Pterodactyl theme files from your backup:

```bash
cd /var/www/pterodactyl
cp -r .espresso-theme-backup/resources/* ./resources/
yarn build:production
chown -R www-data:www-data /var/www/pterodactyl
php artisan view:clear
php artisan cache:clear
```

---

## 📋 System Requirements

- **Pterodactyl Panel**: `v1.11.x`
- **Node.js**: `16.x`, `18.x`, or `20.x`
- **Package Manager**: Yarn `1.22.x`
- **PHP**: `8.1` or `8.2`

---

## 💎 Credits & Acknowledgements

This theme and its extensions are actively developed and maintained with care by the **[ByteNodes.id](https://bytenodes.id)** engineering team.

Special thanks and appreciation to:
- **[ByteNodes.id](https://bytenodes.id)** — Cloud infrastructure, server virtualization, and product engineering.
- **[Pterodactyl Software](https://pterodactyl.io/)** — The open-source game server management panel.
- **[Modrinth API](https://modrinth.com/)** & **[CurseForge](https://curseforge.com/)** — Open APIs powering the automated plugin and modpack ecosystem.

### 💬 Connect with ByteNodes
- **Website**: [https://bytenodes.id](https://bytenodes.id)
- **Client Billing Portal**: [https://billing.bytenodes.id](https://billing.bytenodes.id)
- **Discord Community**: [https://dsc.gg/bytenodes](https://dsc.gg/bytenodes)
- **Infrastructure Status**: [https://status.bytenodes.id](https://status.bytenodes.id)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
Feel free to use, modify, and distribute with attribution.
