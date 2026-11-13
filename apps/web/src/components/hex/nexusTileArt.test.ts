import { describe, expect, it } from "vitest";
import { seatNumbers } from "../game/resources";
import { nexusArtSlug, nexusDetailArt } from "./nexusTileArt";

describe("nexusArtSlug", () => {
  it("maps tile kinds and seats to filenames", () => {
    expect(nexusArtSlug("nexusCentral")).toBe("central-nexus");
    expect(nexusArtSlug("nexusRim", 1)).toBe("outer-rim-nexus-1");
    expect(nexusArtSlug("nexusRim", 4)).toBe("outer-rim-nexus-4");
  });
});

describe("nexusDetailArt", () => {
  it("resolves bundled art for every seat", () => {
    expect(nexusDetailArt("nexusCentral")).toMatch(/central-nexus\.webp$/);
    for (const seat of seatNumbers) {
      const url = nexusDetailArt("nexusRim", seat);
      expect(url, `seat ${seat}`).toBeDefined();
      expect(url).toMatch(new RegExp(`outer-rim-nexus-${seat}\\.webp$`));
    }
  });
});
