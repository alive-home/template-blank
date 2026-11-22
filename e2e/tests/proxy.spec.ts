import { createORPCClient } from "@orpc/client"
import { RPCLink } from "@orpc/client/fetch"
import type { RouterClient } from "@orpc/server"
import { expect, test } from "@playwright/test"
import type { AppRouter } from "@template/api/router"

const WEB = process.env.WEB_BASE_URL ?? "http://localhost:3000"
const PASSWORD = process.env.AUTH_SECRET ?? "dev-secret-do-not-use-in-prod"

// The browser only ever talks to the web origin: its /rpc proxy finds the api
// by PORT_API, whichever port the host gave it.
test("login through the web origin's /rpc proxy issues a JWT", async () => {
  const client: RouterClient<AppRouter> = createORPCClient(new RPCLink({ url: `${WEB}/rpc` }))
  const { token } = await client.auth.login({ password: PASSWORD })
  expect(token).toMatch(/^[\w-]+\.[\w-]+\.[\w-]+$/)
})
