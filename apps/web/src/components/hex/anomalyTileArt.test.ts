import { describe, expect, it } from "vitest";
import { anomalyFixtures } from "../../fixtures/tiles";
import { anomalyDetailArt, anomalySlug } from "./anomalyTileArt";

describe("anomalySlug", () => {
  it("maps fixture names to art filenames", () => {
    expect(anomalySlug("The Scrap Reclamation Yard")).toBe("the-scrap-reclamation-yard");
    expect(anomalySlug("Deep-Space Tactical Sensor Array")).toBe("deep-space-tactical-sensor-array");
    expect(anomalySlug("Smuggler's Foundry")).toBe("smugglers-foundry");
    expect(anomalySlug("Free-Trade Logistics Hub")).toBe("free-trade-logistics-hub");
  });
});

describe("anomalyDetailArt", () => {
  it("resolves art for every anomaly fixture", () => {
    const missing = anomalyFixtures.filter((tile) => anomalyDetailArt(tile.name) === undefined).map((tile) => tile.name);
    expect(missing, `missing anomaly art: ${missing.join(", ")}`).toEqual([]);
  });

  it("returns undefined for a name with no art file", () => {
    expect(anomalyDetailArt("No Such Anomaly")).toBeUndefined();
  });
});
