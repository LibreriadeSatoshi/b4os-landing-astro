---
name: ismos-ui
description: Build or review any ISMOS (ismos.xyz) interface, page, component, email or theme (web, Moodle, mentor-ia, app) so it follows the ISMOS design system. Use for any UI, styling, layout, copy or icon work on ISMOS surfaces.
---

# ISMOS UI

Source of truth: `design/ismos/`. Tokens in `tokens.json`; full guide in `docs/` (01–10). This file is the working summary. When something here is unclear or missing, read the matching doc before guessing. Where this file and `docs/` disagree, `docs/` wins.

## Setup in code

- Import once: `design/ismos/css/ismos.css` (fonts + tokens + typography + `ism-*` components).
- Tailwind v4: also `design/ismos/tailwind/theme.css`. Theme-driven defaults are wiped; only ISMOS values exist. Arbitrary values are still possible in Tailwind, so the checker must reject them.
- Theme: light by default; `data-theme="hacker"` on `<html>` forces Hacker mode (dark); `data-theme="light"` forces light; no attribute follows the device.
- Non-CSS contexts (emails, OG images, canvas): `design/ismos/js/tokens.ts`.
- Never edit generated files (`css/tokens.css`, `fonts.css`, `fonts.public.css`, `typography.css`, `ismos.css`, `tailwind/theme.css`, `js/tokens.ts`). Change `tokens.json` and run `node scripts/build-tokens.mjs`.
- Run `node scripts/check-ismos.mjs src` before finishing. Fix every violation.

## Hard rules (no exceptions)

**Colour**
- Use semantic tokens, never raw hex: `surface`, `surface-raised`, `text`, `text-heading`, `text-muted`, `hairline`, `rule-strong`, `link`, `link-hover`, `action`/`on-action`, `alert`, `bar`, `track`, `focus`, `status-*`, `border-input`, `border-strong`, `scrim`. Primitives (`mauveine`, `indigo`, `logwood`, `logwood-800`, `madder`, `weld`, `ink`, `paper`…) only for full-bleed colour blocks.
- Ground is Paper with Ink type, or a full-bleed block of Mauveine / Indigo / Logwood with white type. Never off-white text on a dark colour.
- Mauveine: links (underlined), the 6 px bar, hero blocks. Never as text or lines on Ink/Logwood (use `mauveine-200`).
- Madder = alerts only, Ink type on it; alert text on Paper is `madder-800`. Weld = highlights only, Ink type, ~6% of a screen.
- No gradients. No tints/opacity to soften a colour. No colour per tag. Never colour alone for meaning: every state = colour + icon + WORD.
- Contrast ≥ 4.5:1, ≥ 7:1 for body text. Check both themes.

**Type**
- Literata = titles only (400/500, no Light). IBM Plex Sans = everything read or pressed (400/500/600; under 16 px use 500). IBM Plex Mono = labels, figures, code, the address `ISMOS.XYZ`. Bricolage Grotesque = the wordmark only, and the wordmark is artwork, never typeset.
- Scale: display 48/52, h1 36/42, h2 28/34, h3 21/28 (Literata); lead 19/30, body 17/28, body-small 15/24, caption 13/20 (Plex Sans); label 11/16 Plex Mono uppercase 0.14em. Classes `.ism-t-*` or Tailwind `text-*`. Nothing in the UI below 13 px.
- Uppercase only on the Plex Mono label. Sentence case everywhere else. No underline except links. No letterspacing on lowercase.

**Layout**
- Spacing: 4 8 12 16 24 32 48 64 96 only (2 = optical offsets). If you need 20, it is 16 or 24.
- Rules: 1, 2, 6 px only. Corners: 0, 4 (pressable: buttons, inputs, cards, tabs), 8 (max, modals/sheets). `radius-circle` for avatars only. No pills, no round buttons, no circular badges.
- Shadows: `shadow-float` (menus, popovers) and `shadow-modal` + scrim (modals) only. Cards use a 1 px hairline.
- Grid: 12 cols, max 1200, gutter 24, margin 32 / 16 mobile, reading column 680. Breakpoints 640 / 1024 / 1280, mobile first, reflows to 320.
- Six graphic devices only: rules (1/2/6), mark as marker, corner mark, full-bleed colour blocks, dashed construction line (docs only), motif field (≤25% opacity). No rounded panels, left-border callouts, coloured chips, arcs, dotted rules.
- Use logical properties (`margin-inline-start`) and `dir`; Arabic mirrors. Set `lang` on every page. Size labels against the longest language (FR/RU/ES ≈ +30%). No fixed-height cards, no truncated titles.

