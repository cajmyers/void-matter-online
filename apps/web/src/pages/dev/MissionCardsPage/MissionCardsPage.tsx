import {
  firstPlayableMissionDeck,
  firstPlayableSlice,
  fullGameMissionDeck,
  missionCatalogue,
} from "@void-matter/content";
import { MissionCard } from "../../../components/game/MissionCard";
import { Typography } from "../../../components/Typography/Typography";
import { CatalogueDeckBackSection, FigureDeck } from "../GalleryPage/FigureDeck";
import { CardScalesFigure } from "../GalleryPage/Figure";
import galleryStyles from "../GalleryPage/GalleryPage.module.css";
import styles from "../S1CardsPage/S1CardsPage.module.css";

const catalogueById = new Map(missionCatalogue.map((mission) => [mission.id, mission]));

const sliceMissions = firstPlayableMissionDeck.cards
  .map((entry) => {
    const mission = catalogueById.get(entry.missionId);
    if (!mission) {
      return null;
    }
    return { ...mission, copies: entry.copies };
  })
  .filter((row): row is NonNullable<typeof row> => row !== null)
  .sort((a, b) => a.title.localeCompare(b.title, "en", { sensitivity: "base" }));

const notInSlice = missionCatalogue
  .filter((mission) => !sliceMissions.some((row) => row.id === mission.id))
  .sort((a, b) => a.title.localeCompare(b.title, "en", { sensitivity: "base" }));

function deckNote(copies: number): string {
  return copies === 1 ? "1× in slice deck" : `${copies}× in slice deck`;
}

export default function MissionCardsPage() {
  return (
    <div className={styles.page}>
      <header className={styles.intro}>
        <Typography variant="overline">Stage 1b · Missions (`MSN-3`)</Typography>
        <Typography variant="h1">Mission cards</Typography>
        <Typography variant="body1">
          Catalogue in <code>packages/content/data/missions/missions.json</code> ({missionCatalogue.length} PvE types;
          7 PvP types omitted from data). First-playable deck: <strong>{firstPlayableSlice.missionDeckSize}</strong>{" "}
          physical cards ({sliceMissions.length} types). Each redeem grants 1 Void Matter. Print 65 × 100 mm; hand 118px
          / inspect 220px.
        </Typography>
      </header>

      <section className={galleryStyles.section}>
        <Typography variant="h2">Slice deck</Typography>
        <Typography variant="body2">
          From <code>mission-deck-slice.json</code> — same 29-card PvE deck as full game (`MSN-3`; all enemy factions in
          play).
        </Typography>
        <div className={galleryStyles.grid}>
          {sliceMissions.map((mission) => (
            <CardScalesFigure
              key={mission.id}
              name={mission.title}
              note={deckNote(mission.copies)}
              render={(width) => (
                <MissionCard
                  catalogueId={mission.id}
                  title={mission.title}
                  text={mission.text}
                  voidMatter={mission.voidMatter}
                  width={width}
                />
              )}
            />
          ))}
        </div>
      </section>

      {notInSlice.length > 0 ? (
        <section className={galleryStyles.section}>
          <Typography variant="h2">Catalogue only (not in slice)</Typography>
          <Typography variant="body2">
            In the full PvE deck ({fullGameMissionDeck.deckSize} cards) but excluded from the Iron Syndicate slice.
          </Typography>
          <div className={galleryStyles.grid}>
            {notInSlice.map((mission) => (
              <CardScalesFigure
                key={mission.id}
                name={mission.title}
                note="Full PvE deck only"
                render={(width) => (
                  <MissionCard
                    catalogueId={mission.id}
                    title={mission.title}
                    text={mission.text}
                    voidMatter={mission.voidMatter}
                    width={width}
                  />
                )}
              />
            ))}
          </div>
        </section>
      ) : null}

      <section className={galleryStyles.section}>
        <Typography variant="h2">Complete and redeemed</Typography>
        <Typography variant="body2">
          Condition met (redeem at Central Nexus), then after the Redeem action VM is in the faction pool.
        </Typography>
        <div className={galleryStyles.grid}>
          {sliceMissions
            .filter((mission) => mission.id === "syndicate-bust")
            .flatMap((mission) => [
              <CardScalesFigure
                key={`${mission.id}-ready`}
                name={`${mission.title} (ready)`}
                note="Ready to redeem at Central Nexus"
                render={(width) => (
                  <MissionCard
                    catalogueId={mission.id}
                    title={mission.title}
                    text={mission.text}
                    voidMatter={mission.voidMatter}
                    readyToRedeem
                    width={width}
                  />
                )}
              />,
              <CardScalesFigure
                key={`${mission.id}-redeemed`}
                name={`${mission.title} (redeemed)`}
                note="Redeem action taken — VM in pool"
                render={(width) => (
                  <MissionCard
                    catalogueId={mission.id}
                    title={mission.title}
                    text={mission.text}
                    voidMatter={mission.voidMatter}
                    redeemed
                    width={width}
                  />
                )}
              />,
            ])}
        </div>
      </section>

      <CatalogueDeckBackSection>
        <FigureDeck
          sector={null}
          label="Missions"
          count={firstPlayableSlice.missionDeckSize}
          rim="var(--game-mission-rim)"
          variant="mission"
        />
      </CatalogueDeckBackSection>
    </div>
  );
}