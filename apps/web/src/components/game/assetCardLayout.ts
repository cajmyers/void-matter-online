import { cardWidthDetail } from "./cardSizes";

/** Fixed regions on `AssetCard` (proportional to card width; print 65 × 100 mm). */

export function assetCardArtPlateHeight(widthPx: number): number {
  const ratio = widthPx >= cardWidthDetail ? 0.52 : 0.58;
  return Math.round(widthPx * ratio);
}

/** Flavour + rules panel; taller on inspect-sized cards. */
export function assetCardTextBlockHeight(widthPx: number): number {
  const ratio = widthPx >= cardWidthDetail ? 0.42 : 0.36;
  return Math.round(widthPx * ratio);
}

/** Bottom band: two lines of small type (footer stats captions). */
export function assetCardFooterReserveHeight(widthPx: number): number {
  const compact = widthPx < 140;
  const linePx = compact ? 10 : 11;
  return (linePx * 2 + 4) * 2;
}
