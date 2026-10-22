#!/usr/bin/env node
// Builds CSS variables, Tailwind v4 theme and a TS export from design/ismos/tokens.json.
// Zero dependencies. Run: node scripts/build-tokens.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "design",
  "ismos"
);
const t = JSON.parse(readFileSync(join(ROOT, "tokens.json"), "utf8"));
const HEADER =
  "/* GENERATED from design/ismos/tokens.json by scripts/build-tokens.mjs. Do not edit by hand. */\n";
const write = (rel, s) => {
  const p = join(ROOT, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, s);
  console.log("wrote", rel);
};

// ---------- colours ----------
const ref = v =>
  typeof v === "string" && /^\{.+\}$/.test(v) ? `var(--${v.slice(1, -1)})` : v;
const primitives = t.color.tokens.filter(c => typeof c.value === "string");
const semantic = t.color.tokens.filter(c => typeof c.value === "object");
const hexOf = name => {
  const c = primitives.find(p => p.name === name);
  return c && (/^\{/.test(c.value) ? hexOf(c.value.slice(1, -1)) : c.value);
};

const primVars = primitives
  .map(c => `  --${c.name}: ${ref(c.value)};`)
  .join("\n");
const semVars = theme =>
  semantic.map(c => `  --${c.name}: ${ref(c.value[theme])};`).join("\n");

// ---------- scalar groups ----------
const scalar = group =>
  t[group].tokens.map(x => `  --${x.name}: ${x.value};`).join("\n");
const fam = t.type.families;

const tokensCss = `${HEADER}
:root {
  color-scheme: light;
  /* Primitives: exact brand hex values */
${primVars}

  /* Semantic roles: light (default) */
${semVars("light")}

  /* Type families */
  --font-serif: ${fam.serif};
  --font-sans: ${fam.sans};
  --font-mono: ${fam.mono};
  --font-wordmark: ${fam.wordmark};

  /* Spacing (nine values + optical 2px) */
${scalar("spacing")}

  /* Radius */
${scalar("radius")}

  /* Rules */
${scalar("border")}

  /* Shadows */
${scalar("shadow")}

  /* Opacity */
${scalar("opacity")}

  /* Z-index */
${scalar("zIndex")}

  /* Motion */
${scalar("transition")}

  /* Sizes */
${scalar("size")}

  /* Layout */
${scalar("layout")}
}

/* Hacker mode: explicit */
:root[data-theme="hacker"] {
  color-scheme: dark;
${semVars("hacker")}
}

/* Hacker mode: follow the device unless the user forced light */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    color-scheme: dark;
${semVars("hacker").replace(/^ {2}/gm, "    ")}
  }
}

/* Reduced motion: every duration to 0 */
@media (prefers-reduced-motion: reduce) {
  :root { --motion-fast: 0ms; --motion-base: 0ms; --motion-slow: 0ms; }
}
`;
write("css/tokens.css", tokensCss);

// ---------- fonts ----------
const fontsCss =
  HEADER +
  t.type.fonts
    .map(
      f => `@font-face {
  font-family: "${f.family}";
  src: url("../${f.file}") format("woff2");
  font-weight: ${f.weight};
  font-style: ${f.style};
  font-display: swap;
}`
    )
    .join("\n") +
  "\n";
write("css/fonts.css", fontsCss);
// Variant with absolute URLs for bundlers that do not rebase url() inside @import (e.g. Tailwind CLI, plain PostCSS).
// Copy design/ismos/fonts/* to public/fonts/ismos/ and import fonts.public.css instead of fonts.css.
write(
  "css/fonts.public.css",
  fontsCss.replace(/url\("\.\.\/fonts\//g, 'url("/fonts/ismos/')
);

// ---------- typography classes ----------
const mobile = { display: "32px", h1: "27px" };
const famVar = f => `var(--font-${f})`;
const typeRules = [];
for (const g of t.type.groups) {
  if (g.name === "Guide document") continue; // print guide scale, not for product UI
  for (const s of g.styles) {
    const f = s.family || g.family;
    const lines = [
      `font-family: ${famVar(f)};`,
      `font-size: ${s.fontSize};`,
      `line-height: ${s.lineHeight};`,
      `font-weight: ${s.fontWeight};`,
    ];
    if (s.letterSpacing)
      lines.push(
        `letter-spacing: ${s.letterSpacing};`,
        "text-transform: uppercase;"
      );
    if (s.name === "figure") lines.push("font-variant-numeric: tabular-nums;");
    if (f === "serif") lines.push("text-wrap: balance;");
    if (s.name === "body" || s.name === "lead")
      lines.push("text-wrap: pretty;");
    typeRules.push(`.ism-t-${s.name} { ${lines.join(" ")} }`);
    if (mobile[s.name])
      typeRules.push(
        `@media (max-width: 639px) { .ism-t-${s.name} { font-size: ${mobile[s.name]}; line-height: 1.15; } }`
      );
  }
}
const typographyCss = `${HEADER}
/* Type scale classes. Title faces: Literata (serif). UI/text: IBM Plex Sans. Labels/figures: IBM Plex Mono.
   .ism-t-wordmark exists only to document the proportions: PLACE the lockup artwork, never typeset it. */
${typeRules.join("\n")}

/* CJK / Devanagari / Bengali: more leading, never letterspaced or uppercased */
:is(:lang(zh), :lang(ja), :lang(hi), :lang(bn)) .ism-t-body { line-height: 30px; }
:is(:lang(zh), :lang(ja), :lang(hi), :lang(bn)) :is(.ism-t-label, .ism-label) { letter-spacing: 0; text-transform: none; }
`;
write("css/typography.css", typographyCss);

// ---------- Tailwind v4 theme ----------
const px = s => s;
const twColors = [
  ...primitives.map(
    c =>
      `  --color-${c.name}: ${/^\{/.test(c.value) ? hexOf(c.value.slice(1, -1)) : c.value};`
  ),
].join("\n");
const twSemantic = semantic
  .map(c => `  --color-${c.name}: var(--${c.name});`)
  .join("\n");
const twSpacing = t.spacing.tokens
  .map(s => `  --spacing-${s.name.replace("space-", "")}: ${px(s.value)};`)
  .join("\n");
const twRadius = t.radius.tokens
  .map(r => `  --radius-${r.name.replace("radius-", "")}: ${r.value};`)
  .join("\n");
const twShadow = t.shadow.tokens
  .map(s => `  --shadow-${s.name.replace("shadow-", "")}: ${s.value};`)
  .join("\n");
const twBp = t.breakpoint.tokens
  .filter(b => b.value !== "0px")
  .map(b => `  --breakpoint-${b.name.replace("bp-", "")}: ${b.value};`)
  .join("\n");
const twText = t.type.groups
  .filter(g => g.name !== "Guide document" && g.name !== "Wordmark")
  .flatMap(g => g.styles)
  .map(
    s =>
      `  --text-${s.name}: ${s.fontSize};\n  --text-${s.name}--line-height: ${s.lineHeight};\n  --text-${s.name}--font-weight: ${s.fontWeight};` +
      (s.letterSpacing
        ? `\n  --text-${s.name}--letter-spacing: ${s.letterSpacing};`
        : "")
  )
  .join("\n");
const twZ = t.zIndex.tokens
  .map(
    z => `@utility z-${z.name.replace("z-", "")} { z-index: var(--${z.name}); }`
  )
  .join("\n");
const layout = name => t.layout.tokens.find(x => x.name === name).value;

const twCss = `${HEADER}
/* Tailwind CSS v4 theme for ISMOS.
   Usage (e.g. src/styles/global.css):
     @import "tailwindcss";
     @import "../../design/ismos/css/ismos.css";       (tokens, fonts, typography, components)
     @import "../../design/ismos/tailwind/theme.css";
   Defaults are wiped (\`--*: initial\`) so theme-driven utilities only use ISMOS values:
   p-16 = 16px, rounded-4 = 4px, and semantic colours follow light / hacker mode at runtime.
   Arbitrary values remain a Tailwind feature; scripts/check-ismos.mjs rejects off-scale usage. */

@theme {
  --*: initial;

  /* Primitives (exact hex) */
  --color-transparent: transparent;
  --color-current: currentColor;
${twColors}

  /* Spacing: p-4 p-8 p-12 p-16 p-24 p-32 p-48 p-64 p-96 (px). p-2 = optical only. */
${twSpacing}

  /* Radius: rounded-0 rounded-4 rounded-8 rounded-circle */
${twRadius}

  /* Shadows: shadow-float shadow-modal */
${twShadow}

  /* Breakpoints: md 640, lg 1024, xl 1280 (mobile first) */
${twBp}

  /* Type scale: text-display text-h1 ... text-label text-figure */
${twText}

  --font-serif: ${fam.serif};
  --font-sans: ${fam.sans};
  --font-mono: ${fam.mono};
  --font-wordmark: ${fam.wordmark};

  --container-content: ${layout("content-max")};
  --container-reading: ${layout("reading-column")};
}

/* Semantic roles resolve at runtime so data-theme="hacker" flips them */
@theme inline {
${twSemantic}
}

/* Rule weights: border-1 border-2, and the 6px bar */
@utility border-1 { border-width: var(--rule-1); }
@utility border-2 { border-width: var(--rule-2); }
@utility h-bar { height: var(--rule-6); }
@utility min-h-tap { min-height: var(--tap-target); }
${twZ}
`;
write("tailwind/theme.css", twCss);

// ---------- TS export ----------
const tsObj = {
  color: Object.fromEntries(
    primitives.map(c => [
      c.name,
      /^\{/.test(c.value) ? hexOf(c.value.slice(1, -1)) : c.value,
    ])
  ),
  semantic: Object.fromEntries(
    semantic.map(c => [
      c.name,
      { light: c.value.light, hacker: c.value.hacker },
    ])
  ),
  font: fam,
  space: Object.fromEntries(t.spacing.tokens.map(s => [s.name, s.value])),
  radius: Object.fromEntries(t.radius.tokens.map(s => [s.name, s.value])),
  shadow: Object.fromEntries(t.shadow.tokens.map(s => [s.name, s.value])),
  breakpoint: Object.fromEntries(
    t.breakpoint.tokens.map(s => [s.name, s.value])
  ),
  layout: Object.fromEntries(t.layout.tokens.map(s => [s.name, s.value])),
};
write(
  "js/tokens.ts",
  `// GENERATED from design/ismos/tokens.json. Do not edit by hand.\n// For non-CSS contexts (emails, canvas, OG images, React Native). In CSS use the variables.\nexport const ismos = ${JSON.stringify(tsObj, null, 2)} as const;\nexport type IsmosColor = keyof typeof ismos.color;\n`
);

// ---------- entry point ----------
write(
  "css/ismos.css",
  `${HEADER}@import "./fonts.css";\n@import "./tokens.css";\n@import "./typography.css";\n@import "./components.css";\n`
);
