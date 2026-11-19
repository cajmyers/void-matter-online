import type { AssetCardProps } from "./AssetCard";
import type { CrewCardProps } from "./CrewCard";
import {
  assetCardEffectAreaOuterHeight,
  assetCardFooterReserveHeight,
  assetCardInstalledEffectOnlyPeekHeight,
  assetCardRegionHeights,
} from "./assetCardLayout";
import { assetCardLayoutFlags } from "./assetCardLayoutFlags";
import { cardHeightForWidth, cardWidthDetail } from "./cardSizes";
import { crewCardRegionHeights, crewCardTextBlockHeight } from "./crewCardLayout";

const textBlockMarginTop = 4;

function assetCardWrappedLineCount(text: string, widthPx: number, detail: boolean): number {
  const trimmed = text.trim();
  if (!trimmed) {
    return 0;
  }
  const innerWidth = Math.max(48, widthPx - 28);
  const charWidth = detail ? 6.6 : 6;
  const charsPerLine = Math.max(14, Math.floor(innerWidth / charWidth));
  let lines = 1;
  let lineChars = 0;
  for (const word of trimmed.split(/\s+/)) {
    const token = word.length + (lineChars > 0 ? 1 : 0);
    if (lineChars + token > charsPerLine && lineChars > 0) {
      lines += 1;
      lineChars = word.length;
    } else {
      lineChars += token;
    }
  }
  return lines;
}

/** Short rules band at the card foot — avoids blank reclaimed text area covering lower stack layers. */
export function assetCardRulesInstalledPeekHeight(
  width: number,
  rulesText: string,
  footerReserveHeight: number,
): number {
  const detail = width >= cardWidthDetail;
  const lineCount = Math.max(1, assetCardWrappedLineCount(rulesText, width, detail));
  const linePx = detail ? 16 : 14;
  const rulesPadding = 12;
  return lineCount * linePx + rulesPadding + textBlockMarginTop + footerReserveHeight;
}

/** Installed stack peek bands (`footerOnly` | `textOnly` | `both`). */
export type CardEffectLayout = "footerOnly" | "textOnly" | "both";

export function assetCardEffectLayout(
  props: Pick<
    AssetCardProps,
    | "rulesText"
    | "flavorText"
    | "category"
    | "statsLine"
    | "weapon"
    | "footerNote"
    | "speedBonus"
    | "speedFooterLabel"
    | "cargoBonus"
    | "crewSlotsBonus"
    | "hullSlotsBonus"
  >,
  width: number,
): CardEffectLayout {
  const { showRules, hasFooterContent } = assetCardLayoutFlags(props, width);
  if (showRules && hasFooterContent) {
    return "both";
  }
  if (showRules) {
    return "textOnly";
  }
  return "footerOnly";
}

export function crewCardEffectLayout(props: Pick<CrewCardProps, "text">): Exclude<CardEffectLayout, "textOnly"> {
  return props.text.trim().length > 0 ? "both" : "footerOnly";
}

export function assetCardInstalledPeekHeights(
  props: Pick<
    AssetCardProps,
    | "sectorDeck"
    | "rulesText"
    | "flavorText"
    | "category"
    | "statsLine"
    | "weapon"
    | "footerNote"
    | "speedBonus"
    | "speedFooterLabel"
    | "cargoBonus"
    | "crewSlotsBonus"
    | "hullSlotsBonus"
  >,
  width: number,
): {
  readonly fullHeight: number;
  readonly peekHeight: number;
  readonly hiddenOffset: number;
  readonly layout: CardEffectLayout;
} {
  const layout = assetCardEffectLayout(props, width);
  const flags = assetCardLayoutFlags(props, width);
  const regions = assetCardRegionHeights(width, props.sectorDeck, {
    compact: flags.compact,
    hasEffectArea: flags.hasFooterContent,
    hasTextBlock: flags.showTextBlock,
  });

  const fullHeight = cardHeightForWidth(width);
  let peekHeight = 0;

  if (layout === "textOnly") {
    peekHeight = assetCardRulesInstalledPeekHeight(width, props.rulesText, regions.footerReserveHeight);
  } else if (layout === "footerOnly") {
    peekHeight = assetCardInstalledEffectOnlyPeekHeight(width, props.sectorDeck);
  } else if (flags.showRules) {
    peekHeight += regions.textBlockHeight + textBlockMarginTop;
    peekHeight += assetCardEffectAreaOuterHeight(width, props.sectorDeck, {
      usesEffectFooter: flags.hasFooterContent,
    });
  } else if (flags.hasFooterContent) {
    peekHeight = assetCardEffectAreaOuterHeight(width, props.sectorDeck, { usesEffectFooter: true });
  } else {
    peekHeight += regions.footerReserveHeight || assetCardFooterReserveHeight(width, props.sectorDeck);
  }

  if (peekHeight === 0) {
    peekHeight = assetCardFooterReserveHeight(width, props.sectorDeck);
  }

  peekHeight = Math.min(fullHeight, Math.max(peekHeight, 1));

  return {
    fullHeight,
    peekHeight,
    hiddenOffset: -(fullHeight - peekHeight),
    layout,
  };
}

export function crewCardInstalledPeekHeights(
  props: Pick<CrewCardProps, "text" | "rank">,
  width: number,
): {
  readonly fullHeight: number;
  readonly peekHeight: number;
  readonly hiddenOffset: number;
  readonly layout: Exclude<CardEffectLayout, "textOnly">;
} {
  const layout = crewCardEffectLayout(props);
  const fullHeight = cardHeightForWidth(width);
  const compact = width < 140;
  const hasTraitText = props.text.trim().length > 0;
  const compactTeaser = compact && hasTraitText;
  const { textBlockHeight, footerReserveHeight } = crewCardRegionHeights(width, {
    hasTextBlock: hasTraitText,
    compactTeaser,
  });

  let peekHeight = footerReserveHeight;
  if (hasTraitText) {
    peekHeight += crewCardTextBlockHeight(width, { compactTeaser }) + textBlockMarginTop;
  }

  peekHeight = Math.min(fullHeight, Math.max(peekHeight, 1));

  return {
    fullHeight,
    peekHeight,
    hiddenOffset: -(fullHeight - peekHeight),
    layout,
  };
}

/** @deprecated Use `assetCardInstalledPeekHeights`. */
export function assetCardStackHeights(
  props: Parameters<typeof assetCardInstalledPeekHeights>[0],
  width: number,
): ReturnType<typeof assetCardInstalledPeekHeights> {
  return assetCardInstalledPeekHeights(props, width);
}