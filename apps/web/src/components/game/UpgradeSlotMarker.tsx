import moduleIcon from "../../assets/icons/slots/module.png";
import type { AssetSlotSize } from "./assetCardTypes";
import styles from "./UpgradeSlotMarker.module.css";

const slotLabels: Readonly<Record<AssetSlotSize, string>> = {
  0.5: ".5",
  1: "1",
  2: "2",
};

export interface UpgradeSlotMarkerProps {
  readonly slotSize: AssetSlotSize;
  readonly size?: number;
}

/** Slot cost (`SLT-1`) on the art window: puzzle icon + number on a dark plate. */
export function UpgradeSlotMarker({ slotSize, size = 26 }: UpgradeSlotMarkerProps) {
  const label = slotLabels[slotSize];
  return (
    <span
      className={styles.marker}
      style={{ width: size, height: size, fontSize: size }}
      role="img"
      aria-label={`${slotSize} slot${slotSize === 1 ? "" : "s"}`}
    >
      <img className={styles.icon} src={moduleIcon} alt="" draggable={false} />
      <span className={slotSize === 0.5 ? `${styles.value} ${styles.valueHalf}` : styles.value}>
        {slotSize === 0.5 ? (
          <>
            <span className={styles.halfDot} aria-hidden>
              .
            </span>
            <span>5</span>
          </>
        ) : (
          label
        )}
      </span>
    </span>
  );
}
