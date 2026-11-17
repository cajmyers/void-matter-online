import { CrewMarketZone } from "../../../components/game/CrewMarketZone";
import { MissionMarketZone } from "../../../components/game/MissionMarketZone";
import { SectorMarketZone } from "../../../components/game/SectorMarketZone";
import { ZoneTabDock } from "../../../components/game/ZoneTabDock";
import { Typography } from "../../../components/Typography/Typography";
import {
  galleryCrewCardsById,
  galleryCrewMarketZoneView,
  galleryMissionMarketZoneView,
  galleryMissionsById,
  gallerySectorAssetCardsByDeck,
  gallerySectorMarketDepletedView,
  gallerySectorMarketZoneViews,
  zoneDockTabMeta,
} from "../../../fixtures/zoneFixtures";
import { firstPlayableSlice } from "@void-matter/content";
import type { ZoneDockTabId } from "../../../view/marketZoneView";
import { Figure } from "./Figure";
import styles from "./GalleryPage.module.css";

const sectorViews = gallerySectorMarketZoneViews();
const sectorCardsByDeck = gallerySectorAssetCardsByDeck();
const crewView = galleryCrewMarketZoneView();
const missionView = galleryMissionMarketZoneView();
const depletedView = gallerySectorMarketDepletedView();

function sectorPanel(deck: (typeof sectorViews)[number]["sectorDeck"], attachTabs = false) {
  const view = sectorViews.find((row) => row.sectorDeck === deck);
  if (!view) {
    return null;
  }
  return (
    <SectorMarketZone view={view} cardsById={sectorCardsByDeck[deck]} attachTabs={attachTabs} />
  );
}

const dockTabIds: readonly ZoneDockTabId[] = ["s1", "s2", "s3", "s4", "crew", "missions"];

export function ZonesSection() {
  const dockTabs = dockTabIds.map((id) => {
    const meta = zoneDockTabMeta(id);
    const panel =
      id === "crew" ? (
        <CrewMarketZone view={crewView} cardsById={galleryCrewCardsById} attachTabs />
      ) : id === "missions" ? (
        <MissionMarketZone view={missionView} missionsById={galleryMissionsById} attachTabs />
      ) : (
        sectorPanel(id, true)
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

  return (
    <section className={styles.section} id="zones">
      <Typography variant="h3">Zones</Typography>
      <Typography variant="body2">
        Shared markets and piles in a **left-hand column**: at most **two cards wide**, height grows with face-up count (3 sector,
        4 crew/mission). Deck backs show count only (order hidden). One active zone via tabs (`implementation-plan.md` §5.3).
      </Typography>

      <div className={styles.group}>
        <Typography variant="overline">Zone dock (tab bar preview)</Typography>
        <Figure
          name="Tabs + active market"
          note="2-wide column; top tabs switch S1–S4, crew, and missions."
        >
          <ZoneTabDock tabs={dockTabs} defaultTabId="s1" />
        </Figure>
      </div>

      <div className={styles.group}>
        <Typography variant="overline">Sector markets (stacked as on the left rail)</Typography>
        <div className={styles.zoneColumnStack}>
          {sectorViews.map((view) => (
            <Figure key={view.sectorDeck} name={view.label} note={`Deck ${view.piles.deckCount} · discard ${view.piles.discardCount}`}>
              <SectorMarketZone view={view} cardsById={sectorCardsByDeck[view.sectorDeck]} />
            </Figure>
          ))}
        </div>
      </div>

      <div className={styles.group}>
        <Typography variant="overline">Crew and mission markets</Typography>
        <div className={styles.zoneColumnStack}>
          <Figure name="Crew market" note="4 face-up · 2×2 grid, slice deck">
            <CrewMarketZone view={crewView} cardsById={galleryCrewCardsById} />
          </Figure>
          <Figure name="Mission market" note="4 face-up · 2×2 grid, slice deck">
            <MissionMarketZone view={missionView} missionsById={galleryMissionsById} />
          </Figure>
        </div>
      </div>

      <div className={styles.group}>
        <Typography variant="overline">Edge state</Typography>
        <Figure
          name="S2 market depleted"
          note="Two face-up left; empty deck with discard to reshuffle (`DCK-2`). Slice has only 2 card types."
        >
          <SectorMarketZone view={depletedView} cardsById={sectorCardsByDeck.s2} />
        </Figure>
      </div>
    </section>
  );
}