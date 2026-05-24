# SaaS Medusa Unification Design

## Goal

Unify `apps/web` and `apps/server` so the SaaS dashboard manages Medusa through a first-party internal API instead of direct Admin API calls. `apps/store` stays as the next phase and will consume the stable Medusa storefront surface after this layer is ready.

## Architecture

- `apps/web` remains the authenticated SaaS dashboard. It owns NextAuth sessions, Prisma users, subscriptions, store ownership, and plan limits.
- `apps/server` exposes `/saas/*` internal endpoints. These endpoints run inside Medusa 2 and perform sales-channel, product, region, shipping-profile, and upload operations through Medusa workflows and query APIs.
- `apps/web` calls `/saas/*` with `SAAS_INTERNAL_API_KEY`. The key never reaches client components.
- Ownership is checked twice: `web` checks Prisma ownership before calling Medusa, and `server` checks allowed sales-channel ids from internal headers before mutating Medusa records.

## Data Flow

1. A dashboard user triggers a server action in `web`.
2. The action authenticates the user with NextAuth and reads allowed stores from Prisma.
3. The action calls `server` `/saas/*` with the internal API key and allowed sales-channel ids.
4. Medusa executes the operation and returns normalized entities to `web`.

## Security

- Remove public Admin tokens from frontend env examples.
- Do not use `NEXT_PUBLIC_*` for Medusa admin credentials.
- Keep Medusa admin credentials out of the dashboard request path.
- Require `SAAS_INTERNAL_API_KEY` for all `/saas/*` routes.

## Dashboard Quality

- Preserve the current dashboard UI while cleaning obvious accessibility gaps.
- Buttons that perform actions get explicit `type`, `aria-label`, focus state, and `cursor-pointer`.
- SEO metadata stays on public pages and dashboard routes are excluded from indexing.

## Storefront Phase

After `web + server` are stable, `apps/store` should become the ecommerce storefront that reads products by publishable key, sales channel, region, and subdomain.
