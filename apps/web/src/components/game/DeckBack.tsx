import type { CSSProperties } from "react";
import { crewDeckBackArt } from "./crewDeckBackArt";
import { enemyDeckBackArt } from "./enemyDeckBackArt";
import { missionDeckBackArt } from "./missionDeckBackArt";
import { shipDeckBackArt } from "./shipDeckBackArt";
import type { SectorArtDeck } from "./assetCardArt";
import { sectorDeckBackArt } from "./sectorDeckBackArt";
import styles from "./DeckBack.module.css";

export type DeckBackVariant = "procedural" | "sector" | "crew" | "enemy" | "mission" | "ship";

export interface DeckBackProps {
  readonly label: string;
  readonly count: number;
  /** A CSS colour (usually a theme variable) for the glowing rim. */
  readonly rim?: string;
  readonly width?: number;
  /** Owner sector market back (`cards/s{1–4}/back/s{n}.webp`). */
  readonly variant?: DeckBackVariant;
  readonly sectorDeck?: SectorArtDeck;
}

/** Deck pile back. Label and count are for accessibility only (gallery captions carry the public count). */
export function DeckBack({
  label,
  count,
  rim = "var(--palette-primary-main)",
  width = 84,
  variant = "procedural",
  sectorDeck,
}: DeckBackProps) {
  const ownerArtUrl =
    variant === "crew"
      ? crewDeckBackArt()
      : variant === "enemy"
        ? enemyDeckBackArt()
        : variant === "mission"
          ? missionDeckBackArt()
          : variant === "ship"
            ? shipDeckBackArt()
            : variant === "sector" && sectorDeck !== undefined
            ? sectorDeckBackArt(sectorDeck)
            : undefined;
  const style = { "--rim": rim, width } as CSSProperties;
  const className = ownerArtUrl ? `${styles.deck} ${styles.ownerBack}` : styles.deck;
  return (
    <div
      className={className}
      style={
        ownerArtUrl ? ({ ...style, backgroundImage: `url(${ownerArtUrl})` } as CSSProperties) : style
      }
      role="img"
      aria-label={`${label}: ${count} cards left`}
    />
  );
}