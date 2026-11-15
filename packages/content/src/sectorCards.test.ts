import { describe, expect, it } from "vitest";
import { s2AssetCards, s3AssetCards, s4AssetCards, sectorAssetCards } from "./loadContent";

/** Printed card copy must not reference repo docs (player-facing only). */
const internalDocumentPattern =
  /design-decisions|combat-reference|technical-proposal|implementation-plan|content-data|tooling-decisions|\.md\b|docs\//i;

describe("sector asset catalogues", () => {
  it("rules and flavour text never cite internal documents", () => {
    for (const card of sectorAssetCards) {
      expect(card.rulesText, card.id).not.toMatch(internalDocumentPattern);
      expect(card.flavorText, card.id).not.toMatch(internalDocumentPattern);
    }
  });
  it("loads one row per illustrated card in s2–s4", () => {
    expect(s2AssetCards).toHaveLength(11);
    expect(s3AssetCards).toHaveLength(11);
    expect(s4AssetCards).toHaveLength(11);
  });

  it("keeps illustrationSlug aligned with id (s2–s4)", () => {
    for (const card of [...s2AssetCards, ...s3AssetCards, ...s4AssetCards]) {
      expect(card.illustrationSlug).toBe(card.id);
    }
  });
});
