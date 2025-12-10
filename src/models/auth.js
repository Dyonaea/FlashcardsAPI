import z from "zod"

export const registerSchema = z.object({
    email: z.email(),
    first_name: z.string().max(30).min(3),
    last_name: z.string().max(30).min(3),
    password: z.string().max(255).min(3)

})

export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(1).max(255),
})