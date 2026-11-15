import { AttackDieIcon } from "./AttackDieIcon";
import styles from "./AssetCard.module.css";

export interface AttackDiceRowProps {
  readonly diceCount: number;
  readonly hitLabel?: string;
  readonly archetype?: string;
  readonly compact?: boolean;
  readonly dieSize?: number;
}

export function AttackDiceRow({ diceCount, hitLabel, archetype, compact = false, dieSize = 12 }: AttackDiceRowProps) {
  return (
    <div className={styles.weaponFooter}>
      {archetype ? <span className={compact ? `${styles.weaponType} ${styles.weaponTypeCompact}` : styles.weaponType}>{archetype}</span> : null}
      <div
        className={styles.weaponRow}
        {...(hitLabel ? { "aria-label": `${diceCount} dice at ${hitLabel}` } : {})}
      >
        <div className={styles.attackDice} aria-hidden>
          {Array.from({ length: diceCount }, (_, index) => (
            <AttackDieIcon key={index} size={dieSize} />
          ))}
        </div>
        {hitLabel ? (
          <span className={styles.hitLabel}>
            at <span className={styles.hitThreshold}>{hitLabel}</span>
          </span>
        ) : null}
      </div>
    </div>
  );
}
