import type { MouseEvent, ReactNode } from "react";
import { Typography } from "../Typography/Typography";
import styles from "./DiscardPile.module.css";

export interface DiscardPileProps {
  readonly label?: string;
  readonly count: number;
  /** Top discard face-up; omit when count is 0. */
  readonly topCard?: ReactNode;
  readonly width: number;
  readonly onInspectDiscard?: () => void;
}

/** Discard zone: public count, optional face-up top card (`DCK-2` reshuffle source). */
export function DiscardPile({ label = "Discard", count, topCard, width, onInspectDiscard }: DiscardPileProps) {
  const onContextMenu = (event: MouseEvent<HTMLDivElement>) => {
    if (count <= 0 || !onInspectDiscard) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    onInspectDiscard();
  };

  if (count <= 0) {
    return (
      <div
        className={`${styles.empty} ${styles.spent}`}
        style={{ width }}
        role="img"
        aria-label={`${label}: empty`}
        onContextMenu={onContextMenu}
      >
        <Typography variant="caption" className={styles.emptyHint}>
          Empty
        </Typography>
      </div>
    );
  }

  const depth = Math.min(count, 3);
  return (
    <div
      className={`${styles.pile} ${styles.spent}`}
      style={{ width, cursor: onInspectDiscard ? "context-menu" : undefined }}
      role="group"
      aria-label={`${label}: ${count} cards, top face-up`}
      onContextMenu={onContextMenu}
    >
      {Array.from({ length: depth - 1 }, (_, index) => (
        <div
          key={index}
          className={styles.shadowCard}
          style={{ width, transform: `translate(${4 + index * 3}px, ${3 + index * 2}px)` }}
          aria-hidden="true"
        />
      ))}
      <div className={styles.top} style={{ width }}>
        {topCard}
      </div>
      <Typography variant="caption" className={styles.countBadge}>
        {count}
      </Typography>
    </div>
  );
}