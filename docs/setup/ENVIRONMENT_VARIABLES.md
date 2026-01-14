# Environment Variables Reference

Complete reference for all environment variables used in Football EyeQ.

---

## Quick Setup

1. Copy `.env.local.example` to `.env.local`
2. Fill in your Firebase credentials (see [Firebase Setup](./FIREBASE_SETUP.md))
3. Add email service credentials (optional)
4. Restart dev server: `npm run dev`

---

## Environment Variable Categories

### 1. Firebase Client SDK (Public)

These variables are prefixed with `NEXT_PUBLIC_` and are safe to expose publicly. They're embedded in the browser JavaScript bundle.

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase Web API key | `AIzaSyXXX...` | ✅ Yes |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Authentication domain | `project.firebaseapp.com` | ✅ Yes |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID | `my-project-id` | ✅ Yes |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Cloud Storage bucket | `project.appspot.com` | ✅ Yes |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Cloud Messaging sender ID | `123456789012` | ✅ Yes |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app ID | `1:123:web:abc` | ✅ Yes |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | Google Analytics measurement ID | `G-XXXXXXXXXX` | ✅ Yes |

**Where to get:** Firebase Console → Project Settings → Your apps → Web app config

**Security:** Safe to expose - these are public identifiers. Your Firestore security rules protect data.

---

### 2. Firebase Admin SDK (Private - Server-side only)

These variables are used by API routes to access Firestore server-side. **Keep these private.**

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `FIREBASE_PROJECT_ID` | Firebase project ID | `my-project-id` | ✅ Yes |
| `FIREBASE_CLIENT_EMAIL` | Service account email | `firebase-adminsdk-...@project.iam.gserviceaccount.com` | ✅ Yes |
| `FIREBASE_PRIVATE_KEY` | Service account private key | `"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"` | ✅ Yes |

**Where to get:** Firebase Console → Project Settings → Service Accounts → Generate new private key

**Security:** 🔒 **PRIVATE** - Never commit to git, never expose in client code

**Important:**
- Wrap `FIREBASE_PRIVATE_KEY` in quotes
- Preserve `\n` newline characters in the private key
- Do not remove the quotes around the key value

---

### 3. Email Service (Optional)

For the contact form (`/contact` page) to send emails via Resend.

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `RESEND_API_KEY` | Resend API key | `re_xxxxxxxxxxxxx` | ❌ Optional |
| `CONTACT_EMAIL_TO` | Recipient email for contact form | `contact@yourdomain.com` | ❌ Optional |
| `CONTACT_EMAIL_FROM` | Sender email (verified domain) | `noreply@yourdomain.com` | ❌ Optional |

**Where to get:** https://resend.com/api-keys

**For testing:** Use `onboarding@resend.dev` as `CONTACT_EMAIL_FROM`

**What happens without these:** Contact form won't work, but rest of app functions normally.

---

## Environment Files

### Local Development: `.env.local`

