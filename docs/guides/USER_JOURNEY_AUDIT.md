# Football EyeQ User Journey Audit
## Comprehensive UX/UI Assessment and Recommendations
### Pre-Launch Readiness & Startup Mode Focus

**Date:** January 3, 2026
**Auditor:** Claude (UX/UI Journey Designer)
**Platform Status:** 🚧 **Startup/Conceptual Mode** (Pre-Launch)
**Scope:** First landing → Fully fledged user journey for all personas

---

## Executive Summary

Football EyeQ is a **well-architected coaching platform** in its pre-launch phase with strong foundational design for multiple user personas. The platform demonstrates professional UX patterns and thoughtful feature gating.

### Platform Status: Startup Mode
- Payment integration is **intentionally placeholder-based** (not live)
- Subscription management is **manual via super admin** (appropriate for pre-launch)
- Focus is on **UX polish and mockups** rather than full infrastructure
- Platform is being validated before go-live

### Key Strengths:
- ✅ Clean, intuitive signup flows for all personas
- ✅ Robust club invite code system with security
- ✅ Well-designed FREE tier (1 reusable session)
- ✅ Excellent first-time user onboarding (welcome modals)
- ✅ Unique club-level exercise policy control (EyeQ vs Plastic)

### Pre-Launch Priorities Identified:
1. **UX Polish** - Limitation messaging, upgrade CTAs, feature discoverability
2. **Payment Mockups** - Create compelling checkout UI/UX for testing
3. **Admin Enhancements** - Improve club management tools
4. **User Journey Optimization** - Remove friction, improve conversion paths

---

## Part 1: Persona Validation & Architecture

### ✅ Current Personas (VALIDATED & WELL-DESIGNED)

#### Persona 1: Individual Coach (No Club Affiliation)
**Profile:**
- Independent coach, private trainer, or freelance coach
- No affiliation with a registered club
- Wants to plan professional training sessions
- May upgrade if value is demonstrated

**Current Journey:** FREE → Individual Premium ($29/month)
**Implementation Status:** ✅ **Excellent UX**, ⚠️ Payment is mockup (correct for startup mode)

**Code Verified:**
- FREE tier: 1 session (reusable - can edit unlimited), 10 favorites
- Premium tier: 12 sessions, unlimited favorites
- Session locking works correctly (app/planner/page.tsx:109)

---

#### Persona 2: Club Coach
**Profile:**
- Coach at a registered club/academy
- May or may not have club code initially
- Experiences platform on FREE tier before club joins
- Converts to full access when receives club code

**Current Journey:** FREE → Club Member (via code)
**Implementation Status:** ✅ **Excellently implemented**

**Path Flexibility:**
- ✅ Can sign up before club exists (uses FREE tier)
- ✅ Can sign up with code during signup
- ✅ Can enter code later (multiple entry points)
- ✅ Seamless conversion from FREE to club member

---

#### Persona 3: Club Admin
**Profile:**
- Director of coaching, head coach, or club administrator
- Manages multiple coaches on their staff
- Needs roster management and invite system
- Controls club-level policies (exercise type, access)

**Current Journey:** Sign up → Invite coaches → Manage team
**Implementation Status:** ✅ **Well-designed dashboard**, ⚠️ Manual subscription (appropriate for startup)

**Subscription Model (Verified):**
- Clubs start with `subscriptionStatus: "trial"`
- NO automatic trial expiration (indefinite until go-live)
- Super admin manually activates clubs
- **This is perfect for startup mode** - allows testing without payment complexity

---

#### Persona 4: Super Admin (Platform Owner)
**Profile:**
- obrinkmann@gmail.com (hardcoded - appropriate for single-admin startup)
- Platform oversight and management
- Exercise catalog curation
- Manual club/coach subscription management

**Current Journey:** Login → Admin dashboard
**Implementation Status:** ✅ **Functional**, ⚠️ Scalability note (future consideration)

---

### 🔍 Missing Persona Assessment

**Potential Persona 5: Player/Athlete**
**Recommendation:** ❌ **Do NOT add** (focus on coaches first)

**Rationale:**
- Platform's core value is coach planning, not player tracking
- Adding players dilutes focus during critical launch phase
- Most successful coaching SaaS start coach-only, add players later (if ever)
- Focus on perfecting coach experience before expanding

**Verdict:** Current 4 personas are **complete and correct** for launch.

---

## Part 2: Detailed User Journey Maps

### 🎯 Journey 1: Individual Coach (FREE → Premium)

#### **Landing & Discovery** (/)
**Current State:**
- Homepage with "Login" and "Sign Up" CTAs
- Marketing content about Football EyeQ value

**Assessment:** ✅ Clear entry points
**Pre-Launch Opportunity:** Optimize messaging for early adopters

---

#### **Signup** (/signup)
**Current State:**
```
- Clear value prop: "Full drill catalog, 1 session planner, 10 favorites"
- Form fields: First Name, Last Name, Email, Organization (optional), Password
- Checkbox: "I have a club access code" (shows alternative path)
- Link to club signup for admins
- Redirect: /planner?welcome=true
```

**Assessment:** ✅ **EXCELLENT DESIGN**

