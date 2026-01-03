# Upgrade Page Redesign
## Problem: Trying to Serve Too Many Audiences

**Current Issue:** `/upgrade` page tries to address:
1. Individual coaches wanting to upgrade → Premium ($29/mo)
2. Coaches who have club codes → Enter code
3. Coaches without codes looking for clubs → Find club option
4. Club admins → Register club
5. Existing premium users → Status display

**Result:** Confusing, cluttered, unclear call-to-action

---

## Current State Analysis

**File:** `app/upgrade/page.tsx`

**Current layout:**
```
┌─────────────────────────────────────┐
│   Upgrade Your Account              │
├─────────────────────────────────────┤
│                                     │
│   [Pricing Box: $29/month]         │
│                                     │
│   [View Checkout] [Create Free]    │ ← Individual Premium
│                                     │
├─────────────────────────────────────┤
│                                     │
│   [Join a Club Card]                │ ← Club code entry
│   • Enter code here                 │
│   • Full access via club            │
│                                     │
│   [Individual Premium Card]         │ ← Individual upgrade
│   • Coming soon message             │
│                                     │
├─────────────────────────────────────┤
│                                     │
│   "Are you a club admin?"           │ ← Club registration
│   [Register Your Club]              │
│                                     │
└─────────────────────────────────────┘
```

**Problems:**
1. **Too many CTAs:** View Checkout, Create Free, Join Club, Register Club
2. **Competing messages:** Individual vs Club vs Admin
3. **No hierarchy:** Everything has equal visual weight
4. **Confusion:** "Which option is for me?"
5. **Overwhelm:** User sees all options, chooses none

---

## Solution: Persona-Based Routing

**Core Principle:** Show each user ONLY what's relevant to them

### Strategy 1: Dynamic Content Based on Account Type

**If FREE user (individual coach):**
```
┌─────────────────────────────────────┐
│   Unlock Full Access                │
├─────────────────────────────────────┤
│   Primary Option:                   │
│   [Upgrade to Premium - $29/month]  │ ← Big, prominent
│   ✓ 12 sessions                     │
│   ✓ Unlimited favorites             │
│   ✓ Analytics                       │
│                                     │
├─────────────────────────────────────┤
│   Alternative:                      │
│   "Part of a club?"                 │
│   [Enter Club Code]                 │ ← Smaller, secondary
│                                     │
├─────────────────────────────────────┤
│   For clubs:                        │
│   Small link: "Register your club →"│ ← Minimal, footer
└─────────────────────────────────────┘
```

**If FREE user with recent club code activity:**
```
┌─────────────────────────────────────┐
│   Join Your Club                    │
├─────────────────────────────────────┤
│   Primary Option:                   │
│   "Have an invite code?"            │
│   [Enter Code: ______]              │ ← Big input
│   [Join Club]                       │
│                                     │
├─────────────────────────────────────┤
│   Or:                               │
│   [Upgrade Individually - $29/mo]   │ ← Secondary
│                                     │
└─────────────────────────────────────┘
```

**If PREMIUM user:**
```
┌─────────────────────────────────────┐
│   Your Subscription                 │
├─────────────────────────────────────┤
│   ✓ Premium Access Active           │
│   Next billing: Feb 3, 2026         │
│   $29/month                         │
│                                     │
│   [Manage Subscription]             │
│   [View Billing History]            │
│                                     │
└─────────────────────────────────────┘
```

**If CLUB COACH:**
```
┌─────────────────────────────────────┐
│   Your Club Access                  │
├─────────────────────────────────────┤
│   ✓ Full Access via [Club Name]    │
│   Your role: Coach                  │
│                                     │
│   All features unlocked             │
│   ✓ 12 sessions                     │
│   ✓ Unlimited favorites             │
│   ✓ Analytics                       │
│                                     │
│   Questions? Contact your admin     │
└─────────────────────────────────────┘
```

---

## Strategy 2: Separate Pages for Different Goals

Instead of ONE `/upgrade` page, create **focused landing pages:**

