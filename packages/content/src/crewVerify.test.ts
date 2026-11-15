/** Recruitment totals — `CRE-2`; per-card splits are authoritative in the JSON files. */
import { describe, expect, it } from "vitest";
import { commanderCrew, ensignCrew } from "./loadContent";

function recruitmentTotal(costs: readonly { amount: number }[]): number {
  return costs.reduce((sum, entry) => sum + entry.amount, 0);
}

describe("crew catalogue", () => {
  it("ensign recruitment totals 3 resources", () => {
    for (const row of ensignCrew) {
      expect(recruitmentTotal(row.costs)).toBe(3);
    }
  });

  it("commander recruitment totals 5 resources", () => {
    for (const row of commanderCrew) {
      expect(recruitmentTotal(row.costs)).toBe(5);
    }
  });

  it("commanders have trait text", () => {
    for (const row of commanderCrew) {
      expect(row.text.trim().length).toBeGreaterThan(0);
    }
  });
});