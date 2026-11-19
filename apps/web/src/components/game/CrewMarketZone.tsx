import type { GalleryCrewCard } from "../../fixtures/crewCardFixtures";
import type { CrewMarketZoneView } from "../../view/marketZoneView";
import { CrewCard } from "./CrewCard";
import { DeckBack } from "./DeckBack";
import { DiscardPile } from "./DiscardPile";
import { MarketZonePanel } from "./MarketZonePanel";
import type { MarketCardInspectTarget } from "../../view/marketCardInspect";
import { BlockContextMenu } from "../table/BlockContextMenu";
import { InspectableMarketCard } from "../table/InspectableMarketCard";
import type { MarketDiscardInspectTarget } from "../../view/marketCardInspect";
import { cardWidthHand, cardWidthMarketPile } from "./cardSizes";

export function CrewMarketZone({
  view,
  cardsById,
  cardWidth = cardWidthHand,
  attachTabs = false,
  showFootnote = true,
  onInspectCard,
  onInspectDiscard,
}: {
  readonly view: CrewMarketZoneView;
  readonly cardsById: Readonly<Record<string, GalleryCrewCard>>;
  readonly cardWidth?: number;
  readonly attachTabs?: boolean;
  readonly showFootnote?: boolean;
  readonly   onInspectCard?: (target: MarketCardInspectTarget) => void;
  onInspectDiscard?: (target: MarketDiscardInspectTarget) => void;
}) {
  const rim = "var(--game-crew-rim)";
  const faceUpCards = view.faceUpCrewIds.map((id) => cardsById[id]).filter((card): card is GalleryCrewCard => card !== undefined);
  const discardTop = view.discardTopCrewId ? cardsById[view.discardTopCrewId] : undefined;
  const pileWidth = cardWidthMarketPile(cardWidth);
  const discardIds = view.discardCardIds ?? (view.discardTopCrewId ? [view.discardTopCrewId] : []);
  const openDiscardInspect = () => {
    if (discardIds.length === 0 || !onInspectDiscard) {
      return;
    }
    onInspectDiscard({ pileKind: "crew", title: "Crew market discard", cardIds: discardIds });
  };

  return (
    <MarketZonePanel
      title="Crew market"
      subtitle="Recruit at any Nexus"
      rim={rim}
      faceUp={faceUpCards.map((card) => {
        const crew = <CrewCard {...card} width={cardWidth} />;
        if (!onInspectCard) {
          return crew;
        }
        return (
          <InspectableMarketCard
            key={card.catalogueId}
            label={card.name ?? card.title}
            onInspect={() => onInspectCard({ kind: "crew", catalogueId: card.catalogueId })}
          >
            {crew}
          </InspectableMarketCard>
        );
      })}
      deck={
        <BlockContextMenu>
          <DeckBack label="Crew deck" count={view.piles.deckCount} rim={rim} width={pileWidth} variant="crew" />
        </BlockContextMenu>
      }
      discard={
        <DiscardPile
          count={view.piles.discardCount}
          width={pileWidth}
          topCard={discardTop ? <CrewCard {...discardTop} width={pileWidth} /> : undefined}
          onInspectDiscard={onInspectDiscard ? openDiscardInspect : undefined}
        />
      }
      {...(showFootnote
        ? {
            footnote:
              "Maintenance discards oldest face-up and refills to 4. Empty deck reshuffles discard (`DCK-2`).",
          }
        : {})}
      cardWidth={cardWidth}
      attachTabs={attachTabs}
    />
  );
}