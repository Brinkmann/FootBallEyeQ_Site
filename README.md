# Football EyeQ

Football EyeQ is a Next.js app that helps coaches organize football training. It combines a searchable drill catalog, a season planner, and mock smart-cone controls with Firebase authentication and Firestore storage.

## Core features
- **Exercise catalog:** Browse drills stored in Firestore with filters for age group, decision theme, player involvement, game moment, and difficulty. Each card shows images, overviews, and tags for quick scanning.  
- **Season planner:** Build a 12-week plan, add exercises into weekly slots, and persist the plan per user in Firestore. Generate numeric session codes for hardware integration from each week.  
- **Cone control (mock):** Send a pattern number to smart LED cones via a stubbed network request. The UI is ready to swap in a real controller endpoint.  
- **Coach accounts:** Sign up, log in, and keep profile info (name, organization, email, created date) synced with Firestore.  
- **Exercise admin:** Add, edit, or delete catalog entries with normalized tags and optional base64 images; stored under the `exercises` collection.

## Project structure
- `app/page.tsx`: Marketing-style landing page with feature highlights and auth-aware header.  
- `app/catalog/page.tsx`: Catalog grid with multi-filter search backed by Firestore.  
- `app/planner/page.tsx`: Planner UI using Zustand state that autosaves user plans to Firestore and generates session codes.  
- `app/cones/page.tsx`: Mock cone controller that posts pattern numbers and documents how to hook up real hardware.  
- `app/profile/page.tsx`: Profile viewer/editor bound to the `signups` collection for the signed-in user.  
- `app/admin/page.jsx`: Admin console for managing exercises and tags.  
- `Firebase/`: Firebase initialization plus small auth helpers.  
- `app/store/usePlanStore.ts`: Zustand store for planner state and slot constraints.

## Prerequisites
- Node.js 18+ and npm
- A Firebase project with Firestore and Email/Password auth enabled
- Environment variables in a `.env.local` file:
  ```
  NEXT_PUBLIC_FIREBASE_API_KEY=your_key
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
  NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
  NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
  NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
  ```

## Getting started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Open the app at http://localhost:3000. Create an account, load exercises (via admin), and start planning sessions.

## Data model
- **`exercises` collection:** Documents with drill metadata (title, tags, difficulty, image, description).  
- **`planners` collection:** One document per user storing `weeks` arrays and `maxPerWeek` limits for the season planner.  
- **`signups` collection:** User profile records (name, organization, email, created timestamp) tied to auth emails.

## Notes for hardware integration
Replace the mock `triggerPattern` implementation in `app/utils/coneControl.ts` with a real `fetch` call to your cone controller. The UI already sends numeric pattern values and displays responses, so only the network call needs to change.
