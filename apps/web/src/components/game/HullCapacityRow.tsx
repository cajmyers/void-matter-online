import styles from "./AssetCard.module.css";

export interface HullCapacityRowProps {
  readonly slotCount: number;
  readonly compact?: boolean;
  readonly slotSize?: number;
}

/** Hull capacity slots in the card effect area (empty squares). */
export function HullCapacityRow({ slotCount, compact = false, slotSize = 22 }: HullCapacityRowProps) {
  return (
    <div
      className={styles.cargoFooter}
      aria-label={`${slotCount} hull ${slotCount === 1 ? "slot" : "slots"}`}
    >
      <div className={styles.cargoSlots}>
        {Array.from({ length: slotCount }, (_, index) => (
          <span
            key={index}
            className={compact ? `${styles.hullSlot} ${styles.hullSlotCompact}` : styles.hullSlot}
            style={{ width: slotSize, height: slotSize }}
          >
            <span className={styles.cargoSlotVoid} aria-hidden />
          </span>
        ))}
      </div>
    </div>
  );
}