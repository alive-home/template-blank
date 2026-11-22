import { aliveTagger } from "@alive-game/alive-tagger"
import tailwindcss from "@tailwindcss/vite"
import { tanstackRouter } from "@tanstack/router-plugin/vite"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")
  // Alive hands every service its neighbours' ports by name and the bind host in
  // HOST (loopback on a person's computer). Unset HOST binds every interface: the
  // preview edge dials this server over IPv4, and Vite's own default (`localhost`)
  // can resolve to ::1 alone. The 3000/3001 defaults are for runs without Alive.
  const host = env.HOST || true
  const apiTarget = env.API_PROXY_TARGET ?? `http://localhost:${env.PORT_API || 3001}`
  return {
    plugins: [
      tanstackRouter({ target: "react", autoCodeSplitting: true }),
      react(),
      tailwindcss(),
      // Dev only: tags each element with its source location so Alive's
      // preview can map a clicked element back to the line that renders it.
      mode === "development" && aliveTagger(),
    ],
    server: {
      port: Number(env.PORT ?? 3000),
      host,
      // Dev-only mirror of nginx.conf's `location /rpc/` so the same-origin
      // "/rpc" client default reaches the api (bun) in dev too.
      proxy: {
        "/rpc": apiTarget,
      },
    },
    preview: {
      port: Number(env.PORT ?? 3000),
      host,
    },
  }
})
