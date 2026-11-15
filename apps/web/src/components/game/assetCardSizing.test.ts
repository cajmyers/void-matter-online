import { describe, expect, it } from "vitest";
import { assetCardCargoSlotOuterSize, assetCardCostCubeSize } from "./assetCardSizing";
import { cardWidthDetail, cardWidthHand } from "./cardSizes";

describe("assetCardSizing", () => {
  it("uses 16px cost cubes on hand cards (smallest asset-card cube)", () => {
    expect(assetCardCostCubeSize(cardWidthHand)).toBe(16);
  });

  it("sizes cargo slots large enough for the cost cube at hand and detail widths", () => {
    for (const width of [cardWidthHand, cardWidthDetail, 156]) {
      const cube = assetCardCostCubeSize(width);
      const outer = assetCardCargoSlotOuterSize(width);
      const compact = width < 140;
      const border = compact ? 1 : 1.5;
      const pad = compact ? 1 : 2;
      const inner = outer - 2 * border - 2 * pad;
      expect(inner, `width ${width}`).toBeGreaterThanOrEqual(cube);
    }
  });
});