### Page 1: `/upgrade` (Individual Coach Focus)
**URL:** `/upgrade` or `/pricing`
**Audience:** FREE individual coaches
**Goal:** Convert to Premium

```tsx
// Focused layout
<div className="max-w-3xl mx-auto">
  <h1>Unlock Full Access</h1>
  <p>Plan your entire season with Premium</p>

  {/* Primary CTA */}
  <div className="hero-card">
    <h2>Premium - $29/month</h2>
    <ul>
      <li>12 session planner</li>
      <li>Unlimited favorites</li>
      <li>Session analytics</li>
      <li>Export plans</li>
    </ul>
    <button>Start Premium</button>
  </div>

  {/* Feature comparison */}
  <FeatureComparisonTable />

  {/* Secondary options (minimal) */}
  <div className="text-sm text-gray-500 mt-8">
    <a href="/join-club">Have a club code?</a>
    <span> • </span>
    <a href="/club/signup">Register a club</a>
  </div>
</div>
```

---

### Page 2: `/join-club` (Club Code Entry)
**Audience:** Coaches with invite codes
**Goal:** Enter code and join club

**Current state:** Already good! Keep this focused.

---

### Page 3: `/club/pricing` (Club Admin Focus)
**Audience:** Club administrators
**Goal:** Register club or learn about club subscriptions

```tsx
<div className="max-w-4xl mx-auto">
  <h1>Football EyeQ for Clubs</h1>
  <p>Equip your entire coaching staff</p>

  {/* Value props for clubs */}
  <div className="benefits">
    <div>Unlimited coaches</div>
    <div>Centralized management</div>
    <div>Exercise type control</div>
  </div>

  {/* Pricing tiers (when ready) */}
  <div className="pricing-options">
    <div className="tier">
      <h3>Small Club</h3>
      <p>$99/month</p>
      <p>Up to 5 coaches</p>
    </div>
    <div className="tier recommended">
      <h3>Standard Club</h3>
      <p>$149/month</p>
      <p>Unlimited coaches</p>
    </div>
  </div>

  <button>Register Your Club</button>

  {/* For individual coaches */}
  <div className="text-sm mt-8">
    <a href="/upgrade">Individual coach? See individual pricing →</a>
  </div>
</div>
```

---

## Strategy 3: Smart Routing Logic

**Automatically send users to the right page based on context:**

```tsx
// app/upgrade/page.tsx - becomes a router
export default function UpgradePage() {
  const { accountType, isAuthenticated } = useEntitlements();
  const searchParams = useSearchParams();
  const intent = searchParams.get('intent'); // club, individual, code

  // Route based on user state
  if (!isAuthenticated) {
    // Not logged in → show generic pricing
    return <PricingPagePublic />;
  }

  if (accountType === "clubCoach") {
    // Already in club → show status
    return <ClubAccessStatus />;
  }

  if (accountType === "individualPremium") {
    // Already premium → show management
    return <PremiumSubscriptionManagement />;
  }

  // FREE user - check intent
  if (intent === "code" || searchParams.get('code')) {
    // Has code or indicated intent → redirect to join-club
    redirect('/join-club');
  }

  if (intent === "club-admin") {
    // Wants to register club → redirect
    redirect('/club/signup');
  }

  // Default: FREE user wanting to upgrade individually
  return <IndividualUpgradePage />;
}
```

---

## Recommended Implementation

**Phase 1 (This month):** Clean up current `/upgrade` page

