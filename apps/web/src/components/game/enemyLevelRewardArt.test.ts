import { describe, expect, it } from "vitest";
import { enemyLevelRewardArt, enemyLevelRewardArtAspectHeightOverWidth } from "./enemyLevelRewardArt";

describe("enemyLevelRewardArt", () => {
  it("maps each tier to distinct bundled art", () => {
    const one = enemyLevelRewardArt(1);
    const two = enemyLevelRewardArt(2);
    const three = enemyLevelRewardArt(3);
    expect(one).toBeTruthy();
    expect(two).toBeTruthy();
    expect(three).toBeTruthy();
    expect(new Set([one, two, three]).size).toBe(3);
  });

  it("uses owner asset aspect ratio for layout", () => {
    expect(enemyLevelRewardArtAspectHeightOverWidth).toBeCloseTo(718 / 952, 5);
  });
});