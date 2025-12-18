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
  level: z.int().min(1).max(5).optional(),
});

export const updateFlashCardSchema = z.object({
  front: z.string().min(1).max(1000).optional(),
  back: z.string().min(1).max(1000).optional(),
  front_URL: z.string().min(1).max(1000).optional(),
  back_URL: z.string().min(1).max(1000).optional(),
});
