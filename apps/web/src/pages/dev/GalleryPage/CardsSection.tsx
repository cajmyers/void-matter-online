import { commanderCrew, ensignCrew, firstPlayableSlice } from "@void-matter/content";
import { AssetCard } from "../../../components/game/AssetCard";
import { CrewCard } from "../../../components/game/CrewCard";
import { DeckBack } from "../../../components/game/DeckBack";
import { EnemyCard } from "../../../components/game/EnemyCard";
import { MissionCard } from "../../../components/game/MissionCard";
import { ShipCard } from "../../../components/game/ShipCard";
import type { SectorArtDeck } from "../../../components/game/assetCardArt";
import type { DeckBackVariant } from "../../../components/game/DeckBack";
import { sectorDeckForResource } from "../../../components/game/sectorDeck";
import { resourceInfo, type ResourceId } from "../../../components/game/resources";
import { Typography } from "../../../components/Typography/Typography";
import { enemyFixtures } from "../../../fixtures/cards";
import { galleryCrewCardsFromCatalogue } from "../../../fixtures/crewCardFixtures";
import { hrefFor } from "../../../app/useHashRoute";
import {
  galleryExampleAssetCardsForSectorMarkets,
  sectorDeckLabel,
} from "../../../fixtures/sectorAssetCards";
import { CardScalesFigure } from "./Figure";
import styles from "./GalleryPage.module.css";

const sectorMarketGalleryExamples = galleryExampleAssetCardsForSectorMarkets();
const galleryEnsignSample = galleryCrewCardsFromCatalogue(
  ensignCrew.filter((row) => row.id === "pilot"),
  "ensign",
);
const galleryCommanderSample = galleryCrewCardsFromCatalogue(
  commanderCrew.filter((row) => row.id === "weapons-officer"),
  "commander",
);

const sectorDeckGalleryRows: readonly {
  readonly sector: ResourceId;
  readonly sectorDeck: SectorArtDeck;
  readonly count: number;
  readonly ownerBack: boolean;
}[] = (["s1", "s2", "s3", "s4"] as const).map((key) => {
  const market = firstPlayableSlice.sectorMarkets[key];
  return {
    sector: market.resource,
    sectorDeck: key,
    count: market.deckSize,
    ownerBack: market.deckBack === "sector",
  };
});

const enemyDeckCount =
  firstPlayableSlice.enemyDecks["iron-syndicate"].explorationSize +
  firstPlayableSlice.enemyDecks["iron-syndicate"].reinforcementSize;

