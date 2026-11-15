import { z } from "zod";

export const contentManifestSchema = z.object({
  schemaVersion: z.number().int().positive(),
  rulesVersion: z.string().min(1),
  contentSetId: z.string().min(1),
  description: z.string().optional(),
  collections: z.record(z.string().min(1)),
});
export type ContentManifest = z.infer<typeof contentManifestSchema>;
