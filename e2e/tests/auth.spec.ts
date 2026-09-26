import { createORPCClient } from "@orpc/client"
import { RPCLink } from "@orpc/client/fetch"
import type { RouterClient } from "@orpc/server"
import { expect, test } from "@playwright/test"
import type { AppRouter } from "@template/api/router"

const API = process.env.API_BASE_URL ?? "http://localhost:3001"
const PASSWORD = process.env.AUTH_SECRET ?? "dev-secret-do-not-use-in-prod"

function client(): RouterClient<AppRouter> {
  return createORPCClient(new RPCLink({ url: `${API}/rpc` }))
}

test("login issues a JWT for the AUTH_SECRET password", async () => {
  const { token } = await client().auth.login({ password: PASSWORD })
  expect(token).toMatch(/^[\w-]+\.[\w-]+\.[\w-]+$/)
})

test("login rejects a wrong password", async () => {
  const anon = client()
  await expect(anon.auth.login({ password: "definitely-not-the-secret" })).rejects.toThrow(/UNAUTHORIZED|bad password/)
})
