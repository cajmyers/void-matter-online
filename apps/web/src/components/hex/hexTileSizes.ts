/** Pointy-top hex circumradius passed to `HexTileBody` as `size`. */

/** Hexes on the live play table (pan/zoom can pull back when the map is larger than the viewport). */
export const hexTileSizeBoard = 70;

/** Board-scale tiles in the style specimen and component gallery (1:1 SVG, ~22px market pills). */
export const hexTileSizeGalleryBoard = 62;

/** Inspector / details pane (`implementation-plan.md` §5.2 inspect zoom). */
export const hexTileSizeDetail = 156;

export type HexTileScale = "board" | "detail";

export function hexTileSize(scale: HexTileScale, context: "play" | "gallery" = "gallery"): number {
  if (scale === "detail") return hexTileSizeDetail;
  return context === "play" ? hexTileSizeBoard : hexTileSizeGalleryBoard;
}

/**
 * Planet supply/demand pills: ~22px in SVG user space (= screen px when the tile SVG is shown at
 * intrinsic width/height). Do not CSS-shrink detail tile SVGs or pills will look wrong.
 */
export const hexTileMarketPillHeight = 22;
export const hexTileMarketPillWidth = 82;
export const hexTileMarketCubeSize = 18;
export const hexTileMarketPillPadY = (hexTileMarketPillHeight - hexTileMarketCubeSize) / 2;
export const hexTileMarketEntryTail = 12;
export const hexTileMarketFontSize = 13;
export const hexTileMarketTextOffsetX = 4;
/** Gap between the top of a market pill and the bottom of lock cubes stacked above it. */
export const hexTileMarketLockGap = 3;
/** Board pills stay ~22px; detail hexes scale up slightly for legibility. */
export const hexTileMarketPillScaleDetail = 1.15;

export interface HexTileMarketLayout {
  readonly cube: number;
  readonly pillHeight: number;
  readonly pillWidth: number;
  readonly pillPadY: number;
  readonly entryTail: number;
  readonly fontSize: number;
  readonly textOffsetX: number;
  readonly lockGap: number;
}

export function hexTileMarketLayout(hexSize: number): HexTileMarketLayout {
  const scale = hexSize >= hexTileSizeDetail ? hexTileMarketPillScaleDetail : 1;
  const pillHeight = Math.round(hexTileMarketPillHeight * scale);
  const cube = Math.round(hexTileMarketCubeSize * scale);
  return {
    cube,
    pillHeight,
    pillWidth: Math.round(hexTileMarketPillWidth * scale),
    pillPadY: (pillHeight - cube) / 2,
    entryTail: Math.round(hexTileMarketEntryTail * scale),
    fontSize: Math.round(hexTileMarketFontSize * scale),
    textOffsetX: Math.round(hexTileMarketTextOffsetX * scale),
    lockGap: Math.round(hexTileMarketLockGap * scale),
  };
}

export type HexTileMarketLockSide = "above" | "below";

function pillVerticalBounds(layout: HexTileMarketLayout) {
  const { cube, pillPadY, pillHeight } = layout;
  const pillTop = -cube / 2 - pillPadY;
  return { pillTop, pillBottom: pillTop + pillHeight };
}

/** Centre y for lock cubes stacked above or below a market pill (row-local coordinates). */
export function hexTileMarketLockStackY(layout: HexTileMarketLayout, side: HexTileMarketLockSide): number {
  const { cube, lockGap } = layout;
  const { pillTop, pillBottom } = pillVerticalBounds(layout);
  if (side === "below") return pillBottom + lockGap + cube / 2;
  return pillTop - lockGap - cube / 2;
}

/** Inset from the hex circumradius when pinning market pills to the top and bottom. */
export const hexTileMarketRimInset = 0.96;
export const hexTileMarketEdgePad = 3;
/** Extra offset from the rim toward the hex centre (both supply and demand). */
export const hexTileMarketRowInset = 22;
/** Additional inset on inspector / detail hexes only. */
export const hexTileMarketRowInsetDetailExtra = 8;

function hexTileMarketRowInsetTotal(hexSize: number): number {
  return hexTileMarketRowInset + (hexSize >= hexTileSizeDetail ? hexTileMarketRowInsetDetailExtra : 0);
}

/** Centre y for the supply row: pill sits just inside the top of the hex. */
export function hexTileMarketSupplyY(hexSize: number): number {
  const { pillHeight } = hexTileMarketLayout(hexSize);
  const rim = hexSize * hexTileMarketRimInset;
  return -rim + pillHeight / 2 + hexTileMarketEdgePad + hexTileMarketRowInsetTotal(hexSize);
}

/** Centre y for the demand row: pill sits just inside the bottom of the hex. */
export function hexTileMarketDemandY(hexSize: number): number {
  const { pillHeight } = hexTileMarketLayout(hexSize);
  const rim = hexSize * hexTileMarketRimInset;
  return rim - pillHeight / 2 - hexTileMarketEdgePad - hexTileMarketRowInsetTotal(hexSize);
}

/** Extra inset below the demand row for the Anomaly Interact / passive marker (toward the hex bottom). */
export const hexTileAnomalyAbilityExtraInset = 6;

/** Centre y for the Anomaly ability marker at the bottom of the hex. */
export function hexTileAnomalyAbilityY(hexSize: number): number {
  const scale = hexSize >= hexTileSizeDetail ? hexTileMarketPillScaleDetail : 1;
  return hexTileMarketDemandY(hexSize) + Math.round(hexTileAnomalyAbilityExtraInset * scale);
}
