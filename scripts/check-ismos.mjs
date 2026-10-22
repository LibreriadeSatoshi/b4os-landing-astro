#!/usr/bin/env node
// ISMOS design-system guard. Zero dependencies.
// Usage: node scripts/check-ismos.mjs [dir ...]   (default: src)
// Exit code 1 on violations and 2 on unreadable paths, so it can gate CI / a pre-commit hook.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname, relative } from "node:path";

const roots = process.argv.slice(2).length ? process.argv.slice(2) : ["src"];
const CODE = new Set([
  ".css",
  ".scss",
  ".astro",
  ".html",
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".vue",
  ".svelte",
  ".mdx",
]);
const COPY = new Set([
  ".astro",
  ".html",
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".vue",
  ".svelte",
  ".md",
  ".mdx",
  ".json",
  ".yml",
  ".yaml",
]);
const SKIP =
  /(?:^|[\\/])(?:node_modules|dist|\.git|\.astro)(?:[\\/]|$)|(?:^|[\\/])design[\\/]ismos(?:[\\/]|$)/;

const tokens = JSON.parse(
  readFileSync(new URL("../design/ismos/tokens.json", import.meta.url))
);
const PALETTE = new Set(
  tokens.color.tokens
    .filter(c => /^#/.test(c.value))
    .map(c => c.value.toUpperCase())
);
const SPACING = new Set([
  0,
  ...tokens.spacing.tokens.map(s => Number.parseFloat(s.value)),
]);
const RADII = new Set([0, 4, 8]);

// Words and icons the guide forbids (05, 05.1, 08). Case-insensitive, whole words.
const BANNED_WORDS = [
  "certificate",
  "diploma",
  "empower",
  "empowers",
  "empowering",
  "journey",
  "transform",
  "transforms",
  "transformed",
  "transformative",
  "world-class",
  "unlock",
  "unlocks",
  "seamless",
  "seamlessly",
  "leverage",
  "the underserved",
  "learners",
  "users",
];
const BANNED_ICONS = [
  "graduation-cap",
  "trophy",
  "medal",
  "crown",
  "star",
  "rocket",
];
const BANNED_ICON_COMPONENTS = [
  "GraduationCap",
  "Trophy",
  "Medal",
  "Crown",
  "Star",
  "Rocket",
];
const NAMED_COLOURS = [
  "red",
  "blue",
  "green",
  "yellow",
  "orange",
  "purple",
  "pink",
  "black",
  "white",
  "gray",
  "grey",
  "rebeccapurple",
].join("|");
const TW_SPACING = String.raw`-?(?:m[trblxyse]?|p(?:x|y|t|r|b|l|s|e|bs|be)?|gap(?:-[xy])?|space-[xy]|inset(?:-[xy])?|top|right|bottom|left|start|end)`;
const numericLengths = value => [
  ...value.matchAll(/(-?\d+(?:\.\d+)?)(px|rem|em)\b/g),
];
const spacingMessage = `Spacing must use ${[...SPACING].sort((a, b) => a - b).join(" ")} px or a spacing token.`;

const rules = [
  {
    id: "gradient",
    re: /(linear|radial|conic)-gradient\(/g,
    on: CODE,
    msg: "No gradients (04 Rules).",
  },
  {
    id: "hex",
    re: /#[0-9a-fA-F]{3,4}\b|#[0-9a-fA-F]{6}(?:[0-9a-fA-F]{2})?\b/g,
    on: CODE,
    test: m => !PALETTE.has(normHex(m)),
    msg: "Hex not in the ISMOS palette. Use a token or a Tailwind theme colour.",
  },
  {
    id: "colour-function",
    re: /\b(?:rgba?|hsla?)\(\s*[-\d.]/gi,
    on: CODE,
    msg: "Hardcoded colour function. Use an ISMOS token.",
  },
  {
    id: "named-colour",
    re: new RegExp(
      String.raw`\b(?:color|background(?:-color)?|border(?:-[\w-]+)?|fill|stroke):\s*(?:${NAMED_COLOURS})\b`,
      "gi"
    ),
    on: CODE,
    msg: "Named CSS colour. Use an ISMOS token.",
  },
  {
    id: "tw-arbitrary-colour",
    re: new RegExp(
      String.raw`\b(?:text|bg|border|fill|stroke)-\[(?:${NAMED_COLOURS})\]`,
      "gi"
    ),
    on: CODE,
    msg: "Arbitrary colour. Use a Tailwind theme colour.",
  },
  {
    id: "radius",
    re: /(?<![\w-])border(?:-[\w-]+)?-radius:\s*([^;}{]+)/g,
    on: CODE,
    test: (_, value) =>
      numericLengths(value).some(
        x => x[2] !== "px" || !RADII.has(Math.abs(+x[1]))
      ),
    msg: "Radius must be 0, 4 or 8 px (radius-circle for avatars only).",
  },
  {
    id: "tw-rounded",
    re: /\brounded(?:-[trblse]{1,2})?-(?:none|xs|sm|md|lg|xl|2xl|3xl|4xl|full)\b/g,
    on: CODE,
    msg: "No pills or Tailwind default radii. Use rounded-0 / rounded-4 / rounded-8.",
  },
  {
    id: "tw-rounded-arbitrary",
    re: /\brounded(?:-[trblse]{1,2})?-\[[^\]]+\]/g,
    on: CODE,
    msg: "No arbitrary radii. Use rounded-0 / rounded-4 / rounded-8.",
  },
  {
    id: "tw-rounded-bare",
    re: /(?<![\w-])rounded\b(?![-\w])/g,
    on: CODE,
    msg: "No Tailwind default radius. Use rounded-0 / rounded-4 / rounded-8.",
  },
  {
    id: "spacing",
    re: /(?<![\w-])(?:margin|padding|gap|row-gap|column-gap|inset|top|left|right|bottom)(?:-(?:inline|block|top|left|right|bottom|start|end)){0,2}:\s*([^;}{]+)/g,
    on: CODE,
    test: (_, value) =>
      numericLengths(value).some(
        x => x[2] !== "px" || !SPACING.has(Math.abs(+x[1]))
      ),
    msg: spacingMessage,
  },
  {
    id: "tw-spacing",
    re: new RegExp(
      String.raw`(?<![\w-])${TW_SPACING}-(\d+(?:\.\d+)?)(?![\w-])`,
      "g"
    ),
    on: CODE,
    test: (_, value) => !SPACING.has(Math.abs(+value)),
    msg: spacingMessage,
  },
  {
    id: "tw-spacing-arbitrary",
    re: new RegExp(String.raw`(?<![\w-])${TW_SPACING}-\[[^\]]+\]`, "g"),
    on: CODE,
    msg: "No arbitrary spacing. Use the numeric ISMOS scale or a spacing token.",
  },
  {
    id: "tw-spacing-px",
    re: new RegExp(String.raw`(?<![\w-])${TW_SPACING}-px\b`, "g"),
    on: CODE,
    msg: spacingMessage,
  },
  {
    id: "shadow",
    re: /box-shadow:\s*([^;}{]+)/g,
    on: CODE,
    test: (_, value) =>
      !/^(?:none|var\(--shadow-(?:float|modal)\)|(?:inset\s+)?0 0 0 1px\s+var\(--(?:hairline|logwood-700|logwood-400)\))$/.test(
        value.trim()
      ),
    msg: "Only shadow-float / shadow-modal or a one-pixel token hairline.",
  },
  {
    id: "tw-shadow",
    re: /\b(?:shadow-(?:2xs|xs|sm|md|lg|xl|2xl)|shadow-\[[^\]]+\]|inset-shadow-(?:2xs|xs|sm|md|lg|xl|2xl)|inset-shadow-\[[^\]]+\])/g,
    on: CODE,
    msg: "Only shadow-float / shadow-modal.",
  },
  {
    id: "tw-shadow-bare",
    re: /(?<![\w-])shadow\b(?![-\w])/g,
    on: CODE,
    msg: "Only shadow-float / shadow-modal.",
  },
  {
    id: "tw-drop-shadow",
    re: /\bdrop-shadow(?:-[\w-]+|-\[[^\]]+\])?\b/g,
    on: CODE,
    msg: "No drop shadows.",
  },
  {
    id: "all-caps-heading",
    re: /<h[1-6]\b[^>]*\bclass(?:Name)?\s*=\s*(?:"[^"]*\buppercase\b[^"]*"|'[^']*\buppercase\b[^']*'|\{[^}]*\buppercase\b[^}]*\})/g,
    on: CODE,
    msg: "No all-caps headings. Uppercase is for the Plex Mono label only.",
  },
  {
    id: "emoji",
    re: /\p{Extended_Pictographic}/gu,
    on: COPY,
    msg: "No emoji, anywhere.",
  },
  {
    id: "em-dash",
    re: /—/g,
    on: COPY,
    msg: "No em dashes in copy (05.1 Mechanics).",
  },
  {
    id: "banned-icon",
    re: new RegExp(
      `\\b(?:iconoir[/-]|icon[=:"' ]+)(${BANNED_ICONS.join("|")})\\b`,
      "g"
    ),
    on: CODE,
    msg: "Forbidden icon.",
  },
  {
    id: "banned-icon-tag",
    re: new RegExp(
      String.raw`</?\s*(?:${BANNED_ICON_COMPONENTS.join("|")})(?=[\s/>])`,
      "g"
    ),
    on: CODE,
    msg: "Forbidden icon component.",
  },
  {
    id: "banned-icon-import",
    re: /import\s+{([^}]+)}\s+from\s+['"](?:lucide-react|iconoir-react)['"]/g,
    on: CODE,
    test: (_, names) =>
      new RegExp(`\\b(?:${BANNED_ICON_COMPONENTS.join("|")})\\b`).test(names),
    msg: "Forbidden icon import.",
  },
  {
    id: "banned-word",
    re: new RegExp(
      `(?<![\\w-])(${BANNED_WORDS.map(w => w.replace("-", "\\-")).join("|")})(?![\\w-])`,
      "gi"
    ),
    on: COPY,
    textOnly: true,
    msg: "Banned word (05 Voice / 08 Production).",
  },
  {
    id: "exclamation",
    re: />[^<{}]*\w![^<{}=]*</g,
    on: new Set([".astro", ".html", ".jsx", ".tsx", ".vue", ".svelte"]),
    msg: "No exclamation marks in interface copy.",
  },
];

