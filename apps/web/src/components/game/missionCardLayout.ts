import { cardWidthDetail } from "./cardSizes";
import { crewCardArtPlateHeight } from "./crewCardLayout";

/** Mission rules panel — taller than crew at inspect width (longer conditions). */
export function missionCardTextBlockHeight(widthPx: number): number {
  if (widthPx < 140) {
    return 0;
  }
  const detail = widthPx >= cardWidthDetail;
  return Math.round(widthPx * (detail ? 0.42 : 0.3));
}

/** Centred VM emblem on redeemed missions (replaces corner rail). */
export function missionCardRedeemedVmSize(widthPx: number): number {
  const compact = widthPx < 140;
  const detail = widthPx >= cardWidthDetail;
  if (compact) {
    return Math.round(widthPx * 0.36);
  }
  if (detail) {
    return Math.round(widthPx * 0.28);
  }
  return Math.round(widthPx * 0.32);
}

/** Footer band: progress bar + status line (taller than crew officer token strip). */
export function missionCardFooterReserveHeight(widthPx: number): number {
  const compact = widthPx < 140;
  const progressAndGap = 10;
  const statusLine = compact ? 11 : 12;
  const padY = compact ? 5 : 8;
  return padY * 2 + progressAndGap + statusLine;
}

export function missionCardRegionHeights(widthPx: number): {
  readonly artPlateHeight: number;
  readonly textBlockHeight: number;
  readonly footerReserveHeight: number;
  readonly compact: boolean;
} {
  const compact = widthPx < 140;
  return {
    compact,
    artPlateHeight: compact ? 0 : crewCardArtPlateHeight(widthPx),
    textBlockHeight: missionCardTextBlockHeight(widthPx),
    footerReserveHeight: missionCardFooterReserveHeight(widthPx),
  };
}