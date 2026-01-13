# Test User Setup for E2E Tests

This directory contains scripts and fixtures for setting up test users in Firebase.

## Quick Setup

### 1. Run the Setup Script

```bash
npm run setup-test-users
```

This will create 4 test users in your Firebase project:

| Account Type | Email | Password |
|-------------|-------|----------|
| Free Coach | free-coach@test.football-eyeq.com | TestFree123! |
| Individual Premium | premium-coach@test.football-eyeq.com | TestPremium123! |
| Club Coach | club-coach@test.football-eyeq.com | TestClub123! |
| Club Admin | club-admin@test.football-eyeq.com | TestAdmin123! |

### 2. What the Script Does

- Creates users in Firebase Authentication
- Creates user profile documents in Firestore (`signups` collection)
- Creates a test club document (`test-club-e2e`)
- Creates empty planner documents for each user
- Sets up proper account tiers and permissions

### 3. Run Tests

After setup, you can run tests:

```bash
npm run test:e2e
```

## Manual Setup (Alternative)

If you prefer to set up users manually:

1. Go to Firebase Console → Authentication
2. Create users with the emails/passwords listed above
3. Go to Firestore Database
4. Create documents as shown in the script

## Test User Usage in Tests

Tests can use these users via the fixtures:

```typescript
import { testUsers } from '../fixtures/test-data';

// Login as free coach
await page.goto('/login');
await page.fill('input[type="email"]', testUsers.freeCoach.email);
await page.fill('input[type="password"]', testUsers.freeCoach.password);
await page.click('button[type="submit"]');
```

## Troubleshooting

### "Missing Firebase credentials"

Make sure your `.env.local` file contains:
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

### "User already exists"

The script is idempotent - it will update existing users, so it's safe to run multiple times.

### "Permission denied"

Make sure your Firebase Admin credentials have proper permissions in the Firebase Console.
