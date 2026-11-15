import { z } from "zod";

export const enemyShipSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  faction: z.literal("iron-syndicate"),
  tier: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  hull: z.number().int().positive(),
  speed: z.number().int().positive(),
  weaponsLine: z.string().min(1),
  specialText: z.string().min(1),
});
export type EnemyShip = z.infer<typeof enemyShipSchema>;
