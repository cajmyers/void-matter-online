/** Playing-card widths for gallery and table (`implementation-plan.md` §5.2). */

/** Print size (mm); drives `--card-aspect-ratio` in `theme.css`. */
export const cardPrintWidthMm = 65;
export const cardPrintHeightMm = 100;

/** In hand on the player mat or in a market row. */
export const cardWidthHand = 118;

/** Inspector / detail zoom beside the board. */
export const cardWidthDetail = 220;

export function cardHeightForWidth(widthPx: number): number {
  return (widthPx * cardPrintHeightMm) / cardPrintWidthMm;
}
