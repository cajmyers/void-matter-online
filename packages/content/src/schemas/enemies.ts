import { z } from "zod";

export const enemyFactionIdSchema = z.enum(["iron-syndicate", "prism-ascendancy", "the-hive"]);
export type EnemyFactionId = z.infer<typeof enemyFactionIdSchema>;

export const enemyShipSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  faction: enemyFactionIdSchema,
  tier: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  hull: z.number().int().positive(),
  speed: z.number().int().positive(),
  weaponsLine: z.string().min(1),
  /** Empty when the card has no printed ability (e.g. Swarm Larva). */
  specialText: z.string(),
});
export type EnemyShip = z.infer<typeof enemyShipSchema>;

export const ENEMY_FACTION_LABELS: Readonly<Record<EnemyFactionId, string>> = {
  "iron-syndicate": "Iron Syndicate",
  "prism-ascendancy": "Prism Ascendancy",
  "the-hive": "The Hive",
};
