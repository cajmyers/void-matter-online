import { z } from "zod";
import { sectorDeckSchema } from "./cards";
import { enemyFactionIdSchema } from "./enemies";

export const marketDeckCardEntrySchema = z.object({
  cardId: z.string().min(1),
  copies: z.number().int().positive(),
});
export type MarketDeckCardEntry = z.infer<typeof marketDeckCardEntrySchema>;

export const sectorMarketDeckSchema = z.object({
  deckSize: z.number().int().positive(),
  cards: z.array(marketDeckCardEntrySchema).min(1),
});
export type SectorMarketDeck = z.infer<typeof sectorMarketDeckSchema>;

export const fullGameSectorMarketsSchema = z.object({
  id: z.literal("full-game"),
  label: z.string().min(1),
  decks: z.object({
    s1: sectorMarketDeckSchema,
    s2: sectorMarketDeckSchema,
    s3: sectorMarketDeckSchema,
    s4: sectorMarketDeckSchema,
  }),
});
export type FullGameSectorMarkets = z.infer<typeof fullGameSectorMarketsSchema>;

export const sliceSectorMarketCompositionSchema = z.object({
  s1: z.array(marketDeckCardEntrySchema).optional(),
  s2: z.array(marketDeckCardEntrySchema).optional(),
  s3: z.array(marketDeckCardEntrySchema).optional(),
  s4: z.array(marketDeckCardEntrySchema).optional(),
});
export type SliceSectorMarketComposition = z.infer<typeof sliceSectorMarketCompositionSchema>;

export const crewDeckCardEntrySchema = z.object({
  crewId: z.string().min(1),
  copies: z.number().int().positive(),
});
export type CrewDeckCardEntry = z.infer<typeof crewDeckCardEntrySchema>;

export const fullGameCrewDeckSchema = z.object({
  id: z.literal("full-game"),
  label: z.string().min(1),
  deckSize: z.number().int().positive(),
  cards: z.array(crewDeckCardEntrySchema).min(1),
});
export type FullGameCrewDeck = z.infer<typeof fullGameCrewDeckSchema>;

export { missionDeckCardEntrySchema, missionDeckSchema } from "./missions";
export type { MissionDeck, MissionDeckCardEntry } from "./missions";

export const enemyDeckCardEntrySchema = z.object({
  enemyId: z.string().min(1),
  copies: z.number().int().positive(),
});
export type EnemyDeckCardEntry = z.infer<typeof enemyDeckCardEntrySchema>;

const enemyPileSchema = z.object({
  cards: z.array(enemyDeckCardEntrySchema).min(1),
});

export const fullGameEnemyDecksSchema = z.object({
  schemaVersion: z.literal(1),
  label: z.string().min(1),
  explorationDeckSize: z.number().int().positive(),
  reinforcementDeckSize: z.number().int().positive(),
  exploration: enemyPileSchema,
  reinforcement: enemyPileSchema,
});
export type FullGameEnemyDecks = z.infer<typeof fullGameEnemyDecksSchema>;

export const sliceEnemyDeckSchema = z.object({
  schemaVersion: z.literal(1),
  label: z.string().min(1),
  factionsInPlay: z.array(enemyFactionIdSchema).min(1),
  explorationDeckSize: z.number().int().positive(),
  reinforcementDeckSize: z.number().int().positive(),
  exploration: enemyPileSchema,
  reinforcement: enemyPileSchema,
});
export type SliceEnemyDeck = z.infer<typeof sliceEnemyDeckSchema>;