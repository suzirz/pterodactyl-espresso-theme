<div align="center">

```
   ______                                    ______           __            _ __ 
  / ____/________  ________  ______________ / ____/___  _____/ /______  (_) /_
 / __/ / ___/ __ \/ ___/ _ \/ ___/ ___/ __ \/ /   / __ \/ ___/ //_/ __ \/ / __/
/ /___(__  ) /_/ / /  /  __(__  |__  ) /_/ / /___/ /_/ / /__/ ,< / /_/ / / /_  
/_____/____/ .___/_/   \___/____/____/\____/\____/\____/\___/_/|_/ .___/_/\__/  
          /_/                                                   /_/             
```

# ☕ Espresso Cockpit Theme for Pterodactyl Panel
**An ultra-refined, warm-minimalist game hosting cockpit theme for Pterodactyl Panel (v1.11.x).**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Pterodactyl](https://img.shields.io/badge/Pterodactyl-v1.11.x-007ACC?style=for-the-badge&logo=pterodactyl&logoColor=white)](https://pterodactyl.io/)
[![React](https://img.shields.io/badge/React-17%2B-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9%2B-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

[Features](#-key-features) • [Installation](#-quick-installation) • [Customization](#-customization--theming) • [Uninstallation](#-uninstallation) • [Contributing](#-contributing)

</div>

---

## 🌟 Overview

**Espresso Cockpit** replaces Pterodactyl's standard cold, blue-tinted interface with an agency-grade, warm-minimalist cockpit. Built for server owners and hosting providers who value high visual density, tactile responsiveness, and aesthetic excellence.

Say goodbye to generic flat cards and eye fatigue during long late-night server management sessions.

---

## ✨ Key Features

### ☕ 1. Warm Charcoal Espresso Color System
- **Base Canvas (`#141211`):** Deep warm obsidian charcoal replaces harsh `#000000` pitch black.
- **Card Surfaces (`#1c1917` & `#25211e`):** Subtle layered elevations with 1px tactile borders (`rgba(191, 168, 158, 0.15)`).
- **Earthy Accent Pairings:** Soft **Khaki Beige** (`#BFA89E`) action accents paired with crisp **Mint Cream** (`#EBF5EE`) foreground typography, achieving **12.4:1 WCAG AA+** contrast.

### 🎛️ 2. High-Density Cockpit Bento Grid
- **Tactical Overview:** Critical metrics (CPU, RAM, Disk I/O, Network, and Power state) are displayed in an organized bento grid with zero wasted whitespace.
- **Server Hero Banner:** Visual overview card with quick copyable connection credentials, node allocation tags, and active status indicators.

### 🖥️ 3. Warm Obsidian Xterm.js Terminal
- Fully customized 16-color terminal palette optimized for readability in Minecraft, Node.js, and Linux server stdout logs.
- Smooth cursor animations, high contrast warnings, and comfortable dark mode foregrounds.

### 🎮 4. Smart Game-Specific Meta Badges
- Intelligent badge detection with dynamic glow effects for major game engines:
  - **Minecraft:** Emerald Glow (`#34D399`)
  - **Discord Bot:** Blurple Glow (`#5865F2`)
  - **SA-MP (GTA):** Amber Glow (`#F59E0B`)
  - **Web / Node.js API:** Cyan Glow (`#06B6D4`)
  - **Generic Server:** Khaki Glow (`#BFA89E`)

### ⚡ 5. Tactile Micro-Interactions & Physics
- Fluid 150–200ms transitions on hover states.
- Tactile press physics (`transform: scale(0.98)`) on power controls and primary action buttons.
- Fully responsive layout engineered for mobile phones, tablets, and ultrawide cockpit monitors.

---

## 🚀 Quick Installation

### Option A: One-Line Installer (Recommended)

Log in to your Pterodactyl server via SSH as `root`, then run:

```bash
bash <(curl -s https://raw.githubusercontent.com/bytenodeshost/pterodactyl-espresso-theme/main/scripts/install.sh)
```

The script will automatically:
1. Verify system prerequisites (`node`, `yarn`).
2. Create a safe timestamped backup of your existing `resources/` folder.
3. Deploy Espresso Cockpit components and Blade views.
4. Compile production assets (`yarn build:production`).
5. Fix file permissions and clear Laravel view/config caches.

---

### Option B: Manual Installation

1. Navigate to your Pterodactyl directory:
   ```bash
   cd /var/www/pterodactyl
   ```

2. Back up your existing resources:
   ```bash
   mkdir -p .espresso-theme-backup
   cp -r resources .espresso-theme-backup/
   ```

3. Clone this repository into a temporary folder:
   ```bash
   git clone https://github.com/bytenodeshost/pterodactyl-espresso-theme.git /tmp/espresso-theme
   ```

4. Copy the theme files:
   ```bash
   cp -r /tmp/espresso-theme/resources/* /var/www/pterodactyl/resources/
   rm -rf /tmp/espresso-theme
   ```

5. Rebuild panel assets:
   ```bash
   yarn install
   yarn build:production
   ```

6. Set permissions and clear cache:
   ```bash
   chown -R www-data:www-data /var/www/pterodactyl
   php artisan view:clear
   php artisan config:clear
   ```

---

## 🎨 Customization & Theming

All theme colors and tokens are organized in CSS custom properties inside `resources/scripts/index.css`:

```css
:root {
  --bn-bg-base: #141211;       /* Main canvas background */
  --bn-bg-surface: #1c1917;    /* Navbar & subnav surface */
  --bn-bg-card: #25211e;       /* Bento cards elevation */
  --bn-mint: #ebf5ee;          /* Primary sharp text */
  --bn-khaki: #bfa89e;         /* Button & focus ring accent */
  --bn-taupe: #8b786d;         /* Muted text & subtle borders */
}
```

To modify branding, adjust the parameters in `resources/views/templates/wrapper.blade.php` or change the SVG asset paths in `resources/scripts/components/`.

---

## 🔄 Uninstallation

To restore your panel to the default Pterodactyl theme:

```bash
bash scripts/uninstall.sh
```

Or manually restore your backup from `.espresso-theme-backup/`:
```bash
cp -r .espresso-theme-backup/resources /var/www/pterodactyl/
yarn build:production
chown -R www-data:www-data /var/www/pterodactyl
```

---

## 📋 Compatibility

| Software | Supported Versions |
| :--- | :--- |
| **Pterodactyl Panel** | `v1.11.0` – `v1.11.x` |
| **Node.js** | `16.x`, `18.x`, `20.x` |
| **Yarn** | `v1.22.x` |
| **Web Browsers** | Chrome, Firefox, Edge, Safari (iOS/macOS) |

---

## 📄 License

This theme is distributed under the **[MIT License](LICENSE)**. Feel free to use it for personal servers, commercial game hostings, or as a base for your own theme forks!

---

<div align="center">
  <sub>Crafted with passion for the Pterodactyl community. If you love this theme, don't forget to star ⭐ the repository!</sub>
</div>
