import { describe, expect, it } from "vitest";
import { ensignCrew, firstPlayableSlice, ironSyndicateEnemies, s1AssetCards } from "./loadContent";

/** `content-data.md` §5 and slice tables. */
describe("first-playable slice verification", () => {
  it("matches proposed slice market deck sizes", () => {
    expect(firstPlayableSlice.sectorMarkets.s1.deckSize).toBe(10);
    expect(firstPlayableSlice.sectorMarkets.s2.deckSize).toBe(2);
    expect(firstPlayableSlice.sectorMarkets.s3.deckSize).toBe(8);
    expect(firstPlayableSlice.sectorMarkets.s4.deckSize).toBe(12);
  });

  it("matches Iron Syndicate enemy deck placeholders", () => {
    expect(firstPlayableSlice.enemyDecks["iron-syndicate"].explorationSize).toBe(6);
    expect(firstPlayableSlice.enemyDecks["iron-syndicate"].reinforcementSize).toBe(5);
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
    const enemyIds = new Set(ironSyndicateEnemies.map((enemy) => enemy.id));
    for (const id of firstPlayableSlice.includedEnemyIds) {
      expect(enemyIds.has(id)).toBe(true);
    }
  });
});
