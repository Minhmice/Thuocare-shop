# Technology Stack

**Analysis Date:** 2026-04-21

## Languages

**Primary:**
- TypeScript - App + server code in `src/**/*.ts` and `src/**/*.tsx`

**Secondary:**
- CSS - Global styling in `src/app/globals.css` (Tailwind v4)
- SQL - Supabase migrations and seed data in `supabase/migrations/*.sql` and `supabase/seed.sql`

## Runtime

**Environment:**
- Node.js (required): `>=24` (from `package.json#engines.node`)

**Package Manager:**
- npm
- Lockfile: present (`package-lock.json`)

## Frameworks

**Core:**
- Next.js `16.2.1` - App Router web application (`src/app/**`)
- React `19.2.4` / `react-dom` `19.2.4` - UI runtime

**Testing:**
- Not detected (no `jest`/`vitest` config found; no `*.test.*`/`*.spec.*` surfaced in scan)

**Build/Dev:**
- Next dev/build/start (scripts in `package.json`)
- TypeScript `^5` - typechecking via `npm run typecheck` (`tsc --noEmit`)
- ESLint `^9` - linting via `npm run lint` with Next presets (`eslint.config.mjs`)

**Styling/UI:**
- Tailwind CSS `^4` - via PostCSS plugin `@tailwindcss/postcss` (`postcss.config.mjs`) and `@import "tailwindcss";` in `src/app/globals.css`
- shadcn/ui - configured via `components.json` (RSC enabled; aliases point to `@/components/ui`)
- `@base-ui/react` `^1.3.0` - headless UI primitives
- `lucide-react` `^1.6.0` - icon library
- `class-variance-authority`, `clsx`, `tailwind-merge`, `tw-animate-css` - styling helpers/animations

## Key Dependencies

**Critical:**
- `@supabase/supabase-js` `^2.104.0` - primary backend data store client (server-side usage in `src/lib/supabase/*`, `src/data/*`, `src/features/*/repositories/*`)
- `zod` `^4.3.6` - runtime validation (`src/infrastructure/validation/zod.ts`, schemas under `src/features/**/schemas/*`)

**Infrastructure:**
- Next.js standalone output - `next.config.ts` sets `output: "standalone"` for production packaging

## Configuration

**Environment:**
- Env vars consumed in server code (no values committed):
  - Supabase URL and keys in `src/lib/supabase/server.ts` and scripts under `scripts/*.ts`
  - App reads both server (`SUPABASE_*`) and public (`NEXT_PUBLIC_SUPABASE_*`) variants
- Local env file present (`.env`) - contains environment configuration (do not commit secrets)

**Build:**
- Next: `next.config.ts`
- TypeScript: `tsconfig.json` (path alias `@/*` → `src/*`)
- ESLint: `eslint.config.mjs`
- PostCSS/Tailwind v4 plugin: `postcss.config.mjs`
- shadcn: `components.json`

## Platform Requirements

**Development:**
- Node.js `>=24`
- npm (lockfile is `package-lock.json`)

**Production:**
- Next.js standalone build (`next.config.ts` sets `output: "standalone"`)

---

*Stack analysis: 2026-04-21*

