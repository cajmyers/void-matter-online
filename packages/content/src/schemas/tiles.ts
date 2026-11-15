import { z } from "zod";
import { edgeNameSchema, resourceAmountSchema, resourceIdSchema } from "./primitives";

export const anomalyAbilitySchema = z.enum(["interact", "passive"]);
export type AnomalyAbility = z.infer<typeof anomalyAbilitySchema>;

export const anomalyTileSchema = z.object({
  id: z.string().min(1),
  number: z.number().int().positive(),
  name: z.string().min(1),
  bonus: z.tuple([resourceIdSchema, resourceIdSchema]),
  ability: anomalyAbilitySchema,
  gates: z.array(edgeNameSchema).min(1),
});
export type AnomalyTile = z.infer<typeof anomalyTileSchema>;

export const planetGatePatternSchema = z.enum(["cl", "y", "ar", "al"]);
export type PlanetGatePattern = z.infer<typeof planetGatePatternSchema>;

export const planetGroupSchema = z.enum(["High metal", "High fuel", "High component", "High tech"]);
export type PlanetGroup = z.infer<typeof planetGroupSchema>;

export const planetTileSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  group: planetGroupSchema,
  pattern: planetGatePatternSchema,
  supply: z.array(resourceAmountSchema).min(1),
  demand: z.array(resourceAmountSchema).min(1),
});
export type PlanetTile = z.infer<typeof planetTileSchema>;
