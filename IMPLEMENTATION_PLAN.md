# IMPLEMENTATION_PLAN

## Objective
Build a web app that helps districts and local businesses launch themed neighborhood crawls, measure foot traffic impact, and grow local engagement.

## Product Scope (MVP)
- Public route discovery and map view for visitors (anonymous browsing).
- Business onboarding + route participation management (authenticated).
- QR check-in flow with timestamped visit events (authenticated visitors).
- Analytics dashboard for route completion and stop conversion (admin).
- Admin controls for district/campaign management (admin).

## Key IdeaBrowser Inputs
- Main premise: themed local crawls with mobile route experience and check-ins.
- Value ladder: free planning guide -> pilot program -> business subscription -> continuity rewards -> sponsorship backend.
- Why now: experiential local tourism + measurable SMB marketing spend demand.
- Problem score: high pain around proving campaign impact for local districts.
- Feasibility score: moderate difficulty, fast MVP possible.

## Technical Stack
- **Framework**: Next.js App Router (TypeScript)
- **Database**: Convex (real-time document DB, denormalized)
- **Auth**: Clerk (visitor/business/admin roles)
- **UI**: shadcn/ui + Tailwind CSS + Geist fonts
- **Mapping**: Mapbox GL JS + Turf.js (client-side geo)
- **CI/CD**: GitHub Actions + semantic-release + branch protection
- **Testing**: Vitest (unit/component) + Playwright (e2e)
- **Hosting**: Vercel
- **Package manager**: Bun

## Architecture Decisions
- **Single-tenant MVP** — one district, but `districtId` on all documents for future multi-tenant.
- **Denormalized Convex documents** — stops embedded in routes, check-ins with references.
- **Anonymous browsing** — Clerk auth required only for check-ins and admin/business pages.
- **QR-only check-ins** — no GPS verification for MVP. Accept fraud risk at small scale.
- **Mobile-first** — design for 375-428px, desktop gets wider layout.
- **Real-time analytics** — Convex queries compute metrics on the fly, no pre-aggregation.
- **Monetization deferred** — no Stripe, subscriptions, or sponsorship packages in MVP.

## Phases

### Phase 0 — Foundation (v0.1.0)
- Bootstrap Next.js App Router with Bun (replace Vite scaffold)
- Integrate Convex backend
- Integrate Clerk authentication
- Set up shadcn/ui component library
- GitHub Actions CI + semantic-release + branch protection

### Phase 1 — Data & Auth (v0.2.0)
- Define Convex schema for all domain entities
- Clerk-Convex user sync with role metadata
- Role-based middleware and server-side guards
- App shell with mobile-first nav and layout

### Phase 2 — Route Discovery (v0.3.0)
- Public route list page with theme filters
- Route detail page with Mapbox map and stop list
- Mobile route runner view with progress tracker
- Route card SEO metadata and share preview

### Phase 3 — Check-in Flow (v0.4.0)
- QR token generation and management
- QR scan check-in flow with auth gate
- Duplicate check-in prevention and validation
- Route completion detection and celebration

### Phase 4 — Business + Admin Console (v0.5.0)
- Business profile CRUD with photo uploads
- Admin route builder with stop ordering and publish toggles
- Analytics dashboard for district admin
- Business owner stop performance view

### Phase 5 — Testing + Hardening (v1.0.0)
- Vitest unit tests for Convex functions
- Vitest component tests for key UI flows
- Playwright e2e tests for critical paths
- Mobile performance optimization
- Production readiness checklist

## Non-Goals (Initial MVP)
- Native mobile apps.
- Real-time indoor navigation.
- Full recommendation engine for route optimization.
- Monetization (subscriptions, sponsorships, payments).
- Multi-tenant / multi-district support.

## Risks
1. **Convex denormalized + analytics** — real-time queries read every matching doc. Fine at MVP scale.
2. **QR fraud** — no GPS verification. Accept for MVP, add proximity check post-MVP.
3. **Clerk webhook reliability** — lazy-sync fallback in `useRole()` hook.
4. **Mapbox bundle size** — lazy-load with `next/dynamic`, skeleton placeholder.
5. **Single-tenant assumption** — `districtId` on all docs eases future migration.

## Acceptance Criteria (MVP)
- Users can discover and complete a route on mobile web (anonymous browsing).
- Each stop can be checked in once per 24h via QR scan with persisted events.
- Business owners can manage their profile and view stop performance.
- Admins can create/publish routes and view district-level analytics.
- CI pipeline gates all PRs; semantic-release versions all merges to main.