export function CardsSection() {
  return (
    <section className={styles.section} id="cards">
      <Typography variant="h3">Cards</Typography>
      <Typography variant="body2">
        All sector asset cards share one layout (`AssetCard`): ship module header, cost pips, art window, rules panel,
        and slot marker on art. Rim colour follows the sector (`MAP-4`). Print 65 × 100 mm; hand 118px wide, inspect
        220px. Full catalogues:{" "}
        <a className={styles.inlineLink} href={hrefFor("/dev/s1-cards")}>
          S1
        </a>
        {", "}
        <a className={styles.inlineLink} href={hrefFor("/dev/s2-cards")}>
          S2
        </a>
        {", "}
        <a className={styles.inlineLink} href={hrefFor("/dev/s3-cards")}>
          S3
        </a>
        {", "}
        <a className={styles.inlineLink} href={hrefFor("/dev/s4-cards")}>
          S4
        </a>
        .
      </Typography>

      <div className={styles.group}>
        <Typography variant="overline">Sector markets (S1–S4, one example each)</Typography>
        <div className={styles.grid}>
          {sectorMarketGalleryExamples.map((card) => (
            <CardScalesFigure
              key={card.catalogueId}
              name={card.title}
              note={sectorDeckLabel[card.sectorDeck]}
              render={(width) => <AssetCard {...card} width={width} />}
            />
          ))}
        </div>
      </div>

      <div className={styles.group}>
        <Typography variant="overline">
          Crew (one Ensign, one Commander) —{" "}
          <a className={styles.inlineLink} href={hrefFor("/dev/crew-cards")}>
            full catalogue
          </a>
        </Typography>
        <div className={styles.grid}>
          {galleryEnsignSample.map((crew) => (
            <CardScalesFigure
              key={crew.catalogueId}
              name={crew.name ?? crew.title}
              note="Ensign · officer token on this ship only"
              render={(width) => <CrewCard {...crew} width={width} />}
            />
          ))}
          {galleryCommanderSample.map((crew) => (
            <CardScalesFigure
              key={crew.catalogueId}
              name={crew.name ?? crew.title}
              note="Commander · trait + officer token"
              render={(width) => <CrewCard {...crew} width={width} />}
            />
          ))}
        </div>
      </div>

      <div className={styles.group}>
        <Typography variant="overline">Missions</Typography>
        <div className={styles.grid}>
          <CardScalesFigure
            name="Syndicate Bust (in progress)"
            note="Combat mission, slice deck"
            render={(width) => (
              <MissionCard
                title="Syndicate Bust"
                text="Destroy 2 Iron Syndicate ships in one globalRound."
                voidMatter={1}
                width={width}
              />
            )}
          />
          <CardScalesFigure
            name="Syndicate Bust (complete)"
            render={(width) => (
              <MissionCard
                title="Syndicate Bust"
                text="Destroy 2 Iron Syndicate ships in one globalRound."
                voidMatter={1}
                complete
                width={width}
              />
            )}
          />
        </div>
      </div>

      <div className={styles.group}>
        <Typography variant="overline">Enemy ships (Iron Syndicate slice)</Typography>
        <div className={styles.grid}>
          {enemyFixtures.map((enemy) => (
            <CardScalesFigure
              key={enemy.name}
              name={enemy.name}
              note={`Level ${enemy.tier} · ${enemy.tier} reward card${enemy.tier === 1 ? "" : "s"}`}
              render={(width) => (
                <EnemyCard
                  name={enemy.name}
                  tier={enemy.tier}
                  hull={enemy.hull}
                  speed={enemy.speed}
                  weapons={enemy.weapons}
                  special={enemy.special}
                  width={width}
                />
              )}
            />
          ))}
        </div>
      </div>

      <div className={styles.group}>
        <Typography variant="overline">Ship card (`SLT-1` halves)</Typography>
        <div className={styles.grid}>
          <CardScalesFigure
            name="Nomad-class Corvette"
            note="Sample install: ½ + ½ in slot 1, one full slot used"
            render={(width) => (
              <ShipCard
                name="Nomad-class Corvette"
                subtitle="Starting ship"
                speed={2}
                hull={1}
                crew={1}
                cargo={2}
                slotFill={[2, 0, 1, 0]}
                width={width}
              />
            )}
          />
        </div>
      </div>

      <div className={styles.group}>
        <Typography variant="overline">Deck backs (slice counts)</Typography>
        <div className={styles.grid}>
          {sectorDeckGalleryRows.map(({ sector, sectorDeck, count, ownerBack }) => (
            <FigureDeck
              key={sector}
              sector={sector}
              sectorDeck={sectorDeck}
              count={count}
              variant={ownerBack ? "sector" : "procedural"}
            />
          ))}
          <FigureDeck
            sector={null}
            label="Enemy"
            count={enemyDeckCount}
            rim="var(--game-faction-iron)"
            variant="enemy"
          />
          <FigureDeck
            sector={null}
            label="Missions"
            count={firstPlayableSlice.missionDeckSize}
            rim="var(--palette-primary-main)"
            variant="mission"
          />
          <FigureDeck
            sector={null}
            label="Crew"
            count={firstPlayableSlice.crewDeckSize}
            rim="var(--palette-primary-light)"
            variant="crew"
          />
          <FigureDeck
            sector={null}
            label="Ships"
            count={firstPlayableSlice.includedPlayerShipIds.length}
            rim="var(--palette-secondary-main)"
            variant="ship"
          />
        </div>
      </div>
    </section>
  );
}

function FigureDeck({
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