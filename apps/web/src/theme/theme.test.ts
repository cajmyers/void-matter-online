import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const here = dirname(fileURLToPath(import.meta.url));
const css = readFileSync(join(here, "theme.css"), "utf8");

describe("theme.css", () => {
  const defined = new Set<string>();
  for (const match of css.matchAll(/^\s*(--[a-z0-9-]+)\s*:/gm)) defined.add(match[1] ?? "");

  it("defines a full token set", () => {
    expect(defined.size).toBeGreaterThan(50);
  });

  it("only references variables that are defined in the file", () => {
    const used = new Set<string>();
    for (const match of css.matchAll(/var\((--[a-z0-9-]+)/g)) used.add(match[1] ?? "");
    const undefinedNames = [...used].filter((name) => !defined.has(name));
    expect(undefinedNames).toEqual([]);
  });

  it("has a single theme: no data-theme blocks remain", () => {
    expect(css).not.toContain("[data-theme");
  });
});
