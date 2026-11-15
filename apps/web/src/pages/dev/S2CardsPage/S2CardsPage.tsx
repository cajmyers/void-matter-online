import { s2AssetCards } from "@void-matter/content";
import { AssetCard } from "../../../components/game/AssetCard";
import { cardIllustrationArtForDeck } from "../../../components/game/assetCardArt";
import { Typography } from "../../../components/Typography/Typography";
import { CardScalesFigure } from "../GalleryPage/Figure";
import galleryStyles from "../GalleryPage/GalleryPage.module.css";
import { ownerAssetCardsForDeck } from "../../../fixtures/sectorAssetCards";
import styles from "./S2CardsPage.module.css";

const catalogueCards = [...ownerAssetCardsForDeck("s2")].sort((a, b) =>
  a.title.localeCompare(b.title, "en", { sensitivity: "base" }),
);
const missingArt = s2AssetCards.filter(
  (row) => !cardIllustrationArtForDeck(row.illustrationSlug, "s2"),
);

/** All S2 (Propulsion / Utility) catalogue rows with owner hero art. */
export default function S2CardsPage() {
  return (
    <div className={styles.page}>
      <header className={styles.intro}>
        <Typography variant="overline">Stage 1b · S2 market (`MAP-4`)</Typography>
        <Typography variant="h1">S2 asset cards</Typography>
        <Typography variant="body1">
          Full Propulsion / Utility deck from <code>packages/content/data/cards/s2-assets.json</code> ({s2AssetCards.length}{" "}
          types). Helium-3 rim; print 65 × 100 mm; hand 118px / inspect 220px.
        </Typography>
        {missingArt.length > 0 ? (
          <Typography variant="body2" component="p">
            Missing hero art ({missingArt.length}): {missingArt.map((row) => row.title).join(", ")}.
          </Typography>
        ) : null}
      </header>

      <section className={galleryStyles.section}>
        <div className={galleryStyles.grid}>
          {catalogueCards.map((card) => (
            <CardScalesFigure
              key={card.catalogueId}
              name={card.title}
              note={card.category}
              render={(width) => <AssetCard {...card} width={width} />}
            />
          ))}
        </div>
        {catalogueCards.length === 0 ? (
          <Typography variant="body2">No cards with loaded illustrations.</Typography>
        ) : null}
      </section>
    </div>
  );
}