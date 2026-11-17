import {
  commanderCrew,
  ensignCrew,
  firstPlayableSlice,
  enemyCatalogue,
  missionCatalogue,
  playerShips,
} from "@void-matter/content";
import { AssetCard } from "../../../components/game/AssetCard";
import { CrewCard } from "../../../components/game/CrewCard";
import { EnemyCard } from "../../../components/game/EnemyCard";
import { MissionCard } from "../../../components/game/MissionCard";
import { ShipCard } from "../../../components/game/ShipCard";
import type { SectorArtDeck } from "../../../components/game/assetCardArt";
import type { ResourceId } from "../../../components/game/resources";
import { Typography } from "../../../components/Typography/Typography";
import { galleryCrewCardsFromCatalogue } from "../../../fixtures/crewCardFixtures";
import { shipCardPropsFromPlayerShip } from "../../../fixtures/shipCardFixtures";
import { hrefFor } from "../../../app/useHashRoute";
import {
  galleryExampleAssetCardsForSectorMarkets,
  sectorDeckLabel,
} from "../../../fixtures/sectorAssetCards";
import { CardScalesFigure } from "./Figure";
import { FigureDeck } from "./FigureDeck";
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
  firstPlayableSlice.enemyDecks.explorationSize + firstPlayableSlice.enemyDecks.reinforcementSize;

const galleryMissionSample = missionCatalogue.find((mission) => mission.id === "syndicate-bust");

const galleryEnemySampleIds = ["iron-skiff", "prism-spark", "swarm-larva"] as const;
const galleryEnemySamples = galleryEnemySampleIds
  .map((id) => enemyCatalogue.find((enemy) => enemy.id === id))
  .filter((enemy): enemy is NonNullable<typeof enemy> => enemy !== undefined);

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
              note={card.sectorDeck ? sectorDeckLabel[card.sectorDeck] : "Sector asset"}
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
        <Typography variant="overline">
          Missions (Syndicate Bust sample) —{" "}
          <a className={styles.inlineLink} href={hrefFor("/dev/mission-cards")}>
            full catalogue
          </a>
        </Typography>
        <div className={styles.grid}>
          {galleryMissionSample ? (
            <>
              <CardScalesFigure
                name={`${galleryMissionSample.title} (in progress)`}
                note="Combat mission, slice deck"
                render={(width) => (
                  <MissionCard
                    catalogueId={galleryMissionSample.id}
                    title={galleryMissionSample.title}
                    text={galleryMissionSample.text}
                    voidMatter={galleryMissionSample.voidMatter}
                    width={width}
                  />
                )}
              />
              <CardScalesFigure
                name={`${galleryMissionSample.title} (ready to redeem)`}
                note="Central Nexus · Interact"
                render={(width) => (
                  <MissionCard
                    catalogueId={galleryMissionSample.id}
                    title={galleryMissionSample.title}
                    text={galleryMissionSample.text}
                    voidMatter={galleryMissionSample.voidMatter}
                    readyToRedeem
                    width={width}
                  />
                )}
              />
              <CardScalesFigure
                name={`${galleryMissionSample.title} (redeemed)`}
                note="VM in faction pool"
                render={(width) => (
                  <MissionCard
                    catalogueId={galleryMissionSample.id}
                    title={galleryMissionSample.title}
                    text={galleryMissionSample.text}
                    voidMatter={galleryMissionSample.voidMatter}
                    redeemed
                    width={width}
                  />
                )}
              />
            </>
          ) : null}
        </div>
      </div>

      <div className={styles.group}>
        <Typography variant="overline">
          Enemy ships (one level-1 scout per faction) —{" "}
          <a className={styles.inlineLink} href={hrefFor("/dev/enemy-cards")}>
            full catalogue
          </a>
        </Typography>
        <div className={styles.grid}>
          {galleryEnemySamples.map((enemy) => (
            <CardScalesFigure
              key={enemy.id}
              name={enemy.name}
              note={`Level ${enemy.tier} · ${enemy.tier} reward card${enemy.tier === 1 ? "" : "s"}`}
              render={(width) => (
                <EnemyCard
                  enemyId={enemy.id}
                  name={enemy.name}
                  faction={enemy.faction}
                  tier={enemy.tier}
                  hull={enemy.hull}
                  speed={enemy.speed}
                  weapons={enemy.weaponsLine}
                  special={enemy.specialText}
                  width={width}
                />
              )}
            />
          ))}
        </div>
      </div>

      <div className={styles.group}>
        <Typography variant="overline">
          Player ship —{" "}
          <a className={styles.inlineLink} href={hrefFor("/dev/ship-cards")}>
            full catalogue
          </a>
        </Typography>
        <div className={styles.grid}>
          {playerShips[0] ? (
            <CardScalesFigure
              name={playerShips[0].title}
              note={`${playerShips[0].upgradeSlotsHalves / 2} upgrade slots`}
              render={(width) => (
                <ShipCard {...shipCardPropsFromPlayerShip(playerShips[0]!)} width={width} />
              )}
            />
          ) : null}
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
            rim="var(--game-mission-rim)"
            variant="mission"
          />
          <FigureDeck
            sector={null}
            label="Crew"
            count={firstPlayableSlice.crewDeckSize}
            rim="var(--game-crew-rim)"
            variant="crew"
          />
          <FigureDeck
            sector={null}
            label="Ships"
            count={firstPlayableSlice.includedPlayerShipIds.length}
            rim="var(--game-ship-rim)"
            variant="ship"
          />
        </div>
      </div>
    </section>
  );
}