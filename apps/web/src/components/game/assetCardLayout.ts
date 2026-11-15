import type { SectorArtDeck } from "./assetCardArt";
import { cardWidthDetail } from "./cardSizes";

/**
 * Fixed region heights on `AssetCard` (65 × 100 mm print).
 * Maps to: image area, text box, effect area (`assetCardLayout.test.ts`).
 */

/** Image area (`artPlate`). */
export function assetCardArtPlateHeight(widthPx: number, sectorDeck?: SectorArtDeck): number {
  const detail = widthPx >= cardWidthDetail;
  let ratio = detail ? 0.52 : 0.58;
  if (sectorDeck === "s2" && detail) {
    ratio = 0.46;
  }
  return Math.round(widthPx * ratio);
}

/** Text box (`textBlock`): flavour and effect text. */
export function assetCardTextBlockHeight(widthPx: number, sectorDeck?: SectorArtDeck): number {
  const detail = widthPx >= cardWidthDetail;
  let ratio = detail ? 0.42 : 0.36;
  if (sectorDeck === "s2" && detail) {
    ratio = 0.5;
  }
  return Math.round(widthPx * ratio);
}

/** Effect area (`footerReserve`): attack dice, speed line, footer notes. */
export function assetCardFooterReserveHeight(widthPx: number, sectorDeck?: SectorArtDeck): number {
  const compact = widthPx < 140;
  const linePx = compact ? 10 : 11;
  if (sectorDeck === "s2") {
    return linePx * 2 + 8;
  }
  return (linePx * 2 + 4) * 2;
}

/** Gap at the card bottom when the effect area was reclaimed into text or image. */
export function assetCardBottomInsetPx(widthPx: number): number {
  return widthPx >= cardWidthDetail ? 8 : 6;
}

export type AssetCardRegionHeights = {
  readonly artPlateHeight: number;
  readonly textBlockHeight: number;
  readonly footerReserveHeight: number;
};

/**
 * When the effect area is unused on hand/detail cards, reclaim its height into the text box (compact always keeps the footer band).
 */
export function assetCardRegionHeights(
  widthPx: number,
  sectorDeck: SectorArtDeck | undefined,
  options: {
    readonly compact: boolean;
    readonly hasEffectArea: boolean;
    readonly hasTextBlock: boolean;
  },
): AssetCardRegionHeights {
  const artPlateHeight = assetCardArtPlateHeight(widthPx, sectorDeck);
  const textBlockHeight = assetCardTextBlockHeight(widthPx, sectorDeck);
  const footerReserveHeight = assetCardFooterReserveHeight(widthPx, sectorDeck);

  if (options.hasEffectArea || options.compact) {
    return { artPlateHeight, textBlockHeight, footerReserveHeight };
  }

  const reclaimed = footerReserveHeight;
  const bottomInset = assetCardBottomInsetPx(widthPx);
  const extra = Math.max(0, reclaimed - bottomInset);

  if (options.hasTextBlock) {
    return {
      artPlateHeight,
      textBlockHeight: textBlockHeight + extra,
      footerReserveHeight: bottomInset,
    };
  }
  return {
    artPlateHeight: artPlateHeight + extra,
    textBlockHeight,
    footerReserveHeight: bottomInset,
  };
}
