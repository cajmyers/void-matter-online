import type { GalleryCrewCard } from "../../fixtures/crewCardFixtures";
import type { CrewMarketZoneView } from "../../view/marketZoneView";
import { CrewCard } from "./CrewCard";
import { DeckBack } from "./DeckBack";
import { DiscardPile } from "./DiscardPile";
import { MarketZonePanel } from "./MarketZonePanel";
import { cardWidthHand } from "./cardSizes";

export function CrewMarketZone({
  view,
  cardsById,
  cardWidth = cardWidthHand,
  attachTabs = false,
}: {
  readonly view: CrewMarketZoneView;
  readonly cardsById: Readonly<Record<string, GalleryCrewCard>>;
  readonly cardWidth?: number;
  readonly attachTabs?: boolean;
}) {
  const rim = "var(--game-crew-rim)";
  const faceUpCards = view.faceUpCrewIds.map((id) => cardsById[id]).filter((card): card is GalleryCrewCard => card !== undefined);
  const discardTop = view.discardTopCrewId ? cardsById[view.discardTopCrewId] : undefined;

  return (
    <MarketZonePanel
      title="Crew market"
      subtitle="Recruit at any Nexus"
      rim={rim}
      faceUp={faceUpCards.map((card) => (
        <CrewCard key={card.catalogueId} {...card} width={cardWidth} />
      ))}
      deck={<DeckBack label="Crew deck" count={view.piles.deckCount} rim={rim} width={cardWidth} variant="crew" />}
      discard={
        <DiscardPile
          count={view.piles.discardCount}
          width={cardWidth}
          topCard={discardTop ? <CrewCard {...discardTop} width={cardWidth} /> : undefined}
        />
      }
      footnote="Maintenance discards oldest face-up and refills to 4. Empty deck reshuffles discard (`DCK-2`)."
      cardWidth={cardWidth}
      attachTabs={attachTabs}
    />
  );
}