const normHex = h =>
  (h.length === 4
    ? "#" + [...h.slice(1)].map(c => c + c).join("")
    : h
  ).toUpperCase();

// Strip code-ish regions for copy checks: imports, attributes like class="", identifiers.
const visibleText = (src, ext) => {
  if (ext === ".json" || ext === ".yml" || ext === ".yaml")
    return src.replace(/"[\w.-]+"\s*:/g, "").replace(/^\s*[\w.-]+:/gm, "");
  return src
    .replace(/^---[\s\S]*?---/m, "")
    .replace(/<script[\s\S]*?<\/script>/g, "")
    .replace(/<style[\s\S]*?<\/style>/g, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\{[^}]*\}/g, " ");
};

let count = 0;
let errors = 0;
const walk = p => {
  if (SKIP.test(p)) return;
  let st;
  try {
    st = statSync(p);
  } catch {
    console.error(
      `${relative(process.cwd(), p)}: path not found or unreadable`
    );
    errors++;
    return;
  }
  if (st.isDirectory()) {
    try {
      readdirSync(p).forEach(f => walk(join(p, f)));
    } catch {
      console.error(`${relative(process.cwd(), p)}: directory unreadable`);
      errors++;
    }
    return;
  }
  const ext = extname(p);
  if (!CODE.has(ext) && !COPY.has(ext)) return;
  let raw;
  try {
    raw = readFileSync(p, "utf8");
  } catch {
    console.error(`${relative(process.cwd(), p)}: file unreadable`);
    errors++;
    return;
  }
  if (
    /^\/\*! tailwindcss|\.min\.(css|js)$/.test(raw.slice(0, 40)) ||
    /\.min\./.test(p)
  )
    return;
  for (const r of rules) {
    if (!r.on.has(ext)) continue;
    const src = r.textOnly ? visibleText(raw, ext) : raw;
    for (const m of src.matchAll(r.re)) {
      if (r.test && !r.test(m[0], m[1])) continue;
      const line = r.textOnly ? "?" : raw.slice(0, m.index).split("\n").length;
      console.log(
        `${relative(process.cwd(), p)}:${line}  [${r.id}] ${r.msg}  → ${m[0].trim().slice(0, 60)}`
      );
      count++;
    }
  }
};
roots.forEach(walk);
if (count) {
  console.log(`\n${count} ISMOS violation(s).`);
  process.exitCode = 1;
}
if (errors) {
  console.error(`\n${errors} path/read error(s).`);
  process.exitCode = 2;
}
if (!count && !errors) console.log("ISMOS check passed.");
