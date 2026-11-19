import { describe, expect, it } from "vitest";
import { resourceIds } from "../components/game/resources";
import { centralNexusPassSupply } from "./centralNexusPassSupply";

describe("centralNexusPassSupply", () => {
  it("starts with one of each resource type", () => {
    expect(centralNexusPassSupply).toHaveLength(resourceIds.length);
    expect(centralNexusPassSupply.map((row) => row.resource).sort()).toEqual([...resourceIds].sort());
    expect(centralNexusPassSupply.every((row) => row.amount === 1)).toBe(true);
  });
});