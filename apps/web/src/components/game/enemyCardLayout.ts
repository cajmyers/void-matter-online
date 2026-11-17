import { assetCardCostCubeSize } from "./assetCardSizing";
import { cardWidthDetail } from "./cardSizes";
import { enemyLevelRewardArtAspectHeightOverWidth } from "./enemyLevelRewardArt";

/** Minimum hero band; art grows with `flex` to absorb free space above content-sized rules text. */
export function enemyCardArtPlateMinHeightPx(widthPx: number): number {
  const detail = widthPx >= cardWidthDetail;
  return Math.round(widthPx * (detail ? 0.22 : 0.2));
}

/** Inspect (`cardWidthDetail`) level icon — slightly larger than sector cost cubes. */
export const enemyCardLevelIconDetailHeightPx = 30;

/** Level / reward-stack icon on the art cost rail (hand matches cost cubes; detail is larger). */
export function enemyCardLevelIconHeightPx(widthPx: number): number {
  if (widthPx >= cardWidthDetail) {
    return enemyCardLevelIconDetailHeightPx;
  }
  return assetCardCostCubeSize(widthPx);
}

export function enemyCardLevelIconWidthPx(widthPx: number): number {
  const height = enemyCardLevelIconHeightPx(widthPx);
  return Math.round(height / enemyLevelRewardArtAspectHeightOverWidth);
}

/** Hull damage boxes on the meta bar (hidden at hand width). */
export function enemyCardHullSlotSizePx(widthPx: number): number {
  if (widthPx < 140) {
    return 0;
  }
  if (widthPx >= cardWidthDetail) {
    return 18;
  }
  return 14;
}

/** No footer band: reward count reads from the art-plate cost rail (`DCK-3`). */
export function enemyCardFooterReserveHeight(_widthPx: number): number {
  return 0;
}

export function enemyCardRegionHeights(widthPx: number): {
  readonly artPlateMinHeight: number;
  readonly footerReserveHeight: number;
  readonly compact: boolean;
  readonly detail: boolean;
} {
  const compact = widthPx < 140;
  const detail = widthPx >= cardWidthDetail;
  return {
    compact,
    detail,
    artPlateMinHeight: compact ? 0 : enemyCardArtPlateMinHeightPx(widthPx),
    footerReserveHeight: enemyCardFooterReserveHeight(widthPx),
  };
}