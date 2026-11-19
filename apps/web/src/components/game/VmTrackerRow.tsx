import type { FactionPoolView } from "./FactionPoolCounts";
import type { SeatNumber } from "./resources";
import { SeatVmChip } from "./SeatVmChip";
import styles from "./VmTrackerRow.module.css";

export interface SeatVmEntry {
  readonly seat: SeatNumber;
  readonly label: string;
  readonly voidMatterTaken: number;
  readonly pool: FactionPoolView;
  readonly activeTurn?: boolean;
  readonly firstPlayer?: boolean;
}

export function VmTrackerRow({ seats }: { readonly seats: readonly SeatVmEntry[] }) {
  return (
    <div className={styles.row} role="list" aria-label="Void Matter by seat">
      {seats.map((entry) => (
        <div key={entry.seat} role="listitem">
          <SeatVmChip
            seat={entry.seat}
            label={entry.label}
            voidMatterTaken={entry.voidMatterTaken}
            pool={entry.pool}
            active={entry.activeTurn ?? false}
            firstPlayer={entry.firstPlayer ?? false}
            compact
          />
        </div>
      ))}
    </div>
  );
}