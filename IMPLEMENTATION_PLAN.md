# IMPLEMENTATION_PLAN

## Objective
Build a web app that helps districts and local businesses launch themed neighborhood crawls, measure foot traffic impact, and convert route performance data into recurring revenue.

## Product Scope (MVP)
- Public route discovery and map view for visitors.
- Business onboarding + route participation management.
- QR check-in flow with timestamped visit events.
- Analytics dashboard for route completion and stop conversion.
- Admin controls for district/campaign management.

## Key IdeaBrowser Inputs
- Main premise: themed local crawls with mobile route experience and check-ins.
- Value ladder: free planning guide -> pilot program -> business subscription -> continuity rewards -> sponsorship backend.
- Why now: experiential local tourism + measurable SMB marketing spend demand.
- Problem score: high pain around proving campaign impact for local districts.
- Feasibility score: moderate difficulty, fast MVP possible.

## Technical Baseline
- Frontend: React + TypeScript (Vite)
- Mapping: Mapbox GL JS (or Leaflet fallback)
- Backend: Supabase (Auth, Postgres, Storage)
- Analytics events: server-side route/check-in event model
- Hosting: Vercel

## Phases

### Phase 1 - App Foundation
- Define domain model: districts, businesses, routes, stops, check-ins, users.
- Set up auth and role gates (visitor, business owner, district admin).
- Create app shell, navigation, environment handling, error boundaries.

### Phase 2 - Route Discovery Experience
- Implement public route listing with theme filters.
- Build route detail page with stop order, map pins, and ETA.
- Add mobile-first route runner view.

### Phase 3 - Check-ins + Attribution
- Implement QR check-in token flow per stop.
- Write check-in events with anti-duplicate guardrails.
- Add attribution metrics: completion rate, stop drop-off, repeat visitors.

### Phase 4 - Business + District Console
- Business profile CRUD, media uploads, and offer metadata.
- Route builder for admins (drag/reorder stops, publish/unpublish).
- Campaign dashboard with route-level and stop-level KPIs.

### Phase 5 - Monetization + Ops
- Subscription/paywall hooks for businesses.
- Sponsorship/campaign packaging entities.
- CSV/PDF export for grant/reporting use cases.

### Phase 6 - Hardening + Launch
- Performance tuning for map-heavy mobile views.
- Security and RLS policy review.
- End-to-end tests for critical flows.
- Production deploy and post-launch runbook.

## Non-Goals (Initial MVP)
- Native mobile apps.
- Real-time indoor navigation.
- Full recommendation engine for route optimization.

## Risks
- Geo + QR fraud/abuse in check-ins.
- Proving conversion quality for merchants without POS integrations.
- Cold start of route inventory in a new district.

## Acceptance Criteria (MVP)
- Users can discover and complete a route on mobile web.
- Each stop can be checked in once per route run with persisted events.
- Business admins can publish a route and view engagement metrics.
- District admins can export campaign summary data.
