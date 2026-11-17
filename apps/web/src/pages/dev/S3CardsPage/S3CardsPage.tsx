import { firstPlayableSlice, s3AssetCards } from "@void-matter/content";
import { AssetCard } from "../../../components/game/AssetCard";
import { cardIllustrationArtForDeck } from "../../../components/game/assetCardArt";
import { Typography } from "../../../components/Typography/Typography";
import { CatalogueDeckBackSection, FigureDeck } from "../GalleryPage/FigureDeck";
import { CardScalesFigure } from "../GalleryPage/Figure";
import galleryStyles from "../GalleryPage/GalleryPage.module.css";
import { catalogueAssetCardsForDeck } from "../../../fixtures/sectorAssetCards";
import styles from "../S1CardsPage/S1CardsPage.module.css";

const catalogueCards = [...catalogueAssetCardsForDeck("s3")].sort((a, b) =>
  a.title.localeCompare(b.title, "en", { sensitivity: "base" }),
);
const missingArt = s3AssetCards.filter((row) => !cardIllustrationArtForDeck(row.illustrationSlug, "s3"));

const s3Market = firstPlayableSlice.sectorMarkets.s3;

/** All S3 (Cargo / Life Support) catalogue rows with owner hero art. */
export default function S3CardsPage() {
  return (
    <div className={styles.page}>
      <header className={styles.intro}>
        <Typography variant="overline">Stage 1b · S3 market (`MAP-4`)</Typography>
        <Typography variant="h1">S3 asset cards</Typography>
        <Typography variant="body1">
          Cargo / Life Support types from <code>packages/content/data/cards/s3-assets.json</code> ({s3AssetCards.length}{" "}
          JSON rows; <strong>11</strong> deck types, <strong>18</strong> physical cards). Quantum Prime rim; print 65 ×
          100 mm; hand 118px / inspect 220px.
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
              note={
                card.illustrationUrl
                  ? card.category
                  : `${card.category} · missing hero art`
              }
              render={(width) => <AssetCard {...card} width={width} />}
            />
          ))}
        </div>
        {catalogueCards.length === 0 ? (
          <Typography variant="body2">No cards with loaded illustrations.</Typography>
        ) : null}
      </section>

      <CatalogueDeckBackSection>
        <FigureDeck
          sector={s3Market.resource}
          sectorDeck="s3"
          count={s3Market.deckSize}
          variant={s3Market.deckBack === "sector" ? "sector" : "procedural"}
        />
      </CatalogueDeckBackSection>
    </div>
  );
}