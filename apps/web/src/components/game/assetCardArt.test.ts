import { describe, expect, it } from "vitest";
import {
  cardIllustrationArt,
  cardIllustrationArtForDeck,
  cardIllustrationSlug,
  sectorCardFaceTexture,
} from "./assetCardArt";

describe("assetCardArt", () => {
  it("slugs titles", () => {
    expect(cardIllustrationSlug("AI Guidance Suite")).toBe("ai-guidance-suite");
    expect(cardIllustrationSlug("The Apocalypse")).toBe("apocalypse");
    expect(cardIllustrationSlug("Smuggler’s Hold")).toBe("smugglers-hold");
    expect(cardIllustrationSlug("Energy shields")).toBe("energy-shields");
  });

  it("loads art from the correct sector folder", () => {
    expect(cardIllustrationArtForDeck("ai-guidance-suite", "s1")).toMatch(/s1\/fronts\/art\/ai-guidance-suite/);
    expect(cardIllustrationArtForDeck("impulse-thrusters", "s2")).toMatch(/s2\/fronts\/art\/impulse-thrusters/);
    expect(cardIllustrationArtForDeck("compact-storage", "s3")).toMatch(/s3\/fronts\/art\/compact-storage/);
    expect(cardIllustrationArtForDeck("nano-bonding", "s4")).toMatch(/s4\/fronts\/art\/nano-bonding/);
    expect(cardIllustrationArtForDeck("hull-plating", "common")).toMatch(/common\/fronts\/art\/hull-plating/);
  });

  it("resolves by title across decks", () => {
    expect(cardIllustrationArt("AI Guidance Suite")).toMatch(/ai-guidance-suite/);
    expect(cardIllustrationArt("Compact Storage")).toMatch(/compact-storage/);
  });

  it("loads S1 face texture", () => {
    expect(sectorCardFaceTexture("s1")).toMatch(/s1\/fronts\/s1-texture/);
    expect(sectorCardFaceTexture("s2")).toBeUndefined();
  });
});
