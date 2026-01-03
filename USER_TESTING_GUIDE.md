# User Testing Guide
## How to Observe Users Using Football EyeQ

**Purpose:** Identify UX issues, validate assumptions, improve conversion
**Timeline:** Pre-launch (next 3 months before April 2026)
**Target:** 10-15 individual coaches + 5 club admins

---

## Method 1: Screen Recording (Easiest) ⭐ START HERE

**Tools:** Loom, Hotjar, or built-in browser screen recording

**Setup:**
1. Recruit 5-10 coaches (friends, family, local coaches, online communities)
2. Send them:
   - Link to Football EyeQ
   - Brief: "Test our new coaching platform, record your screen"
   - Screen recording instructions (Loom is free and easy)
   - Specific task: "Sign up and try to create your first session plan"

**What to ask them to do:**
```
Task 1: Sign up for a free account
Task 2: Browse the drill catalog and save 3 favorites
Task 3: Create your first session plan
Task 4: Try to create a second session (they'll hit the lock)
Task 5: Tell us what you would do next
```

**What you'll learn:**
- Where they get confused (watch for pauses, re-reading, clicking back)
- What they ignore (features they don't notice)
- How they react to limitations (do they understand? get frustrated?)
- Their verbal reactions (if they narrate while recording)

**Deliverable:** 10 videos you can watch at your own pace

---

## Method 2: Live Zoom Sessions (Most Valuable)

**Setup:**
1. Schedule 30-minute Zoom calls with 5-10 coaches
2. Ask them to share their screen
3. Give them tasks, observe silently
4. Ask follow-up questions

**Script:**
```
"Thanks for helping test Football EyeQ. I'm going to give you some tasks.
Please think out loud as you go - tell me what you're looking at, what you expect,
what confuses you. There are no wrong answers. We're testing the site, not you."

Task 1: "Imagine you're a coach who just heard about this platform.
        Sign up for an account."
        [WATCH: Do they find signup? Which path do they choose?]

Task 2: "You want to plan a training session for next week.
        Try to do that now."
        [WATCH: Do they go to planner? Do they understand how to add drills?]

Task 3: "You loved that session and want to plan the next 3 weeks ahead.
        Try to do that."
        [WATCH: Do they hit the lock? How do they react?]

Task 4: "What would you do now?"
        [LISTEN: Do they want to upgrade? Look for alternatives? Give up?]
```

**What to observe:**
- **Hesitation:** Pauses before clicking = unclear what to do
- **Wrong path:** Clicking menu items repeatedly = lost
- **Surprise:** "Oh!" or "Wait, what?" = expectation mismatch
- **Frustration:** Sighs, complaints = UX pain point
- **Delight:** "Cool!" or "Nice!" = things working well

**Questions to ask after:**
- "What was confusing?"
- "What would you change?"
- "Would you pay $29/month for this? Why/why not?"
- "What's missing that you need?"

---

## Method 3: In-Person Testing (Gold Standard)

**Setup:**
1. Find 5 local coaches (friends, colleagues, local clubs)
2. Meet in person (or over Zoom with screen share)
3. Sit next to them, watch over their shoulder
4. Take notes, don't help unless they're completely stuck

**Advantages:**
- See facial expressions (confusion, delight, frustration)
- See mouse movement patterns (hovering, hesitation)
- Can ask immediate follow-ups
- More natural behavior (less performance anxiety)

**Protocol:**
- Use their computer (not yours) - see real-world conditions
- Give them tasks, then **shut up and observe**
- Don't help, even when they struggle (that's the point!)
- Take notes on EVERYTHING:
  - What they click
  - What they say
  - How long tasks take
  - Where they get stuck

---

## Method 4: Analytics + Heatmaps (Passive Observation)

**Tools to implement:**
- **Hotjar** (free plan): Heatmaps, session recordings, feedback polls
- **Google Analytics 4:** Conversion funnels, drop-off points
- **Microsoft Clarity:** Free session recordings and heatmaps

**What to track:**
1. **Signup funnel:**
   - Landing → Signup page view → Signup started → Signup completed
   - Where do people drop off?

2. **Activation funnel:**
   - Signup → First catalog view → First favorite → First session created
   - What % complete each step?

3. **Limitation discovery:**
   - FREE users who try to create session 2
   - FREE users who hit 10-favorite limit
   - Click rate on "Upgrade" CTAs

4. **Heatmaps:**
   - What do people click on signup page?
   - Do they see the "I have club code" checkbox?
   - Do they see the upgrade CTAs in planner?

