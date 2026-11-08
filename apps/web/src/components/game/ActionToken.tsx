import type { CSSProperties } from "react";
import type { ActionTokenKind } from "./resources";
import moveIcon from "../../assets/icons/actions/move.png";
import tradeIcon from "../../assets/icons/actions/trade.png";
import interactIcon from "../../assets/icons/actions/interact.png";
import tacticalIcon from "../../assets/icons/actions/tactical.png";
import styles from "./ActionToken.module.css";

// The owner's icons: white glyphs on transparent, 150 by 150. They are used as a
// mask, so the glyph takes the token colour (ready or exhausted).
const icons: Readonly<Record<ActionTokenKind, string>> = {
  move: moveIcon,
  trade: tradeIcon,
  interact: interactIcon,
  tactical: tacticalIcon,
};

const labels: Readonly<Record<ActionTokenKind, string>> = {
  move: "Move",
  trade: "Trade",
  interact: "Interact",
  tactical: "Tactical",
};

export interface ActionTokenProps {
  readonly kind: ActionTokenKind;
  readonly exhausted?: boolean;
  /** An officer token belongs to one ship (ACT-1) and is drawn with a pip. */
  readonly officer?: boolean;
  readonly size?: number;
}

export function ActionToken({ kind, exhausted = false, officer = false, size = 36 }: ActionTokenProps) {
  const className = [styles.token, styles[kind], exhausted ? styles.exhausted : styles.ready].join(" ");
  const glyphSize = Math.round(size * 0.62);
  const glyphStyle = {
    width: glyphSize,
    height: glyphSize,
    "--action-icon": `url(${icons[kind]})`,
  } as CSSProperties;
  return (
    <span
      className={className}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${labels[kind]} token, ${exhausted ? "exhausted" : "ready"}${officer ? ", officer" : ""}`}
      title={`${labels[kind]}: ${exhausted ? "exhausted" : "ready"}${officer ? " (officer, one ship only)" : ""}`}
    >
      <span className={styles.glyph} style={glyphStyle} aria-hidden="true" />
      {officer ? <span className={styles.pip} aria-hidden="true" /> : null}
    </span>
  );
}
