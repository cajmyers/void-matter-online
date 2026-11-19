import type { MissionCard as MissionCatalogueRow } from "@void-matter/content";
import type { MissionMarketZoneView } from "../../view/marketZoneView";
import { DeckBack } from "./DeckBack";
import { DiscardPile } from "./DiscardPile";
import { MarketZonePanel } from "./MarketZonePanel";
import { MissionCard } from "./MissionCard";
import type { MarketCardInspectTarget } from "../../view/marketCardInspect";
import { BlockContextMenu } from "../table/BlockContextMenu";
import { InspectableMarketCard } from "../table/InspectableMarketCard";
import type { MarketDiscardInspectTarget } from "../../view/marketCardInspect";
import { cardWidthHand, cardWidthMarketPile } from "./cardSizes";

export function MissionMarketZone({
  view,
  missionsById,
  cardWidth = cardWidthHand,
  attachTabs = false,
  showFootnote = true,
  onInspectCard,
  onInspectDiscard,
}: {
  readonly view: MissionMarketZoneView;
  readonly missionsById: Readonly<Record<string, MissionCatalogueRow>>;
  readonly cardWidth?: number;
  readonly attachTabs?: boolean;
  readonly showFootnote?: boolean;
  readonly   onInspectCard?: (target: MarketCardInspectTarget) => void;
  onInspectDiscard?: (target: MarketDiscardInspectTarget) => void;
}) {
  const rim = "var(--game-mission-rim)";
  const faceUp = view.faceUpMissionIds
    .map((id) => missionsById[id])
    .filter((row): row is MissionCatalogueRow => row !== undefined);
  const discardTop = view.discardTopMissionId ? missionsById[view.discardTopMissionId] : undefined;
  const pileWidth = cardWidthMarketPile(cardWidth);
  const discardIds =
    view.discardCardIds ?? (view.discardTopMissionId ? [view.discardTopMissionId] : []);
  const openDiscardInspect = () => {
    if (discardIds.length === 0 || !onInspectDiscard) {
      return;
    }
    onInspectDiscard({ pileKind: "mission", title: "Mission market discard", cardIds: discardIds });
  };

  return (
    <MarketZonePanel
      title="Mission market"
      subtitle="Take at Outer Rim Nexus"
      rim={rim}
      faceUp={faceUp.map((mission) => {
        const face = (
          <MissionCard
            catalogueId={mission.id}
            title={mission.title}
            text={mission.text}
            voidMatter={mission.voidMatter}
            width={cardWidth}
          />
        );
        if (!onInspectCard) {
          return face;
        }
        return (
          <InspectableMarketCard
            key={mission.id}
            label={mission.title}
            onInspect={() => onInspectCard({ kind: "mission", catalogueId: mission.id })}
          >
            {face}
          </InspectableMarketCard>
        );
      })}
      deck={
        <BlockContextMenu>
          <DeckBack label="Mission deck" count={view.piles.deckCount} rim={rim} width={pileWidth} variant="mission" />
        </BlockContextMenu>
      }
      discard={
        <DiscardPile
          count={view.piles.discardCount}
          width={pileWidth}
          onInspectDiscard={onInspectDiscard ? openDiscardInspect : undefined}
          topCard={
            discardTop ? (
              <MissionCard
                catalogueId={discardTop.id}
                title={discardTop.title}
                text={discardTop.text}
                voidMatter={discardTop.voidMatter}
                width={pileWidth}
              />
            ) : undefined
          }
        />
      }
      {...(showFootnote
        ? {
            footnote:
              "Refill to 4 in Maintenance (New Objectives). Bureau Interact replaces one face-up immediately (`DCK-1` does not apply).",
          }
        : {})}
      cardWidth={cardWidth}
      attachTabs={attachTabs}
    />
  );
}