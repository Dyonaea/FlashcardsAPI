import { z } from "zod";

export const createCollectionSchema = z.object({
  title: z.string().min(1).max(300),
  visibility: z.enum(["PUBLIC", "PRIVATE"]),
  description: z.string().max(500).optional(),
});

export const idCollection = z.object({
  id: z.uuid(),
});

export const searchCollectionSchema = z.object({
  query: z.string().min(1).max(100),
});

export const updateCollectionSchema = z
  .object({
    title: z.string().min(1).max(300).optional(),
    visibility: z.enum(["PUBLIC", "PRIVATE"]).optional(),
    description: z.string().max(500).optional(),
  })
  .refine(
    (data) =>
      data.title !== undefined ||
      data.visibility !== undefined ||
      data.description !== undefined,
    { message: "At least one field must be provided" }
  );
