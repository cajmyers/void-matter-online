import { describe, expect, it } from "vitest";
import {
  enemyCatalogue,
  firstPlayableEnemyDeck,
  firstPlayableSlice,
  fullGameEnemyDecks,
} from "./loadContent";

function deckTotal(cards: readonly { copies: number }[]): number {
  return cards.reduce((sum, row) => sum + row.copies, 0);
}

function pileSignature(cards: readonly { enemyId: string; copies: number }[]): string {
  return cards.map((row) => `${row.enemyId}:${row.copies}`).join(",");
}

describe("enemy decks (`content-data.md` §3)", () => {
  const catalogueIds = new Set(enemyCatalogue.map((enemy) => enemy.id));

  it("catalogue has three factions and nine types", () => {
    expect(enemyCatalogue).toHaveLength(9);
    const factions = new Set(enemyCatalogue.map((enemy) => enemy.faction));
    expect(factions).toEqual(new Set(["iron-syndicate", "prism-ascendancy", "the-hive"]));
  });

  it("full game and slice use the same mixed-faction composition", () => {
    expect(deckTotal(fullGameEnemyDecks.exploration.cards)).toBe(12);
    expect(deckTotal(fullGameEnemyDecks.reinforcement.cards)).toBe(15);
    expect(pileSignature(firstPlayableEnemyDeck.exploration.cards)).toBe(
      pileSignature(fullGameEnemyDecks.exploration.cards),
    );
    expect(pileSignature(firstPlayableEnemyDeck.reinforcement.cards)).toBe(
      pileSignature(fullGameEnemyDecks.reinforcement.cards),
    );
    expect(firstPlayableEnemyDeck.factionsInPlay).toEqual([
      "iron-syndicate",
      "prism-ascendancy",
      "the-hive",
    ]);
  });

  it("slice metadata matches first-playable.json", () => {
    expect(firstPlayableEnemyDeck.explorationDeckSize).toBe(firstPlayableSlice.enemyDecks.explorationSize);
    expect(firstPlayableEnemyDeck.reinforcementDeckSize).toBe(firstPlayableSlice.enemyDecks.reinforcementSize);
    expect(firstPlayableSlice.enemyDecks.explorationSize).toBe(12);
    expect(firstPlayableSlice.enemyDecks.reinforcementSize).toBe(15);
    expect(firstPlayableSlice.enemyDecks.factionsInPlay).toHaveLength(3);
    expect(firstPlayableSlice.includedEnemyIds.sort()).toEqual(
      firstPlayableSlice.enemyDecks.cardIds.slice().sort(),
    );
  });

  it("deck rows reference catalogue ids", () => {
    for (const pile of [fullGameEnemyDecks.exploration.cards, fullGameEnemyDecks.reinforcement.cards]) {
      for (const row of pile) {
        expect(catalogueIds.has(row.enemyId)).toBe(true);
      }
    }
  });
});