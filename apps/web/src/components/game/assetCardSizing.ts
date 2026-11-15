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