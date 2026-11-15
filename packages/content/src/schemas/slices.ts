import { z } from "zod";
import { resourceIdSchema } from "./primitives";

const sectorMarketSchema = z.object({
  resource: resourceIdSchema,
  label: z.string().min(1),
  deckSize: z.number().int().positive(),
  deckBack: z.enum(["s1-upgrade", "procedural"]),
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
  includedCardIds: z.object({
    s1: z.array(z.string().min(1)),
  }),
  includedCrewIds: z.array(z.string().min(1)),
  includedEnemyIds: z.array(z.string().min(1)),
  includedPlayerShipIds: z.array(z.string().min(1)),
});
export type FirstPlayableSlice = z.infer<typeof firstPlayableSliceSchema>;
