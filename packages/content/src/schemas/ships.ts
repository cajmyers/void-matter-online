import { z } from "zod";
import { resourceCostSchema } from "./primitives";

export const playerShipSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  speed: z.number().int().positive(),
  hull: z.number().int().positive(),
  crewSlots: z.number().int().nonnegative(),
  cargo: z.number().int().positive(),
  upgradeSlotsHalves: z.number().int().positive(),
  /** Printed base weapon (`design-decisions.md` §3a). Same format as enemy `weaponsLine`. */
  weaponsLine: z.string().min(1),
  /** Build cost at an Outer Rim Nexus (`design-decisions.md` §3, new Corvette mix). */
  buildCosts: z.array(resourceCostSchema).min(1),
});
export type PlayerShip = z.infer<typeof playerShipSchema>;
