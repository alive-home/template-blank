import { existsSync, readFileSync } from "node:fs"
import { defineConfig, devices } from "@playwright/test"

// bun's automatic .env loading does not survive the `bun --filter` hop, so
// load the workspace root .env here — real env vars keep precedence.
const envFile = new URL("../.env", import.meta.url)
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, "utf8").split("\n")) {
    const m = /^([A-Z_][A-Z0-9_]*)=(.*)$/.exec(line)
    if (m?.[1] && m[2] !== undefined && !(m[1] in process.env)) {
      process.env[m[1]] = m[2]
    }
  }
}

const WEB = process.env.WEB_BASE_URL ?? "http://localhost:3000"
const API = process.env.API_BASE_URL ?? "http://localhost:3001"
const AUTH_SECRET = process.env.AUTH_SECRET ?? "dev-secret-do-not-use-in-prod"

// Playwright starts both servers, so the two URLs name their ports. They get
// them the way Alive's supervisor gives them: PORT for its own, PORT_API for web.
function portOf(url: string): string {
  const { port } = new URL(url)
  if (!port) throw new Error(`${url} needs an explicit port: the dev server started for it listens there`)
  return port
}

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: WEB,
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: [
    {
      command: "bun --filter @template/api dev",
      url: `${API}/health`,
      reuseExistingServer: !process.env.CI,
      cwd: "..",
      env: { AUTH_SECRET, API_BASE_URL: API, WEB_BASE_URL: WEB, PORT: portOf(API) },
    },
    {
      command: "bun --filter @template/web dev",
      url: WEB,
      reuseExistingServer: !process.env.CI,
      cwd: "..",
      env: { VITE_API_BASE_URL: API, VITE_WEB_BASE_URL: WEB, PORT: portOf(WEB), PORT_API: portOf(API) },
    },
  ],
})
