import { firstPlayableSlice, fullGameSectorMarkets, s4AssetCards } from "@void-matter/content";
import { AssetCard } from "../../../components/game/AssetCard";
import { cardIllustrationArtForDeck } from "../../../components/game/assetCardArt";
import { Typography } from "../../../components/Typography/Typography";
import { CatalogueDeckBackSection, FigureDeck } from "../GalleryPage/FigureDeck";
import { CardScalesFigure } from "../GalleryPage/Figure";
import galleryStyles from "../GalleryPage/GalleryPage.module.css";
import { catalogueAssetCardsForDeck } from "../../../fixtures/sectorAssetCards";
import styles from "../S1CardsPage/S1CardsPage.module.css";

const catalogueCards = [...catalogueAssetCardsForDeck("s4")].sort((a, b) =>
  a.title.localeCompare(b.title, "en", { sensitivity: "base" }),
);
const missingArt = s4AssetCards.filter((row) => !cardIllustrationArtForDeck(row.illustrationSlug, "s4"));
const deckSize = fullGameSectorMarkets.decks.s4.deckSize;
const s4Market = firstPlayableSlice.sectorMarkets.s4;

/** All S4 (Hull / Defensive) catalogue rows. */
export default function S4CardsPage() {
  return (
    <div className={styles.page}>
      <header className={styles.intro}>
        <Typography variant="overline">Stage 1b · S4 market (`MAP-4`)</Typography>
        <Typography variant="h1">S4 asset cards</Typography>
        <Typography variant="body1">
          Hull / Defensive types from <code>packages/content/data/cards/s4-assets.json</code> ({s4AssetCards.length}{" "}
          JSON rows; <strong>11</strong> deck types, <strong>{deckSize}</strong> physical cards). Titanium Core rim;
          print 65 × 100 mm; hand 118px / inspect 220px.
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
      </section>

      <CatalogueDeckBackSection>
        <FigureDeck
          sector={s4Market.resource}
          sectorDeck="s4"
          count={s4Market.deckSize}
          variant={s4Market.deckBack === "sector" ? "sector" : "procedural"}
        />
      </CatalogueDeckBackSection>
    </div>
  );
}