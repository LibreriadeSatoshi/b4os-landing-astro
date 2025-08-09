# B4OS Landing Page Documentation

## 📋 Project Overview

This is the official landing page for **B4OS (Bitcoin 4 Open Source)**, a free technical training program for senior developers interested in the Bitcoin and Lightning Network ecosystem. The site is built with **Astro** for optimal performance and SEO.

## ⚡ About Astro

**Astro** is a modern web framework designed for building fast, content-focused websites. Key advantages for this project:

- **Zero JS by default**: Ships only the JavaScript you need
- **Island Architecture**: Interactive components load independently
- **Built-in optimizations**: Automatic image optimization, CSS bundling, and more
- **SEO-friendly**: Server-side rendering with excellent meta tag support
- **Framework agnostic**: Can use React, Vue, Svelte components when needed

Perfect for landing pages like B4OS where performance and SEO are critical.

## Astro Starter Kit: Minimal

```sh
npm create astro@latest -- --template minimal
```

## 🏗️ Project Structure

```text
/
├── public/                 # Static assets (images, favicons, etc.)
├── src/
│   ├── components/        # Reusable Astro components (FAQ, Benefits, etc.)
│   ├── data/             # Static data (cities, countries)
│   ├── layouts/          # Page layouts (Layout.astro)
│   ├── pages/            # Routes (index.astro, terminos.astro)
│   └── styles/           # CSS modules (global.css, nav.css, etc.)
├── reports/               # Lighthouse audit reports (auto-generated)
└── package.json
```

## 🧞 Development Commands

| Command | Action | Usage |
|---------|--------|-------|
| `npm install` | Install dependencies | One-time setup |
| `npm run dev` | Start development server | Development at `localhost:4321` |
| `npm run build` | Build for production | Creates `./dist/` folder |
| `npm run preview` | Preview production build | Test build locally |
| `npm run astro add` | Add integrations | `npm run astro add tailwind` |
| `npm run astro check` | Check for errors | TypeScript and syntax validation |

## 📊 Lighthouse Performance Commands

### Basic Lighthouse Commands

| Command | Action | Usage |
|---------|--------|-------|
| `npm install -g lighthouse` | Install Lighthouse globally | One-time setup |
| `lighthouse http://localhost:4321` | Basic audit | Simple performance check |
| `npm run check:server` | Verify server is running | Checks if `localhost:4321` is accessible |

### Advanced Lighthouse Scripts

| Command | Description | What it does |
|---------|-------------|--------------|
| `npm run lighthouse:mobile` | **Mobile performance audit** | Tests with mobile throttling, saves HTML report to `./reports/lighthouse-mobile.html`, auto-opens results |
| `npm run lighthouse:desktop` | **Desktop performance audit** | Tests with desktop preset (faster CPU/network), saves to `./reports/lighthouse-desktop.html` |
| `npm run lighthouse:both` | **Run both mobile & desktop** | Sequential execution of mobile then desktop audits |
| `npm run lighthouse:ci` | **Full CI/CD pipeline audit** | Builds project → starts preview server → runs both audits → closes server |
| `npm run lighthouse:quiet` | **Silent desktop audit** | Desktop audit with minimal console output, useful for scripts |

### Command Breakdown

**`lighthouse:mobile`** - Mobile-first audit with realistic conditions:
```bash
lighthouse http://localhost:4321 \
  --output=html \                                    # HTML report format
  --output-path=./reports/lighthouse-mobile.html \   # Save location
  --view \                                          # Auto-open in browser
  --chrome-flags="--headless=new --no-sandbox --disable-gpu" \  # Chrome optimizations
  --throttling-method=provided                      # Use Lighthouse's throttling
```

**`lighthouse:desktop`** - Desktop performance testing:
```bash
lighthouse http://localhost:4321 \
  --preset=desktop \                                # Desktop-optimized settings
  --output=html \                                   # HTML report
  --output-path=./reports/lighthouse-desktop.html   # Save location
```

**`lighthouse:ci`** - Complete automated workflow:
1. `npm run build` - Build production version
2. `npm run preview &` - Start preview server in background
3. `sleep 8` - Wait for server to be ready
4. `npm run lighthouse:both` - Run both audits
5. `pkill -f 'astro preview'` - Clean up preview server

### Performance Targets
- **Performance**: 95+ score target
- **Accessibility**: 100 score target  
- **Best Practices**: 95+ score target
- **SEO**: 100 score target

### Quick Usage Examples
```bash
# Check if dev server is running
npm run check:server

# Quick mobile audit while developing
npm run lighthouse:mobile

# Full audit for production
npm run lighthouse:ci

# Silent audit for automated checks
npm run lighthouse:quiet
```

## 🎨 Key Features

- **Multi-section landing page** with hero, timeline, registration form
- **Responsive design** optimized for mobile and desktop
- **SEO optimized** with structured data and meta tags
- **Form handling** with country/city selection and validation
- **Performance optimized** with lazy loading and efficient assets
- **Astro Islands** for interactive components without JS bloat

## 🌐 Deployment

The site generates static files perfect for any hosting service:

```bash
npm run build              # Creates ./dist/ folder
```

Deploy the `./dist/` folder to Netlify, Vercel, GitHub Pages, or any static host.

## 📈 Performance Monitoring Workflow

1. **Development**: Use `npm run lighthouse:mobile` for quick checks
2. **Pre-commit**: Run `npm run lighthouse:both` to test both devices
3. **CI/CD**: Use `npm run lighthouse:ci` in automated pipelines
4. **Reports**: Check `./reports/` folder for detailed HTML reports

---

**Tech Stack**: Astro, CSS Modules, Vanilla JavaScript  
**Performance**: Lighthouse optimized for 95+ scores across all metrics