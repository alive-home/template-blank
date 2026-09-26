import { z } from "zod"

export const LoginInput = z.object({
  password: z.string().min(1),
})
export type LoginInput = z.infer<typeof LoginInput>
