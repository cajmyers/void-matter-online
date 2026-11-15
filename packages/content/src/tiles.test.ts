import { describe, expect, it } from "vitest";
import { anomalies, passiveAnomalyNumbers, planets } from "./loadContent";
import { planetGatePatterns } from "./planetGatePatterns";

const edgeOrder = ["TL", "TR", "R", "BR", "BL", "L"] as const;

describe("tile content (technical-proposal Appendices B and C)", () => {
  it("has 22 Anomaly tiles including Overclocking Relay (TIL-2)", () => {
    expect(anomalies).toHaveLength(22);
    const tile4 = anomalies.find((tile) => tile.number === 4);
    expect(tile4?.name).toBe("Overclocking Relay");
    expect(tile4?.ability).toBe("interact");
  });

  it("marks passive vs Interact tiles per MSN-1", () => {
    for (const tile of anomalies) {
      const expected = passiveAnomalyNumbers.has(tile.number) ? "passive" : "interact";
      expect(tile.ability, tile.name).toBe(expected);
    }
  });

  it("gives every Anomaly valid, distinct gate edges and two different discovery resources", () => {
    for (const tile of anomalies) {
      expect(new Set(tile.gates).size).toBe(tile.gates.length);
      for (const edge of tile.gates) expect(edgeOrder).toContain(edge);
      expect(tile.bonus[0]).not.toBe(tile.bonus[1]);
    }
  });

  it("gives only tiles 10 and 13 two gates and tiles 5 and 15 four gates", () => {
    const withGates = (count: number): number[] =>
      anomalies.filter((tile) => tile.gates.length === count).map((tile) => tile.number);
    expect(withGates(2)).toEqual([10, 13]);
    expect(withGates(4)).toEqual([5, 15]);
  });

  it("has 20 planets, five in each of four groups, each with exactly three gates", () => {
    expect(planets).toHaveLength(20);
    for (const group of ["High metal", "High fuel", "High component", "High tech"]) {
      expect(planets.filter((planet) => planet.group === group)).toHaveLength(5);
    }
    for (const pattern of Object.values(planetGatePatterns)) expect(pattern).toHaveLength(3);
  });

  it("never demands a resource the planet supplies", () => {
    for (const planet of planets) {
      const supplied = new Set(planet.supply.map((entry) => entry.resource));
      for (const entry of planet.demand) expect(supplied.has(entry.resource)).toBe(false);
    }
  });

  it("uses each gate pattern the documented number of times (cl 6, ar 6, al 6, y 2)", () => {
    const count = (pattern: string): number => planets.filter((planet) => planet.pattern === pattern).length;
    expect([count("cl"), count("ar"), count("al"), count("y")]).toEqual([6, 6, 6, 2]);
  });
});
