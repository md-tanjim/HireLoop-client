<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# hire-loop

Early-stage job-board app: Next.js 16.4.4 App Router, React 19, strict TypeScript, Tailwind v4, Better Auth + MongoDB. npm with `package-lock.json`. No test runner or CI is configured yet.

## Commands

- `npm run dev` — Turbopack dev server.
- `npm run lint` / `npx eslint <path>` — ESLint 9 flat config.
- `npm run typecheck` — `tsc --noEmit` for the whole project.
- `npm run build` — **currently fails** during page-data collection; see Known issues.
- `npm run format` — Prettier on `**/*.{ts,tsx}` only. For CSS/MJS/JSON, run `npx prettier --write <path>`.
- No test commands exist; don't invent one.

## Layout and wiring

- `app/` — App Router. `app/api/auth/[...all]/route.ts` delegates to `lib/auth.ts` via `toNextJsHandler`.
- `lib/auth.ts` — server Better Auth config (MongoDB adapter, database name hardcoded to `hire-loop`).
- `lib/auth-client.ts` — browser auth client.
- `.env` is gitignored; expected keys are `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `NEXT_PUBLIC_API_URL`, `MONGO_DB_URL`.
- `@/*` maps to the repo root; there is no `src/` directory.
- `components/ui/` — shadcn components. This repo uses the `base-nova` style with `@base-ui/react` primitives, not Radix. Add components with `npx shadcn@latest add <name>`.
- `cn` comes from the `cn` npm package and is re-exported by `lib/utils.ts`; don't add `clsx`/`tailwind-merge`.
- Tailwind v4 is CSS-first: no `tailwind.config`; theme tokens live in `app/globals.css`.

## Conventions

- Prettier: no semicolons, double quotes, LF, 80 columns, sorted Tailwind classes (`cn` and `cva` are recognized).
- Next 16: Turbopack is the default for dev and build; `middleware.ts` is deprecated in favor of `proxy.ts`; request APIs (`params`, `searchParams`, `cookies()`, `headers()`) are async — `await` them.
- `next dev` rewrites the generated block at the top of this file; keep it in commits.

## Known issues (fix, don't copy)

- `lib/auth.ts:5` passes the literal string `"process.env.MONGO_DB_URL as string"` to `MongoClient`, so the build fails with `MongoParseError: Invalid scheme`. Use `process.env.MONGO_DB_URL as string`.
- `lib/auth-client.ts` creates the client twice: exported `signIn`/`signUp`/`useSession` come from an unconfigured `createAuthClient()`. It also reads `BETTER_AUTH_URL` in browser code, where only `NEXT_PUBLIC_*` variables are inlined. Reuse one configured client with a public URL when touching auth.
