import type { CSSProperties } from "react";
import { FirstPlayerToken } from "./Markers";
import { SeatMark } from "./SeatMark";
import type { SeatNumber } from "./resources";
import { seatColourName } from "./resources";
import { FactionPoolCounts, formatFactionPoolForScreenReader, type FactionPoolView } from "./FactionPoolCounts";
import { VmPips } from "./VmPips";
import { Typography } from "../Typography/Typography";
import styles from "./SeatVmChip.module.css";

export interface SeatVmChipProps {
  readonly seat: SeatNumber;
  readonly label: string;
  readonly voidMatterTaken: number;
  readonly pool: FactionPoolView;
  readonly active?: boolean;
  readonly firstPlayer?: boolean;
  readonly compact?: boolean;
}

export function SeatVmChip({
  seat,
  label,
  voidMatterTaken,
  pool,
  active = false,
  firstPlayer = false,
  compact = false,
}: SeatVmChipProps) {
  const style = {
    borderColor: `var(--game-seat-${seat})`,
    "--chip-seat": `var(--game-seat-${seat})`,
  } as CSSProperties;
  const className = active ? `${styles.chip} ${styles.chipActive}` : styles.chip;
  const tokenSize = compact ? 15 : 18;
  const markSize = compact ? 16 : 18;
  return (
    <div className={className} style={style}>
      <div className={styles.identityRow}>
        {firstPlayer ? <FirstPlayerToken size={tokenSize} /> : null}
        <SeatMark seat={seat} size={markSize} />
        <Typography variant={compact ? "caption" : "subtitle2"} className={styles.name}>
          {label}
        </Typography>
      </div>
      <div className={styles.statsRow}>
        <FactionPoolCounts pool={pool} compact={compact} />
        <VmPips taken={voidMatterTaken} size={compact ? "small" : "medium"} />
      </div>
      <span className={styles.srOnly}>
        {seatColourName[seat]} seat
        {active ? ", active turn" : ""}
        {firstPlayer ? ", first player" : ""}
        {`, pool: ${formatFactionPoolForScreenReader(pool)}`}
      </span>
    </div>
  );
}