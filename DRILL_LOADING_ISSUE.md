# Root Cause: Missing Firebase Configuration

## The Problem
The drill catalog page shows "Loading drills..." forever because the `/api/exercises` endpoint is failing.

## Root Cause
**No Firebase Admin SDK credentials are configured.**

The API route at `app/api/exercises/route.ts` requires these environment variables:
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

Currently: **ALL are missing** (checked with `env | grep FIREBASE`)

## Why This Breaks Everything
1. User visits `/catalog`
2. Page tries to fetch from `/api/exercises`
3. API route calls `getAdminDb()` from `app/utils/firebaseAdmin.ts`
4. Firebase Admin initialization fails with error: "Missing Firebase Admin credentials"
5. API returns 500 error
6. Frontend shows loading spinner forever

## The Fix
Create `.env.local` file with Firebase credentials:

```bash
# Firebase Admin SDK (for server-side API routes)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
```

## How to Get These Values
1. Go to Firebase Console: https://console.firebase.google.com
2. Select your project
3. Go to Project Settings → Service Accounts
4. Click "Generate New Private Key"
5. Download the JSON file
6. Extract the values:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY`

## After Adding Credentials
1. Restart the dev server: `npm run dev`
2. Visit `/catalog`
3. Drills should load

## Current State
I've stripped the catalog page to absolute minimum (87 lines vs 725 lines) with extensive console logging to confirm this diagnosis. Once credentials are added, drills will load and we can add back features incrementally.
