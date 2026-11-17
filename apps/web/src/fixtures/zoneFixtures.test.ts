import { describe, expect, it } from "vitest";
import {
  galleryCrewMarketZoneView,
  galleryMissionMarketZoneView,
  gallerySectorMarketZoneViews,
} from "./zoneFixtures";

describe("zone gallery fixtures", () => {
  it("keeps sector face-up rows at three cards (`MAP-4`)", () => {
    for (const view of gallerySectorMarketZoneViews()) {
      expect(view.faceUpCardIds).toHaveLength(3);
    }
  });

  it("keeps crew face-up row at four cards", () => {
    expect(galleryCrewMarketZoneView().faceUpCrewIds).toHaveLength(4);
  });

  it("keeps mission face-up row at four cards", () => {
    expect(galleryMissionMarketZoneView().faceUpMissionIds).toHaveLength(4);
  });
});