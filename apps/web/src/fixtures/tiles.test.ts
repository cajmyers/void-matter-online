import { describe, expect, it } from "vitest";
import { edgeOrder } from "../components/hex/hexGeometry";
import { anomalyFixtures, planetFixtures, planetGatePatterns } from "./tiles";

describe("tile fixtures (technical-proposal Appendices B and C)", () => {
  it("has 21 Anomaly tiles, with tile 4 removed (TIL-1)", () => {
    expect(anomalyFixtures).toHaveLength(21);
    expect(anomalyFixtures.some((tile) => tile.number === 4)).toBe(false);
  });

  it("gives every Anomaly valid, distinct gate edges and two different discovery resources", () => {
    for (const tile of anomalyFixtures) {
      expect(new Set(tile.gates).size).toBe(tile.gates.length);
      for (const edge of tile.gates) expect(edgeOrder).toContain(edge);
      expect(tile.bonus[0]).not.toBe(tile.bonus[1]);
    }
  });

  it("gives only tiles 10 and 13 two gates and tiles 5 and 15 four gates", () => {
    const withGates = (count: number): number[] =>
      anomalyFixtures.filter((tile) => tile.gates.length === count).map((tile) => tile.number);
    expect(withGates(2)).toEqual([10, 13]);
    expect(withGates(4)).toEqual([5, 15]);
  });

  it("has 20 planets, five in each of four groups, each with exactly three gates", () => {
    expect(planetFixtures).toHaveLength(20);
    for (const group of ["High metal", "High fuel", "High component", "High tech"]) {
      expect(planetFixtures.filter((planet) => planet.group === group)).toHaveLength(5);
    }
    for (const pattern of Object.values(planetGatePatterns)) expect(pattern).toHaveLength(3);
  });

  it("never demands a resource the planet supplies", () => {
    for (const planet of planetFixtures) {
      const supplied = new Set(planet.supply.map((entry) => entry.resource));
      for (const entry of planet.demand) expect(supplied.has(entry.resource)).toBe(false);
    }
  });

  it("uses each gate pattern the documented number of times (cl 6, ar 6, al 6, y 2)", () => {
    const count = (pattern: string): number => planetFixtures.filter((planet) => planet.pattern === pattern).length;
    expect([count("cl"), count("ar"), count("al"), count("y")]).toEqual([6, 6, 6, 2]);
  });
});
