import { z } from 'zod';

export const createQuestionSchema = z.object({
    title: z.string().min(1).max(300),
    visibility: z.enum(['PUBLIC', 'PRIVATE']),
    description: z.string().max(500).optional(),
})
