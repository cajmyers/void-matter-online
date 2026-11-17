import { Typography } from "../Typography/Typography";
import { CombatLogRow, type CombatLogRowProps } from "./CombatLogRow";
import styles from "./CombatLog.module.css";

export function CombatLog({ rows, title = "Combat log" }: { readonly rows: readonly CombatLogRowProps[]; readonly title?: string }) {
  return (
    <section className={styles.log} aria-label={title}>
      <Typography variant="overline" className={styles.title}>
        {title}
      </Typography>
      <div className={styles.list} role="list">
        {rows.map((row, index) => (
          <CombatLogRow key={`${row.kind}-${index}`} {...row} />
        ))}
      </div>
    </section>
  );
}