import { axialKey, edgeOrder, edgeDirections, hexDisc, type Axial, type EdgeName } from "../../components/hex/hexGeometry";
import type { SeatNumber } from "../../components/game/resources";

/** `MAP-1`: 4-player board is a radius-3 disc (37 hexes). */
export const board4SeatRadius = 3;

export const board4SeatHexes: readonly Axial[] = hexDisc(board4SeatRadius);

const outerRimNexusBySeat: Readonly<Record<SeatNumber, Axial>> = {
  1: { q: -1, r: -2 },
  2: { q: 3, r: -2 },
  3: { q: -3, r: 2 },
  4: { q: 1, r: 2 },
};

const onMap = new Set(board4SeatHexes.map((hex) => axialKey(hex.q, hex.r)));

export function outerRimNexusCoord(seat: SeatNumber): Axial {
  return outerRimNexusBySeat[seat];
}

export function seatAtOuterRimNexus(q: number, r: number): SeatNumber | undefined {
  for (const seat of [1, 2, 3, 4] as const) {
    const coord = outerRimNexusBySeat[seat];
    if (coord.q === q && coord.r === r) return seat;
  }
  return undefined;
}

/** Gates on an Outer Rim Nexus: every edge that faces an on-map neighbour (`MAP-5`). */
export function rimNexusGates(q: number, r: number): readonly EdgeName[] {
  return edgeOrder.filter((edge) => {
    const direction = edgeDirections[edge];
    return onMap.has(axialKey(q + direction.q, r + direction.r));
  });
}

export function gatesForBoardHex(q: number, r: number, orientedEdges: readonly EdgeName[]): readonly EdgeName[] {
  if (q === 0 && r === 0) return edgeOrder;
  if (seatAtOuterRimNexus(q, r) !== undefined) return rimNexusGates(q, r);
  return orientedEdges;
}