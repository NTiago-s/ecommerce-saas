# Multi-tenant Ecommerce SaaS Design

Date: 2026-05-24

## Goal

Unify `apps/web`, `apps/server`, and `apps/store` into a functional ecommerce SaaS:

- `apps/web` owns marketing, auth, billing, tenant management, and dashboard UX.
- `apps/server` (Medusa 2) owns catalog, checkout primitives, and internal ecommerce operations.
- `apps/store` becomes the public storefront surface for each tenant.

The first release uses slug-based storefront URLs and keeps the architecture ready for future custom domains without collapsing the three apps into one codebase.

## Product Model

- Guests can browse the public SaaS website in `apps/web`.
- Registration creates an account only. It does not grant store access automatically.
- A user gains ecommerce access only after selecting one of the existing plans:
  - `Prueba`
  - `Basico`
  - `Intermedio`
  - `Profesional`
- After an active or trial subscription exists, the dashboard unlocks tenant creation and store operations.

## Multi-tenant Model

- A user can own multiple stores up to `plan.maxStores`.
- Each store maps to:
  - a local SaaS record in Prisma
  - a Medusa sales channel
  - a slug reserved for the public storefront
- Stores are created manually from an empty dashboard state. No demo store is provisioned automatically.

## Technical Architecture

### `apps/web`

- Remains the SaaS control plane.
- Validates authentication, billing status, plan limits, and ownership.
- Calls Medusa through the existing internal `/saas/*` surface.
- Exposes a public storefront lookup endpoint so `apps/store` can resolve tenant context by slug.

### `apps/server`

- Keeps the Medusa workflows and SaaS-protected internal endpoints.
- Continues enforcing allowed sales channels for catalog mutations.
- Serves as the source of truth for ecommerce entities such as products and sales channels.

### `apps/store`

- Resolves a tenant by slug through `apps/web`.
- Renders a storefront under a tenant-aware URL.
- Filters catalog and cart context by the tenant sales channel.
- Keeps SEO on public storefront pages while account and checkout remain excluded.

## Routing Strategy

- SaaS public website stays in `apps/web`.
- Tenant storefronts use slug-based paths in `apps/store`.
- First release path shape:
  - `/{countryCode}/s/{storeSlug}`
  - `/{countryCode}/s/{storeSlug}/products/{handle}`
- This route contract is intentionally isolated so domain resolution can later swap `slug -> custom domain` without rewriting catalog templates.

## Access and Limits

- Dashboard states:
  - guest
  - authenticated without active plan
  - authenticated with active plan
- Store creation requires subscription status in `ACTIVE` or `TRIAL`.
- Product creation validates ownership and `plan.maxProducts` per store.
- Downgrades block new resource creation but should not break existing operational stores.

## Storefront Behavior

- Storefront pages are public and indexable only when the tenant is active.
- Product listings and product detail pages are filtered by tenant sales channel.
- Cart creation uses the tenant sales channel so checkout stays isolated to the selected storefront.
- If a shopper switches to another tenant storefront, a new cart context is created when needed.

## SEO

- `apps/web` indexes only marketing pages.
- `dashboard`, `billing`, and authenticated areas remain `noindex`.
- `apps/store` generates tenant-specific metadata, canonical URLs, and public-facing content per slug.
- Account, checkout, and private operational routes remain excluded from search indexing.

## Implementation Plan

1. Fix account and subscription gating in `apps/web`.
2. Harden tenant creation and product limit enforcement.
3. Rework dashboard states for no-plan, no-store, and multi-store operation.
4. Add public storefront lookup in `apps/web`.
5. Add tenant-aware storefront routes and cart context in `apps/store`.
6. Validate the build surface for `web` and `store`.
