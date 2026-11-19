import { axialKey, rotateEdges } from "../../components/hex/hexGeometry";
import type { GameView } from "../../view/gameView";
import type { MapHexView, MapTileView } from "../../view/mapView";
import { anomalyGatesForName, planetGatesForName } from "../../view/mapHexPresentation";
import { board4SeatHexes, gatesForBoardHex } from "../board/boardLayout4Seat";
import { midGame4SeatMarkets } from "./midGame4SeatMarkets";
import { midGame4SeatViewerFleet } from "./midGame4SeatFleet";

/** Revealed tiles for a mid-game 4-seat fixture (`implementation-plan.md` §5.4 `midGame*`). */
const tileByCoord: Readonly<Record<string, MapTileView>> = {
  [axialKey(0, 0)]: { kind: "nexusCentral" },
  [axialKey(-1, -2)]: { kind: "nexusRim", seat: 1 },
  [axialKey(3, -2)]: { kind: "nexusRim", seat: 2 },
  [axialKey(-3, 2)]: { kind: "nexusRim", seat: 3 },
  [axialKey(-2, 1)]: { kind: "planet", planetName: "Caelum Mining Hub" },
  [axialKey(1, 2)]: { kind: "nexusRim", seat: 4 },
  [axialKey(-1, 0)]: { kind: "planet", planetName: "Aethel-9" },
  [axialKey(1, 0)]: { kind: "planet", planetName: "Vulkan's Forge", lockedDemand: 1 },
  [axialKey(0, -1)]: { kind: "planet", planetName: "Kraken's Breath", lockedSupply: 2 },
  [axialKey(0, 1)]: { kind: "planet", planetName: "Stallos Prime" },
  [axialKey(-2, 0)]: { kind: "planet", planetName: "Solaria Prime" },
  [axialKey(2, 0)]: { kind: "planet", planetName: "Gorgon Prime" },
  [axialKey(-1, 1)]: { kind: "anomaly", anomalyName: "Dense Asteroid Field" },
  [axialKey(1, -1)]: { kind: "anomaly", anomalyName: "Graviton Warp Conduit" },
  [axialKey(-2, -1)]: { kind: "anomaly", anomalyName: "The Scrap Reclamation Yard" },
  [axialKey(2, 1)]: { kind: "planet", planetName: "Neptunia Prime" },
  [axialKey(-1, -1)]: { kind: "planet", planetName: "Steelhold Alpha" },
  [axialKey(2, -2)]: { kind: "planet", planetName: "Nova Forge" },
};

function orientedGates(q: number, r: number, tile: MapTileView) {
  let base: readonly import("../../components/hex/hexGeometry").EdgeName[] = [];
  if (tile.kind === "planet") {
    base = planetGatesForName(tile.planetName);
    if (tile.planetName === "Nova Forge") {
      base = rotateEdges(base, 1);
    }
    if (tile.planetName === "Steelhold Alpha") {
      base = rotateEdges(base, -1);
    }
    if (tile.planetName === "Gorgon Prime") {
      base = rotateEdges(base, -1);
    }
    if (tile.planetName === "Caelum Mining Hub") {
      base = rotateEdges(base, 1);
    }
    if (tile.planetName === "Stallos Prime") {
      base = rotateEdges(base, -1);
    }
  }
  if (tile.kind === "anomaly") {
    const gates = anomalyGatesForName(tile.anomalyName);
    base =
      tile.anomalyName === "The Scrap Reclamation Yard" ? rotateEdges(gates, -1) : gates;
  }
  return gatesForBoardHex(q, r, base);
}

function buildMap(): readonly MapHexView[] {
  return board4SeatHexes.map((hex) => {
    const key = axialKey(hex.q, hex.r);
    const tile = tileByCoord[key] ?? ({ kind: "faceDown" } as const);
    return {
      q: hex.q,
      r: hex.r,
      tile,
      gates: orientedGates(hex.q, hex.r, tile),
    };
  });
}

/** Hand-authored mid-game `GameView` for seat 1 (human). */
export const midGame4SeatView: GameView = {
  scenarioId: "midGame4Seat",
  seatCount: 4,
  viewerSeat: 1,
  gameRound: 4,
  phase: "Action",
  firstPlayerSeat: 2,
  activeSeat: 1,
  seats: [
    { seat: 1, label: "You", vmTaken: 0, pool: { tc: 2, h3: 1, pc: 3, qp: 0 } },
    { seat: 2, label: "Bot A", vmTaken: 1, pool: { tc: 0, h3: 4, pc: 1, qp: 2 } },
    { seat: 3, label: "Bot B", vmTaken: 1, passed: true, pool: { tc: 1, h3: 0, pc: 0, qp: 3 } },
    { seat: 4, label: "Bot C", vmTaken: 2, pool: { tc: 3, h3: 2, pc: 2, qp: 1 } },
  ],
  map: buildMap(),
  ships: [
    { q: -1, r: -2, seat: 1, instanceId: "seat1-corvette-a", selected: true },
    { q: 3, r: -2, seat: 2 },
    { q: -3, r: 2, seat: 3 },
    { q: 1, r: 2, seat: 4 },
    { q: 1, r: 0, seat: 1, instanceId: "seat1-corvette-b", laneOffset: -1, pinned: true },
    { q: 1, r: 0, seat: 2, laneOffset: 1, pinned: true },
    { q: 0, r: -1, seat: 3 },
  ],
  markets: midGame4SeatMarkets,
  viewerFleet: midGame4SeatViewerFleet,
};