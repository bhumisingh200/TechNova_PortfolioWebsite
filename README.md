# Bhumi Singh - Interactive Premium Developer Portfolio

Welcome to the source repository of Bhumi Singh's personal developer portfolio website. This is a state-of-the-art, glassmorphic single-page application built using pure, high-performance **Vanilla HTML5, CSS3, and JavaScript**. It features modern UI design systems, dynamic styling controllers, terminal CLI modes, command palettes, full Hindi/English translation capabilities, and interactive widgets.

---

## 🌟 Premium Features

### 1. Modern Glassmorphic UI & Styling
* **HSL Color Token Engine**: The portfolio CSS leverages HSL variables to alter accent colors dynamically via JavaScript.
* **Accent Customizer Widget**: A sliding control panel enabling visitors to choose from four accents (**Purple, Blue, Green, Orange**) and toggle between **Dark Mode** and **Light Mode** (states persist in `localStorage`).
* **Active Scroll Ring**: The Back-to-Top floating button includes an SVG progressive ring indicating scroll percentage.
* **Canvas Particle Mesh**: A background canvas renders floating stars that connect via neural cords on proximity.
* **Cursor Glow Tracker**: Highlights mouse cursor coordinates with glowing radial neon gradients.

### 2. Interactive Data Widgets & Dashboards
* **Interactive GitHub Contribution Graph**: Renders a 52-week contribution chart with color-intensity cells and dates.
* **Stats Counter Dashboard**: Numeric metrics (completed projects, solved DSA questions, internships) count up dynamically on scroll.
* **Tech Stack Explorer**: Clicking a skill tag (e.g. *Java*, *React.js*, *MongoDB*) highlights matching project cards.
* **Interactive Projects Timeline**: Visual timeline matching project sequences; clicking steps filters and zooms cards.
* **Project Details Modals**: Opens detail overlays containing technical system architectures, challenges, and lessons learned.
* **Resume HTML Previewer**: Custom layout previewing Bhumi's CV, complete with simulated PDF download triggers.

### 3. Developer Shell Console (CLI Terminal)
* Press `Alt + T` or click the shell icon in the navbar to pull up a developer terminal prompt.
* **Supported Prompt commands**:
  - `help` - Lists all available console commands.
  - `about` - Prints educational details and CGPA info.
  - `skills` - Outputs core language and database stack indices.
  - `projects` - Summarizes featured hackathon and academic software projects.
  - `contact` - Outputs active emails and social media handles.
  - `theme [color]` - Changes accent themes (e.g. `theme blue`, `theme orange`).
  - `konami` - Manual shortcut to trigger the Matrix rain overlay.
  - `sudo rm -rf` - Triggers a simulated unauthorized guest access warning.
  - `clear` - Wipes output lines.
  - `exit` - Closes the console panel.

### 4. VS-Code-Style Command Palette
* Press `Ctrl + K` or click the shortcut keycap button to open the Command Palette.
* Supports fuzzy search matching to trigger navigation jumps, apply accent colors, download resumes, or open console windows.

### 5. Multi-Language Localization (English / Hindi)
* Clicking the language toggle translates all elements on the page including navbar headings, statistics labels, services descriptions, timelines, contact forms, and even the **typing animation words**!

### 6. Easter Egg (Matrix Rain Canvas)
* Entering the classic **Konami Code** (`↑ ↑ ↓ ↓ ← → ← → B A`) or executing `konami` in the terminal prompt engages Developer Mode, launching a full-screen Matrix digital rain loop.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `Ctrl + K` | Toggle Command Palette |
| `Alt + T` | Toggle CLI Developer Console |
| `R` | Toggle Resume Preview Modal |
| `P` | Smooth Scroll to Projects |
| `C` | Smooth Scroll to Contact Form |
| `ESC` | Close active modals, menus, or command palettes |

---

## 📁 File Structure

All source files are stored inside the repository subdirectory:
```
TechNova_PortfolioWebsite/
├── index.html        # Main semantic structural layout and modal shells
├── styles.css        # Glassmorphic layout styles, HSL rules, and animations
├── script.js         # Interactive canvas math, localization loops, CLI parser, and shortcuts
├── profile.jpg       # Profile photo asset
├── README.md         # This documentation file
└── DEPLOYMENT_GUIDE.md
```

---

## 🚀 Quick Start (Local Setup)

1. Clone or download the repository.
2. Navigate to the `TechNova_PortfolioWebsite` subdirectory:
   ```bash
   cd TechNova_PortfolioWebsite
   ```
3. Launch a local web server. For example, using Python:
   ```bash
   python -m http.server 5500
   ```
4. Open your browser and navigate to `http://localhost:5500`.

---

## 🌎 Contact Info
* **Name**: Bhumi Singh
* **Email**: bhumi_2400526@gniot.net.in
* **LinkedIn**: [bhumi-singh-97818830b](https://linkedin.com/in/bhumi-singh-97818830b)
* **GitHub**: [bhumisingh200](https://github.com/bhumisingh200)
