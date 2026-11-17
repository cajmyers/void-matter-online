import type { CSSProperties } from "react";
import {
  combatDiePipLayout,
  type CombatDieState,
  type CombatDieValue,
} from "./combatDiePips";
import styles from "./CombatDie.module.css";

export interface CombatDieProps {
  readonly value: CombatDieValue;
  readonly state?: CombatDieState;
  readonly size?: number;
  /** Yellow dashed outline — result colour (success/fail) stays on the die face. */
  readonly rerolled?: boolean;
}

function pipRadius(size: number): number {
  return Math.max(2.8, size * 0.09);
}

export function CombatDie({ value, state = "resting", size = 40, rerolled = false }: CombatDieProps) {
  const pips = combatDiePipLayout[value];
  const r = pipRadius(size);
  const style = { width: size, height: size } as CSSProperties;
  const className = [styles.die, styles[state]].filter(Boolean).join(" ");

  const ariaState =
    state === "hit"
      ? ", success"
      : state === "miss"
        ? ", fail"
        : state === "thrown"
          ? ", thrown"
          : "";
  const ariaReroll = rerolled ? ", selected for reroll" : "";

  return (
    <span
      className={className}
      style={style}
      role="img"
      aria-label={`Die showing ${value}${ariaState}${ariaReroll}`}
    >
      <svg className={styles.face} viewBox="0 0 100 100" width={size} height={size} aria-hidden>
        {pips.map(([cx, cy], index) => (
          <circle key={index} className={styles.pip} cx={cx} cy={cy} r={r} />
        ))}
      </svg>
      {rerolled ? <span className={styles.rerollRing} aria-hidden /> : null}
    </span>
  );
}