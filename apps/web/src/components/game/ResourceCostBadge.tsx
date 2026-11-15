import { resourceArt } from "./resourceArt";
import type { ResourceId } from "./resources";
import styles from "./ResourceCostBadge.module.css";

export interface ResourceCostBadgeProps {
  readonly resource: ResourceId;
  readonly amount: number;
  readonly size?: number;
  /** Larger centre numerals (inspect / detail cards). */
  readonly detail?: boolean;
}

/** Printed cost icon with a numeric badge (V5 layout). */
export function ResourceCostBadge({ resource, amount, size = 22, detail = false }: ResourceCostBadgeProps) {
  const amountClass = detail ? `${styles.amount} ${styles.amountDetail}` : styles.amount;
  return (
    <span className={styles.badge} style={{ width: size, height: size }} role="img" aria-label={`${amount} ${resource}`}>
      <img className={styles.icon} src={resourceArt[resource]} alt="" draggable={false} />
      <span className={amountClass}>{amount}</span>
    </span>
  );
}
