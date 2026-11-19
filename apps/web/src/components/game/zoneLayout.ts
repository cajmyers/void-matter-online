import type { CSSProperties } from "react";
import { cardWidthHand } from "./cardSizes";

/** Face-up markets in the left zone column never show more than this many cards across. */
export const zoneCardsAcross = 2;

/** Inline vars for `MarketZonePanel` and `ZoneTabDock` width (`theme.css` `--game-zone-cards-across`). */
export function zoneColumnStyle(
  cardWidth: number = cardWidthHand,
  pileWidth: number = cardWidth,
): CSSProperties {
  return {
    "--zone-card-width": `${cardWidth}px`,
    "--zone-pile-width": `${pileWidth}px`,
  } as CSSProperties;
}