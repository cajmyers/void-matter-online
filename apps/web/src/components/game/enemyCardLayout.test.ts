import { describe, expect, it } from "vitest";
import { cardWidthDetail, cardWidthHand } from "./cardSizes";
import {
  enemyCardArtPlateMinHeightPx,
  enemyCardFooterReserveHeight,
  enemyCardHullSlotSizePx,
  enemyCardLevelIconDetailHeightPx,
  enemyCardLevelIconHeightPx,
  enemyCardLevelIconWidthPx,
  enemyCardRegionHeights,
} from "./enemyCardLayout";
import { assetCardCostCubeSize } from "./assetCardSizing";

describe("enemyCardRegionHeights", () => {
  it("uses a flex art band with a small minimum; rules text is content-sized in CSS", () => {
    const detail = enemyCardRegionHeights(cardWidthDetail);
    expect(detail.artPlateMinHeight).toBe(enemyCardArtPlateMinHeightPx(cardWidthDetail));
  });

  it("hides rules and art minimum at hand width", () => {
    const hand = enemyCardRegionHeights(cardWidthHand);
    expect(hand.compact).toBe(true);
    expect(hand.artPlateMinHeight).toBe(0);
    expect(hand.footerReserveHeight).toBe(0);
  });

  it("sizes level icons like cost cubes except larger at detail width", () => {
    expect(enemyCardLevelIconHeightPx(cardWidthHand)).toBe(assetCardCostCubeSize(cardWidthHand));
    expect(enemyCardLevelIconHeightPx(cardWidthDetail)).toBeGreaterThan(assetCardCostCubeSize(cardWidthDetail));
    expect(enemyCardLevelIconHeightPx(cardWidthDetail)).toBe(enemyCardLevelIconDetailHeightPx);
    expect(enemyCardLevelIconWidthPx(cardWidthDetail)).toBeGreaterThan(enemyCardLevelIconHeightPx(cardWidthDetail));
    expect(enemyCardFooterReserveHeight(cardWidthDetail)).toBe(0);
  });

  it("omits hull slot boxes at hand width", () => {
    expect(enemyCardHullSlotSizePx(cardWidthHand)).toBe(0);
    expect(enemyCardHullSlotSizePx(156)).toBe(14);
    expect(enemyCardHullSlotSizePx(cardWidthDetail)).toBe(18);
  });
});