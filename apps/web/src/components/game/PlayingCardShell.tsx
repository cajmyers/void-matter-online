import type { CSSProperties, ReactNode } from "react";
import styles from "./playingCardShell.module.css";

export interface PlayingCardShellProps {
  readonly rim: string;
  readonly width?: number;
  readonly ariaLabel: string;
  readonly children: ReactNode;
  readonly className?: string;
  /** Full-card face stock (e.g. crew-texture.webp). */
  readonly faceTextureUrl?: string;
  /** Merged into the shell style (e.g. region height CSS variables). */
  readonly layoutStyle?: CSSProperties;
}

/** Shared 5:7 frame and sector-coloured rim for non-component card types. */
export function PlayingCardShell({
  rim,
  width = 156,
  ariaLabel,
  children,
  className,
  faceTextureUrl,
  layoutStyle,
}: PlayingCardShellProps) {
  const style = {
    ...layoutStyle,
    "--rim": rim,
    width,
    ...(faceTextureUrl ? { "--card-face-texture": `url(${faceTextureUrl})` } : {}),
  } as CSSProperties;
  const shellClass = [
    styles.shell,
    faceTextureUrl ? styles.withFaceTexture : undefined,
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <article className={shellClass} style={style} aria-label={ariaLabel}>
      {children}
    </article>
  );
}
