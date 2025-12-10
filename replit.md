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
- Added PlanSyncProvider for global Firebase sync (fixes data persistence on login/logout)
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

## User Preferences
- Architecture: Firebase + Vercel + GitHub only (no Replit-specific dependencies)
- Admin access: Controlled via Firestore `admin: true` field on user documents
