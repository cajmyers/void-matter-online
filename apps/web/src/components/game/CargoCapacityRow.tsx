import { ResourceCube } from "./ResourceCube";
import type { ResourceId } from "./resources";
import { previewCargoSlotResources } from "./cargoSlotPreview";
import styles from "./AssetCard.module.css";

export interface CargoCapacityRowProps {
  readonly slotCount: number;
  readonly compact?: boolean;
  /** Outer slot box (border + padding). */
  readonly slotSize?: number;
  /** Resource cube drawn inside the slot. */
  readonly cubeSize?: number;
  /** When set, slots show stable random resource cubes (preview). */
  readonly fillSeed?: string;
  /** Explicit fill; overrides {@link fillSeed}. */
  readonly resources?: readonly ResourceId[];
}

/** Cargo capacity slots (empty in play; optional preview fill for gallery). */
export function CargoCapacityRow({
  slotCount,
  compact = false,
  slotSize = 22,
  cubeSize = 16,
  fillSeed,
  resources,
}: CargoCapacityRowProps) {
  const fill =
    resources ?? (fillSeed ? previewCargoSlotResources(fillSeed, slotCount) : undefined);

  return (
    <div
      className={styles.cargoFooter}
      aria-label={`${slotCount} cargo ${slotCount === 1 ? "slot" : "slots"}`}
    >
      <div className={styles.cargoSlots}>
        {Array.from({ length: slotCount }, (_, index) => (
          <span
            key={index}
            className={compact ? `${styles.cargoSlot} ${styles.cargoSlotCompact}` : styles.cargoSlot}
            style={{ width: slotSize, height: slotSize }}
          >
            {fill ? (
              <ResourceCube resource={fill[index]!} size={cubeSize} />
            ) : (
              <span className={styles.cargoSlotVoid} aria-hidden />
            )}
          </span>
        ))}
      </div>
    </div>
  );
}