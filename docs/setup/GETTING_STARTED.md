# Getting Started with Football EyeQ

Complete setup guide to get Football EyeQ running locally, deploy to production, and run tests.

---

## Overview

Football EyeQ is a Next.js 15 application that helps football coaches create and manage training sessions with smart LED cone integration.

**Tech Stack:**
- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend:** Firebase (Authentication, Firestore)
- **Testing:** Playwright (E2E tests)
- **Deployment:** Vercel
- **Email:** Resend

---

## Prerequisites

Before you begin, ensure you have:

- **Node.js** 18.17 or later ([download](https://nodejs.org/))
- **npm** 9.0 or later (comes with Node.js)
- **Git** ([download](https://git-scm.com/))
- **Firebase account** ([create free account](https://firebase.google.com/))
- **Vercel account** for deployment ([create free account](https://vercel.com/))

---

## Step 1: Clone the Repository

```bash
git clone https://github.com/Brinkmann/FootBallEyeQ_Site.git
cd FootBallEyeQ_Site
```

---

## Step 2: Install Dependencies

```bash
npm install
```

This installs all required packages (~300 dependencies).

---

## Step 3: Firebase Setup

Firebase provides authentication and database services. You need both client and server credentials.

### 3.1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **Add project**
3. Name it (e.g., "football-eyeq")
4. Disable Google Analytics (optional)
5. Click **Create project**

### 3.2: Enable Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click **Create database**
3. Select **Production mode**
4. Choose a location (e.g., `us-central1`)
5. Click **Enable**

### 3.3: Enable Authentication

1. Go to **Authentication** → **Sign-in method**
2. Click **Email/Password**
3. Enable **Email/Password** toggle
4. Click **Save**

### 3.4: Deploy Firestore Security Rules

From your project directory:

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase (select Firestore only)
firebase init firestore

# Deploy security rules
firebase deploy --only firestore:rules
```

**Note:** The `firestore.rules` file in the repo contains production-ready security rules.

### 3.5: Get Firebase Credentials

**Client-side credentials:**
1. Firebase Console → ⚙️ Project Settings → Your apps
2. Click the web app icon `</>` (or create one)
3. Copy the `firebaseConfig` object values

**Server-side credentials:**
1. Firebase Console → ⚙️ Project Settings → Service accounts
2. Click **Generate new private key**
3. Save the JSON file (keep it secure!)

### 3.6: Configure Environment Variables

Create `.env.local` in your project root:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Firebase credentials:

```bash
# === Firebase Client SDK (from firebaseConfig) ===
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123:web:abc
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# === Firebase Admin SDK (from service account JSON) ===
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----\n"
```

**See [Firebase Setup Guide](./FIREBASE_SETUP.md) for detailed instructions.**

---

## Step 4: Create Test Users

Create test accounts for development and testing:

```bash
npm run setup-test-users
```

This creates:
- **Free user:** `test.free@example.com` / `testpass123`
- **Premium user:** `test.premium@example.com` / `testpass123`

---

## Step 5: Run the Development Server

```bash
npm run dev
```

The app will start on http://localhost:5000

**Verify it works:**
- ✅ Homepage loads
- ✅ Navigate to `/catalog` - drills should load
- ✅ Click "Sign In" - login page appears
- ✅ Try logging in with test account

---

## Step 6: Run Tests

### E2E Tests (Playwright)

Install Playwright browsers (first time only):

```bash
npx playwright install --with-deps
```

Run tests:

```bash
# Run all tests (headless)
npm run test:e2e

# Run with UI (interactive)
npm run test:e2e:ui

# View test report
npm run test:report
```

**Test coverage:**
- 109 E2E tests across 7 spec files
- Navigation, authentication, catalog, planner, user journeys

See [E2E Testing Guide](../testing/E2E_TESTING.md) for details.

---

## Step 7: Build for Production

Test production build locally:

```bash
# Build the app
npm run build

# Start production server
npm start
```

Visit http://localhost:5000 to test the production build.

---

## Step 8: Deploy to Vercel

### 8.1: Connect to Vercel

1. Go to [vercel.com](https://vercel.com/)
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** (leave default)

### 8.2: Add Environment Variables

In Vercel dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add all 13 variables from your `.env.local`:
   - 7 `NEXT_PUBLIC_*` variables
   - 3 `FIREBASE_*` variables
   - 3 email variables (optional)
3. Select all environments: Production, Preview, Development
4. Click **Save**

### 8.3: Deploy

Click **Deploy** - Vercel will build and deploy your app.

**Your app will be live at:** `https://your-project.vercel.app`

See [Deployment Guide](../deployment/) for advanced configuration.

---

## Optional: Email Configuration

To enable the contact form:

1. Create account at [resend.com](https://resend.com/)
2. Get API key from dashboard
3. Add to `.env.local` and Vercel:
   ```bash
   RESEND_API_KEY=re_xxxxx
   CONTACT_EMAIL_TO=your-email@example.com
   CONTACT_EMAIL_FROM=noreply@yourdomain.com
   ```

**For testing:** Use `onboarding@resend.dev` as FROM address.

---

## Next Steps

Now that you're set up:

### For Development

- [ ] Read [Quick Wins Roadmap](../development/QUICK_WINS_ROADMAP.md) - planned features
- [ ] Review [User Journey Audit](../guides/USER_JOURNEY_AUDIT.md) - UX analysis
- [ ] Check [Security Review](../development/SECURITY_REVIEW.md) - security checklist

### For Testing

- [ ] Read [Test Plan](../testing/TEST_PLAN.md) - test personas & scenarios
- [ ] Review [Test Suite Summary](../testing/TEST_SUITE_SUMMARY.md) - all 109 tests
- [ ] Learn [User Testing Guide](../guides/USER_TESTING_GUIDE.md) - conduct user tests

### For Deployment

- [ ] Configure [GitHub Actions CI](../deployment/GITHUB_ACTIONS.md) - automated testing
- [ ] Set up [Firebase Secrets](../deployment/FIREBASE_SECRETS_CI.md) - CI credentials
- [ ] Plan production launch

---

## Troubleshooting

### Drills not loading

**Symptom:** Catalog page shows "Loading drills..." forever

**Fix:**
1. Check `.env.local` has all Firebase variables
2. Verify `FIREBASE_PRIVATE_KEY` has quotes and `\n`
3. Restart dev server: `Ctrl+C` then `npm run dev`

See [Firebase Setup](./FIREBASE_SETUP.md#troubleshooting) for more.

### Login/signup fails

**Symptom:** "Invalid email" or auth errors

**Fix:**
1. Check Firebase Authentication is enabled
2. Verify `NEXT_PUBLIC_FIREBASE_*` variables are correct
3. Check browser console for specific error

### Tests fail

**Symptom:** Playwright tests timeout or fail

**Fix:**
1. Ensure dev server is running (`npm run dev`)
2. Check test users exist (`npm run setup-test-users`)
3. Verify Firebase credentials in `.env.local`

See [E2E Testing Guide](../testing/E2E_TESTING.md#troubleshooting) for more.

### Build errors

**Symptom:** `npm run build` fails with TypeScript errors

**Fix:**
1. Update dependencies: `npm install`
2. Clear Next.js cache: `rm -rf .next`
3. Check for TypeScript errors: `npm run lint`

---

## Project Structure

```
FootBallEyeQ_Site/
├── app/                    # Next.js App Router
│   ├── components/         # React components
│   ├── api/                # API routes
│   ├── catalog/            # Drill catalogue
│   ├── planner/            # Session planner
│   ├── club/               # Club management
│   └── [pages]/            # Other pages
├── tests/                  # Playwright E2E tests
│   ├── e2e/                # Test specs
│   ├── pages/              # Page Object Models
│   └── fixtures/           # Test data
├── docs/                   # Documentation (you are here!)
│   ├── setup/              # Setup guides
│   ├── testing/            # Test documentation
│   ├── guides/             # Planning & UX docs
│   ├── development/        # Dev guides
│   └── deployment/         # Deployment guides
├── Firebase/               # Firebase configuration
├── public/                 # Static assets
└── scripts/                # Utility scripts
```

---

## Available NPM Scripts

```bash
npm run dev              # Start development server (port 5000)
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Run ESLint
npm run test:e2e         # Run Playwright tests (headless)
npm run test:e2e:ui      # Run Playwright with UI
npm run test:report      # View test report
npm run setup-test-users # Create test Firebase users
```

---

## Getting Help

### Documentation

- [Firebase Setup](./FIREBASE_SETUP.md) - Complete Firebase guide
- [Environment Variables](./ENVIRONMENT_VARIABLES.md) - All env vars explained
- [Documentation Index](../DOCUMENTATION_INDEX.md) - All docs overview

### Debugging Guides

- [Drill Catalog Loading](../development/debugging/drill-catalog-loading.md) - Common issue case study

### External Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Playwright Documentation](https://playwright.dev/)
- [Vercel Documentation](https://vercel.com/docs)

---

## What's Next?

You're all set! 🚀

**Recommended first steps:**
1. Explore the codebase structure
2. Read through the [User Journey Audit](../guides/USER_JOURNEY_AUDIT.md)
3. Run the test suite to understand coverage
4. Try adding a new feature or fixing a bug

**Have questions?** Check the [Documentation Index](../DOCUMENTATION_INDEX.md) or review the specific setup guides above.

Happy coding! ⚽
