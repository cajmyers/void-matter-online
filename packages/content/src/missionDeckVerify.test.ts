import { describe, expect, it } from "vitest";
import {
  firstPlayableMissionDeck,
  firstPlayableSlice,
  fullGameMissionDeck,
  missionCatalogue,
} from "./loadContent";

/** `MSN-3`, `content-data.md` §4 and §5. */
describe("mission decks", () => {
  it("slice deck matches full PvE deck (29 cards of 26 types)", () => {
    const sliceTotal = firstPlayableMissionDeck.cards.reduce((sum, row) => sum + row.copies, 0);
    const fullTotal = fullGameMissionDeck.cards.reduce((sum, row) => sum + row.copies, 0);
    expect(sliceTotal).toBe(29);
    expect(fullTotal).toBe(29);
    expect(firstPlayableMissionDeck.cards.length).toBe(26);
    expect(sliceTotal).toBe(firstPlayableMissionDeck.deckSize);
    expect(sliceTotal).toBe(firstPlayableSlice.missionDeckSize);
    expect(sliceTotal).toBe(fullTotal);
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

  it("includes faction redemption missions (`MSN-3`)", () => {
    const sliceIds = new Set(firstPlayableMissionDeck.cards.map((row) => row.missionId));
    expect(sliceIds.has("prismatic-salvage")).toBe(true);
    expect(sliceIds.has("hive-cleansing")).toBe(true);
    expect(sliceIds.has("syndicate-bust")).toBe(true);
  });
});