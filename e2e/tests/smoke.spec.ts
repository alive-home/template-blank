import { expect, test } from "@playwright/test"

const API = process.env.API_BASE_URL ?? "http://localhost:3001"

test("api health responds", async ({ request }) => {
  const res = await request.get(`${API}/health`)
  expect(res.ok()).toBe(true)
  await expect(res.json()).resolves.toEqual({ ok: true })
})

test("home page renders", async ({ page }) => {
  const res = await page.goto("/")
  expect(res?.ok()).toBe(true)
  await expect(page.locator("main")).toBeAttached()
})
