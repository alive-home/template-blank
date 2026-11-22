import { expect, test } from "bun:test"
import { join } from "node:path"

const apiDir = join(import.meta.dir, "..")

// env.ts parses process.env once, at import, so each case loads the api's real
// entry module in a process of its own and reads what it exports for Bun to serve.
function exportedServer(vars: Record<string, string>): { port: number; hostname?: string } {
  const proc = Bun.spawnSync(
    [
      process.execPath,
      "-e",
      'import server from "./src/index.ts"; console.log(JSON.stringify({ port: server.port, hostname: server.hostname }))',
    ],
    {
      cwd: apiDir,
      env: {
        API_BASE_URL: "http://localhost:4101",
        WEB_BASE_URL: "http://localhost:4100",
        AUTH_SECRET: "test-secret-of-at-least-16-chars",
        ...vars,
      },
    },
  )
  if (proc.exitCode !== 0) throw new Error(`api entry failed to load: ${proc.stderr.toString()}`)
  const lastLine = proc.stdout.toString().trim().split("\n").at(-1)
  return JSON.parse(lastLine ?? "")
}

test("listens on the host Alive gives in HOST and the port in PORT", () => {
  expect(exportedServer({ PORT: "4101", HOST: "127.0.0.1" })).toEqual({ port: 4101, hostname: "127.0.0.1" })
})

test("listens on every interface when HOST is unset", () => {
  expect(exportedServer({ PORT: "4101" })).toEqual({ port: 4101 })
})

test("an empty HOST counts as unset", () => {
  expect(exportedServer({ PORT: "4101", HOST: "" })).toEqual({ port: 4101 })
})
