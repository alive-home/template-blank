import { afterEach, expect, test } from "bun:test"
import config from "./vite.config.ts"

const KEYS = ["HOST", "PORT_API", "API_PROXY_TARGET"] as const
const before = Object.fromEntries(KEYS.map(key => [key, process.env[key]]))

afterEach(() => {
  for (const key of KEYS) {
    if (before[key] === undefined) delete process.env[key]
    else process.env[key] = before[key]
  }
})

// What Alive's supervisor would put in the environment; a key left out is unset.
function resolve(vars: Partial<Record<(typeof KEYS)[number], string>>) {
  for (const key of KEYS) {
    const value = vars[key]
    if (value === undefined) delete process.env[key]
    else process.env[key] = value
  }
  return config({ command: "serve", mode: "test" })
}

test("binds every interface when HOST is unset", () => {
  const { server, preview } = resolve({})
  expect(server?.host).toBe(true)
  expect(preview?.host).toBe(true)
})

test("binds the host Alive gives in HOST", () => {
  const { server, preview } = resolve({ HOST: "127.0.0.1" })
  expect(server?.host).toBe("127.0.0.1")
  expect(preview?.host).toBe("127.0.0.1")
})

test("proxies /rpc to the api port Alive gives in PORT_API", () => {
  expect(resolve({ PORT_API: "4101" }).server?.proxy).toEqual({ "/rpc": "http://localhost:4101" })
})

test("proxies /rpc to 3001 outside Alive", () => {
  expect(resolve({}).server?.proxy).toEqual({ "/rpc": "http://localhost:3001" })
})

test("API_PROXY_TARGET still wins over PORT_API", () => {
  const proxy = resolve({ PORT_API: "4101", API_PROXY_TARGET: "http://api.internal:9000" }).server?.proxy
  expect(proxy).toEqual({ "/rpc": "http://api.internal:9000" })
})
