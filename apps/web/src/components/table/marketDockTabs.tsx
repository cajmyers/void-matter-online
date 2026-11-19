import { firstPlayableSlice } from "@void-matter/content";
import type { GalleryCrewCard } from "../../fixtures/crewCardFixtures";
import type { OwnerGalleryAssetCard } from "../../fixtures/sectorAssetCards";
import { zoneDockTabMeta } from "../../fixtures/zoneFixtures";
import type { MarketCardInspectTarget, MarketDiscardInspectTarget } from "../../view/marketCardInspect";
import type { TableMarketsView } from "../../view/tableMarketsView";
import type { ZoneDockTabId } from "../../view/marketZoneView";
import type { MissionCard as MissionCatalogueRow } from "@void-matter/content";
import { CrewMarketZone } from "../game/CrewMarketZone";
import { MissionMarketZone } from "../game/MissionMarketZone";
import { SectorMarketZone } from "../game/SectorMarketZone";
import type { ZoneTabDockTab } from "../game/ZoneTabDock";

const dockTabIds: readonly ZoneDockTabId[] = ["s1", "s2", "s3", "s4", "crew", "missions"];

export function buildMarketDockTabs(
  markets: TableMarketsView,
  cards: {
    readonly sectorByDeck: Readonly<
      Record<"s1" | "s2" | "s3" | "s4", Readonly<Record<string, OwnerGalleryAssetCard>>>
    >;
    readonly crewById: Readonly<Record<string, GalleryCrewCard>>;
    readonly missionsById: Readonly<Record<string, MissionCatalogueRow>>;
  },
  onInspectCard?: (target: MarketCardInspectTarget) => void,
  onInspectDiscard?: (target: MarketDiscardInspectTarget) => void,
): readonly ZoneTabDockTab[] {
  return dockTabIds.map((id) => {
    const meta = zoneDockTabMeta(id);
    const panel =
      id === "crew" ? (
        <CrewMarketZone
          view={markets.crew}
          cardsById={cards.crewById}
          showFootnote={false}
          onInspectCard={onInspectCard}
          onInspectDiscard={onInspectDiscard}
        />
      ) : id === "missions" ? (
        <MissionMarketZone
          view={markets.mission}
          missionsById={cards.missionsById}
          showFootnote={false}
          onInspectCard={onInspectCard}
          onInspectDiscard={onInspectDiscard}
        />
      ) : (
        (() => {
          const sectorView = markets.sectors.find((row) => row.sectorDeck === id);
          if (!sectorView) {
            return null;
          }
          return (
            <SectorMarketZone
              view={sectorView}
              cardsById={cards.sectorByDeck[id]}
              showFootnote={false}
              onInspectCard={onInspectCard}
              onInspectDiscard={onInspectDiscard}
            />
          );
        })()
      );
    const label =
      id === "crew"
        ? "Crew market"
        : id === "missions"
          ? "Mission market"
          : firstPlayableSlice.sectorMarkets[id].label;
    return {
      id,
      shortLabel: meta.shortLabel,
      ariaLabel: label,
      rim: meta.rim,
      panel,
    };
  });
}

export function defaultMarketDockTab(purchasableTabIds: readonly ZoneDockTabId[]): ZoneDockTabId {
  const preferred = purchasableTabIds.find((id) => id.startsWith("s"));
  return preferred ?? purchasableTabIds[0] ?? "s1";
}