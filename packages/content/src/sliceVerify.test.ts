import { describe, expect, it } from "vitest";
import { ensignCrew, enemyCatalogue, firstPlayableSlice, s1AssetCards } from "./loadContent";

/** `content-data.md` §5 and slice tables. */
describe("first-playable slice verification", () => {
  it("matches proposed slice market deck sizes", () => {
    expect(firstPlayableSlice.sectorMarkets.s1.deckSize).toBe(30);
    expect(firstPlayableSlice.sectorMarkets.s2.deckSize).toBe(2);
    expect(firstPlayableSlice.sectorMarkets.s3.deckSize).toBe(5);
    expect(firstPlayableSlice.sectorMarkets.s4.deckSize).toBe(9);
  });

  it("matches mixed-faction enemy deck placeholders", () => {
    expect(firstPlayableSlice.enemyDecks.explorationSize).toBe(12);
    expect(firstPlayableSlice.enemyDecks.reinforcementSize).toBe(15);
    expect(firstPlayableSlice.enemyDecks.factionsInPlay).toHaveLength(3);
  });

  it("crew composition matches crewDeckSize (Ensigns only, 4 copies each)", () => {
    const total = firstPlayableSlice.crewComposition.reduce((sum, row) => sum + row.copies, 0);
    expect(total).toBe(firstPlayableSlice.crewDeckSize);
    expect(firstPlayableSlice.crewDeckSize).toBe(16);
    for (const row of firstPlayableSlice.crewComposition) {
      expect(row.copies).toBe(4);
    }
    const compositionIds = firstPlayableSlice.crewComposition.map((row) => row.crewId).sort();
    expect(compositionIds).toEqual([...firstPlayableSlice.includedCrewIds].sort());
  });

  it("references loaded catalogue rows by id", () => {
    const s1Ids = new Set(s1AssetCards.map((card) => card.id));
    for (const id of firstPlayableSlice.includedCardIds.s1) {
      expect(s1Ids.has(id)).toBe(true);
    }
    const crewIds = new Set(ensignCrew.map((crew) => crew.id));
    for (const id of firstPlayableSlice.includedCrewIds) {
      expect(crewIds.has(id)).toBe(true);
    }
    const enemyIds = new Set(enemyCatalogue.map((enemy) => enemy.id));
    for (const id of firstPlayableSlice.includedEnemyIds) {
      expect(enemyIds.has(id)).toBe(true);
    }
  });
});
