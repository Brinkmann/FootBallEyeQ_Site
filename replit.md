# Football EyeQ

## Overview
Football EyeQ is a Next.js application that helps coaches organize football training sessions. It combines a searchable drill catalog, a season planner, and mock smart-cone controls with Firebase authentication and Firestore storage.

## Tech Stack
- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore)
- **State Management**: Zustand
- **Deployment**: Vercel

## Project Structure
- `app/` - Next.js app router pages and components
- `app/components/` - Reusable React components including PlanSyncProvider for global state sync
- `app/store/` - Zustand store for planner state
- `Firebase/` - Firebase configuration and auth helpers
- `public/` - Static assets and images
- `attached_assets/` - User-provided infographic images

## Site Structure
The site has the following pages:
1. **Home** (`/`) - Hero section with infographics, three pillars (See/Think/Do), product highlights, CTAs
2. **Drill Catalogue** (`/catalog`) - Main feature - searchable exercise library
3. **Session Planner** (`/planner`) - Main feature - 12-week season planning tool (locked sessions for free users)
4. **Session Stats** (`/planner/stats`) - Exercise selection analytics and plan balance (premium only)
5. **Upgrade** (`/upgrade`) - Join club via invite code or individual subscription options
6. **Club Signup** (`/club/signup`) - Register a new club as admin
7. **Club Dashboard** (`/club/dashboard`) - Club admin: manage coaches, generate invite codes
8. **Why Scanning** (`/why-scanning`) - Educational content on scanning importance
9. **How It Works** (`/how-it-works`) - Training method and hardware overview
10. **Ecosystem** (`/ecosystem`) - Plan/Train/Enjoy cycle visualization
11. **Use Cases** (`/use-cases`) - Player pathways (youth, semi-pro, professional)
12. **Testimonials** (`/testimonials`) - Placeholder for future social proof
13. **Resources** (`/resources`) - Placeholder for guides, blog, downloads
14. **Contact** (`/contact`) - Lead capture form
15. **Tag Explanation Guide** (`/explanation`) - Drill coding system reference

## Navigation Structure
- **Header nav**: Drill Catalogue, Session Planner, Learn (dropdown), Resources, Testimonials, Contact
- **Learn dropdown**: Why Scanning, How It Works, Ecosystem, Use Cases
- **Navbar (authenticated)**: Full tab navigation for logged-in users

## Infographic Assets (in attached_assets/)
- Hero/Game Intelligence image
- Traditional vs EyeQ comparison
- Ecosystem cycle (Plan.Train.Enjoy)
- Power of Scanning steps
- See/Think/Do player illustrations
- Players with colored cones variants
- Single player scanning
- Execute On-Field text

## Exercise Schema
Exercises use a clean, explicit field structure (no redundant tags array):
- `id` - Unique identifier (e.g., "001")
- `title` - Exercise name
- `ageGroup` - Foundation Phase (U7-U10), Youth Development (U11-U14), etc.
- `decisionTheme` - Pass or Dribble, Attack or Hold, Shoot or Pass
- `playerInvolvement` - Individual, 1v1/2v2, Small Group, Team Unit
- `gameMoment` - Build-Up, Switch of Play, Final Third Decision
- `difficulty` - Basic, Moderate, Advanced, Elite
- `practiceFormat` - Warm-Up, Fun Game, Finishing, Possession, Rondo, SSG
- `overview` - Full summary of the drill
- `description` - Detailed setup and coaching points
- `exerciseBreakdownDesc` - Short one-line summary for stats page display
- `image` - Base64 encoded image (optional)

## Key Features
- Exercise catalog with filters (age group, difficulty, game moment, etc.)
- Favorites system - coaches can favorite drills and filter to show only favorites
- 12-week season planner with Firebase persistence
- Coach authentication and profiles
- Admin console for managing exercises
- **Two-tier account system (Club/Coach)**:
  - Free coaches: 1 session, 10 favorites, no stats access
  - Club coaches: Full access (12 sessions, unlimited favorites, stats)
  - Club admins can manage coach roster and generate invite codes
  - Upgrade page for joining clubs via invite code

## Environment Variables Required
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

## Recent Changes
- **Improved Signup Flow (Dec 2024)**: Enhanced onboarding experience
  - `/signup` is now a decision hub with Coach vs Club choice cards
  - Coach signup form has optional organization field
  - `/club/signup` is a 2-step wizard with benefits preview and progress indicator
  - WelcomeModal component shows contextual guidance after signup
  - Coaches see "Welcome to Football EyeQ" modal with feature highlights
  - Club admins see "Your club is ready" modal with next steps for inviting coaches
  - Post-signup redirects include `?welcome=true` to trigger onboarding screens
- **Super Admin System (Dec 2024)**: Hidden system administration page
  - Route: `/super-admin` (not linked anywhere in UI)
  - Access: Only obrinkmann@gmail.com (hardcoded email check)
  - Features: View/suspend/unsuspend/delete clubs and coaches
  - Club suspension cascades to all associated coaches
  - Suspended users get downgraded to free entitlements
  - **SECURITY NOTE**: Production requires Firestore rules (see Future Improvements section)
