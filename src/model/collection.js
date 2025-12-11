import { z } from "zod";

export const createCollectionSchema = z.object({
  title: z.string().min(1).max(300),
  visibility: z.enum(["PUBLIC", "PRIVATE"]),
  description: z.string().max(500).optional(),
});

export const getCollectionSchema = z.object({
  id: z.uuid(),
});

export const searchCollectionSchema = z.object({
  query: z.string().min(1).max(100),
});
