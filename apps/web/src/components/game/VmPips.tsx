import styles from "./VmPips.module.css";

/** Three Void Matter pips (0–3 taken). Public score per seat (`INF-1`). */
export function VmPips({ taken, size = "medium" }: { readonly taken: number; readonly size?: "small" | "medium" }) {
  const pipClass = size === "small" ? `${styles.pip} ${styles.pipSmall}` : styles.pip;
  const filledClass = size === "small" ? `${styles.pip} ${styles.pipSmall} ${styles.pipFilled}` : `${styles.pip} ${styles.pipFilled}`;
  return (
    <span className={styles.pips} role="img" aria-label={`${taken} of 3 Void Matter`}>
      {[0, 1, 2].map((index) => (
        <span key={index} className={index < taken ? filledClass : pipClass} />
      ))}
    </span>
  );
}