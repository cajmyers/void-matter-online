import { cardWidthDetail } from "./cardSizes";

/** Portrait window height (aligned with `AssetCard` image area). */
export function crewCardArtPlateHeight(widthPx: number): number {
  const detail = widthPx >= cardWidthDetail;
  return Math.round(widthPx * (detail ? 0.52 : 0.58));
}

/** Rules text area. */
export function crewCardTextBlockHeight(
  widthPx: number,
  options?: { readonly compactTeaser?: boolean },
): number {
  if (options?.compactTeaser) {
    return 22;
  }
  const detail = widthPx >= cardWidthDetail;
  /** Rules only (no flavour line); shorter than `AssetCard` text box. */
  return Math.round(widthPx * (detail ? 0.32 : 0.28));
}

/** Compact hand effect area: padding in `CrewCard.module.css` `.compact.withFaceTexture .footerReserve`. */
const crewCardCompactFooterPadYPx = 4;

/**
 * Effect area: officer action token (`ACT-1`).
 * Hand cards use a shorter band than sector `AssetCard` footers so the token hugs the panel; only padding
 * tweaks were invisible while `--footer-reserve-height` stayed at 48px and the token capped at 26px.
 */
export function crewCardFooterReserveHeight(widthPx: number): number {
  if (widthPx < 140) {
    const tokenTarget = 30;
    return crewCardCompactFooterPadYPx + tokenTarget;
  }
  const linePx = 11;
  return (linePx * 2 + 4) * 2;
}

/** Vertical padding inside `CrewCard.module.css` `.withFaceTexture .footerReserve`. */
function crewCardFooterVerticalPadPx(widthPx: number): number {
  const compact = widthPx < 140;
  return compact ? crewCardCompactFooterPadYPx : 4 + 6;
}

/** Action token in the effect area; sized to the footer band. */
export function crewCardActionTokenSize(widthPx: number, footerReserveHeightPx: number): number {
  const compact = widthPx < 140;
  const detail = widthPx >= cardWidthDetail;
  const maxInFooter = footerReserveHeightPx - crewCardFooterVerticalPadPx(widthPx);
  if (compact) {
    return Math.max(22, Math.min(maxInFooter, 30));
  }
  if (detail) {
    return Math.max(26, Math.min(maxInFooter, 38));
  }
  return Math.max(22, Math.min(maxInFooter, Math.round(widthPx * 0.12)));
}

export function crewCardRegionHeights(
  widthPx: number,
  options: { readonly hasTextBlock: boolean; readonly compactTeaser?: boolean },
): {
  readonly artPlateHeight: number;
  readonly textBlockHeight: number;
  readonly footerReserveHeight: number;
} {
  const artPlateHeight = crewCardArtPlateHeight(widthPx);
  const footerReserveHeight = crewCardFooterReserveHeight(widthPx);
  const compactTeaser = options.compactTeaser === true;

  if (options.hasTextBlock) {
    const textBlockHeight = crewCardTextBlockHeight(widthPx, { compactTeaser });
    if (compactTeaser) {
      return { artPlateHeight: 0, textBlockHeight, footerReserveHeight };
    }
    return { artPlateHeight, textBlockHeight, footerReserveHeight };
  }

  return {
    artPlateHeight: 0,
    textBlockHeight: 0,
    footerReserveHeight,
  };
}