import styles from "./Markers.module.css";

export interface MarkerProps {
  readonly size?: number;
}

/** The first-player token (passes round the seats each Maintenance). Placeholder art: a gold hex with a 1. */
export function FirstPlayerToken({ size = 40 }: MarkerProps) {
  return (
    <span className={styles.marker} style={{ width: size, height: size }} role="img" aria-label="First-player token" title="First-player token">
      <svg viewBox="0 0 40 40" width="100%" height="100%" aria-hidden="true">
        <polygon points="20,2 36.5,11 36.5,29 20,38 3.5,29 3.5,11" className={styles.firstHex} />
        <polygon points="20,7 32,13.6 32,26.4 20,33 8,26.4 8,13.6" className={styles.firstInner} />
        <path d="M17 15.5l4-2v13" className={styles.firstOne} />
      </svg>
    </span>
  );
}

/**
 * A Swarm Larva token: a spawned enemy token, not a ship (LOT-4). Placeholder art: a
 * segmented grub in the enemy colour, so it never reads as a player seat or a resource.
 */
export function LarvaToken({ size = 36 }: MarkerProps) {
  return (
    <span className={styles.marker} style={{ width: size, height: size }} role="img" aria-label="Swarm Larva token" title="Swarm Larva token (enemy token, not a ship)">
      <svg viewBox="0 0 40 40" width="100%" height="100%" aria-hidden="true">
        <circle cx="20" cy="20" r="17" className={styles.larvaDisc} />
        <circle cx="12" cy="22" r="4.2" className={styles.larvaSegment} />
        <circle cx="19" cy="19" r="5" className={styles.larvaSegment} />
        <circle cx="27" cy="15.5" r="5.8" className={styles.larvaSegment} />
        <circle cx="29" cy="14" r="1.1" className={styles.larvaEye} />
      </svg>
    </span>
  );
}
