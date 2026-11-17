import assetStyles from "./AssetCard.module.css";
import { Typography } from "../Typography/Typography";
import styles from "./HullTrack.module.css";

export interface DamageCubeProps {
  readonly size?: number;
}

/**
 * A damage cube. Amber square with a cross, so it is never read as a resource (those are
 * shaped tokens) and never relies on colour alone. The same marker locks a planet area.
 */
export function DamageCube({ size = 22 }: DamageCubeProps) {
  return (
    <span className={styles.cube} style={{ width: size, height: size }} role="img" aria-label="Damage cube" title="Damage cube">
      <svg viewBox="0 0 24 24" width="62%" height="62%" aria-hidden="true">
        <path d="M5 5L19 19M19 5L5 19" className={styles.cross} />
      </svg>
    </span>
  );
}

export interface HullDamageSlotsProps {
  /** Hull slots printed on the card (`LOT-3` damage cubes fill from the left). */
  readonly capacity: number;
  readonly damage?: number;
  readonly slotSize?: number;
  readonly compact?: boolean;
  readonly className?: string;
}

/** Empty hull boxes that accept {@link DamageCube}s (ships, enemy cards, fleet panel). */
export function HullDamageSlots({
  capacity,
  damage = 0,
  slotSize = 22,
  compact = false,
  className,
}: HullDamageSlotsProps) {
  if (capacity <= 0) {
    return null;
  }
  const filled = Math.min(Math.max(0, damage), capacity);
  const cubeSize = Math.max(10, Math.round(slotSize * 0.78));
  const slotsClass = [assetStyles.cargoSlots, className].filter(Boolean).join(" ");
  const hullSlotClass = compact
    ? `${assetStyles.hullSlot} ${assetStyles.hullSlotCompact}`
    : assetStyles.hullSlot;
  return (
    <div
      className={slotsClass}
      role="img"
      aria-label={`Hull ${capacity} ${capacity === 1 ? "slot" : "slots"}, ${filled} with damage`}
    >
      {Array.from({ length: capacity }, (_, index) => (
        <span key={index} className={hullSlotClass} style={{ width: slotSize, height: slotSize }}>
          {index < filled ? (
            <DamageCube size={cubeSize} />
          ) : (
            <span className={assetStyles.cargoSlotVoid} aria-hidden />
          )}
        </span>
      ))}
    </div>
  );
}

export interface HullTrackProps {
  /** Free hull slots a ship has in total. Damage cubes sit in these slots (DMG rulings, LOT-3). */
  readonly capacity: number;
  readonly damage: number;
}

/** The hull slots of one ship, with damage cubes filling them from the left. */
export function HullTrack({ capacity, damage }: HullTrackProps) {
  const filled = Math.min(damage, capacity);
  const full = filled >= capacity;
  return (
    <div className={styles.track} role="presentation">
      <HullDamageSlots capacity={capacity} damage={damage} slotSize={28} />
      <Typography variant="caption" className={full ? styles.full : undefined}>
        {full ? "Hull full" : `${capacity - filled} free`}
      </Typography>
    </div>
  );
}
