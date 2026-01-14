# Football EyeQ Personas & Test Scenarios

This document captures high-level personas, user journeys, and test cases that align with the Drill Catalogue and 12-Session Planner experiences in the Football EyeQ app. It is written to be human-readable while remaining traceable for test automation.

## Personas

- **Club Admin (policy enforcer)**
  - Manages multiple coaches, sets EyeQ vs plastic drill policies, and checks that club sessions follow the right limits.
- **Club Coach (within a policy)**
  - Builds weekly sessions that comply with club exercise-type rules (EyeQ-only, plastic-only, or coach-choice) and needs drill discovery filtered to allowed types.
- **Individual Premium Coach**
  - Has full entitlements: can favorite unlimited drills, plan all 12 sessions, and generate EyeQ cone codes.
- **Individual Free Coach**
  - Anonymous or logged-in free-tier user who can browse drills, apply filters, plan only the first session, and gets nudges to upgrade or sign in for more content.
- **Player / Session Participant**
  - Consumes shared session codes or previews to understand what will be run on the field.

## Human-readable scenarios (mirrors automation)

### Drill Catalogue
1. **Search relevance** – Enter multi-keyword queries to return only drills whose title/overview/metadata match all terms. Ensures SmartSearch honors AND semantics across text fields.
2. **Faceted filtering** – Apply age group, difficulty, decision theme, practice format, player involvement, and game moment filters individually and in combination; removing a chip resets results. Validates filter state sync with the UI chips.
3. **Exercise-type gating** – Switch between EyeQ and plastic drill types; verify non-authenticated users see the plastic-access banner for EyeQ, and plastic drills are only shown when that type is selected.
4. **Favorites counter & toggle guardrails** – (Premium/pseudo-auth) Favorite/unfavorite drills, preserve ordering with initial favorites, and verify free-tier limit messaging when max favorites is reached.
5. **No-results handling** – Trigger zero results by combining filters and confirm empty-state messaging with clear/reset actions.
6. **Load error recovery** – Simulate Firestore failure and verify the retry + contact support affordances render.
7. **Drill preview & reviews** – Open preview modal, confirm metadata chips appear, and ensure the review summary updates when live review snapshots change.

### Session Planner
1. **Catalog hydration** – Planner loads exercises list; empty or failed fetch shows loader until data arrives.
2. **Add to session** – From a drill card, add to a specific week, ensure slot count increments, and duplicate/over-capacity attempts show inline errors.
3. **Remove from session** – Use the remove action to free a slot and confirm it reverts to an empty placeholder.
4. **Entitlement locking** – Free or suspended accounts see sessions beyond the entitlement limit locked with upgrade messaging; premium accounts can edit all 12.
5. **Exercise-type filtering** – When switching EyeQ vs plastic mode, planner shows only drills of that type and preserves original indices for removals.
6. **Session code generation** – For EyeQ drills, click “Generate Code” to produce cone codes using the ID map derived from the catalog list.
7. **Stats navigation** – “View Stats” link routes to `/planner/stats` without losing session state.

### Cross-cutting & Other Major Value Areas
1. **Navigation persistence** – Moving between catalogue and planner retains filters/plan data (local storage via Zustand persist).
2. **Upgrade nudges** – Free users see upgrade CTA below the planner grid; club coaches see enforced policy labels; club admins see policy controls.
3. **Accessibility & responsiveness** – Key buttons are keyboard-navigable; grid/card layouts adapt from mobile (1 col) to desktop (3–4 cols).

## Automation-ready scenario matrix

| ID | Area | Persona | Goal | Positive Path | Negative / Edge | Notes |
|----|------|---------|------|---------------|-----------------|-------|
| CAT-01 | Catalogue | Individual free | Find drills via search | Search “rondo build-up” returns rondo drill | Empty search returns full list | Uses SmartSearch field |
| CAT-02 | Catalogue | Individual free | Filter by facets | Apply Age=U11-U14 + Difficulty=Moderate; chips show and count reflects filtered set | Clearing one chip restores results | FacetedFilters component |
| CAT-03 | Catalogue | Club coach | Respect exercise-type policy | Switch to plastic; only plastic drills render | EyeQ banner appears for guests on EyeQ type | ExerciseTypeProvider controls selection |
| CAT-04 | Catalogue | Premium coach | Manage favorites | Toggle favorite, count increments, order stable after refresh | Free tier hits favorite limit toast | Requires auth stub |
| CAT-05 | Catalogue | Any | Handle zero/failed loads | Force 0 matches → empty-state CTA; mock Firestore 500 → retry + contact support visible | N/A | Network mocking in Playwright |
| PLAN-01 | Planner | Any | Load planner grid | Loader shown until exercises + store hydrate | N/A | usePlanStore hydration guard |
| PLAN-02 | Planner | Any | Add/remove drill | Add drill to Session 1, then remove; slot count updates | Duplicate add shows alert | ExerciseCard → addToWeek |
| PLAN-03 | Planner | Free coach | Session locking | Sessions > entitlement limit show overlay and upgrade link | N/A | Entitlements from provider |
| PLAN-04 | Planner | Club coach | Exercise-type filtering | Switch to plastic type; planner hides EyeQ drills | N/A | filteredWeeks preserves indices |
| PLAN-05 | Planner | Premium coach | Generate session code | With EyeQ drills present, Generate Code emits IDs | N/A | SessionCodeButton uses ID map |

## Test data / fixtures
- **Exercises** – Three drills across EyeQ and plastic types with varied metadata (see `tests/fixtures/exercises.ts`).
- **Entitlements** – Auth stub for premium vs free vs club roles (Playwright mock identity token + Firestore signups document shape).
- **Reviews/Favorites** – Optional empty responses to keep UI stable; can be extended with additional Firestore documents.

## Context for automation
- Base URL: `http://localhost:5000` (matches `npm run dev`).
- Routes: `/catalog`, `/planner`, `/planner/stats`.
- Critical validations:
  - Smart search AND logic across metadata fields.
  - Faceted filter chips add/remove and clear-all.
  - Planner locking after `entitlements.maxSessions`.
  - Exercise-type enforcement between EyeQ vs plastic contexts.
  - Session code generation uses ID map derived from catalog titles.

