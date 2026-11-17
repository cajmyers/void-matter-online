import type { CSSProperties, ReactNode } from "react";
import { Typography } from "../Typography/Typography";
import { cardWidthHand } from "./cardSizes";
import { zoneColumnStyle } from "./zoneLayout";
import styles from "./MarketZonePanel.module.css";

export interface MarketZonePanelProps {
  readonly title: string;
  readonly subtitle?: string;
  /** Rim colour for the panel and tab accent (usually a `--game-*` token). */
  readonly rim: string;
  readonly faceUp: ReactNode;
  readonly deck: ReactNode;
  readonly discard: ReactNode;
  readonly footnote?: string;
  /** Playing-card width in the grid (hand size on the table). */
  readonly cardWidth?: number;
  /** Top-left square; top edge flush with tab bar (`ZoneTabDock`). */
  readonly attachTabs?: boolean;
}

function PileSlot({ label, children }: { readonly label: string; readonly children: ReactNode }) {
  return (
    <div className={styles.pileSlot}>
      <Typography variant="overline" className={styles.pileLabel}>
        {label}
      </Typography>
      <div className={styles.pileBody}>{children}</div>
    </div>
  );
}

/**
 * Deck and discard on top, face-up market below. Left zone column (`implementation-plan.md` §5.3).
 */
export function MarketZonePanel({
  title,
  subtitle,
  rim,
  faceUp,
  deck,
  discard,
  footnote,
  cardWidth = cardWidthHand,
  attachTabs = false,
}: MarketZonePanelProps) {
  const style = { "--zone-rim": rim, ...zoneColumnStyle(cardWidth) } as CSSProperties;
  const panelClass = attachTabs ? `${styles.panel} ${styles.attachTabs}` : styles.panel;
  return (
    <section className={panelClass} style={style} aria-label={title}>
      <header className={styles.head}>
        <Typography variant="subtitle2" className={styles.title}>
          {title}
        </Typography>
        {subtitle ? (
          <Typography variant="caption" className={styles.subtitle}>
            {subtitle}
          </Typography>
        ) : null}
      </header>
      <div className={styles.piles}>
        <PileSlot label="Deck">{deck}</PileSlot>
        <PileSlot label="Discard">{discard}</PileSlot>
      </div>
      <Typography variant="overline" className={styles.rowLabel}>
        Available
      </Typography>
      <div className={styles.faceUp}>{faceUp}</div>
      {footnote ? (
        <Typography variant="caption" className={styles.footnote}>
          {footnote}
        </Typography>
      ) : null}
    </section>
  );
}