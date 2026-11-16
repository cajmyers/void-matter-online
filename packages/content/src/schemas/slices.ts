import { z } from "zod";
import { crewDeckCardEntrySchema, sliceSectorMarketCompositionSchema } from "./decks";
import { resourceIdSchema } from "./primitives";

const sectorMarketSchema = z.object({
  resource: resourceIdSchema,
  label: z.string().min(1),
  deckSize: z.number().int().positive(),
  deckBack: z.enum(["sector", "procedural"]),
});

export const firstPlayableSliceSchema = z.object({
  id: z.literal("first-playable"),
  label: z.string().min(1),
  sectorMarkets: z.object({
    s1: sectorMarketSchema,
    s2: sectorMarketSchema,
    s3: sectorMarketSchema,
    s4: sectorMarketSchema,
  }),
  enemyDecks: z.object({
    "iron-syndicate": z.object({
      explorationSize: z.number().int().positive(),
      reinforcementSize: z.number().int().positive(),
      cardIds: z.array(z.string().min(1)),
    }),
  }),
  missionDeckSize: z.number().int().positive(),
  crewDeckSize: z.number().int().positive(),
  /** Physical cards in the slice crew deck (`DCK-5` subset). */
  crewComposition: z.array(crewDeckCardEntrySchema).min(1),
  includedCardIds: z.object({
    s1: z.array(z.string().min(1)),
  }),
  /** Slice market rows; sectors omitted use the full `sector-markets.json` deck (`content-data.md` §2). */
  sectorMarketComposition: sliceSectorMarketCompositionSchema,
  includedCrewIds: z.array(z.string().min(1)),
  includedEnemyIds: z.array(z.string().min(1)),
  includedPlayerShipIds: z.array(z.string().min(1)),
});
export type FirstPlayableSlice = z.infer<typeof firstPlayableSliceSchema>;
