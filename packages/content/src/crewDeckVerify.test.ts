import { describe, expect, it } from "vitest";
import {
  commanderCrew,
  ensignCrew,
  fullGameCrewDeck,
} from "./loadContent";

const ensignIds = new Set(ensignCrew.map((row) => row.id));
const commanderIds = new Set(commanderCrew.map((row) => row.id));

function deckTotal(cards: readonly { copies: number }[]): number {
  return cards.reduce((sum, row) => sum + row.copies, 0);
}

/** Full game crew deck — `DCK-5`. */
describe("full-game crew deck", () => {
  it("deck size matches copy sum", () => {
    expect(deckTotal(fullGameCrewDeck.cards)).toBe(fullGameCrewDeck.deckSize);
    expect(fullGameCrewDeck.deckSize).toBe(32);
  });

  it("has 4 copies per Ensign and 1 per Commander", () => {
    for (const entry of fullGameCrewDeck.cards) {
      if (ensignIds.has(entry.crewId)) {
        expect(entry.copies).toBe(4);
      } else if (commanderIds.has(entry.crewId)) {
        expect(entry.copies).toBe(1);
      } else {
        throw new Error(`unknown crewId: ${entry.crewId}`);
      }
    }
  });

  it("includes every catalogue type once in the deck list", () => {
    const listed = new Set(fullGameCrewDeck.cards.map((row) => row.crewId));
    for (const id of ensignIds) {
      expect(listed.has(id)).toBe(true);
    }
    for (const id of commanderIds) {
      expect(listed.has(id)).toBe(true);
    }
    expect(listed.size).toBe(ensignIds.size + commanderIds.size);
  });
});