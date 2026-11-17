import { cardWidthDetail } from "./cardSizes";

/** Hull damage boxes on the meta bar (hidden at hand width). */
export function shipCardHullSlotSizePx(widthPx: number): number {
  if (widthPx < 140) {
    return 0;
  }
  if (widthPx >= cardWidthDetail) {
    return 18;
  }
  return 14;
}

export function shipCardArtPlateMinHeightPx(widthPx: number): number {
  const detail = widthPx >= cardWidthDetail;
  return Math.round(widthPx * (detail ? 0.28 : 0.24));
}

export function shipUpgradeSlotMarkerSizePx(widthPx: number): number {
  const compact = widthPx < 140;
  if (compact) {
    return 26;
  }
  return Math.min(38, Math.round(widthPx * 0.19));
}

export function shipCardRegionHeights(widthPx: number): {
  readonly artPlateMinHeight: number;
  readonly compact: boolean;
  readonly detail: boolean;
} {
  const compact = widthPx < 140;
  const detail = widthPx >= cardWidthDetail;
  return {
    compact,
    detail,
    artPlateMinHeight: compact ? 0 : shipCardArtPlateMinHeightPx(widthPx),
  };
}