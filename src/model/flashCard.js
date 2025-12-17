import {z} from 'zod'

export const createFlashCardSchema = z.object({
    front: z.string().min(1).max(1000),
    back: z.string().min(1).max(1000),
    front_URL: z.string().min(1).max(1000).optional(),
    back_URL: z.string().min(1).max(1000).optional(),
    collection_id: z.uuid()
})

export const getFlashCardSchema = z.object({
    id: z.uuid
})