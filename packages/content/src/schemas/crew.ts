import { z } from "zod";
import { actionTokenKindSchema, resourceCostSchema } from "./primitives";

export const ensignCrewSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  text: z.string().min(1),
  costs: z.array(resourceCostSchema).min(1),
  actionToken: actionTokenKindSchema,
});
export type EnsignCrew = z.infer<typeof ensignCrewSchema>;
