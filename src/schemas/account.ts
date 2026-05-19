import { z } from "zod"

export const signInZodSchema = z.object({
    email: z.string(),
    password: z.string(),
})

export type signInSchema = z.infer<typeof signInZodSchema>