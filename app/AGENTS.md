# DOX -- app/

**Next.js App Router root for SpectreSuite**

## Purpose

Security tool suite routes and layouts. SpectreSuite is GashoTech's cybersecurity offering — vulnerability assessment, security automation, scanning tools.

## Ownership

- `api/` — Route handlers (REST API endpoints for security scanning)
- `auth/` — Auth-gated routes (login, sign-up, profile)
- `components/` — React components used in this app's routes
- `tests/` — Route/integration tests

## Local Contracts

- Next.js App Router (Server Components by default)
- Clerk for auth (`clerk.config.js` in repo root)
- Convex for backend data persistence
- Tailwind CSS via `cn()` utility
- All security tools must validate input server-side (no client trust)
