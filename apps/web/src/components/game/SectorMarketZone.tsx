import { AssetCard } from "./AssetCard";
import { DeckBack } from "./DeckBack";
import { DiscardPile } from "./DiscardPile";
import { MarketZonePanel } from "./MarketZonePanel";
import type { OwnerGalleryAssetCard } from "../../fixtures/sectorAssetCards";
import type { SectorMarketZoneView } from "../../view/marketZoneView";
import type { MarketCardInspectTarget } from "../../view/marketCardInspect";
import { BlockContextMenu } from "../table/BlockContextMenu";
import { InspectableMarketCard } from "../table/InspectableMarketCard";
import type { MarketDiscardInspectTarget } from "../../view/marketCardInspect";
import { cardWidthHand, cardWidthMarketPile } from "./cardSizes";

export function SectorMarketZone({
  view,
  cardsById,
  cardWidth = cardWidthHand,
  attachTabs = false,
  showFootnote = true,
  onInspectCard,
  onInspectDiscard,
}: {
  readonly view: SectorMarketZoneView;
  readonly cardsById: Readonly<Record<string, OwnerGalleryAssetCard>>;
  readonly cardWidth?: number;
  readonly attachTabs?: boolean;
  readonly showFootnote?: boolean;
  readonly   onInspectCard?: (target: MarketCardInspectTarget) => void;
  onInspectDiscard?: (target: MarketDiscardInspectTarget) => void;
}) {
  const rim = `var(--game-resource-${view.resource})`;
  const faceUpCards = view.faceUpCardIds.map((id) => cardsById[id]).filter((card): card is OwnerGalleryAssetCard => card !== undefined);
  const discardTop = view.discardTopCardId ? cardsById[view.discardTopCardId] : undefined;
  const deckVariant = view.useOwnerDeckBack === false ? "procedural" : "sector";
  const pileWidth = cardWidthMarketPile(cardWidth);
  const discardIds =
    view.discardCardIds ?? (view.discardTopCardId ? [view.discardTopCardId] : []);
  const openDiscardInspect = () => {
    if (discardIds.length === 0 || !onInspectDiscard) {
      return;
    }
    onInspectDiscard({
      pileKind: "asset",
      title: `${view.label} discard`,
      cardIds: discardIds,
    });
  };

  return (
    <MarketZonePanel
      title={view.label}
      subtitle="Buy at Nexus (`MAP-4`)"
      rim={rim}
      faceUp={faceUpCards.map((card, index) => {
        const asset = <AssetCard {...card} width={cardWidth} />;
        if (!onInspectCard) {
          return asset;
        }
        return (
          <InspectableMarketCard
            key={`${card.catalogueId}-${index}`}
            label={card.title}
            onInspect={() => onInspectCard({ kind: "asset", catalogueId: card.catalogueId })}
          >
            {asset}
          </InspectableMarketCard>
        );
      })}
      deck={
        <BlockContextMenu>
          <DeckBack
            label="Deck"
            count={view.piles.deckCount}
            rim={rim}
            width={pileWidth}
            variant={deckVariant}
            sectorDeck={view.sectorDeck}
          />
        </BlockContextMenu>
      }
      discard={
        <DiscardPile
          count={view.piles.discardCount}
          width={pileWidth}
          topCard={discardTop ? <AssetCard {...discardTop} width={pileWidth} /> : undefined}
          onInspectDiscard={onInspectDiscard ? openDiscardInspect : undefined}
        />
      }
      {...(showFootnote
        ? {
            footnote:
              "Deck order hidden. Refill to 3 immediately on purchase (`DCK-1`). Empty deck reshuffles discard (`DCK-2`).",
          }
        : {})}
      cardWidth={cardWidth}
      attachTabs={attachTabs}
    />
  );
}