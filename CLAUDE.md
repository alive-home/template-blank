# Blank Canvas

An empty starter. `apps/web/src/routes/index.tsx` is a placeholder; replace it freely without asking. Nothing in this repo is the user's content yet.

The stack, layout and conventions are in `README.md`: a Bun + Turborepo workspace with `apps/web` (Vite, React 19, file-based TanStack Router, Tailwind v4) and `apps/api` (Hono + oRPC). Rewrite the README to describe the actual product once there is one.

## Running

The dev servers `web` and `api` are declared in `alive.toml` and already run under the workspace supervisor; never start them yourself. `web` proxies `/rpc` to `api`.

Their ports come from the supervisor (`alive-workspaced meta` lists them), never from a number written in a file. A service listens on `$PORT`, finds the other by name (`$PORT_API`, `$PORT_WEB`), takes its origin from `$ALIVE_PREVIEW_ORIGIN_WEB` and binds `$HOST` when it is set. Keep it that way in `alive.toml`, `apps/web/vite.config.ts` and `apps/api`; the 3000 and 3001 defaults in them are for runs without Alive.

Env keys set in Alive's settings are written to the root `.env.development`, which the api reads.

## Publishing

Publishing runs `bun run build` and ships the root `dist/` as a static site. `apps/api` runs in the preview only, not on the published site.
