import moduleIcon from "../../assets/icons/slots/module.png";
import type { AssetSlotSize } from "./assetCardTypes";
import styles from "./UpgradeSlotMarker.module.css";

const slotLabels: Readonly<Record<AssetSlotSize, string>> = {
  0.5: ".5",
  1: "1",
  2: "2",
};

export interface UpgradeSlotMarkerProps {
  /** Printed slot cost on a component card (`SLT-1`). */
  readonly slotSize?: AssetSlotSize;
  /** Total upgrade slots on a ship card (icon + count). */
  readonly capacity?: number;
  readonly size?: number;
}

/** Slot cost (`SLT-1`) on the art window: puzzle icon + number on a dark plate. */
export function UpgradeSlotMarker({ slotSize, capacity, size = 26 }: UpgradeSlotMarkerProps) {
  if (capacity === undefined && slotSize === undefined) {
    throw new Error("UpgradeSlotMarker requires slotSize or capacity");
  }

  const capacityLabel = capacity !== undefined ? String(capacity) : undefined;
  const label = capacityLabel ?? slotLabels[slotSize as AssetSlotSize];
  const ariaLabel =
    capacity !== undefined
      ? `${capacity} upgrade slot${capacity === 1 ? "" : "s"}`
      : `${slotSize} slot${slotSize === 1 ? "" : "s"}`;

  return (
    <span
      className={styles.marker}
      style={{ width: size, height: size, fontSize: size }}
      role="img"
      aria-label={ariaLabel}
    >
      <img className={styles.icon} src={moduleIcon} alt="" draggable={false} />
      <span
        className={
          slotSize === 0.5 && capacity === undefined ? `${styles.value} ${styles.valueHalf}` : styles.value
        }
      >
        {slotSize === 0.5 && capacity === undefined ? (
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
