import { z } from "zod";

export const resourceIdSchema = z.enum(["tc", "h3", "pc", "qp"]);
export type ResourceId = z.infer<typeof resourceIdSchema>;

export const edgeNameSchema = z.enum(["TL", "TR", "R", "BR", "BL", "L"]);
export type EdgeName = z.infer<typeof edgeNameSchema>;

export const resourceAmountSchema = z.object({
  resource: resourceIdSchema,
  amount: z.number().int().positive(),
});
export type ResourceAmount = z.infer<typeof resourceAmountSchema>;

export const resourceCostSchema = resourceAmountSchema;
export type ResourceCost = z.infer<typeof resourceCostSchema>;

export const actionTokenKindSchema = z.enum(["move", "trade", "interact", "tactical"]);
export type ActionTokenKind = z.infer<typeof actionTokenKindSchema>;
