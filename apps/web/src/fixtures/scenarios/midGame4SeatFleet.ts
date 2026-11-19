import type { ViewerFleetView } from "../../view/fleetView";

/** Seat 1 fleet for `midGame4Seat` — matches map ship positions. */
export const midGame4SeatViewerFleet: ViewerFleetView = {
  seat: 1,
  selectedInstanceId: "seat1-corvette-a",
  ships: [
    {
      instanceId: "seat1-corvette-a",
      shipCatalogueId: "nomad-corvette",
      displayName: "Corvette A",
      damage: 0,
      installedComponentIds: ["beam-projector", "impulse-thrusters", "minigun", "laser-cannon"],
      crewCatalogueIds: ["pilot"],
      mapPosition: { q: -1, r: -2 },
    },
    {
      instanceId: "seat1-corvette-b",
      shipCatalogueId: "nomad-corvette",
      displayName: "Corvette B",
      damage: 1,
      installedComponentIds: ["energy-shields", "nested-overdrive"],
      crewCatalogueIds: ["shield-specialist"],
      mapPosition: { q: 1, r: 0, laneOffset: -1 },
      pinned: true,
    },
  ],
};