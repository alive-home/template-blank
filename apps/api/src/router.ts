import { ORPCError } from "@orpc/server"
import { LoginInput } from "@template/shared"
import { checkPassword, issueToken } from "./auth.ts"
import { publicProcedure } from "./orpc.ts"

export const appRouter = {
  health: publicProcedure.handler(() => ({ ok: true, ts: Date.now() })),

  auth: {
    login: publicProcedure.input(LoginInput).handler(async ({ input }) => {
      if (!checkPassword(input.password)) {
        throw new ORPCError("UNAUTHORIZED", { message: "bad password" })
      }
      return { token: await issueToken() }
    }),
  },
}

export type AppRouter = typeof appRouter
