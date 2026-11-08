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
    <div className={styles.track} role="img" aria-label={`Hull: ${filled} of ${capacity} slots hold damage${full ? ", full" : ""}`}>
      <div className={styles.slots}>
        {Array.from({ length: capacity }, (_, index) => (
          <span key={index} className={index < filled ? `${styles.slot} ${styles.slotFilled}` : styles.slot}>
            {index < filled ? <DamageCube size={22} /> : null}
          </span>
        ))}
      </div>
      <Typography variant="caption" className={full ? styles.full : undefined}>
        {full ? "Hull full" : `${capacity - filled} free`}
      </Typography>
    </div>
  );
}