Create this file in your project root (it's gitignored):

```bash
# === Firebase Client SDK (Browser) ===
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# === Firebase Admin SDK (Server) ===
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"

# === Email Service (Optional) ===
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
CONTACT_EMAIL_TO=your-email@example.com
CONTACT_EMAIL_FROM=noreply@yourdomain.com
```

**After creating `.env.local`:** Restart your dev server (`npm run dev`)

---

### Production: Vercel Environment Variables

1. Go to Vercel Dashboard
2. Select project → **Settings** → **Environment Variables**
3. Add each variable:
   - **Key:** Variable name (e.g., `NEXT_PUBLIC_FIREBASE_API_KEY`)
   - **Value:** Variable value
   - **Environments:** Select Production, Preview, Development
4. Click **Save**
5. Redeploy your app

**Important:** Environment variable changes require a new deployment to take effect.

---

### CI/CD: GitHub Secrets

For Playwright tests to run in GitHub Actions:

1. Go to GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. Add each `NEXT_PUBLIC_*` variable as a repository secret
3. The workflow file (`.github/workflows/playwright.yml`) automatically uses these

See [Firebase Secrets CI Setup](../deployment/FIREBASE_SECRETS_CI.md) for details.

---

## Testing Different Configurations

### Local Development

```bash
# .env.local - Local Firebase project
NEXT_PUBLIC_FIREBASE_PROJECT_ID=my-dev-project
FIREBASE_PROJECT_ID=my-dev-project
```

### Production

```bash
# Vercel - Production Firebase project
NEXT_PUBLIC_FIREBASE_PROJECT_ID=my-prod-project
FIREBASE_PROJECT_ID=my-prod-project
```

### CI/CD (GitHub Actions)

```bash
# GitHub Secrets - Test Firebase project (recommended)
NEXT_PUBLIC_FIREBASE_PROJECT_ID=my-test-project
```

**Best Practice:** Use separate Firebase projects for dev, test, and production.

---

## Verification Checklist

After setting environment variables, verify:

- [ ] All 13 variables are set (7 `NEXT_PUBLIC_*`, 3 `FIREBASE_*`, 3 email)
- [ ] Private key has quotes and `\n` preserved
- [ ] Dev server restarted after changing `.env.local`
- [ ] Vercel: Variables applied to all environments
- [ ] GitHub: Secrets added for CI/CD
- [ ] Test: Visit `/catalog` - drills should load
- [ ] Test: Login/signup works
- [ ] Test: Contact form sends email (if configured)

---

## Troubleshooting

### Variables not loading

**Symptom:** Changes to `.env.local` have no effect

**Fix:**
1. Restart dev server (`Ctrl+C` then `npm run dev`)
2. Clear Next.js cache: `rm -rf .next`
3. Verify file is named `.env.local` (not `.env.local.txt`)

### Private key format errors

**Symptom:** Error about malformed private key

**Fix:**
```bash
# ❌ WRONG - Missing quotes
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n

# ❌ WRONG - Missing \n characters
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----YOUR_KEY_HERE-----END PRIVATE KEY-----"

# ✅ CORRECT - Quoted with \n preserved
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBg...\n-----END PRIVATE KEY-----\n"
```

### Vercel environment variables not working

**Symptom:** App works locally but fails on Vercel

**Fix:**
1. Check all variables are added to Vercel dashboard
2. Verify applied to correct environment (Production/Preview/Development)
3. **Trigger new deployment** (variables only apply to new builds)
4. Check Vercel deployment logs for specific errors

### GitHub Actions secrets not working

**Symptom:** Playwright tests fail in CI with auth errors

**Fix:**
1. Verify all `NEXT_PUBLIC_*` variables added as secrets
2. Check secret names match exactly (case-sensitive)
3. Verify workflow file uses correct secret names
4. Re-run workflow after adding secrets

---

## Security Best Practices

### ✅ DO

- Keep `.env.local` in `.gitignore` (already configured)
- Use different Firebase projects for dev/test/prod
- Rotate service account keys periodically
- Store private keys securely (password manager, vault)
- Use Vercel/GitHub's secret management (encrypted at rest)

### ❌ DON'T

- Commit `.env.local` to git
- Share service account JSON files publicly
- Use production credentials in test environments
- Hardcode credentials in source code
- Share private keys via email/chat

---

## Related Documentation

- [Firebase Setup Guide](./FIREBASE_SETUP.md) - How to get these values
- [Getting Started](./GETTING_STARTED.md) - Complete setup walkthrough
- [Test User Setup](./TEST_USER_SETUP.md) - Creating test users
- [CI/CD Setup](../deployment/FIREBASE_SECRETS_CI.md) - GitHub Actions configuration

---

## External Resources

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [GitHub Encrypted Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Firebase Web Setup](https://firebase.google.com/docs/web/setup)
