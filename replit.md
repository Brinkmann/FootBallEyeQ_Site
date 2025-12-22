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
3. **Session Planner** (`/planner`) - Main feature - 12-week season planning tool
4. **Why Scanning** (`/why-scanning`) - Educational content on scanning importance
5. **How It Works** (`/how-it-works`) - Training method and hardware overview
6. **Ecosystem** (`/ecosystem`) - Plan/Train/Enjoy cycle visualization
7. **Use Cases** (`/use-cases`) - Player pathways (youth, semi-pro, professional)
8. **Testimonials** (`/testimonials`) - Placeholder for future social proof
9. **Resources** (`/resources`) - Placeholder for guides, blog, downloads
10. **Contact** (`/contact`) - Lead capture form
11. **Tag Explanation Guide** (`/explanation`) - Drill coding system reference

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

## Key Features
- Exercise catalog with filters (age group, difficulty, game moment, etc.)
- 12-week season planner with Firebase persistence
- Coach authentication and profiles
- Admin console for managing exercises

## Environment Variables Required
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

## Recent Changes
- **Catalog UX Modernization Phase 1 (Dec 2024)**: Smart filtering and search
  - Replaced dropdown filters with horizontal scrollable filter chips (FilterChipGroup)
  - Added search bar with instant debounced filtering by title, tags, description
  - Added ActiveFilters component showing dismissible filter tags
  - Added AdvancedFilters bottom sheet for secondary filters (Decision Theme, Player Involvement, Game Moment)
  - Improved empty state with friendly message and reset button
  - Post-login now redirects to Session Planner page
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

---

## Feature Planning
- **Trello Board:** https://trello.com/b/EoF15m6W/showmystyle
- **Local Reference:** See `FUTURE_FEATURES.md` for UX modernization roadmap

## User Preferences
- Architecture: Firebase + Vercel + GitHub only (no Replit-specific dependencies)
- Admin access: Controlled via Firestore `admin: true` field on user documents
- Use ONLY user-provided infographic images (in attached_assets/)
- Drill Catalogue + Session Planner = main features, front and center
- No pricing information needed on the site
