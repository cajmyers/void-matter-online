import type { CSSProperties } from "react";
import type { SeatNumber } from "./resources";
import { Typography } from "../Typography/Typography";
import styles from "./CombatLogRow.module.css";

export type CombatLogRowKind = "phase" | "action" | "combat" | "damage" | "reaction" | "score";

export interface CombatLogRowProps {
  readonly kind: CombatLogRowKind;
  readonly children: string;
  readonly seat?: SeatNumber;
  readonly highlight?: boolean;
}

const kindLabel: Readonly<Record<CombatLogRowKind, string>> = {
  phase: "Phase",
  action: "Action",
  combat: "Combat",
  damage: "Damage",
  reaction: "Reaction",
  score: "Score",
};

export function CombatLogRow({ kind, children, seat, highlight = false }: CombatLogRowProps) {
  const style = seat ? ({ "--log-seat": `var(--game-seat-${seat})` } as CSSProperties) : undefined;
  const className = [styles.row, highlight ? styles.highlight : undefined, seat ? styles.withSeat : undefined]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={className} style={style} data-kind={kind} role="listitem">
      <Typography variant="caption" className={styles.kindTag}>
        {kindLabel[kind]}
      </Typography>
      <Typography variant="body2" className={styles.body}>
        {children}
      </Typography>
    </div>
  );
}