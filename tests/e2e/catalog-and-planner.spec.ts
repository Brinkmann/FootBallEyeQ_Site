import { test, expect, Page } from '@playwright/test';
import { firestoreRunQueryResponse } from '../fixtures/exercises';

const mockFirebase = async (page: Page) => {
  // Firestore queries
  await page.route('**/firestore.googleapis.com/**', async (route) => {
    if (route.request().method() === 'POST') {
      const body = route.request().postDataJSON() as any;
      const collection = body?.structuredQuery?.from?.[0]?.collectionId ?? '';
      const response = firestoreRunQueryResponse(collection);
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(response) });
      return;
    }
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
  });

  // Auth endpoints
  await page.route('**/identitytoolkit.googleapis.com/**', (route) => route.fulfill({ status: 200, body: '{}' }));
  await page.route('**/securetoken.googleapis.com/**', (route) => route.fulfill({ status: 200, body: '{}' }));
};

test.beforeEach(async ({ page }) => {
  await mockFirebase(page);
});

test('CAT-01/02/03: catalogue search, filters, and exercise-type switch', async ({ page }) => {
  await page.goto('/catalog');

  // Confirm fixtures render
  await expect(page.getByRole('heading', { name: /Rondo Awareness/ })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Counter-Press Sprint/ })).toBeVisible();
  await expect(page.getByRole('heading', { name: /First-Touch Finishing/ })).toBeVisible();

  // Search AND logic: only rondo remains
  await page.getByPlaceholder('Search or type to filter...').fill('rondo build-up');
  await expect(page.getByRole('heading', { name: /Rondo Awareness/ })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Counter-Press Sprint/ })).toHaveCount(0);

  // Faceted filters
  await page.getByRole('button', { name: 'Filters' }).click();
  await page.getByRole('button', { name: 'Age Group' }).click();
  await page.getByRole('button', { name: /Youth Development Phase/ }).click();
  await page.getByRole('button', { name: 'Difficulty' }).click();
  await page.getByRole('button', { name: 'Moderate' }).click();
  await page.getByRole('button', { name: 'Close' }).click();
  await expect(page.getByRole('heading', { name: /Rondo Awareness/ })).toBeVisible();

  // Switch to plastic drills
  await page.getByText('Plastic Cones', { exact: false }).click();
  await expect(page.getByRole('heading', { name: /First-Touch Finishing/ })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Rondo Awareness/ })).toHaveCount(0);
});

test('PLAN-02/03/05: add/remove drill, locking, and session code generation', async ({ page }) => {
  await page.goto('/catalog');
  await page.getByRole('heading', { name: /Rondo Awareness/ }).scrollIntoViewIfNeeded();
  await page.getByRole('button', { name: 'Add to Plan' }).first().click();
  await page.getByRole('button', { name: 'Session 1' }).click();

  await page.goto('/planner');
  await expect(page.getByRole('heading', { name: '12-Session Season Plan' })).toBeVisible();

  // Session 1 populated; Session 2 locked for free tier
  await expect(page.getByText('Session 1').first()).toBeVisible();
  await expect(page.getByText('Session 2').nth(1)).toBeVisible();
  await expect(page.getByText('Locked')).toBeVisible();

  // Remove the drill
  await page.getByRole('button', { name: 'Remove' }).click();
  await expect(page.getByText('Empty slot')).toBeVisible();

  // Add again and generate session code
  await page.goto('/catalog');
  await page.getByRole('button', { name: 'Add to Plan' }).first().click();
  await page.getByRole('button', { name: 'Session 1' }).click();
  await page.goto('/planner');
  await page.getByRole('button', { name: 'Generate Code' }).click();
  await expect(page.getByText('Session Code (6 characters):')).toBeVisible();
});

test('CAT-05: empty state and retry on catalogue load failure', async ({ page }) => {
  await page.route('**/firestore.googleapis.com/**', (route) => route.fulfill({ status: 500, contentType: 'application/json', body: '{}' }));
  await page.goto('/catalog');
  await expect(page.getByText("We couldn't load drills right now.")).toBeVisible();
  await expect(page.getByRole('button', { name: 'Retry loading drills' })).toBeVisible();
});

