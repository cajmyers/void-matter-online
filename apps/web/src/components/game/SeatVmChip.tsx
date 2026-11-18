import type { CSSProperties } from "react";
import { FirstPlayerToken } from "./Markers";
import { SeatMark } from "./SeatMark";
import type { SeatNumber } from "./resources";
import { seatColourName } from "./resources";
import { VmPips } from "./VmPips";
import { Typography } from "../Typography/Typography";
import styles from "./SeatVmChip.module.css";

export interface SeatVmChipProps {
  readonly seat: SeatNumber;
  readonly label: string;
  readonly voidMatterTaken: number;
  readonly active?: boolean;
  readonly firstPlayer?: boolean;
  readonly compact?: boolean;
}

export function SeatVmChip({
  seat,
  label,
  voidMatterTaken,
  active = false,
  firstPlayer = false,
  compact = false,
}: SeatVmChipProps) {
  const style = {
    borderColor: `var(--game-seat-${seat})`,
    "--chip-seat": `var(--game-seat-${seat})`,
  } as CSSProperties;
  const className = active ? `${styles.chip} ${styles.chipActive}` : styles.chip;
  return (
    <div className={className} style={style}>
      {firstPlayer ? <FirstPlayerToken size={compact ? 15 : 18} /> : null}
      <SeatMark seat={seat} size={compact ? 16 : 18} />
      <Typography variant={compact ? "caption" : "subtitle2"} className={styles.name}>
        {label}
      </Typography>
      <VmPips taken={voidMatterTaken} size={compact ? "small" : "medium"} />
      <span className={styles.srOnly}>
        {seatColourName[seat]} seat
        {active ? ", active turn" : ""}
        {firstPlayer ? ", first player" : ""}
      </span>
    </div>
  );
}