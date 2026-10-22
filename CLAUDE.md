## Project

Astro 5 landing page for B4OS (Bitcoin 4 Open Source), a free technical training program by Libreria de Satoshi.
Four languages: Spanish (default), English, Portuguese, Catalan — translations in `i18n/[es|en|pt|ca].json`.

## Workflow

- Prefer **small, scoped changes**. No drive-by refactors without explicit approval.
- **One branch per feature** (`feature/...` or `fix/...`), branched from an up-to-date `main`. Never commit on `main`.
- Verify with `npm run build` before calling anything done.

## Design system (ISMOS)

All UI, styling, layout and icon work follows the ISMOS design system (kit copied from `../Landing-page-africa`, itself from `../21weeks`; keep it byte-identical and do not edit it).

- Read `.claude/skills/ismos-ui/SKILL.md` before touching UI. Full guide in `design/ismos/docs/` (01–10); it wins on conflict.
- `design/ismos/css/ismos.css` is the single stylesheet entry point for fonts, tokens, typography and `ism-*` components. There is no Tailwind: use `ism-*` classes and token CSS variables (`var(--space-16)`, `var(--surface)`…).
- Never hex, loose px spacing, radii or shadows outside the tokens. Icons: Iconoir only (regular, `currentColor`).
- Do not edit generated files in `design/ismos/`: change `design/ismos/tokens.json` and run `npm run ismos:tokens`.
- Copy follows ISMOS voice in all four languages (`design/ismos/docs/05-voice-and-tone.md`, `05.1-content.md`): no emoji, em dashes, exclamation marks or banned words (learners → students, certificate → record of completion, journey, empower, transform, unlock, cutting-edge…), sentence case outside labels. The checker only knows the English banned words, so review ES/PT/CA by hand.
- Legal pages (privacy, terms, code of conduct) link to `ismos.xyz`. Copyright holder is ISMOS.
- Before finishing UI work: `npm run ismos:check` and `npm run test:ismos` must pass. Check light and dark (Hacker) mode, at 360 px and desktop.
