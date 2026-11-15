import type { CSSProperties } from "react";
import { Typography } from "../Typography/Typography";
import { s1UpgradeDeckBackUrl } from "./s1DeckBackArt";
import styles from "./DeckBack.module.css";

export type DeckBackVariant = "procedural" | "s1-upgrade";

export interface DeckBackProps {
  readonly label: string;
  readonly count: number;
  /** A CSS colour (usually a theme variable) for the glowing rim. */
  readonly rim?: string;
  readonly width?: number;
  /** Owner art: S1 upgrade back is tinted red (PC). */
  readonly variant?: DeckBackVariant;
}

/** The back of a deck: a glowing card with its name and how many cards are left (counts are public, order is not). */
export function DeckBack({
  label,
  count,
  rim = "var(--palette-primary-main)",
  width = 84,
  variant = "procedural",
}: DeckBackProps) {
  const style = { "--rim": rim, width } as CSSProperties;
  const className = variant === "s1-upgrade" ? `${styles.deck} ${styles.s1Upgrade}` : styles.deck;
  return (
    <div
      className={className}
      style={
        variant === "s1-upgrade"
          ? ({ ...style, backgroundImage: `url(${s1UpgradeDeckBackUrl})` } as CSSProperties)
          : style
      }
      role="img"
      aria-label={`${label}: ${count} cards left`}
    >
      <Typography variant="overline" className={styles.label}>
        {label}
      </Typography>
      <Typography variant="numeric" className={styles.count}>
        {count}
      </Typography>
    </div>
  );
}
