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

**Feature Specifications:**
- **Pages:** Home, Drill Catalogue, Session Planner, Session Stats (premium), Upgrade, Club Signup, Club Dashboard, educational pages (Why Scanning, How It Works, Ecosystem, Use Cases), Contact, and Tag Explanation Guide.
- **Navigation:** Navbar includes Drill Catalogue, Session Planner, Tag Guide, and a "Learn" dropdown. Role-specific tabs for "My Club" (club admins) and "Admin Hub" (super admin).
- **Post-Signup Onboarding:** Contextual welcome modals and redirects guide users based on their account type.

## External Dependencies
- **Firebase:** Used for user authentication, Firestore database for data persistence (drills, user profiles, plans, favorites), and potentially for cloud functions in future enhancements.
- **Next.js:** The core React framework for building the application.
- **React:** JavaScript library for building user interfaces.
- **TypeScript:** Superset of JavaScript that adds static typing.
- **Tailwind CSS:** A utility-first CSS framework for styling.
- **Zustand:** A small, fast, and scalable bear-bones state-management solution.
- **Vercel:** Platform for frontend deployment.