import type { CSSProperties } from "react";
import { Typography } from "../Typography/Typography";
import styles from "./DeckBack.module.css";

export interface DeckBackProps {
  readonly label: string;
  readonly count: number;
  /** A CSS colour (usually a theme variable) for the glowing rim. */
  readonly rim?: string;
  readonly width?: number;
}

/** The back of a deck: a glowing card with its name and how many cards are left (counts are public, order is not). */
export function DeckBack({ label, count, rim = "var(--palette-primary-main)", width = 84 }: DeckBackProps) {
  const style = { "--rim": rim, width } as CSSProperties;
  return (
    <div className={styles.deck} style={style} role="img" aria-label={`${label}: ${count} cards left`}>
      <Typography variant="overline" className={styles.label}>
        {label}
      </Typography>
      <Typography variant="numeric" className={styles.count}>
        {count}
      </Typography>
    </div>
  );
}
