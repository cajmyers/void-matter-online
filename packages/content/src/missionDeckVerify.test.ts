import { describe, expect, it } from "vitest";
import {
  firstPlayableMissionDeck,
  firstPlayableSlice,
  fullGameMissionDeck,
  missionCatalogue,
} from "./loadContent";

/** `MSN-3`, `content-data.md` §4 and §5. */
describe("mission decks", () => {
  it("slice deck is 27 cards of 24 types", () => {
    const total = firstPlayableMissionDeck.cards.reduce((sum, row) => sum + row.copies, 0);
    const types = firstPlayableMissionDeck.cards.length;
    expect(total).toBe(27);
    expect(types).toBe(24);
    expect(total).toBe(firstPlayableMissionDeck.deckSize);
    expect(total).toBe(firstPlayableSlice.missionDeckSize);
  });

  it("full PvE deck is 29 cards", () => {
    const total = fullGameMissionDeck.cards.reduce((sum, row) => sum + row.copies, 0);
    expect(total).toBe(29);
    expect(total).toBe(fullGameMissionDeck.deckSize);
  });

  it("references catalogue ids", () => {
    const ids = new Set(missionCatalogue.map((mission) => mission.id));
    for (const row of firstPlayableMissionDeck.cards) {
      expect(ids.has(row.missionId)).toBe(true);
    }
    for (const row of fullGameMissionDeck.cards) {
      expect(ids.has(row.missionId)).toBe(true);
    }
  });

  it("excludes Prismatic Salvage and Hive Cleansing from the slice", () => {
    const sliceIds = new Set(firstPlayableMissionDeck.cards.map((row) => row.missionId));
    expect(sliceIds.has("prismatic-salvage")).toBe(false);
    expect(sliceIds.has("hive-cleansing")).toBe(false);
  });
});