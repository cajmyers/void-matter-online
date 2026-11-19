import type { GalleryCrewCard } from "../../fixtures/crewCardFixtures";
import type { ViewerFleetView } from "../../view/fleetView";
import type { TableCardInspectTarget } from "../../view/marketCardInspect";
import type { ZoneTabDockTab } from "../game/ZoneTabDock";
import { FleetShipInfoBox } from "./FleetShipInfoBox";

const shipRim = "var(--game-ship-rim)";

export function buildFleetDockTabs(
  fleet: ViewerFleetView,
  crewById: Readonly<Record<string, GalleryCrewCard>>,
  onInspectCard?: (target: TableCardInspectTarget) => void,
): readonly ZoneTabDockTab[] {
  return fleet.ships.map((ship) => ({
    id: ship.instanceId,
    shortLabel: ship.displayName,
    ariaLabel: ship.displayName,
    rim: shipRim,
    panel: (
      <FleetShipInfoBox
        ship={ship}
        seat={fleet.seat}
        crewById={crewById}
        onInspectCard={onInspectCard}
      />
    ),
  }));
}

export function defaultFleetDockTab(fleet: ViewerFleetView): string {
  return fleet.selectedInstanceId;
}