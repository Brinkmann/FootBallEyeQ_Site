# Football EyeQ

## Overview

Football EyeQ is a cognitive training platform for football (soccer) coaches. It provides a curated library of 100+ research-backed cognitive drills, intelligent filtering, a 12-session season planner, smart LED cone integration, community reviews, and club management features. The platform supports multiple account tiers (Free, Individual Premium, Club Coach) with different entitlements and exercise access levels.

The app is built as a Next.js 15 full-stack application using Firebase for authentication, database (Firestore), and analytics. It runs on port 5000.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend

- **Framework**: Next.js 15 (App Router) with React 19 and TypeScript
- **Styling**: Tailwind CSS v4 with CSS custom properties for theming (light/dark mode via `prefers-color-scheme`). Brand colors are defined as CSS variables in `app/globals.css`
- **State Management**: Zustand for client-side state (session planner store at `app/store/usePlanStore`). React Context for cross-cutting concerns (entitlements, favorites, exercise type selection, analytics)
- **Animations**: AOS (Animate On Scroll) library for page transitions
- **PDF Generation**: jsPDF for exercise PDF downloads
- **QR Codes**: qrcode.react for session code QR generation

### Provider Architecture

The app wraps all pages in a layered provider hierarchy defined in `app/components/AppProviders.tsx`:
1. `AnalyticsProvider` — Firebase Analytics with consent management
2. `EntitlementProvider` — Account type, permissions, and club membership
3. `ExerciseTypeProvider` — Toggle between "eyeq" and "plastic" exercise types
4. `FavoritesProvider` — User favorites with Firestore sync
5. `PlanSyncProvider` — Season planner cloud sync with offline support

### Backend / API

- **API Routes**: Next.js App Router API routes under `app/api/` handle server-side logic (contact form, exercise fetching, auth sessions, invite code redemption)
- **Server Auth**: `app/lib/serverAuth.ts` uses Firebase Admin SDK to verify session cookies for protected routes. Session cookies are set via `__session` cookie name
- **Protected Layouts**: `app/admin/layout.tsx` and `app/profile/layout.tsx` use server-side auth checks with redirects
- **Email**: Resend SDK (`resend` package) for transactional emails (contact form)
- **Validation**: Zod v4 for runtime schema validation of exercises, account types, and user data (`app/lib/schemas.ts`)

### Authentication & Authorization

- **Client-side**: Firebase Auth (email/password) with `Firebase/auth.ts` handling register, login, logout
- **Server-side**: Firebase Admin SDK creates session cookies. The flow is: client gets Firebase ID token → POST to `/api/auth/session` → server creates session cookie → subsequent server-side checks use `verifySession()`
- **Account Tiers**: Free, Individual Premium, Club Coach — each with different entitlements (favorites limits, planner access, exercise type access). Defined in `app/types/account.ts`
- **Super Admin**: Hardcoded email check (`obrinkmann@gmail.com`) for admin panel access
- **Club System**: Clubs have invite codes, admin roles, exercise type policies, and member management

### Data Storage

- **Firestore Collections**:
  - `exercises` — Drill/exercise data with fields: id, title, ageGroup, decisionTheme, playerInvolvement, gameMoment, difficulty, practiceFormat, overview, description, exerciseType
  - `signups` — User profile data (fname, lname, organization, accountType, clubId, clubRole)
  - `reviews` — Exercise reviews with star ratings
  - `favorites` — User exercise favorites (per exercise type)
  - `planners` — Season planner data (12 weeks of exercises per user)
  - `clubs` — Club configuration and membership data
- **Firebase Config**: All Firebase credentials come from environment variables prefixed with `NEXT_PUBLIC_FIREBASE_` (client) and `FIREBASE_` (server/admin)

### Key Pages & Routes

| Route | Purpose |
|-------|---------|
| `/` | Marketing landing page |
| `/catalog` | Drill catalogue with faceted filtering, search, favorites |
| `/planner` | 12-session season planner with drag-and-drop |
| `/login`, `/signup` | Authentication |
| `/profile` | User profile management (protected) |
| `/admin` | Admin panel for exercise and club management (protected) |
| `/join-club` | Club invite code redemption |
| `/explanation` | Tag/filter guide for coaches |
| `/faq` | Searchable FAQ from `faq-data.json` |
| `/contact` | Contact form (sends via Resend API) |
| `/upgrade` | Pricing/upgrade page |
| Content pages | `/why-scanning`, `/how-it-works`, `/ecosystem`, `/use-cases`, `/resources`, `/testimonials`, `/getting-started` |

### Middleware

`middleware.ts` handles:
- HTTP → HTTPS redirect in production
- Security headers (HSTS, CSP, X-Frame-Options, etc.)
- Skips redirect for development hosts (localhost, replit.dev)

### Testing

- **E2E**: Playwright configured in `playwright.config.ts`, tests in `tests/e2e/`
- **Unit/API**: tsx test runner for `tests/**/*.test.ts`
- **Test Users**: `scripts/setup-test-users.js` creates Firebase test users for different account tiers

### Build & Run

- `npm run dev` — Development server on port 5000
- `npm run build` — Production build
- `npm run start` — Production server on port 5000

## External Dependencies

### Firebase (Required)
- **Firebase Auth** — User authentication (email/password)
- **Firestore** — NoSQL document database for all app data
- **Firebase Analytics** — Event tracking with user consent
- **Firebase Admin SDK** — Server-side auth verification and database access
- Environment variables needed: `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`, `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`, `NEXT_PUBLIC_FIREBASE_APP_ID`, `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`, `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`

### Resend (Email)
- Transactional email delivery for contact form submissions
- Environment variable: `RESEND_API_KEY`

### NPM Packages of Note
- `zustand` — Lightweight state management for planner
- `zod` — Runtime type validation
- `jspdf` — Client-side PDF generation
- `qrcode.react` — QR code rendering for session codes
- `aos` — Scroll animations
- `next-auth` — Listed as dependency but session management is primarily custom Firebase-based
- `html-to-image` / `html2canvas` — HTML-to-image conversion utilities