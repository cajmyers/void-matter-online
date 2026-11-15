import { describe, expect, it } from "vitest";
import { cardWidthDetail, cardWidthHand } from "./cardSizes";
import {
  assetCardArtPlateHeight,
  assetCardBottomInsetPx,
  assetCardFooterReserveHeight,
  assetCardRegionHeights,
  assetCardTextBlockHeight,
} from "./assetCardLayout";

describe("assetCardLayout", () => {
  it("scales fixed regions with card width", () => {
    expect(assetCardArtPlateHeight(cardWidthHand)).toBe(68);
    expect(assetCardArtPlateHeight(cardWidthDetail)).toBe(114);
    expect(assetCardTextBlockHeight(cardWidthDetail)).toBe(92);
    expect(assetCardFooterReserveHeight(cardWidthHand)).toBe(48);
    expect(assetCardFooterReserveHeight(cardWidthDetail)).toBe(52);
  });

  it("gives S2 inspect cards more text and a shorter footer", () => {
    expect(assetCardArtPlateHeight(cardWidthDetail, "s2")).toBe(101);
    expect(assetCardTextBlockHeight(cardWidthDetail, "s2")).toBe(110);
    expect(assetCardFooterReserveHeight(cardWidthDetail, "s2")).toBe(30);
    expect(assetCardFooterReserveHeight(cardWidthHand, "s2")).toBe(28);
  });

  it("reclaims empty effect area into text on detail cards; compact keeps the footer band", () => {
    const detailFooter = assetCardFooterReserveHeight(cardWidthDetail);
    const handFooter = assetCardFooterReserveHeight(cardWidthHand);

    const detailInset = assetCardBottomInsetPx(cardWidthDetail);
    expect(
      assetCardRegionHeights(cardWidthDetail, undefined, {
        compact: false,
        hasEffectArea: false,
        hasTextBlock: true,
      }),
    ).toEqual({
      artPlateHeight: assetCardArtPlateHeight(cardWidthDetail),
      textBlockHeight: assetCardTextBlockHeight(cardWidthDetail) + Math.max(0, detailFooter - detailInset),
      footerReserveHeight: detailInset,
    });

    expect(
      assetCardRegionHeights(cardWidthHand, undefined, {
        compact: true,
        hasEffectArea: false,
        hasTextBlock: false,
      }),
    ).toEqual({
      artPlateHeight: assetCardArtPlateHeight(cardWidthHand),
      textBlockHeight: assetCardTextBlockHeight(cardWidthHand),
      footerReserveHeight: handFooter,
    });
  });
});
