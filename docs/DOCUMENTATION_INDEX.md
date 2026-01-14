# Football EyeQ Documentation Index

Complete guide to all documentation in this repository.

---

## 🚀 Quick Start

**New to the project?** Start here:

1. [**Getting Started Guide**](./setup/GETTING_STARTED.md) - Complete setup walkthrough
2. [**Firebase Setup**](./setup/FIREBASE_SETUP.md) - Configure Firebase (required)
3. [**Environment Variables**](./setup/ENVIRONMENT_VARIABLES.md) - All env vars explained

---

## 📁 Documentation Structure

### Setup & Configuration

Getting the project running locally and in production.

| Document | Description |
|----------|-------------|
| [Getting Started](./setup/GETTING_STARTED.md) | **START HERE** - Complete setup guide from clone to deploy |
| [Firebase Setup](./setup/FIREBASE_SETUP.md) | Configure Firebase auth & database (client + server) |
| [Environment Variables](./setup/ENVIRONMENT_VARIABLES.md) | Complete reference for all 13 env vars |
| [Test User Setup](./setup/TEST_USER_SETUP.md) | Create test users for development & E2E testing |

---

### Testing

E2E test suite documentation and test planning.

| Document | Description |
|----------|-------------|
| [E2E Testing Guide](./testing/E2E_TESTING.md) | Comprehensive Playwright test documentation |
| [Test Plan](./testing/TEST_PLAN.md) | Test personas & automation scenarios |
| [Test Suite Summary](./testing/TEST_SUITE_SUMMARY.md) | All 109 tests across 5 areas |

---

### User Experience & Planning

UX analysis, user testing, and product planning.

| Document | Description |
|----------|-------------|
| [User Journey Audit](./guides/USER_JOURNEY_AUDIT.md) | Comprehensive UX/UI assessment with personas |
| [User Testing Guide](./guides/USER_TESTING_GUIDE.md) | Methods for conducting user testing |
| [Upgrade Page Redesign](./guides/UPGRADE_PAGE_REDESIGN.md) | UX analysis & redesign proposal |

---

### Development

Developer guides, roadmaps, and debugging resources.

| Document | Description |
|----------|-------------|
| [Quick Wins Roadmap](./development/QUICK_WINS_ROADMAP.md) | Implementation roadmap ordered by complexity |
| [Security Review](./development/SECURITY_REVIEW.md) | Security checklist (HTTPS, cookies, data handling) |
| [Drill Catalog Loading Debug](./development/debugging/drill-catalog-loading.md) | Case study: Debugging Firebase configuration issue |

---

### Deployment & CI/CD

Deployment guides for Vercel and GitHub Actions configuration.

| Document | Description |
|----------|-------------|
| [Firebase Secrets for CI](./deployment/FIREBASE_SECRETS_CI.md) | GitHub Actions secrets configuration |
| [GitHub Actions Setup](./deployment/GITHUB_ACTIONS.md) | Playwright CI/CD workflow explanation |

---

### Archived

Historical documents kept for reference.

| Document | Description |
|----------|-------------|
| [Launch Timeline](./archive/LAUNCH_TIMELINE.md) | 90-day pre-launch roadmap (Jan-April 2026) |

---

## 🎯 Documentation by Role

### For New Developers

**Getting started:**
1. [Getting Started Guide](./setup/GETTING_STARTED.md)
2. [Firebase Setup](./setup/FIREBASE_SETUP.md)
3. [Environment Variables](./setup/ENVIRONMENT_VARIABLES.md)
4. [Test User Setup](./setup/TEST_USER_SETUP.md)

**Understanding the codebase:**
- [E2E Testing Guide](./testing/E2E_TESTING.md) - Learn by reading tests
- [User Journey Audit](./guides/USER_JOURNEY_AUDIT.md) - Understand user flows
- [Quick Wins Roadmap](./development/QUICK_WINS_ROADMAP.md) - See planned work

### For QA / Testers

**Testing resources:**
1. [E2E Testing Guide](./testing/E2E_TESTING.md)
2. [Test Plan](./testing/TEST_PLAN.md)
3. [Test Suite Summary](./testing/TEST_SUITE_SUMMARY.md)
4. [Test User Setup](./setup/TEST_USER_SETUP.md)

**User testing:**
- [User Testing Guide](./guides/USER_TESTING_GUIDE.md)
- [User Journey Audit](./guides/USER_JOURNEY_AUDIT.md)

### For DevOps / SRE

**Deployment:**
1. [Getting Started Guide](./setup/GETTING_STARTED.md) - Step 8: Deploy to Vercel
2. [Firebase Setup](./setup/FIREBASE_SETUP.md) - Part 4: Deployment Setup
3. [Environment Variables](./setup/ENVIRONMENT_VARIABLES.md)

**CI/CD:**
- [GitHub Actions Setup](./deployment/GITHUB_ACTIONS.md)
- [Firebase Secrets for CI](./deployment/FIREBASE_SECRETS_CI.md)

### For Product Managers

**UX & Planning:**
1. [User Journey Audit](./guides/USER_JOURNEY_AUDIT.md) - Comprehensive UX analysis
2. [Quick Wins Roadmap](./development/QUICK_WINS_ROADMAP.md) - Implementation plan
3. [Upgrade Page Redesign](./guides/UPGRADE_PAGE_REDESIGN.md) - Feature proposal
4. [User Testing Guide](./guides/USER_TESTING_GUIDE.md) - Research methods

**Project status:**
- [Test Suite Summary](./testing/TEST_SUITE_SUMMARY.md) - Coverage overview
- [Security Review](./development/SECURITY_REVIEW.md) - Security posture

