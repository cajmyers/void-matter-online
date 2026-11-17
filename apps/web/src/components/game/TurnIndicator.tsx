import type { CSSProperties } from "react";
import { SeatMark } from "./SeatMark";
import type { SeatNumber } from "./resources";
import { Typography } from "../Typography/Typography";
import styles from "./TurnIndicator.module.css";

export interface TurnIndicatorProps {
  readonly seat: SeatNumber;
  readonly playerLabel: string;
  readonly yours?: boolean;
}

export function TurnIndicator({ seat, playerLabel, yours = false }: TurnIndicatorProps) {
  const style = { "--turn-seat": `var(--game-seat-${seat})` } as CSSProperties;
  return (
    <div className={styles.indicator} style={style} role="status">
      <SeatMark seat={seat} size={36} />
      <div className={styles.text}>
        <Typography variant="overline">{yours ? "Your turn" : "Turn"}</Typography>
        <Typography variant="h5" className={styles.name}>
          {playerLabel}
        </Typography>
      </div>
    </div>
  );
}