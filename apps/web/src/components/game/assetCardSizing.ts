import { cardWidthDetail } from "./cardSizes";

/** Resource cube icon on asset card cost rail (smallest in-product use on the hand size). */
export function assetCardCostCubeSize(widthPx: number): number {
  const compact = widthPx < 140;
  return compact ? 16 : Math.min(26, Math.round(widthPx * 0.11));
}

/** Effect-area cargo slot (outer box); fits a {@link assetCardCostCubeSize} cube inside the border. */
export function assetCardCargoSlotOuterSize(widthPx: number): number {
  const cube = assetCardCostCubeSize(widthPx);
  const compact = widthPx < 140;
  return cube + (compact ? 6 : 8);
}

/** Attack die glyph size in card footers / meta bars (S1 `AssetCard`, enemy ships). */
export function assetCardAttackDieSize(widthPx: number): number {
  const compact = widthPx < 140;
  const detail = widthPx >= cardWidthDetail;
  if (compact) {
    return 9;
  }
  if (detail) {
    return Math.min(17, Math.round(widthPx * 0.075));
  }
  return Math.min(14, Math.round(widthPx * 0.06));
}