# Blank Canvas

An empty starter. `apps/web/src/routes/index.tsx` is a placeholder; replace it freely without asking. Nothing in this repo is the user's content yet.

The stack, layout and conventions are in `README.md`: a Bun + Turborepo workspace with `apps/web` (Vite, React 19, file-based TanStack Router, Tailwind v4) and `apps/api` (Hono + oRPC). Rewrite the README to describe the actual product once there is one.

## Running

The dev servers `web` (3000) and `api` (3001) are declared in `alive.toml` and already run under the workspace supervisor; never start them yourself. `web` proxies `/rpc` to `api`.

Env keys set in Alive's settings are written to the root `.env.development`, which the api reads.

## Publishing

Publishing runs `bun run build` and ships the root `dist/` as a static site. `apps/api` runs in the preview only, not on the published site.
