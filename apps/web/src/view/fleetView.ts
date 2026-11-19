import type { SeatNumber } from "../components/game/resources";

/** One player ship instance on the board (`technical-proposal.md` §4.1). */
export interface FleetShipView {
  readonly instanceId: string;
  readonly shipCatalogueId: string;
  readonly displayName: string;
  readonly damage: number;
  /** Installed sector components in install order (`SLT-1` halves derived from catalogue). */
  readonly installedComponentIds: readonly string[];
  readonly crewCatalogueIds: readonly string[];
  readonly mapPosition: {
    readonly q: number;
    readonly r: number;
    readonly laneOffset?: -1 | 1;
  };
  readonly pinned?: boolean;
}

/** Viewer’s own fleet strip on the play table (Stage 1c fixture slice). */
export interface ViewerFleetView {
  readonly seat: SeatNumber;
  readonly ships: readonly FleetShipView[];
  readonly selectedInstanceId: string;
}