import { SeatMark } from "../game/SeatMark";
import { Typography } from "../Typography/Typography";
import type { HexInspectorShipEntry } from "../../view/mapHexInspector";
import styles from "./InspectorShipList.module.css";

function shipFlags(entry: HexInspectorShipEntry): string {
  return [entry.pinned ? "pinned" : null, entry.selected ? "selected" : null].filter(Boolean).join(", ");
}

export function InspectorShipList({ entries }: { readonly entries: readonly HexInspectorShipEntry[] }) {
  return (
    <ul className={styles.list}>
      {entries.map((entry) => {
        const flags = shipFlags(entry);
        return (
          <li key={entry.seat} className={styles.entry}>
            <SeatMark seat={entry.seat} size={18} />
            <Typography variant="body2" className={styles.name}>
              {entry.label}
            </Typography>
            {flags ? (
              <Typography variant="caption" className={styles.flags}>
                {flags}
              </Typography>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}