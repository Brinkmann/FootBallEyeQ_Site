# Firebase Secrets Setup for GitHub Actions

The Playwright tests require Firebase credentials to run in CI. Follow these steps to configure GitHub secrets.

## Step 1: Get Firebase Credentials

You need the following Firebase configuration values from your Firebase project:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click the gear icon ⚙️ → **Project settings**
4. Scroll down to "Your apps" section
5. Find your web app configuration

You'll need these values:
```
apiKey: "YOUR_API_KEY"
authDomain: "your-project.firebaseapp.com"
projectId: "your-project-id"
storageBucket: "your-project.appspot.com"
messagingSenderId: "123456789"
appId: "1:123456789:web:abcdef"
measurementId: "G-XXXXXXXXXX"
```

## Step 2: Add Secrets to GitHub

1. Go to your GitHub repository: https://github.com/Brinkmann/FootBallEyeQ_Site
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each of the following secrets:

### Required Secrets:

| Secret Name | Value from Firebase |
|-------------|-------------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Your `apiKey` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Your `authDomain` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Your `projectId` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Your `storageBucket` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Your `messagingSenderId` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Your `appId` |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | Your `measurementId` |

## Step 3: Verify Setup

After adding all secrets:

1. Push a commit to trigger the workflow
2. Go to **Actions** tab in your GitHub repository
3. Watch the workflow run
4. The `auth/invalid-api-key` error should be resolved

## Alternative: Use Test Firebase Project

If you don't want to use your production Firebase project for CI tests:

1. Create a separate Firebase project for testing
2. Name it something like "football-eyeq-test"
3. Use those credentials for GitHub secrets
4. Run `npm run setup-test-users` locally with test project credentials to create test users

## Troubleshooting

### Error: `auth/invalid-api-key`
- **Cause**: Secret not set or has wrong value
- **Fix**: Double-check the `NEXT_PUBLIC_FIREBASE_API_KEY` secret value

### Error: `auth/project-not-found`
- **Cause**: Wrong `projectId`
- **Fix**: Verify `NEXT_PUBLIC_FIREBASE_PROJECT_ID` matches your Firebase project

### Tests timeout waiting for Firebase
- **Cause**: Network issues or wrong auth domain
- **Fix**: Check `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` is correct

## Security Notes

✅ **Safe to expose**: These `NEXT_PUBLIC_` variables are client-side Firebase config and are meant to be public
✅ **Not secrets**: Firebase API keys are not secret - they're included in your web app bundle
✅ **Protected by rules**: Your Firestore and Auth security rules protect your data, not the API key

## See Also

- [Firebase Web Setup](https://firebase.google.com/docs/web/setup)
- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Test User Setup](../scripts/TEST_USER_SETUP.md)
