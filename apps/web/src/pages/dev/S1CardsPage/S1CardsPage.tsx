import { firstPlayableSlice, s1AssetCards } from "@void-matter/content";
import { AssetCard } from "../../../components/game/AssetCard";
import { cardIllustrationArtForDeck } from "../../../components/game/assetCardArt";
import { Typography } from "../../../components/Typography/Typography";
import { CatalogueDeckBackSection, FigureDeck } from "../GalleryPage/FigureDeck";
import { CardScalesFigure } from "../GalleryPage/Figure";
import galleryStyles from "../GalleryPage/GalleryPage.module.css";
import { ownerAssetCardsForDeck } from "../../../fixtures/sectorAssetCards";
import styles from "./S1CardsPage.module.css";

const catalogueCards = [...ownerAssetCardsForDeck("s1")].sort((a, b) =>
  a.title.localeCompare(b.title, "en", { sensitivity: "base" }),
);
const missingArt = s1AssetCards.filter(
  (row) => !cardIllustrationArtForDeck(row.illustrationSlug, "s1"),
);

const s1Market = firstPlayableSlice.sectorMarkets.s1;

/** All S1 (Weapons / Offensive) catalogue rows with owner hero art. */
export default function S1CardsPage() {
  return (
    <div className={styles.page}>
      <header className={styles.intro}>
        <Typography variant="overline">Stage 1b · S1 market (`MAP-4`)</Typography>
        <Typography variant="h1">S1 asset cards</Typography>
        <Typography variant="body1">
          Full Weapons / Offensive deck from <code>packages/content/data/cards/s1-assets.json</code> ({s1AssetCards.length}{" "}
          types). Plasma Cells rim; print 65 × 100 mm; hand 118px / inspect 220px.
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

      <CatalogueDeckBackSection>
        <FigureDeck
          sector={s1Market.resource}
          sectorDeck="s1"
          count={s1Market.deckSize}
          variant={s1Market.deckBack === "sector" ? "sector" : "procedural"}
        />
      </CatalogueDeckBackSection>
    </div>
  );
}