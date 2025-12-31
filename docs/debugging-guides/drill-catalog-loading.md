# Case Study: Debugging Drill Catalog Loading Failure

## Problem Statement

### Symptoms
- Drill Catalogue page at `/catalog` showed perpetual "Loading drills..." spinner
- `/api/exercises` endpoint returned valid JSON (78 drills) when tested directly
- Client-side fetch appeared to never execute
- After adding environment variables: Drills loaded on first visit (logged out), but disappeared immediately upon login and showed "We hit a snag loading drills" error

### Initial Hypothesis
React hydration mismatch errors in browser console were blocking JavaScript execution, preventing the useEffect hook from running.

---

## Investigation Process

### Phase 1: Misdiagnosis - Hydration Issues

**Actions Taken:**
- Removed double hydration guards from `AppProviders.tsx` and `CatalogPage.tsx`
- Simplified hydration logic to let Next.js handle it naturally

**Result:** ❌ Failed - drills still didn't load

### Phase 2: Debug Mode Implementation

**Approach:** Create minimal debug version to isolate the problem

**Changes Made to `app/catalog/page.tsx`:**

```tsx
"use client";

import { useEffect, useState } from "react";

export default function CatalogPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toISOString()}: ${message}`]);
    console.log(message);
  };

  useEffect(() => {
    addLog("✅ CatalogPage component mounted");
    addLog("🔄 Starting drill fetch...");
    
    async function loadDrills() {
      try {
        addLog("📡 Calling fetch('/api/exercises')");
        const res = await fetch("/api/exercises");
        
        addLog(`📊 Response status: ${res.status}`);
        
        if (!res.ok) {
          const errorData = await res.json();
          addLog(`❌ Error response: ${JSON.stringify(errorData)}`);
          throw new Error(`API returned ${res.status}`);
        }

        const data = await res.json();
        addLog(`✅ Received data with ${data.exercises?.length || 0} exercises`);
        
        setExercises(data.exercises || []);
        addLog(`🎉 Successfully loaded ${data.exercises.length} drills!`);
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        addLog(`❌ ERROR: ${errorMsg}`);
        setError(errorMsg);
      } finally {
        setIsLoading(false);
        addLog("✋ Loading complete");
      }
    }

    loadDrills();
  }, []);

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Drill Catalogue Debug Mode</h1>
        
        {/* Debug Logs - VISIBLE ON SCREEN */}
        <div className="mb-8 p-4 bg-gray-900 text-green-400 rounded-lg font-mono text-xs overflow-auto max-h-60">
          <div className="font-bold mb-2">🔍 Debug Log:</div>
          {logs.map((log, i) => (
            <div key={i} className="mb-1">{log}</div>
          ))}
        </div>

        {/* Status Display */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="p-4 border rounded-lg">
            <div className="text-sm text-gray-600">Status</div>
            <div className="text-2xl font-bold">
              {isLoading ? "🔄 Loading" : error ? "❌ Error" : "✅ Loaded"}
            </div>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="text-sm text-gray-600">Drills Found</div>
            <div className="text-2xl font-bold">{exercises.length}</div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 p-6 bg-red-50 border-2 border-red-300 rounded-lg">
            <div className="text-xl font-bold text-red-800 mb-2">❌ Error Occurred</div>
            <div className="text-red-700 font-mono text-sm">{error}</div>
          </div>
        )}

        {/* Drills Display */}
        {!isLoading && exercises.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exercises.slice(0, 12).map((exercise) => (
              <div key={exercise.id} className="border-2 border-green-200 rounded-lg p-4">
                <h3 className="font-bold text-lg mb-2">{exercise.title}</h3>
                <p className="text-sm text-gray-700 mb-3">{exercise.overview?.substring(0, 150)}...</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

**Key Debug Features:**
- Stripped from 725 lines to 157 lines
- Removed ALL providers, filters, search, pagination
- Added visible on-screen debug log panel with timestamps
- Added status cards showing loading state and drill count
- Extensive console logging at every step

**Result:** ✅ Success - revealed the actual error

### Phase 3: Root Cause Discovery

**Debug Output Revealed:**
```
❌ ERROR: Missing Firebase Admin credentials. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.
```

**Root Cause #1:** Missing Firebase Admin SDK environment variables on Vercel

**Location:** `app/utils/firebaseAdmin.ts`

```typescript
function getAdminApp(): App {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Missing Firebase Admin credentials. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY."
    );
  }
  // ...
}
```

---

## Resolution Phase 1: Environment Variables

**Created `.env.local`:**
```bash
# Firebase Admin SDK (Server-side)
FIREBASE_PROJECT_ID=footballeyeq-39b68
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@footballeyeq-39b68.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n[FULL KEY]-----END PRIVATE KEY-----\n"

# Firebase Client SDK (Client-side)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...
```

**Configured Vercel Environment Variables:**
- Added all 13 variables to Vercel dashboard
- Applied to: Production, Preview, Development environments

**Result:** ✅ Drills loaded on first visit (logged out)

**New Problem:** ❌ Drills disappeared after login

---

## Investigation Phase 2: Login-Related Failure

### Phase 4: Second Root Cause Discovery

**Observation:** When user logs in:
1. Drills load initially ✅
2. User clicks "Sign In" button
3. Drills disappear immediately ❌
4. Shows "No filter matches my criteria" then "We hit a snag loading drills"

**Hypothesis:** Authentication state change triggers component re-render that breaks something

**Investigation:**
Examined `app/components/FavoritesProvider.tsx` which wraps the entire app and responds to auth state changes.

**Code Analysis - Lines 100-112:**

```typescript
useEffect(() => {
  const unsubAuth = onAuthStateChanged(auth, async (user) => {
    setUserId(user?.uid || null);
    if (!user) {
      setFavoritesData([]);
      setAccountType("free");
      setLoading(false);
      setHasHydrated(true);
      return;
    }

    try {
      const signupsQuery = query(                    // ❌ PROBLEM HERE
        collection(db, "signups"),
        where("uid", "==", user.uid)
      );
      const snapshot = await getDocs(signupsQuery);  // ❌ FAILS SILENTLY
      if (!snapshot.empty) {
        const userData = snapshot.docs[0].data();
        setAccountType((userData.accountType as AccountType) || "free");
      }
    } catch (error) {
      console.error("Failed to load account type:", error);
    }
  });
}, []);
```

**Examined Firestore Security Rules - `firestore.rules:56-72`:**

```javascript
match /signups/{signupId} {
  allow read: if isAuthenticated() && 
    (resource.data.uid == request.auth.uid || isSuperAdmin());
  // ...
}
```

**Root Cause #2 Identified:**

The security rule `match /signups/{signupId}` only allows reading specific documents by ID, not querying the collection.

**Why This Matters:**
- `getDoc(doc(db, "signups", userId))` ✅ Works - reads specific document
- `getDocs(query(collection(db, "signups"), where(...)))` ❌ Fails - queries collection

The code attempted a collection query which the security rules blocked. This caused the `getDocs()` call to fail silently, leading to cascading errors that prevented drills from loading.

---

## Resolution Phase 2: Fix Firestore Query

**Changes to `app/components/FavoritesProvider.tsx`:**

**Before (Lines 101-112):**
```typescript
try {
  const signupsQuery = query(
    collection(db, "signups"),
    where("uid", "==", user.uid)
  );
  const snapshot = await getDocs(signupsQuery);
  if (!snapshot.empty) {
    const userData = snapshot.docs[0].data();
    setAccountType((userData.accountType as AccountType) || "free");
  }
} catch (error) {
  console.error("Failed to load account type:", error);
}
```

**After (Lines 101-110):**
```typescript
try {
  const signupDocRef = doc(db, "signups", user.uid);
  const snapshot = await getDoc(signupDocRef);
  if (snapshot.exists()) {
    const userData = snapshot.data();
    setAccountType((userData.accountType as AccountType) || "free");
  }
} catch (error) {
  console.error("Failed to load account type:", error);
}
```

**Also added import:**
```typescript
import {
  // ... existing imports
  getDoc,  // ← Added
} from "firebase/firestore";
```

---

## Key Lessons for AI Debugging

### 1. Don't Trust Initial Hypotheses
- **Initial diagnosis:** "Hydration mismatch blocking JavaScript"
- **Actual cause:** Missing environment variables + Firestore security rule conflict
- **Lesson:** Verify assumptions with direct evidence

### 2. Create Minimal Debug Versions
- Strip complex components down to bare essentials
- Add visible on-screen logging (not just console.log)
- Log at every step of the process
- **Why it works:** Isolates the exact failure point

### 3. Debug UI Features
```typescript
const [logs, setLogs] = useState<string[]>([]);

const addLog = (message: string) => {
  setLogs(prev => [...prev, `${new Date().toISOString()}: ${message}`]);
  console.log(message);
};

// Render logs ON SCREEN
<div className="bg-gray-900 text-green-400 font-mono">
  {logs.map((log, i) => <div key={i}>{log}</div>)}
</div>
```
**Benefit:** User can screenshot and share exact error sequence

### 4. Understand Firebase Security Rule Patterns

**Document Access (Allowed):**
```typescript
getDoc(doc(db, "collection", documentId))  // ✅
```

**Collection Queries (Requires Different Rule):**
```typescript
getDocs(query(collection(db, "collection"), where(...)))  // ❌ May be blocked
```

**Security Rule for Document Access:**
```javascript
match /collection/{docId} {
  allow read: if resource.data.userId == request.auth.uid;
}
```

**Security Rule Needed for Collection Queries:**
```javascript
match /collection/{docId} {
  allow read, list: if resource.data.userId == request.auth.uid;
  // Note: 'list' permission enables queries
}
```

**Alternative:** Change code to use direct document access instead of queries

### 5. Environment Variable Debugging

Check these locations:
1. `.env.local` (local development)
2. Vercel Dashboard → Settings → Environment Variables
3. Verify applied to correct environments (Production/Preview/Development)
4. Check server-side vs client-side prefixes (`NEXT_PUBLIC_`)

### 6. Phased Problem Solving

When multiple issues exist:
1. Fix most obvious issue first (environment variables)
2. Test thoroughly
3. Discover secondary issues (Firestore query)
4. Repeat until resolved

---

## Summary

| Root Cause | Location | Fix |
|------------|----------|-----|
| Missing Firebase Admin credentials | Vercel env vars | Added FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY |
| Collection query blocked by security rules | FavoritesProvider.tsx | Changed from `getDocs(query(...))` to `getDoc(doc(...))` |

**Date Fixed:** December 2024
