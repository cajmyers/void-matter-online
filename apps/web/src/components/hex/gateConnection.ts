// Warp-gate connectivity on the board (`MAP-5`). Visual only: full gates are white, lone gates stay cyan.

import { axialKey, edgeDirections, edgeOrder, type EdgeName } from "./hexGeometry";

/** The edge on the neighbour hex that shares the same border. */
export function oppositeEdge(edge: EdgeName): EdgeName {
  const index = edgeOrder.indexOf(edge);
  return edgeOrder[(((index + 3) % 6) + 6) % 6] ?? edge;
}

export function neighbourAcross(edge: EdgeName, q: number, r: number): { readonly q: number; readonly r: number } {
  const direction = edgeDirections[edge];
  return { q: q + direction.q, r: r + direction.r };
}

/** Both tiles have a gate on this shared edge (connected, not half-connected). */
export function isFullGateOnEdge(
  q: number,
  r: number,
  edge: EdgeName,
  gatesByTile: ReadonlyMap<string, readonly EdgeName[]>,
): boolean {
  const neighbour = neighbourAcross(edge, q, r);
  return (gatesByTile.get(axialKey(neighbour.q, neighbour.r)) ?? []).includes(oppositeEdge(edge));
}
