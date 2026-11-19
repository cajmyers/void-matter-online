import type { FactionPoolView } from "../components/game/FactionPoolCounts";
import type { SeatNumber } from "../components/game/resources";
import type { MapHexView, ShipOnMapView } from "./mapView";
import type { TableMarketsView } from "./tableMarketsView";
import type { ViewerFleetView } from "./fleetView";

export type GamePhase = "Action" | "Maintenance";

export interface SeatPublicView {
  readonly seat: SeatNumber;
  readonly label: string;
  readonly vmTaken: number;
  /** Faction resource pool (`INF-1`, public). */
  readonly pool: FactionPoolView;
  readonly passed?: boolean;
}

/** Redacted play screen for one seat (`technical-proposal.md` §4.6). Stage 1c: fixture-authored. */
export interface GameView {
  readonly scenarioId: string;
  readonly seatCount: 2 | 3 | 4;
  readonly viewerSeat: SeatNumber;
  readonly gameRound: number;
  readonly phase: GamePhase;
  readonly maintenanceStep?: string;
  readonly firstPlayerSeat: SeatNumber;
  readonly activeSeat: SeatNumber;
  readonly seats: readonly SeatPublicView[];
  readonly map: readonly MapHexView[];
  readonly ships: readonly ShipOnMapView[];
  readonly markets: TableMarketsView;
  readonly viewerFleet: ViewerFleetView;
}