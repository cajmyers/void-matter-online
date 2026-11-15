import type { CSSProperties } from "react";
import { attackDieArtUrl } from "./attackDieArt";
import styles from "./AttackDieIcon.module.css";

export interface AttackDieIconProps {
  readonly size?: number;
  /** Tints the glyph (`var(--asset-accent)` on cards). */
  readonly accent?: string;
}

function AttackDieSvg({ size }: { readonly size: number }) {
  return (
    <svg className={styles.svg} width={size} height={size} viewBox="0 0 24 24" aria-hidden focusable="false">
      <path
        fill="currentColor"
        d="M12 2.2 13.4 5.5l3.6-.6.9 3.5 3.4 1.2-1.8 3.2 2.4 2.8-3 1.8.3 3.7-3.7-.3-1.8 3-2.8-2.4-1.2 3.4-3.5-.9-3.6.6L12 21.8l-1.4-3.3-3.6.6-.9-3.5-3.4-1.2 1.8-3.2-2.4-2.8 3-1.8-.3-3.7 3.7.3 1.8-3 2.8 2.4 1.2-3.4 3.5.9 3.6-.6L12 2.2Z"
      />
      <circle cx="12" cy="12" r="4.2" fill="var(--game-card-background)" opacity="0.85" />
      <circle cx="12" cy="12" r="2.3" fill="currentColor" />
    </svg>
  );
}

/** One attack die on a weapon card (gear marker; one per die). */
export function AttackDieIcon({ size = 12, accent = "var(--asset-accent, var(--game-resource-pc))" }: AttackDieIconProps) {
  const style = { width: size, height: size, color: accent } as CSSProperties;

  if (attackDieArtUrl) {
    return (
      <span
        className={styles.masked}
        style={
          {
            ...style,
            "--attack-die-icon": `url(${attackDieArtUrl})`,
          } as CSSProperties
        }
        role="presentation"
      />
    );
  }

  return (
    <span className={styles.wrap} style={style} role="presentation">
      <AttackDieSvg size={size} />
    </span>
  );
}
