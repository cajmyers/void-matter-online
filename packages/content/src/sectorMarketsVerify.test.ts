import { describe, expect, it } from "vitest";
import {
  firstPlayableSlice,
  fullGameSectorMarkets,
  s1AssetCards,
  s2AssetCards,
  s3AssetCards,
  s4AssetCards,
} from "./loadContent";
import type { SectorDeck } from "./schemas/cards";

const catalogueByDeck: Record<SectorDeck, readonly { id: string }[]> = {
  s1: s1AssetCards,
  s2: s2AssetCards,
  s3: s3AssetCards,
  s4: s4AssetCards,
};

function sumCopies(cards: readonly { copies: number }[]): number {
  return cards.reduce((total, row) => total + row.copies, 0);
}

describe("sector market deck composition (`DCK-3`)", () => {
  it("full-game decks match content-data.md §1 totals", () => {
    expect(sumCopies(fullGameSectorMarkets.decks.s1.cards)).toBe(30);
    expect(sumCopies(fullGameSectorMarkets.decks.s2.cards)).toBe(15);
    expect(sumCopies(fullGameSectorMarkets.decks.s3.cards)).toBe(18);
    expect(sumCopies(fullGameSectorMarkets.decks.s4.cards)).toBe(18);
    for (const deck of ["s1", "s2", "s3", "s4"] as const) {
      expect(fullGameSectorMarkets.decks[deck].deckSize).toBe(
        sumCopies(fullGameSectorMarkets.decks[deck].cards),
      );
    }
  });

  it("full-game composition only references catalogue ids", () => {
    for (const deck of ["s1", "s2", "s3", "s4"] as const) {
      const ids = new Set(catalogueByDeck[deck].map((card) => card.id));
      for (const row of fullGameSectorMarkets.decks[deck].cards) {
        expect(ids.has(row.cardId), `${deck}: ${row.cardId}`).toBe(true);
      }
    }
  });

  it("slice composition matches first-playable deckSize headers", () => {
    const composition = firstPlayableSlice.sectorMarketComposition;
    for (const deck of ["s2", "s3", "s4"] as const) {
      const rows = composition[deck];
      expect(rows, deck).toBeDefined();
      expect(sumCopies(rows!)).toBe(firstPlayableSlice.sectorMarkets[deck].deckSize);
    }
    expect(firstPlayableSlice.sectorMarkets.s1.deckSize).toBe(fullGameSectorMarkets.decks.s1.deckSize);
  });

  it("slice S3 uses Compact Storage ×3 and Expanded Cargo Bay ×2", () => {
    const s3 = firstPlayableSlice.sectorMarketComposition.s3!;
    expect(s3.find((row) => row.cardId === "compact-storage")?.copies).toBe(3);
    expect(s3.find((row) => row.cardId === "expanded-cargo-bay")?.copies).toBe(2);
  });

  it("full-game S3 uses Compact Storage ×3 and Crew Quarters ×3", () => {
    const s3 = fullGameSectorMarkets.decks.s3.cards;
    expect(s3.find((row) => row.cardId === "compact-storage")?.copies).toBe(3);
    expect(s3.find((row) => row.cardId === "crew-quarters")?.copies).toBe(3);
    expect(s3.find((row) => row.cardId === "expanded-cargo-bay")?.copies).toBe(2);
  });
});