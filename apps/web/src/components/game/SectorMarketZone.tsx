import { AssetCard } from "./AssetCard";
import { DeckBack } from "./DeckBack";
import { DiscardPile } from "./DiscardPile";
import { MarketZonePanel } from "./MarketZonePanel";
import type { OwnerGalleryAssetCard } from "../../fixtures/sectorAssetCards";
import type { SectorMarketZoneView } from "../../view/marketZoneView";
import { cardWidthHand } from "./cardSizes";

export function SectorMarketZone({
  view,
  cardsById,
  cardWidth = cardWidthHand,
  attachTabs = false,
}: {
  readonly view: SectorMarketZoneView;
  readonly cardsById: Readonly<Record<string, OwnerGalleryAssetCard>>;
  readonly cardWidth?: number;
  readonly attachTabs?: boolean;
}) {
  const rim = `var(--game-resource-${view.resource})`;
  const faceUpCards = view.faceUpCardIds.map((id) => cardsById[id]).filter((card): card is OwnerGalleryAssetCard => card !== undefined);
  const discardTop = view.discardTopCardId ? cardsById[view.discardTopCardId] : undefined;
  const deckVariant = view.useOwnerDeckBack === false ? "procedural" : "sector";

  return (
    <MarketZonePanel
      title={view.label}
      subtitle="Buy at Nexus (`MAP-4`)"
      rim={rim}
      faceUp={faceUpCards.map((card, index) => (
        <AssetCard key={`${card.catalogueId}-${index}`} {...card} width={cardWidth} />
      ))}
      deck={
        <DeckBack
          label="Deck"
          count={view.piles.deckCount}
          rim={rim}
          width={cardWidth}
          variant={deckVariant}
          sectorDeck={view.sectorDeck}
        />
      }
      discard={
        <DiscardPile
          count={view.piles.discardCount}
          width={cardWidth}
          topCard={discardTop ? <AssetCard {...discardTop} width={cardWidth} /> : undefined}
        />
      }
      footnote="Deck order hidden. Refill to 3 immediately on purchase (`DCK-1`). Empty deck reshuffles discard (`DCK-2`)."
      cardWidth={cardWidth}
      attachTabs={attachTabs}
    />
  );
}