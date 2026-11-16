import { describe, expect, it } from "vitest";
import { enemyDeckBackArt } from "./enemyDeckBackArt";

describe("enemyDeckBackArt", () => {
  it("loads owner enemy deck back", () => {
    expect(enemyDeckBackArt()).toMatch(/enemy\/back\/enemy\.webp/);
  });
});