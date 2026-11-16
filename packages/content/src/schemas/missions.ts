import { z } from "zod";

export const missionCardSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  text: z.string().min(1),
  /** Void Matter granted on redeem (`design-decisions.md`); always 1 in current content. */
  voidMatter: z.number().int().positive(),
});
export type MissionCard = z.infer<typeof missionCardSchema>;

export const missionDeckCardEntrySchema = z.object({
  missionId: z.string().min(1),
  copies: z.number().int().positive(),
});
export type MissionDeckCardEntry = z.infer<typeof missionDeckCardEntrySchema>;

export const missionDeckSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  deckSize: z.number().int().positive(),
  cards: z.array(missionDeckCardEntrySchema).min(1),
});
export type MissionDeck = z.infer<typeof missionDeckSchema>;