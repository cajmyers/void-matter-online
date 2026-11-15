import { commanderCrew, ensignCrew, firstPlayableSlice } from "@void-matter/content";
import { AssetCard } from "../../../components/game/AssetCard";
import { CrewCard } from "../../../components/game/CrewCard";
import { DeckBack } from "../../../components/game/DeckBack";
import { EnemyCard } from "../../../components/game/EnemyCard";
import { MissionCard } from "../../../components/game/MissionCard";
import { ReferenceCard } from "../../../components/game/ReferenceCard";
import { ShipCard } from "../../../components/game/ShipCard";
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
const ensignGalleryCards = galleryCrewCardsFromCatalogue(ensignCrew, "ensign");
const commanderGalleryExamples = galleryCrewCardsFromCatalogue(
  commanderCrew.filter((row) =>
    ["weapons-officer", "quartermaster", "trade-expert", "void-scout"].includes(row.id),
  ),
  "commander",
);

const sectorDeckLabels: readonly { readonly sector: ResourceId; readonly count: number; readonly useS1Back: boolean }[] = [
  { sector: firstPlayableSlice.sectorMarkets.s1.resource, count: firstPlayableSlice.sectorMarkets.s1.deckSize, useS1Back: true },
  { sector: firstPlayableSlice.sectorMarkets.s2.resource, count: firstPlayableSlice.sectorMarkets.s2.deckSize, useS1Back: false },
  { sector: firstPlayableSlice.sectorMarkets.s3.resource, count: firstPlayableSlice.sectorMarkets.s3.deckSize, useS1Back: false },
  { sector: firstPlayableSlice.sectorMarkets.s4.resource, count: firstPlayableSlice.sectorMarkets.s4.deckSize, useS1Back: false },
];

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
          Crew ensigns (first slice, `ACT-1`) —{" "}
          <a className={styles.inlineLink} href={hrefFor("/dev/crew-cards")}>
            full catalogue
          </a>
        </Typography>
        <div className={styles.grid}>
          {ensignGalleryCards.map((crew) => (
            <CardScalesFigure
              key={crew.catalogueId}
              name={crew.name ?? crew.title}
              note="Ensign · officer token on this ship only"
              render={(width) => <CrewCard {...crew} width={width} />}
            />
          ))}
        </div>
      </div>

      <div className={styles.group}>
        <Typography variant="overline">
          Crew commanders (catalogue sample) —{" "}
          <a className={styles.inlineLink} href={hrefFor("/dev/crew-cards")}>
            full catalogue
          </a>
        </Typography>
        <div className={styles.grid}>
          {commanderGalleryExamples.map((crew) => (
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
        <Typography variant="overline">Reference</Typography>
        <div className={styles.grid}>
          <CardScalesFigure
            name="Dice reference"
            render={(width) => (
              <ReferenceCard
                title="Natural 6"
                text="A natural 6 always hits. A natural 1 always misses, even with accuracy bonuses."
                width={width}
              />
            )}
          />
        </div>
      </div>

      <div className={styles.group}>
        <Typography variant="overline">Deck backs (slice counts)</Typography>
        <div className={styles.grid}>
          {sectorDeckLabels.map(({ sector, count, useS1Back }) => (
            <FigureDeck key={sector} sector={sector} count={count} useS1Back={useS1Back} />
          ))}
          <FigureDeck sector={null} label="Enemy" count={enemyDeckCount} rim="var(--game-faction-iron)" />
          <FigureDeck sector={null} label="Missions" count={firstPlayableSlice.missionDeckSize} rim="var(--palette-primary-main)" />
          <FigureDeck sector={null} label="Crew" count={firstPlayableSlice.crewDeckSize} rim="var(--palette-primary-light)" />
        </div>
      </div>
    </section>
  );
}

function FigureDeck({
  sector,
  count,
  label,
  rim,
  useS1Back = false,
}: {
  readonly sector: ResourceId | null;
  readonly count: number;
  readonly label?: string;
  readonly rim?: string;
  readonly useS1Back?: boolean;
}) {
  const deckLabel = label ?? (sector ? resourceInfo[sector].name : "Deck");
  const deckRim = rim ?? (sector ? `var(--game-resource-${sector})` : "var(--palette-primary-main)");
  const backNote = useS1Back ? `${count} cards · red upgrade back` : `${count} cards · order hidden`;
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
          {...(useS1Back ? { variant: "s1-upgrade" as const } : {})}
        />
      )}
    />
  );
}