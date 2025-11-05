## Quick orientation for AI coding agents

This repository contains a Next.js (app router) frontend in `itsm-app/` and a NestJS backend in `itsm-app-server`.
Focus on concrete, discoverable patterns below so you can be productive immediately.

1. Big picture

- Frontend: `itsm-app/` is a Next 13+ app-router TypeScript app (see `src/app/`). Routes use segment groups and parentheses (example: `src/app/(core)/iam/users`).
- Backend: `itsm-app-server/` is a NestJS monolith using TypeORM (look under `src/modules/` and `src/db/`). Migrations and seeds live in `src/db/migrations` and `src/db/seeds`.

2. How to run & build (single-line actionable)

- Frontend: from `itsm-app/` run `pnpm install` then `pnpm dev` — this runs `next dev -p 8080 --turbopack` (app listens on port 8080).
- Backend: from `itsm-app-server/` run `pnpm install` then `pnpm run start:dev` (uses Nest `--watch`).
- DB work: migrations use TS TypeORM CLI wrappers in package.json: `migration:generate`, `migration:run`. Seeds: `pnpm run seed`.

3. Project-specific conventions and patterns

- App router & layout segments: see `src/app/layout.tsx` and feature folders like `(core)` and `auth`. Parentheses indicate Next segment groups.
- Data fetching: prefer the helper `src/utils/fetchWithAuth.ts` and `src/utils/getBackendUrl.ts` (centralized backend URL resolution). `src/proxy.ts` is used for dev-level proxying.
- Auth/session: frontend session code lives under `src/app/auth/` and utilities in `src/utils/cookie.utils.ts`.
- Form + validation: uses `react-hook-form` + `zod` (see `src/utils/zod.ts` and form components). Use server/route handlers consistent with zod schemas.
- State & data loading: uses `@tanstack/react-query` for client caching and invalidation.

4. Backend specifics to respect

- Nest modules live in `itsm-app-server/src/modules/*`. Follow existing module/controller/service DTO patterns.
- DB entrypoint: `itsm-app-server/src/db/data-source.ts` — TypeORM config is here. Migration commands rely on this path.
- Authorization: CASL is used in server (`@casl/ability`). Look at existing `iam` module for RBAC patterns.

5. Tests and linting

- Frontend: scripts in `itsm-app/package.json`: `dev`, `build`, `start`, `lint` (Next's ESLint config). Use `pnpm lint` to fix simple issues.
- Backend: Jest is configured; use `pnpm run test`, `test:e2e`, `test:cov`. Lint via `pnpm run lint`.

6. Helpful files to open first (examples)

- Frontend: `src/app/(core)/iam/users/*`, `src/components/providers.tsx`, `src/utils/fetchWithAuth.ts`, `src/proxy.ts`, `src/utils/getBackendUrl.ts`.
- Backend: `itsm-app-server/src/modules/iam/`, `itsm-app-server/src/db/data-source.ts`, `itsm-app-server/src/db/seeds/`, `itsm-app-server/src/modules/*/dto`.

7. Quick engineering contract (for code changes)

- Inputs: TypeScript files under `src/` (frontend) or `src/modules` (backend). Tests: unit or e2e exist for server.
- Outputs: consistent exports, maintain existing routing shapes and DTOs, and keep TypeORM migrations/seeds in sync when changing DB models.
- Error modes: missing env or DB connection are common — don't modify global env handling; add clear migration steps when changing entities.

8. Examples of common edits

- To add an API call from UI: update `fetchWithAuth.ts` usage, add a backend route/controller under `itsm-app-server/src/modules/<feature>`, and add client react-query hooks to call it.
- To change DB schema: create a TypeORM migration via `pnpm run migration:generate` and check `src/db/migrations/`.

If something above is unclear or you want a stronger focus (for example only frontend patterns, only DB/migrations, or a sample PR checklist), tell me which area to expand and I will update this file.
