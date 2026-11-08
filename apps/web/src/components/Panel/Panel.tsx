import type { ReactNode } from "react";
import { Typography } from "../Typography/Typography";
import styles from "./Panel.module.css";

export interface PanelProps {
  readonly title?: string;
  readonly children: ReactNode;
  readonly className?: string;
}

/** Themed container. Translucent glass with a thin glowing rim, from the --panel-* theme tokens. */
export function Panel({ title, children, className }: PanelProps) {
  return (
    <section className={className ? `${styles.panel} ${className}` : styles.panel}>
      {title ? (
        <Typography variant="overline" className={styles.title}>
          {title}
        </Typography>
      ) : null}
      {children}
    </section>
  );
}
