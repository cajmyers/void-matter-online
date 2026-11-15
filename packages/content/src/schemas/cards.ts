import { z } from "zod";
import { resourceCostSchema } from "./primitives";

export const sectorDeckSchema = z.enum(["s1", "s2", "s3", "s4", "common"]);
export type SectorDeck = z.infer<typeof sectorDeckSchema>;

export const assetCardKindSchema = z.enum(["weapon", "special", "defence", "module"]);
export type AssetCardKind = z.infer<typeof assetCardKindSchema>;

/** @deprecated Use {@link assetCardKindSchema}. */
export const s1CardKindSchema = z.enum(["weapon", "special"]);
export type S1CardKind = z.infer<typeof s1CardKindSchema>;

/** Printed weapon family on asset cards (V5). */
export const weaponArchetypeSchema = z.enum(["Energy", "Mass Accelerator", "Drones and Missiles"]);
export type WeaponArchetype = z.infer<typeof weaponArchetypeSchema>;

export const weaponBlockSchema = z.object({
  diceCount: z.number().int().positive(),
  hitLabel: z.string().min(1),
  archetype: weaponArchetypeSchema,
});
export type WeaponBlock = z.infer<typeof weaponBlockSchema>;

/** @deprecated Use {@link weaponBlockSchema}. */
export const s1WeaponBlockSchema = weaponBlockSchema;
export type S1WeaponBlock = WeaponBlock;

export const assetCardSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  sectorDeck: sectorDeckSchema,
  slotSize: z.union([z.literal(0.5), z.literal(1), z.literal(2)]),
  kind: assetCardKindSchema,
  illustrationSlug: z.string().min(1),
  costs: z.array(resourceCostSchema).min(1),
  flavorText: z.string().min(1),
  /** Empty when the card has no printed effect beyond stats (e.g. plain weapons). */
  rulesText: z.string(),
  weapon: weaponBlockSchema.optional(),
});
export type AssetCard = z.infer<typeof assetCardSchema>;

/** S1 rows (`kind` weapon or special only in the full ruleset). */
export const s1AssetCardSchema = assetCardSchema.extend({
  sectorDeck: z.literal("s1"),
  kind: s1CardKindSchema,
});
export type S1AssetCard = z.infer<typeof s1AssetCardSchema>;
