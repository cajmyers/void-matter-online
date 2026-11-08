import { useEffect, useRef } from "react";
import styles from "./StylePage.module.css";

export interface SwatchProps {
  /** Custom property name without the leading dashes, e.g. "palette-primary-main". */
  readonly variable: string;
  /** Custom property for the text drawn on the swatch. */
  readonly textVariable?: string;
  readonly label?: string;
}

/** A colour swatch that also prints its resolved value. */
export function Swatch({ variable, textVariable = "palette-text-primary", label }: SwatchProps) {
  const swatchRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (swatchRef.current && valueRef.current) {
      valueRef.current.textContent = getComputedStyle(swatchRef.current).getPropertyValue(`--${variable}`).trim();
    }
  }, [variable]);

  return (
    <div
      ref={swatchRef}
      className={styles.swatch}
      style={{ background: `var(--${variable})`, color: `var(--${textVariable})` }}
      title={`--${variable}`}
    >
      <span className={styles.swatchLabel}>{label ?? variable.replace(/^palette-/, "")}</span>
      <code ref={valueRef} className={styles.swatchValue} />
    </div>
  );
}
