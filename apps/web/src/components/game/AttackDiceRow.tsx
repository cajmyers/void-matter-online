import { AttackDieIcon } from "./AttackDieIcon";
import styles from "./AssetCard.module.css";

export interface AttackDiceRowProps {
  readonly diceCount: number;
  readonly hitLabel?: string;
  readonly archetype?: string;
  readonly compact?: boolean;
  readonly dieSize?: number;
  readonly weaponFooterClassName?: string;
  readonly weaponRowClassName?: string;
}

export function AttackDiceRow({
  diceCount,
  hitLabel,
  archetype,
  compact = false,
  dieSize = 12,
  weaponFooterClassName,
  weaponRowClassName,
}: AttackDiceRowProps) {
  const footerClass = [styles.weaponFooter, weaponFooterClassName].filter(Boolean).join(" ");
  const rowClass = [styles.weaponRow, weaponRowClassName].filter(Boolean).join(" ");
  return (
    <div className={footerClass}>
      {archetype ? <span className={compact ? `${styles.weaponType} ${styles.weaponTypeCompact}` : styles.weaponType}>{archetype}</span> : null}
      <div
        className={rowClass}
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
