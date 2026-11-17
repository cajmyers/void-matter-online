import type { MissionCard as MissionCatalogueRow } from "@void-matter/content";
import type { MissionMarketZoneView } from "../../view/marketZoneView";
import { DeckBack } from "./DeckBack";
import { DiscardPile } from "./DiscardPile";
import { MarketZonePanel } from "./MarketZonePanel";
import { MissionCard } from "./MissionCard";
import { cardWidthHand } from "./cardSizes";

export function MissionMarketZone({
  view,
  missionsById,
  cardWidth = cardWidthHand,
  attachTabs = false,
}: {
  readonly view: MissionMarketZoneView;
  readonly missionsById: Readonly<Record<string, MissionCatalogueRow>>;
  readonly cardWidth?: number;
  readonly attachTabs?: boolean;
}) {
  const rim = "var(--game-mission-rim)";
  const faceUp = view.faceUpMissionIds
    .map((id) => missionsById[id])
    .filter((row): row is MissionCatalogueRow => row !== undefined);
  const discardTop = view.discardTopMissionId ? missionsById[view.discardTopMissionId] : undefined;

  return (
    <MarketZonePanel
      title="Mission market"
      subtitle="Take at Outer Rim Nexus"
      rim={rim}
      faceUp={faceUp.map((mission) => (
        <MissionCard
          key={mission.id}
          catalogueId={mission.id}
          title={mission.title}
          text={mission.text}
          voidMatter={mission.voidMatter}
          width={cardWidth}
        />
      ))}
      deck={<DeckBack label="Mission deck" count={view.piles.deckCount} rim={rim} width={cardWidth} variant="mission" />}
      discard={
        <DiscardPile
          count={view.piles.discardCount}
          width={cardWidth}
          topCard={
            discardTop ? (
              <MissionCard
                catalogueId={discardTop.id}
                title={discardTop.title}
                text={discardTop.text}
                voidMatter={discardTop.voidMatter}
                width={cardWidth}
              />
            ) : undefined
          }
        />
      }
      footnote="Refill to 4 in Maintenance (New Objectives). Bureau Interact replaces one face-up immediately (`DCK-1` does not apply)."
      cardWidth={cardWidth}
      attachTabs={attachTabs}
    />
  );
}