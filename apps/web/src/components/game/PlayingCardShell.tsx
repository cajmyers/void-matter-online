import type { CSSProperties, ReactNode } from "react";
import styles from "./playingCardShell.module.css";

export interface PlayingCardShellProps {
  readonly rim: string;
  readonly width?: number;
  readonly ariaLabel: string;
  readonly children: ReactNode;
  readonly className?: string;
}

/** Shared 5:7 frame and sector-coloured rim for non-component card types. */
export function PlayingCardShell({ rim, width = 156, ariaLabel, children, className }: PlayingCardShellProps) {
  const style = { "--rim": rim, width } as CSSProperties;
  const shellClass = className ? `${styles.shell} ${className}` : styles.shell;
  return (
    <article className={shellClass} style={style} aria-label={ariaLabel}>
      {children}
    </article>
  );
}