**Implementation:**
```tsx
// Add Hotjar to app/layout.tsx
<Script id="hotjar">
  {`
    (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:YOUR_SITE_ID,hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
  `}
</Script>
```

---

## Method 5: Surveys (Quick Feedback)

**When to use:** After users complete a task or hit a limitation

**Tools:** Typeform, Google Forms, or in-app popup

**Example survey (popup when user hits session 2 lock):**
```
"You've reached the limit of 1 free session."

1. What would you do next? (multiple choice)
   ○ Upgrade to Premium ($29/month)
   ○ Look for a club code
   ○ Keep using just 1 session
   ○ Look for a different tool
   ○ Other: _______

2. What's preventing you from upgrading right now? (open text)

3. How likely are you to recommend Football EyeQ to another coach? (1-10)
```

---

## Testing Priorities for Next 3 Months

### Month 1 (January): Individual Coach Journey
**Recruit:** 10 individual coaches
**Method:** Screen recordings + 3 Zoom sessions
**Focus:**
- Signup flow (is it clear?)
- First session creation (can they figure it out?)
- Hitting session 2 lock (do they understand? want to upgrade?)
- Pricing reaction ($29/month - too high? just right?)

**Questions to answer:**
- Do coaches understand FREE vs Premium?
- Where do they get confused?
- Would they pay $29/month?

---

### Month 2 (February): Club Admin Journey
**Recruit:** 5 club admins (directors of coaching, head coaches)
**Method:** 5 live Zoom sessions (30 min each)
**Focus:**
- Club signup flow (2-step form - is it clear?)
- Generating invite codes (can they figure it out?)
- Sharing codes with coaches (how would they do it?)
- Exercise type policy (do they understand the options?)

**Questions to answer:**
- Is club signup intuitive?
- Do they understand how to invite coaches?
- What pricing would they expect for unlimited coaches?

---

### Month 3 (March): Pricing & Conversion Testing
**Recruit:** 10 new coaches (mix of individual + club)
**Method:** A/B testing different approaches
**Test variations:**
1. Control: Current FREE tier (1 session, 10 favorites)
2. Variation A: Different lock screen messaging
3. Variation B: Different upgrade page copy
4. Variation C: Different pricing display

**Questions to answer:**
- Which messaging converts better?
- Is $29/month the right price?
- What club pricing tiers make sense?

---

## Recruiting Test Users

### Where to find coaches:
1. **Personal network:**
   - Friends who coach
   - Family members
   - Former teammates who coach now

2. **Local clubs:**
   - Call 5 local youth soccer clubs
   - Offer: "Free lifetime access if you test our platform for 30 minutes"

3. **Online communities:**
   - Reddit: r/bootroom (coaching subreddit)
   - Facebook groups: Youth soccer coaching groups
   - Twitter: DM coaches who tweet about training

4. **Coaching courses:**
   - Reach out to people taking coaching licenses
   - Partner with coaching education providers

**Incentive to offer:**
- Free lifetime Premium access (for first 20 testers)
- Free club subscription (for first 5 club admins)
- Amazon gift card ($20-30 for 30-min session)
- Public credit ("Thanks to our beta testers: [names]")

---

## Sample Testing Script

**Pre-session email:**
```
Subject: Help test Football EyeQ (30 minutes, free lifetime access)

Hi [Name],

I'm building Football EyeQ, a training session planning tool for coaches.
Would you be willing to test it for 30 minutes on Zoom?

In return: Lifetime free Premium access (normally $29/month)

What you'll do:
- Share your screen
- Try to sign up and create a session plan
- Tell me what's confusing or what you like
- Answer a few questions

Schedule: [Calendly link]

Thanks!
```

**During session:**
```
1. Introduction (2 min)
   "Thanks for helping. I'm going to ask you to do some tasks.
   Please think out loud - what you see, what you expect, what confuses you.
   Remember, we're testing the site, not you!"

2. Task 1: Signup (5 min)
   "You're a coach who just heard about Football EyeQ. Sign up."
   [Observe silently. Take notes. Don't help unless totally stuck.]

3. Task 2: Explore (5 min)
   "What would you do first after signing up?"
   [See where they naturally go. Catalog? Planner? Profile?]

4. Task 3: Create session (10 min)
   "You want to plan next week's training session. Do that now."
   [Watch how they use the planner. Do they understand drag-drop? Can they find drills?]

5. Task 4: Hit limitation (5 min)
   "You want to plan 3 more weeks ahead. Try that."
   [Watch reaction to session 2 lock. Frustration? Understanding? Curiosity?]

6. Questions (3 min)
   - "What was confusing?"
   - "What would you change?"
   - "Would you pay $29/month for this?"
   - "What's missing?"
```

---

## What Success Looks Like

**Good signs:**
- Users complete signup in <2 minutes
- Users create first session in <5 minutes
- Users understand WHY they hit limitations
- Users ask "How do I upgrade?" (not "This sucks")
- 60%+ say they'd pay $29/month

**Warning signs:**
- Users abandon signup halfway through
- Users can't figure out how to add drills to session
- Users surprised/angry when hitting lock
- Users say "I'd just use Excel instead"
- <20% would pay $29/month

---

## After Testing: What to Do

1. **Watch all videos/sessions**
2. **Take notes on patterns:**
   - What do 3+ users struggle with? (Fix immediately)
   - What do users love? (Promote more)
   - What do users ignore? (Remove or redesign)

3. **Prioritize fixes:**
   - Critical: Blocks users from completing tasks
   - High: Causes confusion but users can work around
   - Medium: Minor annoyance
   - Low: Nice-to-have improvement

4. **Iterate and re-test:**
   - Make changes
   - Test with 3 new users
   - See if fixes worked
   - Repeat

---

## Quick Start (This Week)

**Action plan:**
1. **Today:** Recruit 3 coaches (text friends who coach)
2. **This week:** Send them signup link + screen recording request
3. **Next week:** Watch 3 recordings, identify top 3 issues
4. **Following week:** Fix issues, recruit 3 more coaches, repeat

**Budget:** $0-150 (optional gift cards)
**Time:** 5-10 hours over 2 weeks
**Value:** Invaluable insights before launch

---

*Ready to start? Let me know if you want help drafting recruitment messages or testing scripts!*
