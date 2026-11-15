import { commanderCrew, ensignCrew } from "@void-matter/content";
import { describe, expect, it } from "vitest";
import {
  cardIllustrationArt,
  cardIllustrationArtForDeck,
  cardIllustrationSlug,
  crewCardFaceTexture,
  crewCardPortraitArt,
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
    expect(cardIllustrationArtForDeck("hull-plating", "s4")).toMatch(/s4\/fronts\/art\/hull-plating/);
  });

  it("resolves by title across decks", () => {
    expect(cardIllustrationArt("AI Guidance Suite")).toMatch(/ai-guidance-suite/);
    expect(cardIllustrationArt("Compact Storage")).toMatch(/compact-storage/);
  });

  it("loads sector face textures", () => {
    expect(sectorCardFaceTexture("s1")).toMatch(/s1\/fronts\/s1-texture/);
    expect(sectorCardFaceTexture("s2")).toMatch(/s2\/fronts\/s2-texture/);
    expect(sectorCardFaceTexture("s3")).toMatch(/s3\/fronts\/s3-texture/);
    expect(sectorCardFaceTexture("s4")).toMatch(/s4\/fronts\/s4-texture/);
  });

  it("loads crew face texture", () => {
    expect(crewCardFaceTexture()).toMatch(/crew\/fronts\/crew-texture/);
  });

  it("loads crew portraits by catalogue id", () => {
    expect(crewCardPortraitArt("pilot")).toMatch(/crew\/fronts\/art\/pilot/);
    expect(crewCardPortraitArt("merchant")).toMatch(/crew\/fronts\/art\/merchant/);
    expect(crewCardPortraitArt("unknown")).toBeUndefined();
  });

  it("loads a portrait file for every catalogue crew id", () => {
    const ids = [...ensignCrew, ...commanderCrew].map((row) => row.id);
    const missing = ids.filter((id) => crewCardPortraitArt(id) === undefined);
    expect(missing).toEqual([]);
  });
});