**Quick fix (2-3 hours):**
```tsx
// app/upgrade/page.tsx

export default function UpgradePage() {
  const { accountType, clubName } = useEntitlements();

  // Show different content based on account type
  if (accountType === "clubCoach") {
    return <YouHaveClubAccess clubName={clubName} />;
  }

  if (accountType === "individualPremium") {
    return <YourPremiumSubscription />;
  }

  // FREE users - show focused upgrade options
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Unlock Full Access</h1>
      <p className="text-gray-600 mb-8">
        Choose the best option for you
      </p>

      {/* PRIMARY: Individual upgrade */}
      <div className="bg-white border-2 border-primary rounded-xl p-6 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-2xl font-bold">Premium</h2>
          <span className="px-2 py-1 bg-primary-light text-primary text-xs font-medium rounded">
            RECOMMENDED
          </span>
        </div>
        <p className="text-3xl font-bold mb-4">$29<span className="text-lg text-gray-500">/month</span></p>

        <ul className="space-y-2 mb-6">
          <li className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600">...</svg>
            <span>12-session season planner</span>
          </li>
          {/* ... more features */}
        </ul>

        <Link
          href="/upgrade/checkout"
          className="block w-full text-center bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-hover"
        >
          Upgrade Now
        </Link>
      </div>

      {/* SECONDARY: Club option */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6">
        <h3 className="text-lg font-semibold mb-2">Have a Club Code?</h3>
        <p className="text-sm text-gray-600 mb-4">
          If your club has registered, enter your invite code for free access
        </p>
        <Link
          href="/join-club"
          className="inline-block bg-white border border-primary text-primary px-6 py-2 rounded-lg hover:bg-primary-light"
        >
          Enter Club Code
        </Link>
      </div>

      {/* TERTIARY: Club admin option */}
      <div className="text-center text-sm text-gray-500">
        <p>Setting up a club? <Link href="/club/signup" className="text-primary hover:underline">Register your club →</Link></p>
      </div>
    </div>
  );
}
```

**Visual hierarchy:**
1. **Primary** (80% visual weight): Individual Premium upgrade
2. **Secondary** (15% visual weight): Join a club option
3. **Tertiary** (5% visual weight): Club registration link

---

## Phase 2 (Next month): Separate Pages

Create distinct URLs:
- `/upgrade` → Individual coach upgrade
- `/join-club` → Club code entry (already exists)
- `/club/pricing` → Club admin registration/pricing
- `/account` → Subscription management (all account types)

---

## Testing the Fix

**Before (current):**
- Show upgrade page to 5 FREE users
- Ask: "What would you click?"
- Expect: Confusion, hesitation, unclear path

**After (redesigned):**
- Show to 5 FREE users
- Ask: "What would you click?"
- Expect: Clear choice, confident action

**Success metric:**
- 80%+ of FREE users immediately understand primary CTA
- <5 seconds to decision

---

## Quick Win: Add This Week

**Immediate improvement (30 minutes):**

Add visual hierarchy to current page:

```tsx
// Make Individual Premium the HERO
<div className="bg-gradient-to-br from-primary to-primary-hover text-white rounded-2xl p-8 mb-8 shadow-xl">
  <h2 className="text-3xl font-bold mb-2">Upgrade to Premium</h2>
  <p className="text-xl mb-6">$29/month</p>
  <ul className="mb-6 space-y-2">
    {/* features */}
  </ul>
  <button className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100">
    Start Premium →
  </button>
</div>

// Make other options smaller, visually de-emphasized
<div className="grid md:grid-cols-2 gap-4">
  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
    <h3 className="text-sm font-semibold text-gray-700">Have a Club Code?</h3>
    {/* ... */}
  </div>
  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
    <h3 className="text-sm font-semibold text-gray-700">Register a Club</h3>
    {/* ... */}
  </div>
</div>
```

**Impact:** Makes primary path obvious, reduces cognitive load

---

## Summary: The Fix

**Problem:**
- One page trying to serve 5 different audiences
- No clear visual hierarchy
- User paralyzed by choice

**Solution:**
- **Immediate:** Add visual hierarchy (hero primary CTA)
- **Soon:** Dynamic content based on user type
- **Later:** Separate pages for different goals

**Effort:**
- Quick fix: 30 minutes
- Dynamic content: 2-3 hours
- Separate pages: 5-8 hours

**Impact:**
- Clearer user intent
- Higher conversion rate
- Less confusion
- Better UX

---

*Want me to implement the quick fix (visual hierarchy) now?*
