import { describe, expect, it } from "vitest";
import { s1AssetCards } from "./loadContent";

/** Names in `content-data.md` §1 S1 table (23 types). */
describe("s1-assets catalogue", () => {
  it("lists every S1 card type", () => {
    expect(s1AssetCards).toHaveLength(23);
    expect(s1AssetCards.every((card) => card.sectorDeck === "s1")).toBe(true);
  });

  it("uses illustrationSlug per row", () => {
    const apocalypse = s1AssetCards.find((card) => card.id === "apocalypse");
    expect(apocalypse?.illustrationSlug).toBe("apocalypse");
    const ram = s1AssetCards.find((card) => card.id === "pneumatic-ram-loader");
    expect(ram?.illustrationSlug).toBe("ram-loader");
  });
});