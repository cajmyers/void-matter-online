import type { EdgeName } from "../components/hex/hexGeometry";
import type { SeatNumber } from "../components/game/resources";

export interface MapHexView {
  readonly q: number;
  readonly r: number;
  readonly gates: readonly EdgeName[];
  readonly tile: MapTileView;
}

export type MapTileView =
  | { readonly kind: "faceDown" }
  | { readonly kind: "nexusCentral" }
  | { readonly kind: "nexusRim"; readonly seat: SeatNumber }
  | {
      readonly kind: "planet";
      readonly planetName: string;
      readonly lockedSupply?: number;
      readonly lockedDemand?: number;
      readonly selected?: boolean;
    }
  | {
      readonly kind: "anomaly";
      readonly anomalyName: string;
    };

export interface ShipOnMapView {
  readonly q: number;
  readonly r: number;
  readonly seat: SeatNumber;
  /** Links map badge to `FleetShipView.instanceId` on the fleet panel. */
  readonly instanceId?: string;
  /** Lateral lane within a hex: −1 left, +1 right (scaled by hex size in `GameBoard`). */
  readonly laneOffset?: -1 | 1;
  readonly pinned?: boolean;
  readonly selected?: boolean;
  readonly hovered?: boolean;
}