**Strengths:**
- Low friction (5 fields, 1 optional)
- Clear FREE tier benefits shown upfront
- Alternative paths prominently displayed
- "Start free and upgrade anytime" reduces signup anxiety
- Organization field optional (doesn't create confusion)

**Minor Polish Opportunities:**
1. Add email format validation with visual feedback
2. Password strength indicator (visual bar)
3. Consider social auth (Google/Apple) for even lower friction (post-launch)

**Code Location:** `app/signup/page.tsx:11-215`

---

#### **Welcome & First Use** (/planner?welcome=true)
**Current State:**
```
Welcome Modal appears:
- Title: "Welcome to Football EyeQ!"
- "Your free coach account is ready"
- 3 clear next steps:
  1. Browse 100+ exercises in catalog
  2. Save up to 10 favorites
  3. Plan your first session
- CTAs: "Browse Drills" | "Start Planning"
- Upgrade prompt in footer (subtle, not pushy)
```

**Assessment:** ✅ **EXCELLENT ONBOARDING**

**Strengths:**
- Not overwhelming (only 3 steps)
- Action-oriented (verb-first: "Browse", "Save", "Plan")
- Dual CTAs respect user intent
- Clear URL parameter system (removes ?welcome after view)

**Pre-Launch Polish Opportunity:**
- Add optional "Take a 2-minute tour" for first-time users
- Implement dismissible tooltips on first catalog/planner visit

**Code Location:** `app/components/WelcomeModal.tsx:27-83`

---

#### **Exploring FREE Tier**

**Current Implementation (Code Verified):**

| Feature | FREE Tier | Premium | Implementation |
|---------|-----------|---------|----------------|
| Exercise Catalog | ✅ Full access (100+) | ✅ Full | No restrictions |
| Session Planner | ⚠️ 1 session (reusable) | ✅ 12 sessions | Locked at session 2+ |
| Favorites | ⚠️ 10 maximum | ✅ Unlimited (Infinity) | Count enforced |
| Stats/Analytics | ❌ Completely locked | ✅ Full access | Route blocked |
| Export | ❌ Locked | ✅ Available | Feature gated |

**Code Locations:**
- Entitlements: `app/types/account.ts:62-74`
- Enforcement: `app/planner/page.tsx:109-129`

---

#### **FREE Tier Assessment**

### ✅ What Works Exceptionally Well:

**1. Full Catalog Access**
- **Strategic Decision:** Brilliant trust-builder
- **User Benefit:** Can evaluate exercise quality immediately
- **Conversion Impact:** No "bait and switch" feeling
- **Competitive Advantage:** Most platforms lock catalog behind paywall

**2. 1 Reusable Session**
- **Implementation:** Users can edit Session 1 unlimited times (cannot create Session 2)
- **User Experience:** Enough to demonstrate core value
- **Strategic Benefit:** Forces focus on quality over quantity
- **Conversion Point:** When users want to plan progressive training blocks

**3. 10 Favorites**
- **Sweet Spot:** Enough for discovering go-to exercises
- **Not Too Generous:** Creates clear upgrade incentive
- **User Behavior:** Casual users rarely hit limit, active users upgrade

### ⚠️ Areas for UX Improvement:

**1. Limitation Discovery**
**Current:** Users don't know they're limited until they hit the wall
**Impact:** Surprise/frustration at limitation point
**Recommendation:**
- Add session counter: "FREE: 1/1 session used" in planner header
- Add favorites counter: "8/10 favorites" in catalog
- Show 🔒 icon on locked sessions 2-12 before click
- Preview locked features BEFORE user clicks them

**2. Limitation Messaging**
**Current State (Assumed):**
- Session 2+ shows generic lock overlay
- "Upgrade to unlock" + "View plans" link
- No emotional appeal or benefit clarity

**Recommended Improvement:**
```diff
- Current: "Upgrade to unlock"
+ Better: "Unlock all 12 sessions to plan your full season"

- Current: Generic lock icon
+ Better: "Plan progressive training blocks with 12 sessions"
         "Track improvement across your season"
         [Upgrade to Premium] [Join a Club]
```

**3. Stats Feature - No Preview**
**Current:** Stats completely hidden (user clicks → blocked)
**Issue:** Users don't know what they're missing
**Best Practice:** Show preview with blur/overlay (Spotify/LinkedIn model)

**Recommended Mockup:**
- Show sample stats chart with blur effect
- Overlay: "🔒 Unlock session analytics with Premium"
- Sub-text: "Track player engagement, drill effectiveness, and session progression"
- CTA: "Upgrade Now" or "Join a Club"

**Code Location:** `app/planner/stats/page.tsx` (add preview mode)

---

#### **Upgrade Attempt** (/upgrade)

**Current State:**
```
- Pricing display: $29/month for Pro Access
- Features listed: Full planner, analytics, unlimited favorites
- Two paths:
  1. "View Checkout" → /upgrade/checkout (Individual Premium)
  2. "Join a Club" → Inline code entry
- "Register Your Club" CTA at bottom
```

**Assessment:** ✅ Layout excellent, ⚠️ Checkout is mockup (correct for startup)

**Checkout Page Status:**
- Shows "Coming soon" message (appropriate for pre-launch)
- Stripe webhook exists but is placeholder
- No actual payment processing (intentional)

**Pre-Launch Recommendation:**
Instead of "Coming soon", create **high-fidelity mockup**:
- Design full checkout UI (for user testing)
- Add "Waitlist" signup for early access
- Capture emails of interested users
- A/B test pricing/messaging before going live

**Code Locations:**
- Upgrade page: `app/upgrade/page.tsx:9-257`
- Checkout: `app/upgrade/checkout/page.tsx`

---

### 🎯 Journey 2: Club Coach (FREE → Club Member)

#### **Path A: Has Code at Signup**

**Flow:**
```
1. Signup page (/signup)
2. Check "I have a club access code"
3. Create account (starts as FREE)
4. Redirect to /join-club (NOT /planner)
5. Enter 6-character code (auto-uppercase)
6. API validates code
7. Success screen with club name
8. Shows unlocked features
9. CTAs: "Browse Drills" | "Start Planning"
```

**Assessment:** ✅ **PERFECTLY DESIGNED**

**Strengths:**
- Focused flow (no distractions after checking box)
- Skips free welcome modal (different path)
- Clear success state with feature list
- Instant gratification (immediate full access)

**Code Location:** `app/join-club/page.tsx:10-254`

---

#### **Path B: Receives Code After Signup**

**User Scenario:**
- Coach signs up FREE (uses platform with 1 session)
- Days/weeks later: Receives code from club admin
- Needs to enter code and upgrade

**Entry Points (Multiple):**
1. `/profile` → "Club Membership" section
2. `/upgrade` → "Join a Club" card
3. `/join-club` direct link
4. (Recommended) Banner for FREE users: "Have a club code?"

**Assessment:** ✅ **Good multi-path design**, ⚠️ Discoverability gap

**Gap:** Coaches who receive code via email/WhatsApp may not know WHERE to enter it

**Recommendation:**
- Add persistent banner for FREE users (dismissible):
  - "Part of a club? Enter your access code to unlock premium features →"
- Add helper tooltip on FREE badge in navbar
- Track how many codes are generated vs redeemed (measure gap)

---

#### **Code Redemption System**

**Implementation (Code Verified):**

**Code Generation:**
- 6 characters, alphanumeric
- Excludes confusing chars (no O/0, I/l, etc.)
- Format: `ABCDEFGHJKLMNPQRSTUVWXYZ23456789`
- Expires in 7 days
- Email-specific (security)

**Validation Logic:**
```typescript
1. Code exists in clubInvites collection
2. Not expired (< 7 days old)
3. Not already used
4. Email matches invite email (if specified)
5. Club still exists and active
```

**On Success:**
- Update user: accountType → "clubCoach"
- Set clubId and clubRole → "coach"
- Add to clubs/{clubId}/members collection
- Mark invite as used (timestamp + userId)
- Refresh entitlements (immediate full access)

**Assessment:** ✅ **Robust, secure implementation**

**Code Locations:**
- Generation: `app/club/dashboard/page.tsx:129-175`
- Redemption: `app/api/redeem-invite/route.ts`

---

### 🎯 Journey 3: Club Admin

#### **Discovery & Entry** (/club/signup)

**Entry Points:**
1. From `/signup` → "Setting up a club?" callout box
2. Direct navigation (from marketing, etc.)

**Assessment:** ✅ Clear pathway separation

---

#### **Club Registration** (2-Step Form)

**Step 1: Club Information**
```
- Single field: Club name
- Visual step indicator (●━○)
- Value proposition shown:
  • Full 12-session planner for all coaches
  • Unlimited favorites and stats
  • Easy invite system with codes
  • Admin dashboard to manage team
- Back link to signup options
```

**Step 2: Admin Account**
```
- Fields: First name, Last name, Email, Password
- Shows selected club name from step 1
- Back button (preserves step 1 data)
- On submit:
  1. Creates club with subscriptionStatus: "trial"
  2. Creates admin user account
  3. Adds admin as first club member
  4. Redirects to /club/dashboard?welcome=true
```

**Assessment:** ✅ **EXEMPLARY FORM DESIGN**

**Strengths:**
- Progressive disclosure (don't overwhelm with all fields at once)
- Visual progress indicator sets expectations
- Value prop upfront (motivates completion)
- Easy navigation backward (doesn't lose data)
- Clear transformation: Club → Admin → Ready

**Best Practices Applied:**
- Form broken into logical steps
- Each step has single focus
- Can review previous step
- Clear "what happens next" messaging

**Code Location:** `app/club/signup/page.tsx:12-268`

---

#### **Welcome Experience** (/club/dashboard?welcome=true)

**Welcome Modal:**
```
Title: "{ClubName} is ready!"
Subtitle: "You're now the admin. Let's get your team set up."

Next Steps:
1. Generate invite codes for coaches
2. Share codes with coaches (they sign up & enter code)
3. Manage roster here as coaches join

Security tip: "Each code is single-use and email-specific"
CTA: "Get Started"
```

**Assessment:** ✅ **EXCELLENT ACTIVATION**

**Strengths:**
- Celebrates success (club name in title)
- Sets clear expectations (3 numbered steps)
- Educates on security (single-use codes)
- Action-oriented CTA

**Code Location:** `app/components/WelcomeModal.tsx:86-136`

---

#### **Club Dashboard** (/club/dashboard)

### **Dashboard Sections:**

**1. Team Roster**
```
- Shows: Active coaches + Pending invites
- Active coaches (green badge):
  • Email
  • Role (admin/coach)
  • Generated code (if available)
  • "Remove" button (except admin)
- Pending invites (amber badge):
  • Email
  • Code
  • Expiration date
  • "Cancel" button
- Empty state: "No coaches yet. Click 'Invite Coach'..."
```

**2. Invite Coach (Inline Form)**
```
Trigger: "Invite Coach" button (prominent, primary color)
Form expands inline:
  - Email input (required, validated)
  - Note: "Code only works for this email"
  - CTAs: "Generate Access Code" | "Cancel"
On success:
  - Code displayed in pending invites list
  - Form collapses
  - Admin can copy/share code manually
```

**3. Exercise Access Mode (Club Policy)**
```
Radio button selector:
○ EyeQ Only - Smart LED cone exercises only
○ Plastic Only - Traditional cone exercises only
● Coach Choice - Each coach toggles (default)

Updates in real-time to club document
Cascades to all club coaches immediately
```

**4. How-To Guide**
```
Step-by-step instructions:
1. Click "Invite Coach" and enter email
2. Share generated code with them
3. They sign up and enter code
Note: Code is single-use and email-specific
```

**Assessment:** ✅ **OUTSTANDING IMPLEMENTATION**

**Strengths:**
- Inline form prevents navigation disruption
- Clear visual distinction (active=green, pending=amber)
- Exercise policy is unique competitive feature
- Confirmation before removing coaches
- Empty states guide next action

**Pre-Launch Opportunities:**
1. Add "Copy Code" button (clipboard API) 🚀 **Quick Win**
2. Add bulk invite (CSV upload) - nice to have
3. Add auto-email invitation - future enhancement
4. Show "Last active" for coaches - engagement metric

**Code Location:** `app/club/dashboard/page.tsx:40-517`

---

#### **Subscription Management (Current: Manual)**

**Current State in Startup Mode:**
- Club dashboard shows "Trial" badge
- No expiration date shown
- No payment method entry
- No billing history
- No self-service upgrade

**Why This Is Correct for Startup:**
- ✅ Allows testing without payment complexity
- ✅ Super admin controls everything (appropriate for small scale)
- ✅ Can manually activate clubs case-by-case
- ✅ No credit card processing liability during testing

**Verified Implementation:**
- Clubs created with `subscriptionStatus: "trial"`
- No automatic expiration logic (trials are indefinite)
- Super admin can manually change to "active" or "inactive"
- When subscription is "inactive", all coaches downgraded to FREE

**Code Locations:**
- Club creation: `app/api/create-club/route.ts:50`
- Manual activation: `app/api/admin/upgrade/route.ts:104-112`

---

**Pre-Launch Mockup Recommendation:**

Even without real payment processing, create **high-fidelity mockup** of subscription tab:

```
[Mockup Design]
-----------------
Subscription Status: Trial
Trial Period: No expiration (pre-launch mode)

[Future: Add Payment Method]
(Greyed out with "Available at launch" badge)

Current Features:
✓ Unlimited coaches
✓ Full session planning
✓ Analytics for all coaches
✓ Exercise type policy control

[Coming Soon: Pricing]
Expected: $XX/month flat rate
```

**Purpose:** User testing and feedback on pricing before launch

---

### 🎯 Journey 4: Super Admin

#### **Access & Role**
- Hardcoded email: obrinkmann@gmail.com
- Navbar shows "Admin" badge
- "Admin Hub" link in navigation

**Assessment:** ✅ **Appropriate for single-admin startup**
**Future Note:** Add role-based system when multiple admins needed

---

#### **Admin Dashboard** (/admin)

### **Three Management Tabs:**

**1. Exercises Tab**
```
Functions:
- Add new exercise (comprehensive form)
- Edit existing exercises
- Delete exercises
- Fields: ID, Title, Age Group, Difficulty, Duration,
  Decision Theme, Player Involvement, Game Moment,
  Overview, Description, Image, Exercise Type (eyeq/plastic)
```

**Assessment:** ✅ **Comprehensive content management**
**Pre-Launch Opportunity:** Add markdown preview for descriptions

---

**2. Clubs Tab**
```
Table showing:
- Name, Contact Email, Member Count
- Subscription Status (trial/active/inactive)
- Account Status (active/suspended)

Actions per club:
- Activate (set subscription to "active")
- Deactivate (set to "inactive")
- Suspend/Unsuspend (with reason field)
- Delete (cascades: removes club, invites, resets coaches to free)
```

**Assessment:** ✅ **Functional for startup scale**
**Future Enhancements (Post-Launch):**
- Search/filter (needed at 50+ clubs)
- Pagination (needed at 100+ clubs)
- Export to CSV
- Bulk operations
- Financial reporting (MRR, churn)

**Code Location:** `app/admin/page.tsx:236-580`

---

**3. Coaches Tab**
```
Table showing:
- Name, Email, Account Type
- Club (if member), Status

Actions per coach:
- Upgrade to Individual Premium (if not in club)
- Downgrade to Free
- Suspend/Unsuspend (with reason)
- Delete account
```

**Assessment:** ✅ **Good for manual management**
**Pre-Launch Polish:**
- Add filter by account type
- Add "last login" date (engagement tracking)

**Code Location:** `app/admin/page.tsx:582-850`

---

#### **Manual Operations (Startup Mode)**

**Current Reality:**
- Super admin manually activates club subscriptions
- No automated trial expiration
- No payment webhooks (Stripe is placeholder)
- All upgrades/downgrades are manual

**Assessment:** ✅ **PERFECT for pre-launch**

**Why This Works:**
- You can control who gets access (quality control)
- Personal touch with early adopters
- Gather feedback before automating
- Test pricing models manually
- No payment processing complexity

**When to Automate:** After 20-50 clubs or at official launch

---

## Part 3: Pre-Launch Focus Areas

### 🎨 Priority 1: UX Polish & Mockups (High Impact, Low Effort)

#### **Quick Wins (1-3 hours each)**

**1. Add Session/Favorites Counters**
```typescript
Location: app/planner/page.tsx header
Add: "FREE: 1/1 sessions used" badge
Style: Subtle, informational (not annoying)
```

**2. Add "Copy Code" Button**
```typescript
Location: app/club/dashboard/page.tsx
When: Admin generates invite code
Function: Copy to clipboard with success toast
Tech: navigator.clipboard.writeText()
```

**3. Improve Lock Overlay Messaging**
```diff
// app/planner/page.tsx:119
- <p className="text-sm font-medium text-gray-600">Upgrade to unlock</p>
+ <p className="text-sm font-medium text-gray-600">Plan your full season</p>
+ <p className="text-xs text-gray-500 mt-1">Unlock 11 more sessions with Premium</p>
```

**4. Add "Have Club Code?" Banner**
```typescript
Location: app/planner/page.tsx (for FREE users only)
Condition: accountType === "free"
Design: Dismissible blue banner at top
Message: "Part of a club? Enter your code to unlock premium →"
CTA: Link to /join-club
```

**5. Email Validation Feedback**
```typescript
Location: app/signup/page.tsx
Add: Real-time email format validation
UI: Green checkmark when valid, red X when invalid
Reduces signup errors
```

---

#### **Medium Effort Polish (1-2 days each)**

**6. Stats Preview with Blur Overlay**
```typescript
Location: app/planner/stats/page.tsx
Current: Complete block with generic message
Better: Show sample stats chart with blur effect
Overlay: "🔒 Unlock Analytics with Premium"
Include: Feature benefits, upgrade CTA
Reference: Spotify/LinkedIn preview model
```

**7. Feature Comparison Table**
```tsx
Location: app/upgrade/page.tsx
Design: Side-by-side FREE | PREMIUM | CLUB
Include: All features with ✓/✗ indicators
Highlight: What user gains by upgrading
Mobile: Responsive stacking
```

**8. Payment Mockup (High-Fidelity)**
```
Location: app/upgrade/checkout/page.tsx
Instead of: "Coming soon" message
Create: Full checkout UI mockup
Include:
  - Plan summary (Pro Access - $29/month)
  - Payment method entry (greyed out)
  - Billing address fields (placeholder)
  - "Start Subscription" button (shows "Pre-launch" tooltip)
  - "Join waitlist" CTA (capture emails)
Purpose: User testing, validate pricing, collect interest
```

**9. Guided Product Tour (Optional)**
```typescript
Library: Shepherd.js or Intro.js
Trigger: Optional button in welcome modal
Steps:
  1. "This is the drill catalog" (point to catalog link)
  2. "Save your favorites here" (point to heart icon)
  3. "Plan sessions here" (point to planner)
  4. "Your plan syncs automatically" (point to sync indicator)
Skippable: Always
Resumable: Store progress in localStorage
```

---

### 🧪 Priority 2: User Testing Preparation

#### **Pre-Launch Testing Checklist**

**1. Onboarding Flow Testing**
- [ ] Record 5 first-time signups (screen recording)
- [ ] Ask: "What can you do with FREE account?"
- [ ] Measure: Time to first session created
- [ ] Track: Drop-off points in signup flow

**2. Limitation Messaging Testing**
- [ ] Watch users hit session 2 lock
- [ ] Ask: "What would you do now?"
- [ ] Measure: Click-through rate to /upgrade
- [ ] A/B test: Different lock messages

**3. Value Proposition Testing**
- [ ] Show /upgrade page to coaches
- [ ] Ask: "Is this worth $29/month?"
- [ ] Ask: "What's missing from FREE that you need?"
- [ ] Validate: FREE tier isn't too generous OR too restrictive

**4. Club Admin Flow Testing**
- [ ] Watch admin create club
- [ ] Watch admin generate invite
- [ ] Ask: "How would you share this code?"
- [ ] Measure: Time from signup to first coach invited

**5. Pricing Validation**
- [ ] Interview 10 target customers
- [ ] Ask: "What would you pay for this?" (don't tell price first)
- [ ] Test: $29, $39, $49 individual pricing
- [ ] Test: Flat rate club pricing tiers

---

### 📊 Priority 3: Analytics & Tracking

#### **Key Metrics to Implement (Pre-Launch)**

**Conversion Funnels:**
```
Individual Coach:
  Landing → Signup Started → Signup Complete →
  First Session Created → Session 2 Attempted →
  Upgrade Page Visited → (Waitlist Signup)

Club Admin:
  Landing → Club Signup Started → Club Created →
  First Invite Sent → First Coach Joined →
  2+ Coaches Active
```

**Engagement Metrics:**
```
- Sessions created per user
- Favorites saved per user
- Time to first session (activation metric)
- Return rate (Day 1, Day 7, Day 30)
- FREE users who hit limitations (session 2, 11th favorite)
- Click-through rate on upgrade CTAs
```

**Tools:** Google Analytics 4, Mixpanel, or Amplitude

**Code Location:** `app/components/AnalyticsProvider.tsx` (exists)

---

### 💼 Priority 4: Waitlist & Pre-Launch Marketing

#### **Waitlist Implementation**

**Purpose:** Capture interest before payment goes live

**Where to Add:**
1. `/upgrade/checkout` - "Join waitlist for launch notification"
2. Limitation modals - "Get notified when Premium launches"
3. Homepage (if exists) - "Sign up for early access"

**Data to Capture:**
- Email
- Account type (individual coach or club admin)
- Number of coaches (if club)
- Desired features (survey)

**Implementation:**
```typescript
// Simple Firestore collection
interface WaitlistEntry {
  email: string;
  accountType: "individual" | "club";
  timestamp: Date;
  source: "checkout" | "limitation" | "homepage";
  surveyResponses?: {
    coachCount?: number;
    needsMost?: string;
    willingToPay?: string;
  };
}
```

**Follow-Up:**
- Automated welcome email
- Weekly updates on progress
- Early access invitation when launched
- Special launch discount for waitlist

---

## Part 4: FREE Tier Deep Dive

### Current FREE Tier (Code Verified)

**Implementation:**
```typescript
// app/types/account.ts:62-67
FREE_ENTITLEMENTS = {
  maxSessions: 1,          // Can edit unlimited, can't create 2nd
  maxFavorites: 10,        // Hard cap
  canAccessStats: false,   // Completely blocked
  canExport: false         // Blocked
}
```

**Enforcement:**
```typescript
// app/planner/page.tsx:109
const isLocked = week.week > entitlements.maxSessions;
// Sessions 2-12 show lock overlay for FREE users
```

---

### Assessment: Is This the Right FREE Tier?

**Based on Platform Purpose:**
Football EyeQ helps coaches plan **progressive, season-long training** with professional drills.

**Core User Need:**
- Plan structured sessions that build on each other
- Access high-quality, research-backed drills
- Save time and improve training effectiveness

---

### ✅ Recommendation: **KEEP CURRENT LIMITS**

**Why 1 Session Works:**

**Pros:**
- ✅ Forces users to experience core value (session planning)
- ✅ The session is **reusable** (edit unlimited) - this is key
- ✅ Creates clear upgrade moment (when user wants session 2)
- ✅ Already implemented and working well
- ✅ Low-friction testing (users can try immediately)

**How It Works in Practice:**
- Week 1: User plans first session, uses it for training
- Week 2: User edits Session 1 for new drills (reuses slot)
- Week 3: User wants to plan ahead → needs Session 2 → locked → **upgrade moment**

**Strategic Value:**
- Users CAN use the platform meaningfully (1 session is functional)
- Users CANNOT plan full season (need 12 sessions) → upgrade pressure
- Balances "try before buy" with "must upgrade to do real work"

---

**Why NOT Increase to 3 Sessions:**

While 3 sessions would allow progressive training blocks, it:
- ❌ Reduces upgrade urgency significantly
- ❌ Requires code changes
- ❌ May enable "good enough" for casual users (lost conversions)
- ❌ Doesn't align with "1 free slot" pattern (confuses value prop)

**Verdict:** Keep 1 session, focus on **improving HOW users discover limitation** (better messaging, not more sessions)

---

### Why 10 Favorites Works:

**Analysis:**
- Average session uses 5-6 drills
- 10 favorites = ~2 sessions worth of drills
- Enough for exploration and personalization
- Not enough for long-term use (upgrade incentive)

**User Behavior Projection:**
- **Casual users:** Unlikely to hit 10 (won't upgrade anyway)
- **Active users:** Hit 10 quickly (these are your converters)
- **Sweet spot:** Separates engaged users from browsers

**Verdict:** ✅ **Keep at 10 favorites**

---

### 🎯 The Real Opportunity: Improve Limitation Experience

Instead of changing limits, improve **how users experience them**:

**1. Progressive Disclosure**
- Show locked sessions 2-12 upfront (set expectations early)
- Add counter: "1/1 FREE session" in planner header
- Add favorites counter: "8/10 favorites" before hitting limit

**2. Benefit-Focused Messaging**
```diff
Current:
  "Upgrade to unlock"

Better:
  "Plan Your Full Season"
  "Unlock 11 more sessions to create progressive training blocks"
  "See how drills build on each other across 12 weeks"
  [Upgrade to Premium $29/mo] [Join a Club for Free]
```

**3. Feature Previews**
- Show blurred stats charts (create desire)
- Show sample session analytics (demonstrate value)
- Preview export formats (show what they get)

**4. Soft Prompts Before Hard Blocks**
```
When user is on Session 1:
  Soft banner: "Planning ahead? Unlock 11 more sessions →"
  (Not blocking, just informing)

When user saves 8th favorite:
  Tooltip: "2 more favorites left. Upgrade for unlimited →"
  (Warning before hitting limit)
```

---

### Joyfulness Score: 7.5/10 ⭐

**Joyful Elements:**
- ✅ Can browse ALL exercises (builds trust, enables discovery)
- ✅ Can plan 1 session and edit it freely (functional use)
- ✅ Can save favorites (personalization, control)
- ✅ Clean, modern UI (aesthetic joy)
- ✅ No aggressive upselling (respectful)
- ✅ Welcome modal is encouraging (positive tone)

**Friction Points:**
- ⚠️ Can't see what stats look like (mystery creates doubt, not desire)
- ⚠️ Limitation messaging is generic (transactional, not motivational)
- ⚠️ No way to "taste" premium features (no trial option)
- ⚠️ Hitting limit feels sudden (no warning)

**To Reach 9/10 Joy:**
1. Add stats preview (blur overlay with sample data)
2. Improve limitation copy (benefits, not restrictions)
3. Add soft prompts before hard blocks (progressive disclosure)
4. Consider: 7-day "all features" trial for new users (complexity vs benefit)

---

### 14-Day Trial Discussion

**User Asked:** "How complicated to implement?"

**Implementation Complexity: 3-4 days**

**What's Needed:**
```typescript
1. Add trial fields to user profile:
   - trialStartedAt: Date
   - trialEndsAt: Date
   - hasUsedTrial: boolean

2. Modify entitlements logic:
   - Check if user is in trial period
   - If yes: Grant PREMIUM_ENTITLEMENTS
   - If trial expired: Downgrade to FREE_ENTITLEMENTS

3. Add trial UI:
   - Trial countdown banner ("X days left in trial")
   - Email notifications (3 days before expiry)
   - Expiration modal ("Trial ended. Upgrade to keep access")

4. Edge cases:
   - User joins club during trial (no downgrade)
   - User upgrades during trial (cancel countdown)
   - User deletes account during trial (cleanup)
```

**Pros:**
- ✅ Significantly increases conversion (industry data: 25-40% lift)
- ✅ Users experience FULL value before paying
- ✅ Removes "what am I missing?" doubt
- ✅ Common pattern (users expect it)

**Cons:**
- ❌ Implementation complexity (3-4 days of dev work)
- ❌ Edge cases to handle (club join during trial, etc.)
- ❌ May create "loss aversion" frustration when trial ends
- ❌ Users may not use intensively within 14 days

**Recommendation for Startup Mode:**

**Phase 1 (Pre-Launch):** ❌ **Don't implement trial**
- Focus on UX polish and mockups
- Current FREE tier is sufficient for testing
- Avoid complexity before validating pricing

**Phase 2 (Post-Launch, if needed):** ✅ **Consider trial**
- If conversion rate is low (<10% FREE → Premium)
- If users cite "not sure what I'm missing" as objection
- After 3-6 months of data collection

**Alternative:** "Trial Days" for specific user segments
- Give 14-day trial to coaches referred by active club admins
- Give trial to users who come from partner organizations
- Manual trial grants (super admin can enable for testing)

---

## Part 5: Payment & Subscription (Startup Mode)

### Current State: Mockup/Placeholder Approach ✅

**Assessment:** This is **correct strategy** for pre-launch

**Why Mockups Make Sense:**
- ✅ Validate UX/UI before building infrastructure
- ✅ Test pricing without payment processor fees
- ✅ Avoid credit card compliance (PCI-DSS) during testing
- ✅ Manually control who gets access (quality over automation)
- ✅ Faster iteration on pricing/packaging

---

### Individual Premium Payment

**Current Implementation:**
```
/upgrade → Shows $29/month pricing
/upgrade/checkout → "Coming soon" message
Stripe webhook exists but is placeholder
No actual payment processing
```

**Pre-Launch Recommendation:**

**Option A: High-Fidelity Mockup (Recommended)**
Create full checkout UI with:
- Payment method entry fields (greyed out)
- Billing address form (disabled)
- Plan summary and total
- "Start Subscription" button → Shows "Available at launch" tooltip
- **"Join Waitlist" CTA** → Capture emails for launch notification

**Purpose:**
- User testing (validate pricing, UX flow)
- Collect waitlist (marketing asset)
- Identify friction points before building

**Option B: Simple Waitlist**
Replace checkout page with:
- "Premium launching soon!"
- Email signup form
- Expected features list
- Pricing preview
- Launch notification opt-in

---

### Club Subscription Payment

**Current Implementation:**
```
Clubs start with subscriptionStatus: "trial"
No expiration (indefinite until manual activation)
Super admin manually sets to "active"
No payment method entry
No billing
```

**Pre-Launch Recommendation:**

**Keep Manual Activation** for startup phase:
- ✅ Personal touch with early club adopters
- ✅ Negotiate custom pricing if needed
- ✅ Test different models (flat rate vs per-coach)
- ✅ Gather feedback before automating

**Add to Club Dashboard (Mockup):**
```tsx
<SubscriptionTab>
  <h3>Subscription Status</h3>
  <Badge>Trial (Pre-Launch)</Badge>

  <p>Your club has full access during our pre-launch phase.</p>

  <div className="future-pricing">
    <h4>Expected Pricing (When We Launch)</h4>
    <p>Flat rate: $XX/month for unlimited coaches</p>
    <small>Pricing subject to change. Early adopters may receive special rates.</small>
  </div>

  <Button disabled>
    Add Payment Method
    <Tooltip>Available at launch</Tooltip>
  </Button>
</SubscriptionTab>
```

**Purpose:**
- Set expectations (this is temporary)
- Test pricing messaging
- Prepare users for future payment

---

### Pricing Model Validation

**User Confirmed:** Flat rate for clubs (not per-coach)

**Recommendation:** Test pricing transparency

**Survey Early Clubs:**
- What would you expect to pay for unlimited coaches?
- Would you prefer per-coach or flat rate?
- What's your current coaching software budget?

**Competitive Analysis:**
- Research similar platforms
- Identify pricing range
- Test $99, $149, $199 flat rates

**Early Adopter Strategy:**
- Lock in first 20 clubs at discounted "founder rate"
- Create urgency for early signup
- Build case studies and testimonials

---

## Part 6: Recommendations Summary

### 🚀 This Week (Quick Wins - 1-3 hours each)

**1. Add "Copy Code" Button**
- Location: Club dashboard when invite code generated
- Tech: Clipboard API with success toast
- Impact: Reduces friction in code sharing

**2. Add Session Counter**
- Location: Planner header
- Display: "FREE: 1/1 session used" badge
- Impact: Sets expectations, prompts upgrade awareness

**3. Add "Have Club Code?" Banner**
- Location: Planner page (FREE users only)
- Design: Dismissible blue banner
- Message: "Part of a club? Enter code to unlock premium →"
- Impact: Improves code redemption discovery

**4. Improve Lock Overlay Copy**
- Location: Sessions 2-12 lock screens
- Change: "Upgrade to unlock" → "Plan your full season with 12 sessions"
- Add: Dual CTA (Upgrade | Join Club)
- Impact: Better conversion messaging

**5. Email Validation UI**
- Location: Signup forms
- Add: Real-time validation with visual feedback
- Impact: Reduces signup errors

---

### 🎯 Next 2 Weeks (Medium Impact - 1-2 days each)

**6. Payment Checkout Mockup**
- Location: /upgrade/checkout
- Create: High-fidelity UI mockup
- Include: Waitlist signup
- Purpose: User testing, collect interest

**7. Stats Preview with Blur**
- Location: /planner/stats
- Show: Sample stats chart with blur overlay
- Add: Compelling unlock CTA
- Purpose: Create desire for premium feature

**8. Feature Comparison Table**
- Location: /upgrade page
- Design: FREE | PREMIUM | CLUB side-by-side
- Make: Mobile-responsive
- Impact: Clarifies value proposition

**9. Club Subscription Mockup**
- Location: Club dashboard (new "Subscription" tab)
- Show: Trial status, future pricing, payment placeholder
- Purpose: Set expectations, test pricing

**10. Waitlist System**
- Locations: Checkout, limitation modals, homepage
- Capture: Email, account type, needs
- Purpose: Marketing list for launch

---

### 🔮 Pre-Launch Roadmap (Before Going Live)

**User Testing (2-4 weeks)**
- [ ] 10 individual coach signups (observe onboarding)
- [ ] 5 club admin signups (observe invite flow)
- [ ] Limitation testing (watch users hit session 2)
- [ ] Pricing surveys (validate $29 individual, $XX club)

**Analytics Implementation**
- [ ] Conversion funnels (signup → activation → upgrade)
- [ ] Engagement metrics (sessions created, favorites saved)
- [ ] Drop-off points (where users abandon)

**Content & Polish**
- [ ] Guided product tour (optional)
- [ ] Help documentation (FAQ, guides)
- [ ] Email templates (welcome, trial expiry, etc.)
- [ ] Social proof (if available - testimonials, logos)

**Payment Integration (When Ready to Launch)**
- [ ] Stripe account setup
- [ ] Checkout implementation
- [ ] Webhook handlers (subscription lifecycle)
- [ ] Payment method management
- [ ] Billing history display
- [ ] Invoice generation
- [ ] Refund handling
- [ ] Failed payment retry logic

**Launch Preparation**
- [ ] Pricing finalized (based on testing)
- [ ] Trial strategy decision (yes/no, duration)
- [ ] Legal (terms, privacy, payment terms)
- [ ] Support system (help desk, chat, email)
- [ ] Launch communications (email waitlist)

---

## Part 7: Answers to Original Questions

### Q1: Are there three personas or should we add more?

**Answer:** ✅ **Three core personas are complete and correct:**
1. Individual Coach (no club)
2. Club Coach
3. Club Admin

**Super Admin is Persona 4** (correctly implemented for single-admin startup)

**Missing Persona?** ❌ **No** - Do NOT add player/athlete persona now. Focus on perfecting coach experience before expanding scope.

---

### Q2: Can (1) and (2) join free at any time?

**Answer:** ✅ **YES** - Both can sign up for free accounts with zero friction. Excellently implemented.

---

### Q3: Can (1) upgrade to Premier through payment?

**Answer:** ⚠️ **YES (UI exists), but payment is mockup** - This is **correct for startup mode**.

**Recommendation:** Create high-fidelity checkout mockup + waitlist instead of "coming soon" message.

---

### Q4: Can (2) upgrade to premium via club code?

**Answer:** ✅ **YES** - Club code redemption works excellently. Multiple entry points, secure validation, immediate access.

**Minor enhancement:** Add "Have a code?" banner for discoverability.

---

### Q5: Can (3) sign up for free?

**Answer:** ✅ **YES** - Club admin signup is free with excellent 2-step form design.

---

### Q6: Should club coaches have limitations without club subscription?

**Answer:** ✅ **YES, handled correctly**

**Current Logic:**
- Club created → subscriptionStatus: "trial" (indefinite in startup mode)
- If subscription becomes "inactive" → All club coaches downgraded to FREE
- This is **perfect for pre-launch**

**Post-Launch:** Implement trial expiration (30 days?) with email warnings before downgrade.

---

### Q7: Is admin page easy for (3) to manage club?

**Answer:** ✅ **YES** for core management, ⚠️ Missing subscription self-service

**What Works:**
- Inviting coaches is intuitive
- Roster display is clear
- Exercise policy control is unique
- Remove coaches works with confirmation

**What's Missing (Intentionally for startup):**
- Subscription management (manual is correct for now)
- Payment method entry (add mockup)
- Billing history (post-launch)

**Pre-Launch Enhancement:** Add mockup of "Subscription" tab with pricing preview.

---

### Q8: Is admin page easy for (4) to manage all clubs?

**Answer:** ✅ **YES** for startup scale (<50 clubs)

**What Works:**
- View all clubs/coaches
- Manual activation/suspension
- Exercise management
- Coach upgrade/downgrade

**What Doesn't Scale (Post-Launch concern):**
- No search/filter (needed at 50+ clubs)
- No pagination (needed at 100+ clubs)
- No analytics/reporting (MRR, churn)
- No bulk operations

**Recommendation:** Add these AFTER launch when you have scale problems (don't over-engineer now).

---

### Q9: Are FREE limitations meaningful?

**Answer:** ✅ **YES** - 1 reusable session + 10 favorites is well-balanced

**Meaningful Because:**
- Users can accomplish real work (plan 1 session, edit freely)
- Clear upgrade incentive (when need session 2 for progressive training)
- Full catalog access builds trust
- Not too generous (would kill conversions)
- Not too restrictive (allows proper evaluation)

**Recommendation:** ✅ **Keep current limits**, focus on improving limitation messaging/UX.

---

### Q10: Do limitations create a joyful entry point?

**Answer:** ⭐ **7.5/10 Joyfulness** - Mostly joyful with clear improvement path

**Joyful:**
- Full catalog access (massive trust builder)
- Clean UI
- Encouraging onboarding
- No aggressive upselling

**Can Improve:**
- Better limitation messaging (benefits > restrictions)
- Feature previews (show what's locked)
- Progressive disclosure (warn before blocking)
- Stats preview (create desire)

**To reach 9/10:** Implement UX polish recommendations (stats preview, better copy, soft prompts).

---

## Part 8: Session Limit Deep Dive

### Code Verification Results

**FREE Tier Implementation:**
```typescript
// app/types/account.ts:62-67
FREE_ENTITLEMENTS = {
  maxSessions: 1,
  maxFavorites: 10,
  canAccessStats: false,
  canExport: false
}
```

**How It Actually Works:**

**User Can:**
- ✅ Create Session 1
- ✅ Edit Session 1 unlimited times
- ✅ Save different drills to Session 1
- ✅ Plan and re-plan Session 1 weekly

**User Cannot:**
- ❌ Create Session 2
- ❌ Create Session 3-12
- ❌ Plan multiple sessions in advance

**Why This Is Good:**
1. **Reusability** means it's not "one-time use" (would be too restrictive)
2. **Weekly coaches** can use FREE tier indefinitely (edit Session 1 each week)
3. **Upgrade trigger** is when coaches want to plan ahead or see progression

**Strategic Analysis:**

This creates two user behaviors:

**Behavior A: Weekly User (May Not Convert)**
- Plans Session 1 Monday
- Delivers training session Wednesday
- Edits Session 1 for next week
- Repeats weekly
- **Never hits limitation** because they don't plan ahead

**Behavior B: Season Planner (Will Convert)**
- Wants to plan full 12-week season
- Wants to see progressive training arc
- Tries to create Session 2 → **BLOCKED**
- This is your ideal customer → **Upgrades**

**The Question:** Do you want to convert Behavior A?

**Options:**

**Option 1: Keep 1 Reusable Session (Current)**
- Pros: Already implemented, simple to explain
- Cons: Weekly users can freeload indefinitely
- Who Converts: Season planners only
- Conversion Rate: Lower (but higher quality leads)

**Option 2: Change to "1 Session Per Season" (Not Reusable)**
- Pros: Forces upgrade after 1 use
- Cons: Too restrictive, bad user experience
- Who Converts: No one (they leave instead)
- Conversion Rate: Lower (people churn before converting)

**Option 3: Increase to 3 Sessions**
- Pros: Demonstrates progressive planning
- Cons: Reduces urgency significantly
- Who Converts: Still only season planners
- Conversion Rate: Lower (3 sessions may be "good enough" for some)

**Option 4: Add "Session Age Limit" (Complex)**
- FREE users can only keep sessions for 30 days
- After 30 days, must upgrade or delete
- Pros: Converts weekly users eventually
- Cons: Complex to implement, confusing to explain, feels punitive

---

### Recommendation: Keep 1 Reusable Session ✅

**Rationale:**

**1. Already Optimized**
- Current implementation is working as designed
- No evidence it's broken or underperforming
- Simple to explain ("1 free session")

**2. Right Target Audience**
- Season planners are your ideal customers (higher LTV)
- Weekly users may not value premium features anyway
- Quality > quantity of conversions

**3. Generous FREE Tier is Brand Asset**
- "Use it free forever" is powerful marketing message
- Builds goodwill and word-of-mouth
- Trust-based relationship with users

**4. Avoid Premature Optimization**
- You're in pre-launch (don't have conversion data yet)
- Test current limits before changing
- Can always restrict later (can't easily un-restrict)

---

### What to Do Instead:

**Focus on improving conversion OF season planners:**

1. **Make Limitation Visible Earlier**
   - Show Sessions 2-12 as locked from day 1
   - Add "1/12 sessions available on FREE" messaging
   - Set expectation upfront

2. **Improve Lock Screen Messaging**
   - Emphasize progressive planning value
   - Show example: "Plan Session 1 → Session 2 → Session 3 for progressive skill development"
   - Dual CTA: Individual upgrade OR club join

3. **Add Soft Prompts**
   - When user finishes Session 1: "Great! Season planners unlock 11 more sessions →"
   - Context-aware: "Planning a 12-week season? Unlock all sessions"

4. **Preview Multi-Session Benefits**
   - Show sample season plan (12 sessions with progression)
   - Demonstrate how drills build on each other
   - Create desire through visualization

---

## Conclusion

### 🎉 Overall Assessment: **Strong Foundation, Ready for Polish**

Football EyeQ has:
- ✅ **Excellent persona architecture** (4 distinct user types, well-separated)
- ✅ **Thoughtful feature gating** (FREE tier is balanced)
- ✅ **Professional UX patterns** (signup flows, onboarding, dashboards)
- ✅ **Appropriate startup approach** (manual subscription, mockup payments)
- ✅ **Unique competitive features** (club exercise policy, invite codes)

---

### 🎯 Pre-Launch Priorities (In Order)

**Week 1-2: UX Polish (Quick Wins)**
1. Add "Copy Code" button (1 hour)
2. Add session counter (1 hour)
3. Add "Have club code?" banner (2 hours)
4. Improve lock screen messaging (2 hours)
5. Email validation UI (1 hour)

**Week 3-4: User Testing**
1. Watch 10 individual coach signups
2. Watch 5 club admin flows
3. Test limitation messaging
4. Validate pricing

**Week 5-6: Mockups & Waitlist**
1. High-fidelity payment checkout mockup
2. Club subscription tab mockup
3. Waitlist system
4. Stats preview with blur

**Month 2: Analytics & Refinement**
1. Implement conversion funnels
2. Track engagement metrics
3. Iterate based on data
4. Prepare for launch

**Month 3: Launch Preparation**
1. Stripe integration
2. Payment webhooks
3. Subscription management
4. Email system
5. Support setup

---

### 📊 Success Metrics to Track

**Pre-Launch (Startup Mode):**
- Signups per week
- Activation rate (% who create first session)
- Club admin signups
- Coaches invited per club
- Waitlist signups

**Post-Launch:**
- FREE → Premium conversion rate (target: 10-15%)
- Time to conversion (target: <30 days)
- Club subscription rate
- Churn rate (target: <5% monthly)
- MRR growth

---

### ✅ Final Verdict

**Current State:** 8/10 for pre-launch phase

**Strengths:**
- User journeys are well-designed
- Persona separation is clean
- FREE tier is balanced
- Code quality is professional

**Opportunities:**
- UX polish (messaging, previews, discoverability)
- Payment mockups for testing
- User testing and validation
- Analytics implementation

**Readiness:** ✅ **Ready for user testing** after quick wins are implemented

---

## Next Steps

1. **Review this audit** - Identify priorities
2. **Implement quick wins** - Low effort, high impact (Week 1-2)
3. **Start user testing** - Observe real coaches using the platform
4. **Validate pricing** - Survey potential customers
5. **Create payment mockups** - Test checkout UX
6. **Build waitlist** - Marketing asset for launch
7. **Iterate based on feedback** - Refine before scaling

---

**Questions for You:**

1. Which quick wins should I implement first? (I can start coding now)
2. Do you have users I can watch for testing? (Even internal stakeholders)
3. What's your target launch date? (Helps prioritize roadmap)
4. What's your biggest concern about current user journey? (I can deep-dive)

---

*End of Audit - Updated for Startup/Pre-Launch Mode*
