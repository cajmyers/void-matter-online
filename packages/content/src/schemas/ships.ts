import { z } from "zod";

export const playerShipSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  speed: z.number().int().positive(),
  hull: z.number().int().positive(),
  crewSlots: z.number().int().nonnegative(),
  cargo: z.number().int().positive(),
  upgradeSlotsHalves: z.number().int().positive(),
});
export type PlayerShip = z.infer<typeof playerShipSchema>;
