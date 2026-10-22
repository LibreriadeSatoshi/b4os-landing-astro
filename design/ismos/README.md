# ISMOS design kit for development with LLMs

A kit to drop the ISMOS design system (v1 final, Oct 2026) into any repo so that Claude Code, Cursor, Copilot or any agent respects it.

## Status in this repo (21weeks)

The kit is **active**: the app uses Tailwind 4 with `design/ismos/tailwind/theme.css` and `ismos.css` from `src/index.css`, the body has `ism-root` (in `index.html`) and the icons are `iconoir-react@7.11.0`.

- Scripts: `npm run ismos:tokens`, `npm run ismos:check` (over `src`, `contracts` and `index.html`) and `npm run test:ismos` (included in `npm test` and therefore in CI).
- Instructions for agents: the "Design system" section of `AGENTS.md` and the `.claude/skills/ismos-ui/` skill.
- Pending: the official logo SVGs in `logos/` (the header shows the product name until they arrive).
- Font licenses: `fonts/OFL.txt` and `fonts/COPYRIGHT.md`.
- Demo: `examples/tailwind-demo.html`. `examples/out.css` is generated from `examples/input.css` (which only scans `examples/`):
  ```bash
  npx @tailwindcss/cli@4.1.11 -i examples/input.css -o examples/out.css
  ```
  Open it directly in the browser; the fonts load from `design/ismos/css/fonts.css`.

## What is included

```
design/ismos/
  tokens.json            ← source of truth (copied from the design system, do not touch except for a brand change)
  css/
    ismos.css            ← entry point: fonts + tokens + typography + components
    tokens.css           ← GENERATED: CSS variables, light + hacker (data-theme / prefers-color-scheme)
    fonts.css            ← GENERATED: @font-face with relative paths (Vite/Astro)
    fonts.public.css     ← GENERATED: @font-face with /fonts/ismos/ (Tailwind CLI, PostCSS without rebase)
    typography.css       ← GENERATED: classes .ism-t-display … .ism-t-figure
    components.css       ← official ism-* bundle (+1 fix, see below)
  tailwind/theme.css     ← GENERATED: Tailwind v4 theme, no defaults (p-16 = 16px, rounded-4, bg-surface…)
  js/tokens.ts           ← GENERATED: tokens for emails, OG images, canvas
  fonts/                 ← Literata, IBM Plex Sans/Mono, Bricolage Grotesque (OFL)
  docs/                  ← full guide 01–10 + one .md per component
  logos/                 ← PENDING: official SVGs (see README inside)
.claude/skills/ismos-ui/SKILL.md   ← skill for Claude Code (working summary of the guide)
AGENTS.md                          ← the same for any agent (Codex, Copilot, Gemini CLI…)
.cursor/rules/ismos.mdc            ← Cursor rule
CLAUDE.md.snippet                  ← paste into your CLAUDE.md
scripts/build-tokens.mjs           ← regenerates everything GENERATED from tokens.json (no dependencies)
scripts/check-ismos.mjs            ← guard: off-palette hex, off-scale spacing/radius, gradients, shadows, emoji, em dash, banned words and icons
examples/tailwind-demo.html        ← reference page with every component
package.scripts.json               ← scripts and dependency to merge into your package.json
```

## Installation (Astro / Vite)

1. Copy `design/`, `scripts/`, `.claude/`, `AGENTS.md` and `.cursor/` to the repo root.
2. Paste `CLAUDE.md.snippet` into your `CLAUDE.md`. Merge `package.scripts.json` into `package.json` and run `npm i`.
3. In your global CSS:
   ```css
   @import "tailwindcss";
   @import "../../design/ismos/css/ismos.css";
   @import "../../design/ismos/tailwind/theme.css";
   ```
   Without Tailwind, `ismos.css` is enough. Wrap the layout in `<body class="ism-root">`.
4. Theme: `<html data-theme="hacker">` forces Hacker mode, `data-theme="light"` forces light, no attribute follows the device.
5. Icons: `iconoir` (or `iconoir-react`), version 7.11.0, regular style and `currentColor`.

**If you use Tailwind CLI or PostCSS without `url()` rebasing:** import `fonts.public.css` instead of `ismos.css` (plus `tokens.css`, `typography.css` and `components.css` separately) and copy `design/ismos/fonts/*` to `public/fonts/ismos/`. Vite and Astro rewrite the paths on their own, so it is not needed there.

## Use with LLMs

- **Claude Code:** loads the `ismos-ui` skill only for UI work. Ask for it explicitly with "use the ismos-ui skill".
- **Cursor:** uses `.cursor/rules/ismos.mdc`. **Codex, Copilot, Gemini CLI and others:** read `AGENTS.md`.
- **Standalone chat (ChatGPT, Gemini, claude.ai):** attach `SKILL.md`, `tokens.json` and `components.css`. For non-code assets (posts, slides), use the block in `docs/08-production.md`.
- **Safety net:** `npm run ismos:check` in pre-commit or in CI. An LLM skips rules now and then; the check does not.

## Maintenance

If the brand changes, replace `design/ismos/tokens.json` and `docs/`, run `npm run ismos:tokens` and review `SKILL.md` if any hard rule changed.

## Issues found in the design system (for Dulce)

1. **Bug in the bundle:** `.ism-root a` had higher specificity than `.ism-btn`, so an `<a class="ism-btn">` came out Mauveine and underlined. It is fixed in `components.css` with two rules marked "Kit fix". It would be good to push this upstream to the official bundle.
2. **Inconsistency in TextField:** `docs/components/TextField.md` says "default border 2 px `text` (Ink)", but `tokens.json` (`border-input`) and the bundle use 1.5 px Logwood 700. The kit follows the tokens and the bundle.
3. **The bundle uses off-scale values** (6 px gaps, 18/20 px padding in Terminal, 1.5 px borders). The checker ignores `design/ismos/` so it does not flag them, but they should be normalized.
4. **The logo SVGs are not published** as artifact files; they have to be added by hand in `design/ismos/logos/`. There is also no lockup or favicon artwork yet.
5. **`tokens.json` uses its own format**, not DTCG. That is why the build is a custom script and not Style Dictionary.
