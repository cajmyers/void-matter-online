import type { SeatNumber } from "../components/game/resources";
import type { GameView } from "./gameView";
import type { MapTileView } from "./mapView";
import type { ZoneDockTabId } from "./marketZoneView";
import { upgradeMarketsAtRimNexus } from "./mapHexInspector";

const sectorTabForSeat: Readonly<Record<SeatNumber, ZoneDockTabId>> = {
  1: "s1",
  2: "s2",
  3: "s3",
  4: "s4",
};

const alwaysAtNexus: readonly ZoneDockTabId[] = ["crew", "missions"];

const allSectorTabs: readonly ZoneDockTabId[] = ["s1", "s2", "s3", "s4"];

function tileAt(view: Pick<GameView, "map">, q: number, r: number): MapTileView | undefined {
  return view.map.find((hex) => hex.q === q && hex.r === r)?.tile;
}

function viewerShipHex(view: Pick<GameView, "ships" | "viewerSeat">): { readonly q: number; readonly r: number } | undefined {
  const owned = view.ships.filter((ship) => ship.seat === view.viewerSeat);
  const selected = owned.find((ship) => ship.selected);
  const ship = selected ?? owned[0];
  return ship ? { q: ship.q, r: ship.r } : undefined;
}

export interface TableMarketsContext {
  /** Tabs where the viewer may buy right now (`MAP-4`). */
  readonly purchasableTabIds: readonly ZoneDockTabId[];
}

/** Derive Nexus purchase access from the viewer ship hex (Stage 1c: no engine). */
export function tableMarketsContext(view: Pick<GameView, "map" | "ships" | "seatCount" | "viewerSeat">): TableMarketsContext {
  const here = viewerShipHex(view);
  if (!here) {
    return { purchasableTabIds: [] };
  }
  const tile = tileAt(view, here.q, here.r);
  if (!tile || (tile.kind !== "nexusCentral" && tile.kind !== "nexusRim")) {
    return { purchasableTabIds: [] };
  }
  if (tile.kind === "nexusCentral") {
    return { purchasableTabIds: [...allSectorTabs, ...alwaysAtNexus] };
  }
  const marketSeats = upgradeMarketsAtRimNexus(tile.seat, view.seatCount);
  const sectorTabs = marketSeats.map((seat) => sectorTabForSeat[seat]);
  return { purchasableTabIds: [...sectorTabs, ...alwaysAtNexus] };
}