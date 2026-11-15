import { z } from "zod";
import { actionTokenKindSchema, resourceCostSchema } from "./primitives";

const crewRowSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  /** Commander trait text; plain Ensigns may be empty (action shown in effect area). */
  text: z.string(),
  costs: z.array(resourceCostSchema).min(1),
  actionToken: actionTokenKindSchema,
});

/** Plain Ensigns only — no character `name` (named officers live in `commanderCrewSchema`). */
export const ensignCrewSchema = crewRowSchema;
export type EnsignCrew = z.infer<typeof ensignCrewSchema>;

/** `title` is the specialty (e.g. Black Marketeer); `name` is the unique character on the card. */
export const commanderCrewSchema = crewRowSchema.extend({
  name: z.string().min(1).optional(),
});
export type CommanderCrew = z.infer<typeof commanderCrewSchema>;
