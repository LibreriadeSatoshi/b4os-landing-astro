import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const checker = fileURLToPath(new URL("./check-ismos.mjs", import.meta.url));

function check(files, getRoots) {
  const dir = mkdtempSync(join(tmpdir(), "ismos-check-"));
  try {
    for (const [name, content] of Object.entries(files)) {
      const path = join(dir, name);
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path, content);
    }
    const roots = getRoots
      ? getRoots(dir)
      : Object.keys(files).map(name => join(dir, name));
    const result = spawnSync(process.execPath, [checker, ...roots], {
      cwd: dir,
      encoding: "utf8",
    });
    return {
      status: result.status,
      output: `${result.stdout}${result.stderr}`,
    };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

function expectViolations(result, ids) {
  assert.equal(result.status, 1, result.output);
  for (const id of ids)
    assert.match(
      result.output,
      new RegExp(`\\[${id}\\]`),
      `Missing ${id}:\n${result.output}`
    );
}

test("accepts token-driven utilities, palette colours and valid copy", () => {
  const result = check({
    "valid.tsx": `export const View = () => <div className="p-16 mt-4 rounded-4 shadow-float text-text bg-surface"><span className="ism-avatar rounded-circle">IS</span><span className="mx-auto shadow-none">Hola</span></div>;`,
    "valid.css": `.ok { color: #4D01E0; border-radius: 4px; margin: 16px; box-shadow: var(--shadow-modal); }`,
  });
  assert.equal(result.status, 0, result.output);
  assert.match(result.output, /ISMOS check passed/);
});

test("fails instead of passing when an input path does not exist", () => {
  const result = check({}, dir => [join(dir, "missing")]);
  assert.equal(result.status, 2, result.output);
  assert.match(result.output, /path not found or unreadable/);
});

test("rejects the escape cases found during the kit review", () => {
  const result = check({
    "probe.tsx": `import { Star } from "lucide-react";
export function Probe() {
  return <div className="mt-6 p-[13px] rounded-[999px] shadow-lg text-[red]">
    <span style={{ color: "#12345678", background: "rgb(1, 2, 3)", padding: "6px" }}>Texto de prueba</span>
    <Star />
  </div>;
}`,
  });
  expectViolations(result, [
    "tw-spacing",
    "tw-spacing-arbitrary",
    "tw-rounded-arbitrary",
    "tw-shadow",
    "tw-arbitrary-colour",
    "hex",
    "colour-function",
    "spacing",
    "banned-icon-import",
    "banned-icon-tag",
  ]);
});

test("rejects off-scale CSS, gradients and unauthorised shadows", () => {
  const result = check({
    "bad.css": `.bad { background: linear-gradient(red, blue); color: red; border-radius: 12px; margin: 6px; box-shadow: 0 4px 8px #123456; }`,
  });
  expectViolations(result, [
    "gradient",
    "named-colour",
    "radius",
    "spacing",
    "shadow",
    "hex",
  ]);
});

test("rejects default Tailwind scales, including responsive and negative utilities", () => {
  const result = check({
    "bad.tsx": `export const View = () => <div className="p-5 md:gap-6 -mt-3 rounded-t-full shadow-md" />;`,
  });
  expectViolations(result, ["tw-spacing", "tw-rounded", "tw-shadow"]);
});

test("checks visible copy, heading case and icon imports", () => {
  const result = check({
    "copy.tsx": `import { Rocket } from "iconoir-react";
export const View = () => <h2 className="uppercase">Users!</h2>;`,
  });
  expectViolations(result, [
    "banned-icon-import",
    "all-caps-heading",
    "banned-word",
    "exclamation",
  ]);
});

test("checks emoji and em dashes in TypeScript copy", () => {
  const result = check({
    "copy.ts": `export const message = "Hello — world 🚀";`,
  });
  expectViolations(result, ["em-dash", "emoji"]);
});
