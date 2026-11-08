import { describe, expect, it } from "vitest";
import {
  axialToPixel,
  edgeDirections,
  edgeOrder,
  edgeSegment,
  hexDisc,
  rotateEdges,
  type EdgeName,
} from "./hexGeometry";

const size = 40;

describe("hexGeometry", () => {
  it("places every neighbour the same distance away", () => {
    const origin = axialToPixel(0, 0, size);
    for (const edge of edgeOrder) {
      const direction = edgeDirections[edge];
      const neighbour = axialToPixel(direction.q, direction.r, size);
      const distance = Math.hypot(neighbour.x - origin.x, neighbour.y - origin.y);
      expect(distance).toBeCloseTo(size * Math.sqrt(3), 6);
    }
  });

  it("puts each edge midpoint halfway to the neighbour across that edge (MAP-5)", () => {
    for (const edge of edgeOrder) {
      const [first, second] = edgeSegment(size, edge);
      const midpoint = { x: (first.x + second.x) / 2, y: (first.y + second.y) / 2 };
      const direction = edgeDirections[edge];
      const neighbour = axialToPixel(direction.q, direction.r, size);
      expect(midpoint.x).toBeCloseTo(neighbour.x / 2, 6);
      expect(midpoint.y).toBeCloseTo(neighbour.y / 2, 6);
    }
  });

  it("rotates edges clockwise and returns to the start after six steps", () => {
    const gates: readonly EdgeName[] = ["TL", "TR", "R"];
    expect(rotateEdges(gates, 1)).toEqual(["TR", "R", "BR"]);
    expect(rotateEdges(gates, 6)).toEqual(gates);
    expect(rotateEdges(gates, -1)).toEqual(["L", "TL", "TR"]);
  });

  it("builds the regular board sizes (MAP-1: 2 seats 19 hexes, 4 seats 37 hexes)", () => {
    expect(hexDisc(2)).toHaveLength(19);
    expect(hexDisc(3)).toHaveLength(37);
    const rowWidths = [-2, -1, 0, 1, 2].map((r) => hexDisc(2).filter((hex) => hex.r === r).length);
    expect(rowWidths).toEqual([3, 4, 5, 4, 3]);
  });
});
