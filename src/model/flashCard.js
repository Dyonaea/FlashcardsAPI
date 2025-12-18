import { z } from "zod";

export const createFlashCardSchema = z.object({
  front: z.string().min(1).max(1000),
  back: z.string().min(1).max(1000),
  front_URL: z.string().min(1).max(1000).optional(),
  back_URL: z.string().min(1).max(1000).optional(),
  collection_id: z.uuid(),
});

export const getFlashCardSchema = z.object({
  id: z.uuid(),
});

export const reviewingFlashCardSchema = z.object({
  id: z.uuid(),
  level: z.int32().min(1).max(5).optional(),
});