- **Two-Tier Account System (Dec 2024)**: Club/Coach monetization model
  - Three account types: Free, Club Coach, Individual Premium
  - Free users limited to 1 session, 10 favorites, no stats access
  - Clubs can register and manage coach accounts via invite codes
  - EntitlementProvider tracks user access level across the app
  - Locked UI states with upgrade CTAs for premium features
  - Club dashboard for admin roster management
  - Invite code system with expiration and single-use enforcement
- **Favorites Feature (Dec 2024)**: Allow coaches to save favorite drills
  - Heart icon next to each exercise title for quick favoriting
  - Favorites stored in Firestore per user (real-time sync across devices)
  - FavoritesProvider context for efficient single-listener pattern
  - Favorites toggle button in catalog header shows count and filters to favorites only
  - Favorites filter integrates with ActiveFilters tag strip
- **Catalog UX Modernization (Dec 2024)**: Compact smart filtering system
  - SmartSearch with autocomplete suggestions showing filter options and drill counts
  - FacetedFilters bottom sheet (mobile) / side panel with collapsible accordion sections
  - Each filter option shows live drill counts to guide coach decisions
  - ActiveFilters tag strip for dismissing selected filters
  - Search supports multi-term matching across all drill fields
  - Improved empty state with friendly message and reset button
  - Post-login now redirects to Session Planner page
  - Fixed contextual filter counts (counts now reflect current filter selections)
- **Site Restructure (Dec 2024)**: Complete redesign with 7 new pages
  - New home page with hero infographic, three pillars, product highlights
  - Educational pages: Why Scanning, How It Works, Ecosystem
  - Use Cases page for different player pathways
  - Placeholder pages: Testimonials, Resources
  - Contact page with lead capture form
  - Updated navigation with Learn dropdown menu
  - Integrated user-provided infographic images throughout
- Added PlanSyncProvider for global Firebase sync
- Configured Next.js for Replit environment (port 5000, allowed origins)
- Disabled Turbopack for compatibility

---

## Future Improvements (Security)

### Priority: HIGH - Admin Access Control

The current admin system has security vulnerabilities that should be addressed before going to production:

#### Issue 1: Users Could Self-Promote to Admin
**Problem**: If Firebase security rules allow users to write to their own document in the `signups` collection, they could change `admin: false` to `admin: true` themselves.

**Solution**: Add Firestore security rules that prevent users from modifying the `admin` field:
```javascript
match /signups/{docId} {
  allow read: if request.auth != null;
  allow create: if request.auth != null && request.resource.data.admin == false;
  allow update: if request.auth != null 
    && request.auth.uid == resource.data.uid
    && request.resource.data.admin == resource.data.admin; // Cannot change admin field
}
```

#### Issue 2: Admin Page Has No Route Protection
**Problem**: The `/admin` page is only hidden in the UI navbar. Anyone who knows the URL can navigate directly to `/admin` and access it.

**Solution**: Add server-side route protection using Next.js middleware or a server component that validates admin status before rendering.

#### Issue 3: No Server-Side Validation for Admin Operations
**Problem**: Exercise CRUD operations in the admin page have no server-side authorization. Any authenticated user could potentially modify the exercises collection.

**Solution**: 
- Add Firestore security rules for the `exercises` collection that only allow writes from admin users
- Or move admin operations to server-side API routes that validate admin status

### Implementation Checklist
- [ ] Add Firestore security rules for `signups` collection (prevent admin field modification)
- [ ] Add Firestore security rules for `exercises` collection (admin-only writes)
- [ ] Add route protection for `/admin` page (middleware or server component)
- [ ] Consider using Firebase Custom Claims for admin status (more secure than Firestore field)

### Priority: HIGH - Super Admin Security

The `/super-admin` page currently uses client-side email verification only. Before production:

#### Issue: Client-Side Only Protection
**Problem**: Super admin operations (suspend/delete clubs and coaches) are executed directly from browser. A technically savvy user could bypass the UI check.

**Solution Options**:
1. **Firebase Callable Functions** (Recommended): Move suspend/delete logic to Cloud Functions that verify the caller's email server-side
2. **Firebase Custom Claims**: Set a `superAdmin: true` custom claim on the user and verify in Firestore rules
3. **Firestore Security Rules**: Add rules that only allow writes to `status`/`accountStatus` fields from the super admin UID

**Example Firestore Rules**:
```javascript
// Define super admin UID (get this from Firebase Console)
function isSuperAdmin() {
  return request.auth.uid == 'SUPER_ADMIN_UID_HERE';
}

match /clubs/{clubId} {
  allow read: if request.auth != null;
  allow update: if isSuperAdmin() || (request.auth != null && 
    !request.resource.data.diff(resource.data).affectedKeys().hasAny(['status', 'suspendedAt', 'suspendedReason']));
  allow delete: if isSuperAdmin();
}

match /signups/{docId} {
  allow read: if request.auth != null;
  allow update: if isSuperAdmin() || (request.auth != null && 
    request.auth.uid == resource.data.uid &&
    !request.resource.data.diff(resource.data).affectedKeys().hasAny(['accountStatus', 'suspendedAt', 'suspendedReason', 'admin']));
  allow delete: if isSuperAdmin();
}
```

---

## User Preferences
- Architecture: Firebase + Vercel + GitHub only (no Replit-specific dependencies)
- Admin access: Controlled via Firestore `admin: true` field on user documents
- Use ONLY user-provided infographic images (in attached_assets/)
- Drill Catalogue + Session Planner = main features, front and center
- No pricing information needed on the site
