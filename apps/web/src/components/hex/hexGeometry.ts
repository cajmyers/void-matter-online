// Pointy-top hex geometry (docs/design-decisions.md MAP-1, MAP-5).
// Axial coordinates (q, r). Sides are named as the rulebook names them.

export type EdgeName = "TL" | "TR" | "R" | "BR" | "BL" | "L";

/** Clockwise from the top right. Rotating a tile by one step moves each edge one place along this list. */
export const edgeOrder: readonly EdgeName[] = ["TR", "R", "BR", "BL", "L", "TL"];

export interface Point {
  readonly x: number;
  readonly y: number;
}

export interface Axial {
  readonly q: number;
  readonly r: number;
}

const sqrt3 = Math.sqrt(3);

/** Axial direction to the neighbour across each edge. */
export const edgeDirections: Readonly<Record<EdgeName, Axial>> = {
  TL: { q: 0, r: -1 },
  TR: { q: 1, r: -1 },
  R: { q: 1, r: 0 },
  BR: { q: 0, r: 1 },
  BL: { q: -1, r: 1 },
  L: { q: -1, r: 0 },
};

export function axialToPixel(q: number, r: number, size: number): Point {
  return { x: size * sqrt3 * (q + r / 2), y: size * 1.5 * r };
}

/** Corner points, starting at the top and going clockwise. */
export function hexCorners(size: number): readonly Point[] {
  return Array.from({ length: 6 }, (_, index) => {
    const angle = ((-90 + 60 * index) * Math.PI) / 180;
    return { x: size * Math.cos(angle), y: size * Math.sin(angle) };
  });
}

// Which two corners (indexes into hexCorners) bound each edge.
const edgeCornerIndexes: Readonly<Record<EdgeName, readonly [number, number]>> = {
  TR: [0, 1],
  R: [1, 2],
  BR: [2, 3],
  BL: [3, 4],
  L: [4, 5],
  TL: [5, 0],
};

/** The middle `fraction` of an edge, as two points. */
export function edgeSegment(size: number, edge: EdgeName, fraction = 1): readonly [Point, Point] {
  const corners = hexCorners(size);
  const [firstIndex, secondIndex] = edgeCornerIndexes[edge];
  const first = corners[firstIndex] ?? { x: 0, y: 0 };
  const second = corners[secondIndex] ?? { x: 0, y: 0 };
  const midpoint = { x: (first.x + second.x) / 2, y: (first.y + second.y) / 2 };
  const half = fraction / 2;
  return [
    { x: midpoint.x + (first.x - midpoint.x) * 2 * half, y: midpoint.y + (first.y - midpoint.y) * 2 * half },
    { x: midpoint.x + (second.x - midpoint.x) * 2 * half, y: midpoint.y + (second.y - midpoint.y) * 2 * half },
  ];
}

export function pointsAttribute(points: readonly Point[]): string {
  return points.map((point) => `${point.x.toFixed(2)},${point.y.toFixed(2)}`).join(" ");
}

/** Rotate a set of edges clockwise by `steps` sixths of a turn. */
export function rotateEdges(edges: readonly EdgeName[], steps: number): readonly EdgeName[] {
  return edges.map((edge) => {
    const index = edgeOrder.indexOf(edge);
    const rotated = edgeOrder[(((index + steps) % 6) + 6) % 6];
    return rotated ?? edge;
  });
}

/** All hexes of a regular disc of the given radius (the 2-seat board is radius 2, the 4-seat board radius 3). */
export function hexDisc(radius: number): readonly Axial[] {
  const result: Axial[] = [];
  for (let r = -radius; r <= radius; r += 1) {
    const qStart = Math.max(-radius, -r - radius);
    const qEnd = Math.min(radius, -r + radius);
    for (let q = qStart; q <= qEnd; q += 1) result.push({ q, r });
  }
  return result;
}

export function axialKey(q: number, r: number): string {
  return `${q},${r}`;
}
