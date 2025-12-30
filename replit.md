# Football EyeQ

## Overview
Football EyeQ is a Next.js application designed to assist football coaches in organizing training sessions. It features a searchable drill catalog, a 12-week season planner, and mock smart-cone controls. The platform aims to enhance training methodologies, particularly in decision-making and game intelligence, and offers a tiered access model for individual coaches and clubs. Its primary purpose is to provide an intuitive tool for planning and managing football drills, supported by robust authentication and data storage. The project has significant market potential by streamlining coaching workflows and integrating innovative training concepts.

## User Preferences
- Architecture: Firebase + Vercel + GitHub only (no Replit-specific dependencies)
- Admin access: Controlled via Firestore `admin: true` field on user documents
- Use ONLY user-provided infographic images (in attached_assets/)
- Drill Catalogue + Session Planner = main features, front and center
- No pricing information needed on the site

## System Architecture
The application is built with Next.js 15, React 19, TypeScript, and Tailwind CSS for the frontend, utilizing Zustand for state management. Firebase handles backend services, including Authentication and Firestore for data storage. Deployment is managed via Vercel.

**UI/UX Decisions:**
The design incorporates a clear navigation structure with a prominent navbar and a detailed footer. Educational content is organized under a "Learn" dropdown. The user interface highlights key features like the Drill Catalogue and Session Planner, making them easily accessible. Infographic assets are used throughout the site to visually explain concepts like game intelligence, the ecosystem cycle, and scanning importance.

**Technical Implementations:**
- **Two-tier Account System:** Supports Free, Club Coach, and Individual Premium accounts. Free users have limited access (1 session, 10 favorites, no stats), while Club and Premium users get full access. Club admins can manage coaches and generate invite codes.
- **Exercise Type System (EyeQ vs Plastic):** Drills are categorized as 'eyeq' (smart LED cones) or 'plastic' (traditional cones). Clubs can set policies to restrict drill types, and coaches can filter accordingly.
- **Favorites System:** Allows coaches to mark drills as favorites, stored per user in Firestore with real-time synchronization.
- **Smart Filtering System:** The Drill Catalogue features `SmartSearch` with autocomplete and `FacetedFilters` (bottom sheet on mobile, side panel on desktop) displaying live drill counts.
- **Global State Synchronization:** `PlanSyncProvider` is used for global state synchronization with Firebase.
- **Exercise Schema:** Exercises are structured with fields like `id`, `title`, `ageGroup`, `decisionTheme`, `difficulty`, `practiceFormat`, `overview`, `description`, `image`, and `exerciseType`.
- **Server-Side Authorization:** Protected routes use server-side layouts with Firebase Admin SDK session verification. Session cookies are created on login and cleared on logout via API routes.

**Feature Specifications:**
- **Pages:** Home, Drill Catalogue, Session Planner, Session Stats (premium), Upgrade, Club Signup, Club Dashboard, educational pages (Why Scanning, How It Works, Ecosystem, Use Cases), Contact, and Tag Explanation Guide.
- **Navigation:** Navbar includes Drill Catalogue, Session Planner, Tag Guide, and a "Learn" dropdown. Role-specific tabs for "My Club" (club admins) and "Admin Hub" (super admin).
- **Post-Signup Onboarding:** Contextual welcome modals and redirects guide users based on their account type.

## Firestore Security Rules
The `firestore.rules` file contains comprehensive security rules for all collections:

**Collections & Access Control:**
- **exercises**: Read by authenticated users, write by super admin only
- **signups**: Users can read own profile; clubId/accountType changes require server-side APIs
- **favorites**: Users can only access their own favorites
- **clubs**: Authenticated users can read; creation via server API only; club admins manage their own
- **clubs/{clubId}/members**: Club members can read; write via server API or club admin only
- **clubInvites**: Authenticated users can read; club admins create/manage
- **reviews**: Authenticated users can create; users can edit/delete their own
- **auditEvents**: Authenticated users can create; only super admin can read
- **sessionPlans**: Users can only access their own plans

**Super Admin:** Determined by email (obrinkmann@gmail.com) - has full access to all collections.

**Server-Side APIs (for secure operations):**
- `/api/create-club` - Creates a new club with the user as admin (POST, requires Bearer token)
- `/api/redeem-invite` - Redeems an invite code to join a club (POST, requires Bearer token)
- `/api/exercises` - Fetches exercises server-side with caching (GET)

**Deploying Rules:**
```bash
firebase login
firebase deploy --only firestore:rules
```

## External Dependencies
- **Firebase:** Used for user authentication, Firestore database for data persistence (drills, user profiles, plans, favorites), and potentially for cloud functions in future enhancements.
- **Next.js:** The core React framework for building the application.
- **React:** JavaScript library for building user interfaces.
- **TypeScript:** Superset of JavaScript that adds static typing.
- **Tailwind CSS:** A utility-first CSS framework for styling.
- **Zustand:** A small, fast, and scalable bear-bones state-management solution.
- **Vercel:** Platform for frontend deployment.

## Firebase Admin SDK (Server-Side)
Required environment variables for server-side API routes:
- `FIREBASE_PROJECT_ID` - Firebase project ID
- `FIREBASE_CLIENT_EMAIL` - Service account email
- `FIREBASE_PRIVATE_KEY` - Service account private key (supports various formats)