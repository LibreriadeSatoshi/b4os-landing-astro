import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const generated = [
  "css/tokens.css",
  "css/fonts.css",
  "css/fonts.public.css",
  "css/typography.css",
  "css/ismos.css",
  "tailwind/theme.css",
  "js/tokens.ts",
];

test("build-tokens reproduces every generated file without dependencies", () => {
  const dir = mkdtempSync(join(tmpdir(), "ismos-build-"));
  try {
    mkdirSync(join(dir, "scripts"), { recursive: true });
    cpSync(join(root, "design"), join(dir, "design"), { recursive: true });
    cpSync(
      join(root, "scripts/build-tokens.mjs"),
      join(dir, "scripts/build-tokens.mjs")
    );
    const result = spawnSync(
      process.execPath,
      [join(dir, "scripts/build-tokens.mjs")],
      {
        cwd: dir,
        encoding: "utf8",
      }
    );
    assert.equal(result.status, 0, `${result.stdout}${result.stderr}`);
    for (const file of generated) {
      assert.equal(
        readFileSync(join(dir, "design/ismos", file), "utf8"),
        readFileSync(join(root, "design/ismos", file), "utf8"),
        `${file} is stale`
      );
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("the theme closes default Tailwind values and keeps token utilities", () => {
  const theme = readFileSync(
    join(root, "design/ismos/tailwind/theme.css"),
    "utf8"
  );
  assert.match(theme, /--\*: initial;/);
  assert.match(theme, /--spacing-16: 16px;/);
  assert.match(theme, /--container-content: 1200px;/);
  assert.match(theme, /@utility z-modal \{ z-index: var\(--z-modal\); \}/);
  assert.doesNotMatch(theme, /--z-index-/);
});

test("component regressions stay fixed", () => {
  const css = readFileSync(
    join(root, "design/ismos/css/components.css"),
    "utf8"
  );
  assert.match(css, /\.ism-root a\.ism-btn, \.ism-root a\.ism-btn:hover/);
  assert.match(
    css,
    /:root\[data-theme="hacker"\] \.ism-card \{ background: var\(--surface-raised\); \}/
  );
  assert.match(
    css,
    /:root:not\(\[data-theme="light"\]\) \.ism-card \{ background: var\(--surface-raised\); \}/
  );

  const textField = readFileSync(
    join(root, "design/ismos/docs/components/TextField.md"),
    "utf8"
  );
  assert.match(textField, /1\.5 px `border-input`/);
});
