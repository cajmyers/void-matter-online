import { firstPlayableSlice, playerShips } from "@void-matter/content";
import { ShipCard } from "../../../components/game/ShipCard";
import { Typography } from "../../../components/Typography/Typography";
import { shipCardPropsFromPlayerShip } from "../../../fixtures/shipCardFixtures";
import { CatalogueDeckBackSection, FigureDeck } from "../GalleryPage/FigureDeck";
import { CardScalesFigure } from "../GalleryPage/Figure";
import galleryStyles from "../GalleryPage/GalleryPage.module.css";
import styles from "../S1CardsPage/S1CardsPage.module.css";

const catalogueShips = [...playerShips].sort((a, b) =>
  a.title.localeCompare(b.title, "en", { sensitivity: "base" }),
);

function shipNote(shipId: string): string {
  const inSlice = firstPlayableSlice.includedPlayerShipIds.includes(shipId);
  const halves = playerShips.find((row) => row.id === shipId)?.upgradeSlotsHalves;
  const slots = halves !== undefined ? halves / 2 : "?";
  return inSlice
    ? `First-playable starter · ${slots} upgrade slots`
    : `Catalogue only · ${slots} upgrade slots`;
}

export default function ShipCardsPage() {
  return (
    <div className={styles.page}>
      <header className={styles.intro}>
        <Typography variant="overline">Stage 1b · Player ships</Typography>
        <Typography variant="h1">Ship cards</Typography>
        <Typography variant="body1">
          Catalogue in <code>packages/content/data/ships/player-ships.json</code> —{" "}
          <strong>{playerShips.length}</strong> hull type{playerShips.length === 1 ? "" : "s"} in data today. The
          first-playable slice includes <strong>{firstPlayableSlice.includedPlayerShipIds.length}</strong> (
          {firstPlayableSlice.includedPlayerShipIds.join(", ")}). Build cost is on the art rail (starting ship is free;
          additional hulls pay from the faction pool at a Nexus). Slot capacity uses the module icon on the art plate
          (`SLT-1`). Print 65 × 100 mm; hand 118px / inspect 220px.
        </Typography>
      </header>

      <section className={galleryStyles.section}>
        <Typography variant="h2">Catalogue</Typography>
        <Typography variant="body2">Printed face: title, hero art, build cost, slot count, and base stats.</Typography>
        <div className={galleryStyles.grid}>
          {catalogueShips.map((ship) => {
            const base = shipCardPropsFromPlayerShip(ship);
            return (
              <CardScalesFigure
                key={ship.id}
                name={ship.title}
                note={shipNote(ship.id)}
                render={(width) => <ShipCard {...base} width={width} />}
              />
            );
          })}
        </div>
      </section>

      <CatalogueDeckBackSection>
        <FigureDeck
          sector={null}
          label="Ships (slice)"
          count={firstPlayableSlice.includedPlayerShipIds.length}
          rim="var(--game-ship-rim)"
          variant="ship"
        />
      </CatalogueDeckBackSection>
    </div>
  );
}