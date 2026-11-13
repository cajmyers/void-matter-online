import { describe, expect, it } from "vitest";
import { isFullGateOnEdge, oppositeEdge } from "./gateConnection";
import type { EdgeName } from "./hexGeometry";

describe("gateConnection (MAP-5)", () => {
  it("pairs opposite edges", () => {
    expect(oppositeEdge("R")).toBe("L");
  });

  it("detects a full gate when the neighbour has the opposite edge", () => {
    const map = new Map<string, readonly EdgeName[]>([
      ["0,0", ["R"]],
      ["1,0", ["L"]],
    ]);
    expect(isFullGateOnEdge(0, 0, "R", map)).toBe(true);
    expect(isFullGateOnEdge(1, 0, "L", map)).toBe(true);
  });

  it("is not full when only one tile has a gate", () => {
    const map = new Map<string, readonly EdgeName[]>([
      ["0,0", ["R"]],
      ["1,0", []],
    ]);
    expect(isFullGateOnEdge(0, 0, "R", map)).toBe(false);
  });
});