**Icons and images**
- Iconoir only (`iconoir` / `iconoir-react`, regular style, 1.5 px, `currentColor`), 20/24/32/48 px, with a word beside it (icon alone only for search, close, download). 44 px hit target.
- Never: filled/solid icons, icons in circles or badges, other icon libraries, emoji, and the icons graduation-cap, trophy, medal, crown, star, rocket.
- Logos: place the supplied SVGs (`ismos-mark-ink.svg`, `ismos-mark-paper.svg`, `ismos-book-*.svg`). Never redraw, recolour, rotate, crop, shadow or badge. Ink or Paper only. Mark ≥ 20 px, clear space 0.25 × mark width.
- No photos of people except teacher photos (circle, colour, consent) on course card 32 px, course page 64 px, class page 96 px. Students never have a photo.

**Motion**: animate opacity and translate only; 120/200/280 ms; reduced motion sets all to 0. Hover never moves, lifts or scales anything.

**Focus**: 2 px `focus` outline, 2 px offset, on every control.

## Components (`design/ismos/css/components.css`, prefix `ism-`)

Wrap pages in `.ism-root`. Details per component in `docs/components/*.md`.

| Component | Classes | Key rule |
|---|---|---|
| Button | `.ism-btn`, `.ism-btn--secondary` | Verb + object, sentence case, ≤ 4 words. One primary per view. Never Weld/Madder. |
| Label | `.ism-label`, `--ai`, `--on-color` | Write sentence case in source; CSS uppercases. |
| SectionHead | `.ism-sectionhead`, `__num`, `__title` | Closed by the 2 px rule. |
| Bar | `.ism-bar` | 6 px, 32 px wide. |
| StatusTag | `.ism-tag`, `.ism-tag--alert` | Colour + icon + WORD. |
| TextField | `.ism-field`, `__input`, `__msg`, `--error` | Visible label; error message via `aria-describedby`, names the fix. |
| CourseCard | `.ism-card`, `__title`, `__text`, `__teacher`, `__facts` | Fixed order: bar, tags (≤3, middle dot), title, one sentence, teacher, facts. Whole card is the link. No images except teacher, no ratings, no counts, no "new". |
| Avatar | `.ism-avatar`, `--lg`, `--xl`, `--initials` | Teachers only. |
| Progress | `.ism-progress__head/__count/__track/__fill/__note` | "5 of 8" + a sentence. Never a percentage alone. |
| Terminal | `.ism-term` with `.pr .cm .al .cur` | Hacker mode code surface. |

For components not in the bundle (modal, tabs, select, toast, table, nav, etc.) read `docs/10-accepted-decisions.md` §2 and build from tokens, following the same rules.

## Copy in the interface

Human, warm, direct: a calm instructor talking to one person. Speak to "you". Short sentences. Verbs with objects ("Start the course", not "Submit"/"OK"). Empty state = what is true + one next step with a number. Errors = what happened, not your fault, what to do next; no codes. Never invent numbers: use a visible `[PLACEHOLDER]`; every figure names its denominator.

Never: exclamation marks, em dashes, emoji, all caps (outside labels); the words certificate, diploma, empower, journey, transform, world-class, unlock, seamless, leverage, the underserved, learners, users; streaks, scores, leaderboards, countdowns, guilt about unfinished lessons. Naming: "ISMOS", "ISMOS.XYZ" for the address; never "ISMOS Academy/School/Platform". If AI generated material, label it with `.ism-label--ai` "Built with AI".

## Before you finish

1. `node scripts/check-ismos.mjs src` passes.
2. Checked in light and `data-theme="hacker"`, at 360 px and desktop.
3. Every state has colour + icon + word; every control has a visible focus ring and 44 px target.
4. No hex, px spacing or radius outside the tokens.
