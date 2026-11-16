import { z } from "zod";
import { sectorDeckSchema } from "./cards";

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