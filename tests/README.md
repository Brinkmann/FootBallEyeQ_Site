# E2E Test Suite for Football EyeQ

This directory contains comprehensive end-to-end tests for the Football EyeQ application using Playwright.

## Overview

The test suite covers:
- **Navigation & Routing**: All navigation links and routing functionality
- **Drill Catalogue**: Browse, search, filter, and add drills
- **Authentication**: Signup, login, logout, and protected routes
- **Session Planner**: Add/remove drills, manage sessions, generate codes
- **User Journeys**: Complete flows from browsing to saving sessions

## Structure

```
tests/
├── e2e/                          # Test specifications
│   ├── navigation.spec.ts        # Navigation and routing tests
│   ├── catalog.spec.ts           # Drill catalogue tests
│   ├── auth.spec.ts              # Authentication flow tests
│   ├── planner.spec.ts           # Session planner tests
│   ├── user-journey.spec.ts      # End-to-end user journey tests
│   └── catalog-and-planner.spec.ts # Original tests
├── pages/                        # Page Object Models
│   ├── BasePage.ts               # Base page with common methods
│   ├── NavigationComponent.ts    # Navigation component
│   ├── HomePage.ts               # Home page
│   ├── CatalogPage.ts            # Catalog page
│   ├── PlannerPage.ts            # Planner page
│   ├── LoginPage.ts              # Login page
│   └── SignupPage.ts             # Signup page
├── fixtures/                     # Test data and fixtures
│   ├── exercises.ts              # Exercise fixture data
│   └── test-data.ts              # Test user and data constants
└── helpers/                      # Test utilities
    └── test-helpers.ts           # Mock functions and utilities
```

## Running Tests

### Prerequisites

```bash
# Install dependencies
npm install
```

### Run All Tests

```bash
npm run test:e2e
```

### Run Specific Test File

```bash
npx playwright test tests/e2e/catalog.spec.ts
```

### Run Tests in Headed Mode (see browser)

```bash
npx playwright test --headed
```

### Run Tests in UI Mode (interactive)

```bash
npx playwright test --ui
```

### Run Specific Test by Name

```bash
npx playwright test -g "should navigate to catalog"
```

### Run Tests for Specific Browser

```bash
# Chromium only
npx playwright test --project=chromium

# WebKit only
npx playwright test --project=webkit
```

## Test Configuration

Tests are configured in `playwright.config.ts`:
- **Base URL**: `http://localhost:5000` (or `process.env.BASE_URL`)
- **Timeout**: 120 seconds per test
- **Screenshots**: On failure only
- **Videos**: Retained on failure
- **Trace**: On first retry

## Environment Setup

### Local Development Server

Tests expect the application to be running on port 5000:

```bash
npm run dev
```

### Custom Base URL

Set a custom base URL using environment variable:

```bash
BASE_URL=https://football-eyeq.com npm run test:e2e
```

## Test Patterns

### Page Object Model (POM)

All tests use the Page Object Model pattern for maintainability:

```typescript
import { CatalogPage } from '../pages/CatalogPage';

test('should search drills', async ({ page }) => {
  const catalogPage = new CatalogPage(page);
  await catalogPage.navigate();
  await catalogPage.search('rondo');
  // assertions...
});
```

### Mocking Firebase

Tests mock Firebase services to avoid external dependencies:

```typescript
import { mockFirebase } from '../helpers/test-helpers';

test.beforeEach(async ({ page }) => {
  await mockFirebase(page);
});
```

### Authentication Mocking

Mock successful or failed authentication:

```typescript
import { mockAuthSuccess, mockAuthFailure } from '../helpers/test-helpers';

// Mock successful login
await mockAuthSuccess(page);

// Mock failed login
await mockAuthFailure(page, 'INVALID_PASSWORD');
```

## Test Coverage

### Navigation Tests (17 tests)
- Header navigation
- Mobile menu navigation
- Footer navigation
- Learn dropdown navigation
- Browser back/forward buttons
- Active state highlighting

### Catalog Tests (22 tests)
- Browse drills without auth
- Search functionality
- Filter by age group, difficulty, game moment
- Exercise type switching (EyeQ/Plastic)
- Add to plan functionality
- Error handling and retry

### Authentication Tests (20 tests)
- Login with valid/invalid credentials
- Signup new users
- Form validation
- Logout functionality
- Protected routes
- Session persistence

### Planner Tests (22 tests)
- Display 12-session plan
- Add/remove drills
- Session locking (free tier)
- Session code generation
- Edit session names
- Data persistence

### User Journey Tests (8 tests)
- Complete signup → browse → add drill → save flow
- Guest to authenticated user flow
- Multi-session planning
- Exercise type switching
- Mobile user journey
- Error recovery

## Debugging Tests

### View Test Report

```bash
npx playwright show-report
```

### Debug Specific Test

```bash
npx playwright test --debug -g "test name"
```

### Generate Trace

```bash
npx playwright test --trace on
npx playwright show-trace trace.zip
```

## CI/CD Integration

The tests are designed to run in CI environments:

```bash
# Install browsers in CI
npx playwright install --with-deps

# Run tests in CI mode
CI=true npm run test:e2e
```

## Best Practices

1. **Use Page Objects**: Always use page objects for element interactions
2. **Mock External Services**: Mock Firebase and other external services
3. **Descriptive Test Names**: Use clear, descriptive test names
4. **Independent Tests**: Each test should be independent and isolated
5. **Proper Waits**: Use explicit waits, avoid arbitrary timeouts
6. **Clean Up**: Clear sessions and cookies between tests
7. **Assertions**: Use meaningful assertions with good error messages

## Troubleshooting

### Tests timing out
- Increase timeout in `playwright.config.ts`
- Check if dev server is running
- Verify BASE_URL is correct

### Tests failing on CI but passing locally
- Ensure browsers are installed in CI
- Check for timing issues (use proper waits)
- Verify environment variables

### Firebase mocking issues
- Ensure `mockFirebase` is called in `beforeEach`
- Check route patterns match actual requests
- Verify fixture data is correct

## Contributing

When adding new tests:
1. Create page objects for new pages
2. Add test data to fixtures
3. Follow existing test patterns
4. Add meaningful descriptions
5. Update this README if needed

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Page Object Model](https://playwright.dev/docs/pom)
- [Best Practices](https://playwright.dev/docs/best-practices)
