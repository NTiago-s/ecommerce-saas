# Billing (Mercado Pago Visible, Stripe Hidden) + FX Sync Job Design

Date: 2026-05-23

## Goal

Implement SaaS subscription billing owned by `apps/web`:

- Monthly subscriptions via Mercado Pago (visible/usable in UI).
- Stripe integration scaffolded but not exposed in UI yet.
- Prices are defined in USD in our DB, but Mercado Pago charges in ARS using the official BCRA rate.
- An hourly scheduled job runs in `apps/server` (Medusa) to trigger a sync that updates Mercado Pago subscription plan amounts when the official rate changes.

This design keeps the Medusa surface focused on ecommerce operations while `web` owns billing, plans, and entitlements.

## High-Level Architecture

- `apps/web`
  - Stores users, plans, subscriptions in Prisma (Postgres).
  - Exposes internal endpoints protected with `SAAS_INTERNAL_API_KEY` for billing maintenance tasks.
  - Integrates with Mercado Pago Subscriptions API:
    - `preapproval_plan` per SaaS plan.
    - `preapproval` per user subscription.
  - Receives Mercado Pago webhooks and updates subscription status.
- `apps/server` (Medusa)
  - Runs a scheduled job every hour.
  - Calls `apps/web` internal billing sync endpoint to update Mercado Pago plan amounts.

## Data Model (Prisma)

### Plan

- `price` is stored in USD (integer dollars for now, e.g. 15, 33, 100; free plan is 0).
- `currency` stays as `"usd"`.
- Add:
  - `mpPreapprovalPlanId` (unique, nullable): stores Mercado Pago `preapproval_plan` id for this plan.
  - Optional metadata fields to support idempotent sync (rate/amount last applied).
- Make `stripePriceId` nullable for now (Stripe is scaffolded but not required yet).

### Subscription

- Subscription is per user (1 plan controls max stores and product limits across the user's stores).
- Mercado Pago fields already exist:
  - `mpPayerId` (optional)
  - `mpPreapprovalId` (unique, optional)

## Pricing / Entitlements

Plans:

- Prueba: 1 store, max 10 products, $0/month.
- Basico: 1 store, max 30 products, $15/month.
- Intermedio: 3 stores, max 40 products per store, $33/month.
- Profesional: 5 stores, unlimited products, $100/month.

Enforcement:

- Store creation checks `plan.maxStores`.
- Product creation checks `plan.maxProducts` (interpreted as "max products per store").

## FX Source (Official)

Use the BCRA public API (Principales Variables) to fetch the official retail USD/ARS rate:

- Variable: "Tipo de Cambio Minorista ($ por USD) Comunicación B 9791 - Promedio vendedor"
- We use the latest reported `valor`.

## Mercado Pago Integration

### Plans (preapproval_plan)

We keep one Mercado Pago plan per SaaS plan.

- Create/update plans with ARS amounts derived from the current BCRA official rate.
- Updating a plan updates the recurring charge settings for that plan in Mercado Pago.

### Subscriptions (preapproval)

User flow:

1. User chooses a paid plan in the dashboard.
2. Backend ensures `Plan.mpPreapprovalPlanId` exists (creates it if needed).
3. Backend creates a Mercado Pago subscription (`preapproval`) referencing the plan.
4. User is redirected to `init_point`.
5. Webhook confirms status changes and we update `Subscription.status`.

### Webhooks

Receive webhook topic `subscription_preapproval` and validate signature using the secret configured in Mercado Pago developer console.

## Hourly Sync Job (apps/server)

- A Medusa scheduled job runs every hour (`0 * * * *`).
- It calls `apps/web` internal endpoint:
  - `POST /api/internal/billing/mercadopago/sync-plans`
  - Auth: `Authorization: Bearer ${SAAS_INTERNAL_API_KEY}`
- The endpoint:
  - Fetches official rate from BCRA.
  - Computes ARS amounts for each paid plan.
  - Updates Mercado Pago `preapproval_plan` where needed.

## Stripe (Hidden Scaffold)

- Keep env vars and placeholders for Stripe webhooks/checkout subscription creation.
- UI doesn't expose Stripe yet; only Mercado Pago is selectable/visible.

