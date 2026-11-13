import { describe, expect, it } from "vitest";
import { planetFixtures } from "../../fixtures/tiles";
import { planetDetailArt, planetSlug } from "./planetTileArt";

describe("planetSlug", () => {
  it("maps fixture names to art filenames", () => {
    expect(planetSlug("Aethel-9")).toBe("aethel-9");
    expect(planetSlug("Vulkan's Forge")).toBe("vulkans-forge");
    expect(planetSlug("Chronos Research Outpost")).toBe("chronos-research-outpost");
    expect(planetSlug("Kraken's Breath")).toBe("krakens-breath");
    expect(planetSlug("The Iron Ring")).toBe("the-iron-ring");
  });
});

describe("planetDetailArt", () => {
  it("resolves bundled art when the file is present", () => {
    const url = planetDetailArt("Aethel-9");
    expect(url).toBeDefined();
    expect(url).toMatch(/aethel-9\.webp$/);
  });

  it("resolves art for every planet fixture", () => {
    const missing = planetFixtures.filter((planet) => planetDetailArt(planet.name) === undefined).map((p) => p.name);
    expect(missing, `missing detail art: ${missing.join(", ")}`).toEqual([]);
  });
});