### For Security Reviewers

**Security documentation:**
1. [Security Review](./development/SECURITY_REVIEW.md) - Security checklist
2. [Firebase Setup](./setup/FIREBASE_SETUP.md) - Credential management
3. [Environment Variables](./setup/ENVIRONMENT_VARIABLES.md) - Secret handling

**Code security:**
- Review `firestore.rules` - Database security rules
- Review API routes in `app/api/` - Server-side security

---

## 📝 Documentation Standards

### File Naming

- **Guides:** `TOPIC_NAME.md` (e.g., `GETTING_STARTED.md`)
- **Kebab-case for multi-word:** `drill-catalog-loading.md`
- **ALL CAPS for important docs:** `README.md`, `FIREBASE_SETUP.md`

### Structure

All documentation should include:
1. **Title** - Clear, descriptive H1
2. **Overview** - What this doc covers
3. **Sections** - Logical breakdown with H2/H3 headings
4. **Related Links** - Links to relevant docs
5. **External Resources** - Links to official docs

### Maintenance

- **Update documentation** when changing features
- **Add debugging guides** for common issues
- **Link between related docs** for easy navigation
- **Archive outdated docs** instead of deleting

---

## 🔍 Find Documentation

### By Topic

**Setup & Installation:**
- Getting Started
- Firebase Setup
- Environment Variables
- Test User Setup

**Testing:**
- E2E Testing Guide
- Test Plan
- Test Suite Summary

**User Experience:**
- User Journey Audit
- User Testing Guide
- Upgrade Page Redesign

**Development:**
- Quick Wins Roadmap
- Security Review
- Debugging Guides

**Deployment:**
- Firebase Secrets CI
- GitHub Actions Setup

### By File Location

```
docs/
├── DOCUMENTATION_INDEX.md       ← You are here
├── setup/                        ← Getting started
│   ├── GETTING_STARTED.md
│   ├── FIREBASE_SETUP.md
│   ├── ENVIRONMENT_VARIABLES.md
│   └── TEST_USER_SETUP.md
├── testing/                      ← Test documentation
│   ├── E2E_TESTING.md
│   ├── TEST_PLAN.md
│   └── TEST_SUITE_SUMMARY.md
├── guides/                       ← UX & planning
│   ├── USER_JOURNEY_AUDIT.md
│   ├── USER_TESTING_GUIDE.md
│   └── UPGRADE_PAGE_REDESIGN.md
├── development/                  ← Dev guides
│   ├── QUICK_WINS_ROADMAP.md
│   ├── SECURITY_REVIEW.md
│   └── debugging/
│       └── drill-catalog-loading.md
├── deployment/                   ← Deployment guides
│   ├── FIREBASE_SECRETS_CI.md
│   └── GITHUB_ACTIONS.md
├── archive/                      ← Historical docs
│   └── LAUNCH_TIMELINE.md
└── branding/                     ← Brand assets
    └── (PDF guideline moved here)
```

---

## 🆘 Need Help?

### Common Questions

**Q: How do I set up the project locally?**
A: [Getting Started Guide](./setup/GETTING_STARTED.md)

**Q: Drills won't load - what's wrong?**
A: [Firebase Setup Troubleshooting](./setup/FIREBASE_SETUP.md#troubleshooting)

**Q: How do I run tests?**
A: [E2E Testing Guide](./testing/E2E_TESTING.md)

**Q: How do I deploy to production?**
A: [Getting Started Guide - Step 8](./setup/GETTING_STARTED.md#step-8-deploy-to-vercel)

**Q: What's the roadmap for features?**
A: [Quick Wins Roadmap](./development/QUICK_WINS_ROADMAP.md)

### Debugging Resources

- [Drill Catalog Loading](./development/debugging/drill-catalog-loading.md) - Firebase config issues
- [Firebase Setup Troubleshooting](./setup/FIREBASE_SETUP.md#troubleshooting) - Common setup errors
- [E2E Testing Troubleshooting](./testing/E2E_TESTING.md#troubleshooting) - Test failures

---

## 📚 External Documentation

### Technologies Used

- [Next.js 15](https://nextjs.org/docs) - App framework
- [React 19](https://react.dev/) - UI library
- [TypeScript](https://www.typescriptlang.org/docs/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/docs) - Styling
- [Firebase](https://firebase.google.com/docs) - Backend services
- [Playwright](https://playwright.dev/) - E2E testing
- [Vercel](https://vercel.com/docs) - Deployment platform

### Tools & Services

- [Firestore](https://firebase.google.com/docs/firestore) - Database
- [Firebase Auth](https://firebase.google.com/docs/auth) - Authentication
- [Resend](https://resend.com/docs) - Email service
- [GitHub Actions](https://docs.github.com/en/actions) - CI/CD

---

## 🔄 Recently Updated

- **2026-01-14:** Reorganized all documentation into logical structure
- **2026-01-14:** Created comprehensive setup guides
- **2026-01-14:** Consolidated Firebase documentation
- **2026-01-14:** Added documentation index (this file)

---

## 📌 Quick Links

**Most important docs:**
- [Getting Started](./setup/GETTING_STARTED.md) ⭐
- [Firebase Setup](./setup/FIREBASE_SETUP.md) ⭐
- [E2E Testing](./testing/E2E_TESTING.md) ⭐
- [User Journey Audit](./guides/USER_JOURNEY_AUDIT.md) ⭐

**Main README:** [../README.md](../README.md)

---

*Last updated: 2026-01-14*
