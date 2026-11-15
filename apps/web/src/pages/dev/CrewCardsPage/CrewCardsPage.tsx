import { commanderCrew, ensignCrew, firstPlayableSlice } from "@void-matter/content";
import { CrewCard } from "../../../components/game/CrewCard";
import { Typography } from "../../../components/Typography/Typography";
import { CardScalesFigure } from "../GalleryPage/Figure";
import galleryStyles from "../GalleryPage/GalleryPage.module.css";
import { galleryCrewCardsFromCatalogue } from "../../../fixtures/crewCardFixtures";
import styles from "../S1CardsPage/S1CardsPage.module.css";

const ensignCards = [...galleryCrewCardsFromCatalogue(ensignCrew, "ensign")].sort((a, b) =>
  a.title.localeCompare(b.title, "en", { sensitivity: "base" }),
);
const commanderCards = [...galleryCrewCardsFromCatalogue(commanderCrew, "commander")].sort((a, b) =>
  (a.name ?? a.title).localeCompare(b.name ?? b.title, "en", { sensitivity: "base" }),
);
const sliceDeckSize = firstPlayableSlice.crewDeckSize;

export default function CrewCardsPage() {
  return (
    <div className={styles.page}>
      <header className={styles.intro}>
        <Typography variant="overline">Stage 1b · Crew market (`ACT-1`)</Typography>
        <Typography variant="h1">Crew cards</Typography>
        <Typography variant="body1">
          Catalogue in <code>packages/content/data/crew/</code> ({ensignCrew.length} Ensigns, {commanderCrew.length}{" "}
          Commanders). First-playable crew deck: <strong>{sliceDeckSize}</strong> physical cards (four Ensign types only,
          4 face-up in market). Crew face texture; print 65 × 100 mm; hand 118px / inspect 220px. Commanders use the
          same chrome with a rules paragraph in the text box.
        </Typography>
      </header>

      <section className={galleryStyles.section}>
        <Typography variant="h2">Ensigns</Typography>
        <Typography variant="body2">
          From <code>ensigns.json</code> — plain action tokens; no rules text on the card face.
        </Typography>
        <div className={galleryStyles.grid}>
          {ensignCards.map((card) => (
            <CardScalesFigure
              key={card.catalogueId}
              name={card.name ?? card.title}
              note="Ensign · officer token on this ship only"
              render={(width) => <CrewCard {...card} width={width} />}
            />
          ))}
        </div>
      </section>

      <section className={galleryStyles.section}>
        <Typography variant="h2">Commanders</Typography>
        <Typography variant="body2">
          From <code>commanders.json</code> — trait rules plus officer action token (`ACT-1`). Recruitment costs are
          locked (`CRE-2`, `content-data.md` §2b).
        </Typography>
        <div className={galleryStyles.grid}>
          {commanderCards.map((card) => (
            <CardScalesFigure
              key={card.catalogueId}
              name={card.name ?? card.title}
              note="Commander · officer token on this ship only"
              render={(width) => <CrewCard {...card} width={width} />}
            />
          ))}
        </div>
      </section>
    </div>
  );
}