# Firebase Setup Guide

Complete guide for configuring Firebase for Football EyeQ in local development, CI/CD, and production environments.

---

## Overview

Football EyeQ uses Firebase for:
- **Authentication** - User login/signup
- **Firestore Database** - Storing drills, sessions, favorites, clubs, reviews
- **Firebase Admin SDK** - Server-side data access via API routes

You need to configure **both** client-side and server-side Firebase credentials.

---

## Prerequisites

1. Firebase project created at [console.firebase.google.com](https://console.firebase.google.com/)
2. Firestore database enabled
3. Authentication enabled (Email/Password provider)
4. Firebase Admin SDK service account created

---

## Part 1: Client-Side Configuration (Browser)

### Step 1: Get Firebase Web App Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click the gear icon ⚙️ → **Project settings**
4. Scroll to "Your apps" section
5. Find your web app configuration (or create one if none exists)

You'll see values like:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456",
  measurementId: "G-XXXXXXXXXX"
};
```

### Step 2: Add to Environment Variables

These values go in your `.env.local` file with the `NEXT_PUBLIC_` prefix (they're safe to expose publicly):

```bash
# Firebase Client SDK (Browser)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

---

## Part 2: Server-Side Configuration (API Routes)

The API routes (like `/api/exercises`) use Firebase Admin SDK to access Firestore server-side.

### Step 1: Create Service Account

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click gear icon ⚙️ → **Project settings**
4. Go to **Service accounts** tab
5. Click **Generate new private key**
6. Save the downloaded JSON file (keep it secure!)

The JSON file contains:
```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com",
  "client_id": "123456789012345678901",
  ...
}
```

### Step 2: Extract Required Values

From the JSON file, extract:
- `project_id` → `FIREBASE_PROJECT_ID`
- `client_email` → `FIREBASE_CLIENT_EMAIL`
- `private_key` → `FIREBASE_PRIVATE_KEY`

### Step 3: Add to Environment Variables

**IMPORTANT:** The private key must keep its newline characters (`\n`).

Add to `.env.local`:
```bash
# Firebase Admin SDK (Server-side)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANB...full key here...\n-----END PRIVATE KEY-----\n"
```

**Note:** Wrap the private key in quotes and preserve `\n` characters.

---

## Part 3: Email Configuration (Optional)

For the contact form to work, configure Resend email service:

```bash
# Resend Email Service
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
CONTACT_EMAIL_TO=your-email@example.com
CONTACT_EMAIL_FROM=noreply@yourdomain.com
```

Get your API key from: https://resend.com/api-keys

For testing, you can use: `onboarding@resend.dev` as the FROM address.

---

## Part 4: Deployment Setup

### Vercel Deployment

1. Go to your Vercel dashboard
2. Select your project → **Settings** → **Environment Variables**
3. Add all 13 environment variables:
   - 7 `NEXT_PUBLIC_*` variables (client-side Firebase)
   - 3 `FIREBASE_*` variables (server-side Admin SDK)
   - 3 `RESEND_*` / `CONTACT_*` variables (email service)
4. Apply to: **Production**, **Preview**, **Development** environments
5. Redeploy your application

**Important:** After adding environment variables, trigger a new deployment for them to take effect.

### GitHub Actions (CI/CD)

For Playwright tests to run in CI, add Firebase secrets to GitHub:

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each `NEXT_PUBLIC_*` variable as a secret

See [FIREBASE_SECRETS_CI.md](../deployment/FIREBASE_SECRETS_CI.md) for detailed instructions.

---

## Part 5: Test User Setup

After configuring Firebase, create test users for E2E tests:

```bash
npm run setup-test-users
```

This creates:
- Free user: `test.free@example.com` / `testpass123`
- Premium user: `test.premium@example.com` / `testpass123`

See [TEST_USER_SETUP.md](./TEST_USER_SETUP.md) for details.

---

## Verification

### Test Local Setup

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Visit http://localhost:5000

3. Try these features:
   - Browse drill catalog at `/catalog` (should load drills)
   - Create account at `/signup`
   - Login at `/login`
   - Add drills to planner at `/planner`

### Test Production Setup

1. Deploy to Vercel
2. Check Vercel deployment logs for errors
3. Visit your production URL
4. Test the same features as above

---

## Troubleshooting

### Error: "Missing Firebase Admin credentials"

**Cause:** Server-side environment variables not set

**Fix:**
1. Check `.env.local` has `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`
2. Restart your dev server (`npm run dev`)
3. For Vercel: Check environment variables in dashboard, redeploy

**Where this error appears:** `/api/exercises` endpoint, drill catalog loading

### Error: "auth/invalid-api-key"

**Cause:** Client-side Firebase config incorrect

**Fix:**
1. Verify `NEXT_PUBLIC_FIREBASE_API_KEY` matches your Firebase console
2. Check all 7 `NEXT_PUBLIC_*` variables are set
3. For GitHub Actions: Verify secrets are added

### Error: "Drills load but disappear after login"

**Root Cause:** Firestore security rules blocking collection queries

**Solution:** The code should use direct document access instead of collection queries.

**Example:**
```typescript
// ❌ BAD - Collection query (may be blocked by security rules)
const q = query(collection(db, "signups"), where("uid", "==", userId));
const snapshot = await getDocs(q);

// ✅ GOOD - Direct document access
const docRef = doc(db, "signups", userId);
const snapshot = await getDoc(docRef);
```

See [drill-catalog-loading.md](../development/debugging/drill-catalog-loading.md) for the full debugging case study.

### Error: "Tests timeout waiting for Firebase"

**Cause:** Network issues or wrong configuration

**Fix:**
1. Check `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` is correct
2. Verify Firebase project is accessible
3. For CI: Check GitHub secrets are properly set

---

## Security Notes

### Client-Side Config (NEXT_PUBLIC_*)

✅ **Safe to expose:** These variables are meant to be public
- They're included in your web app JavaScript bundle
- Anyone can see them in browser DevTools
- Firebase API keys are not secret

✅ **Protected by rules:** Your Firestore and Auth security rules protect your data, not the API key

### Server-Side Config (FIREBASE_*)

🔒 **Keep private:** These are actual secrets
- Never commit to git
- Never expose in client-side code
- Store securely in `.env.local` (gitignored)
- Add to Vercel/hosting platform as environment variables

---

## Complete Environment Variable Reference

```bash
# === Firebase Client SDK (Browser - Safe to expose) ===
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# === Firebase Admin SDK (Server - Keep private) ===
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# === Email Service (Optional - Keep private) ===
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
CONTACT_EMAIL_TO=your-email@example.com
CONTACT_EMAIL_FROM=noreply@yourdomain.com
```

---

## Related Documentation

- [Environment Variables Reference](./ENVIRONMENT_VARIABLES.md)
- [Getting Started Guide](./GETTING_STARTED.md)
- [Test User Setup](./TEST_USER_SETUP.md)
- [CI/CD Firebase Secrets](../deployment/FIREBASE_SECRETS_CI.md)
- [Debugging: Drill Catalog Loading](../development/debugging/drill-catalog-loading.md)

---

## External Resources

- [Firebase Web Setup](https://firebase.google.com/docs/web/setup)
- [Firebase Admin SDK Setup](https://firebase.google.com/docs/admin/setup)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
