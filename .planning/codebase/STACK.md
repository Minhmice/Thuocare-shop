```markdown
# Technology Stack

**Analysis Date:** 2026-04-21

## Languages

**Primary:**
- TypeScript (strict) - Next.js app code in `src/**/*.ts`, `src/**/*.tsx` (`tsconfig.json`)

**Secondary:**
- JavaScript (Node) - tool/scripts (e.g. `scripts/sync-skills.mjs`)
- Python (stdlib-only) - scraping script `scripts/longchau_scrape_products.py`
- SQL (Postgres) - Supabase migrations in `supabase/migrations/*.sql`

## Runtime

**Environment:**
- Node.js `>=24` (declared in `package.json#engines`)

**Package Manager:**
- npm (lockfile present: `package-lock.json`)

## Frameworks

**Core:**
- Next.js `16.2.1` - App Router in `src/app/**` (`package.json`)
- React `19.2.4` - UI layer (`package.json`)

**Build/Dev:**
- Next dev/build/start via `npm run dev|build|start` (`package.json`)
- TypeScript `^5` with `strict: true` (`tsconfig.json`)

**Styling/UI:**
- Tailwind CSS `^4` via PostCSS plugin `@tailwindcss/postcss` (`postcss.config.mjs`, `package.json`)
- shadcn (`components.json`) + Base UI (`@base-ui/react`) + class-variance-authority for variants (`src/components/ui/button.tsx`)
- Icons: `lucide-react` (`package.json`)

**Linting:**
- ESLint `^9` with `eslint-config-next` (`eslint.config.mjs`)

## Key Dependencies

**Critical:**
- `@supabase/supabase-js` `^2.104.0` - data access + server API route writes (`src/lib/supabase/server.ts`, `src/data/*.ts`, `src/app/api/**`)

**UI Utility:**
- `clsx` + `tailwind-merge` - class composition helper `cn()` (`src/lib/utils.ts`)

## Configuration

**Next.js:**
- `next.config.ts`:
  - `output: "standalone"` (Docker-ish deploy-friendly artifact)
  - `images.remotePatterns` allows `https://cdn.nhathuoclongchau.com.vn` (used across product images)

**TypeScript:**
- `tsconfig.json`:
  - path alias `@/*` -> `src/*`

**Environment:**
- `.env` present (do not commit secrets). Server-side reads are centralized in `src/lib/supabase/server.ts`.

## Platform Requirements

**Development:**
```bash
npm ci
npm run dev
```

**Typecheck/lint/build:**
```bash
npm run check
```

**Production:**
- Next.js standalone output (see `next.config.ts`) typically deployed via Node server (`npm run start`) with env vars configured at runtime.

---

*Stack analysis: 2026-04-21*
```
