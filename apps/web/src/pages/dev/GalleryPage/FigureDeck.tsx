import type { ReactNode } from "react";
import { DeckBack } from "../../../components/game/DeckBack";
import type { DeckBackVariant } from "../../../components/game/DeckBack";
import type { SectorArtDeck } from "../../../components/game/assetCardArt";
import { sectorDeckForResource } from "../../../components/game/sectorDeck";
import type { ResourceId } from "../../../components/game/resources";
import { resourceInfo } from "../../../components/game/resources";
import { Typography } from "../../../components/Typography/Typography";
import { CardScalesFigure } from "./Figure";
import styles from "./GalleryPage.module.css";

export function FigureDeck({
  sector,
  sectorDeck,
  count,
  label,
  rim,
  variant = "procedural",
}: {
  readonly sector: ResourceId | null;
  readonly sectorDeck?: SectorArtDeck;
  readonly count: number;
  readonly label?: string;
  readonly rim?: string;
  readonly variant?: DeckBackVariant;
}) {
  const deckLabel = label ?? (sector ? resourceInfo[sector].name : "Deck");
  const deckRim = rim ?? (sector ? `var(--game-resource-${sector})` : "var(--palette-primary-main)");
  const resolvedSectorDeck = sectorDeck ?? (sector ? sectorDeckForResource(sector) : undefined);
  const backNote =
    variant === "sector" && resolvedSectorDeck
      ? `${count} cards · owner ${resolvedSectorDeck.toUpperCase()} back`
      : variant === "crew"
        ? `${count} cards · owner crew back`
        : variant === "enemy"
          ? `${count} cards · owner enemy back`
          : variant === "mission"
            ? `${count} cards · owner mission back`
            : variant === "ship"
              ? `${count} cards · owner ship back`
              : `${count} cards · order hidden`;
  return (
    <CardScalesFigure
      name={deckLabel}
      note={backNote}
      render={(width) => (
        <DeckBack
          label={deckLabel}
          count={count}
          rim={deckRim}
          width={width}
          variant={variant}
          {...(variant === "sector" && resolvedSectorDeck ? { sectorDeck: resolvedSectorDeck } : {})}
        />
      )}
    />
  );
}

/** Deck back specimen at the end of a full card catalogue (`#/dev/*-cards`). */
export function CatalogueDeckBackSection({ children }: { readonly children: ReactNode }) {
  return (
    <section className={styles.section}>
      <Typography variant="h2">Deck back</Typography>
      <Typography variant="body2">Slice pile back at hand and inspect widths (same as gallery).</Typography>
      <div className={styles.grid}>{children}</div>
    </section>
  );
}