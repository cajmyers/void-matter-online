import { describe, expect, it } from "vitest";
import { enemyCardFaceTexture } from "./assetCardArt";

describe("enemyCardFaceTexture", () => {
  it("loads owner face stock per faction", () => {
    expect(enemyCardFaceTexture("iron-syndicate")).toMatch(/enemy\/fronts\/iron-texture\.webp/);
    expect(enemyCardFaceTexture("prism-ascendancy")).toMatch(/enemy\/fronts\/prism-texture\.webp/);
    expect(enemyCardFaceTexture("the-hive")).toMatch(/enemy\/fronts\/hive-texture\.webp/);
  });
});