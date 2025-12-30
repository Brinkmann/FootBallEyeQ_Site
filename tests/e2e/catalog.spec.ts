import { test, expect } from '@playwright/test';
import { CatalogPage } from '../pages/CatalogPage';
import { mockFirebase, mockFirestoreError } from '../helpers/test-helpers';
import { testDrills, catalogFilters } from '../fixtures/test-data';

test.describe('Drill Catalogue', () => {
  let catalogPage: CatalogPage;

  test.beforeEach(async ({ page }) => {
    await mockFirebase(page);
    catalogPage = new CatalogPage(page);
    await catalogPage.navigate();
  });

  test.describe('Browse Drills', () => {
    test('CAT-01: should display drill catalogue without authentication', async () => {
      // Verify page loads
      await expect(catalogPage.page).toHaveURL(/.*catalog/);

      // Verify drills are visible
      await catalogPage.waitForDrillsToLoad();
      const drillCount = await catalogPage.getDrillCount();
      expect(drillCount).toBeGreaterThan(0);
    });

    test('CAT-02: should display all fixture drills', async () => {
      // Verify all test drills are visible
      await expect(catalogPage.getDrillByTitle('Rondo Awareness')).toBeVisible();
      await expect(catalogPage.getDrillByTitle('Counter-Press Sprint')).toBeVisible();
      await expect(catalogPage.getDrillByTitle('First-Touch Finishing')).toBeVisible();
    });

    test('CAT-03: should show drill details when clicking on a drill', async ({ page }) => {
      const drillTitle = 'Rondo Awareness';

      // Note: This assumes clicking opens a detail view or modal
      // Adjust based on actual implementation
      await catalogPage.getDrillByTitle(drillTitle).click();

      // Verify drill details are shown (adjust selector based on actual UI)
      await expect(page.getByText(/overview|description/i)).toBeVisible();
    });
  });

  test.describe('Search Functionality', () => {
    test('CAT-04: should filter drills by search query', async () => {
      await catalogPage.search('rondo');

      // Only Rondo drill should be visible
      await expect(catalogPage.getDrillByTitle('Rondo Awareness')).toBeVisible();
      const drillCount = await catalogPage.getDrillCount();
      expect(drillCount).toBe(1);
    });

    test('CAT-05: should use AND logic for multiple search terms', async () => {
      await catalogPage.search('rondo build-up');

      // Only Rondo Awareness matches both terms
      await expect(catalogPage.getDrillByTitle('Rondo Awareness')).toBeVisible();
      await expect(catalogPage.getDrillByTitle('Counter-Press Sprint')).toHaveCount(0);
    });

    test('CAT-06: should show no results for non-matching search', async ({ page }) => {
      await catalogPage.search('nonexistentdrill12345');

      // No drills should match
      const drillCount = await catalogPage.getDrillCount();
      expect(drillCount).toBe(0);
    });

    test('CAT-07: should clear search and show all drills', async () => {
      await catalogPage.search('rondo');
      let drillCount = await catalogPage.getDrillCount();
      expect(drillCount).toBe(1);

      await catalogPage.clearSearch();
      await catalogPage.page.waitForTimeout(500); // Wait for filter to apply

      drillCount = await catalogPage.getDrillCount();
      expect(drillCount).toBeGreaterThan(1);
    });

    test('CAT-08: should be case-insensitive in search', async () => {
      await catalogPage.search('RONDO');

      await expect(catalogPage.getDrillByTitle('Rondo Awareness')).toBeVisible();
    });
  });

  test.describe('Filter Functionality', () => {
    test('CAT-09: should open and close filters panel', async () => {
      await catalogPage.openFilters();

      // Filters panel should be visible
      await expect(catalogPage.ageGroupFilter).toBeVisible();
      await expect(catalogPage.difficultyFilter).toBeVisible();

      await catalogPage.closeFilters();

      // Filters panel should be hidden
      await expect(catalogPage.ageGroupFilter).not.toBeVisible();
    });

    test('CAT-10: should filter by age group', async () => {
      await catalogPage.openFilters();
      await catalogPage.selectFilter('Age Group', 'Youth Development Phase');
      await catalogPage.closeFilters();

      // Only drills with Youth Development Phase should be visible
      await expect(catalogPage.getDrillByTitle('Rondo Awareness')).toBeVisible();
    });

    test('CAT-11: should filter by difficulty level', async () => {
      await catalogPage.openFilters();
      await catalogPage.selectFilter('Difficulty', 'Moderate');
      await catalogPage.closeFilters();

      // Only drills with Moderate difficulty should be visible
      await expect(catalogPage.getDrillByTitle('Rondo Awareness')).toBeVisible();
    });

    test('CAT-12: should apply multiple filters simultaneously', async () => {
      await catalogPage.openFilters();
      await catalogPage.selectFilter('Age Group', 'Youth Development Phase');
      await catalogPage.selectFilter('Difficulty', 'Moderate');
      await catalogPage.closeFilters();

      // Only drills matching both filters should be visible
      await expect(catalogPage.getDrillByTitle('Rondo Awareness')).toBeVisible();
      const drillCount = await catalogPage.getDrillCount();
      expect(drillCount).toBe(1);
    });

    test('CAT-13: should combine search and filters', async () => {
      await catalogPage.search('rondo build-up');
      await catalogPage.openFilters();
      await catalogPage.selectFilter('Age Group', 'Youth Development Phase');
      await catalogPage.selectFilter('Difficulty', 'Moderate');
      await catalogPage.closeFilters();

      // Rondo Awareness should match both search and filters
      await expect(catalogPage.getDrillByTitle('Rondo Awareness')).toBeVisible();
    });
  });

  test.describe('Exercise Type Switch', () => {
    test('CAT-14: should switch between EyeQ and Plastic drills', async () => {
      // Verify EyeQ drills are shown by default
      await expect(catalogPage.getDrillByTitle('Rondo Awareness')).toBeVisible();

      // Switch to Plastic drills
      await catalogPage.switchToPlastic();

      // Plastic drill should be visible, EyeQ drills hidden
      await expect(catalogPage.getDrillByTitle('First-Touch Finishing')).toBeVisible();
      await expect(catalogPage.getDrillByTitle('Rondo Awareness')).toHaveCount(0);
    });

    test('CAT-15: should maintain filters when switching exercise type', async () => {
      // Apply a filter
      await catalogPage.search('finishing');
      await catalogPage.switchToPlastic();

      // Search should still be applied
      await expect(catalogPage.getDrillByTitle('First-Touch Finishing')).toBeVisible();
    });

    test('CAT-16: should switch back from Plastic to EyeQ', async () => {
      await catalogPage.switchToPlastic();
      await expect(catalogPage.getDrillByTitle('First-Touch Finishing')).toBeVisible();

      await catalogPage.switchToEyeQ();

      await expect(catalogPage.getDrillByTitle('Rondo Awareness')).toBeVisible();
      await expect(catalogPage.getDrillByTitle('First-Touch Finishing')).toHaveCount(0);
    });
  });

  test.describe('Add to Plan', () => {
    test('CAT-17: should show session selector when clicking Add to Plan', async ({ page }) => {
      await catalogPage.addFirstDrillToPlan();

      // Session selector should appear
      await expect(page.getByRole('button', { name: 'Session 1' })).toBeVisible();
    });

    test('CAT-18: should close session selector after selecting session', async ({ page }) => {
      await catalogPage.addFirstDrillToSession(1);

      // Session selector should close
      await expect(page.getByRole('button', { name: 'Session 1' })).not.toBeVisible({ timeout: 2000 });
    });

    test('CAT-19: should add drill to multiple sessions', async ({ page }) => {
      // Add to Session 1
      await catalogPage.addFirstDrillToPlan();
      await catalogPage.selectSession(1);

      await page.waitForTimeout(500);

      // Add to Session 2 (if available)
      await catalogPage.addFirstDrillToPlan();
      const session2 = page.getByRole('button', { name: 'Session 2' });
      if (await session2.isVisible()) {
        await catalogPage.selectSession(2);
      }
    });
  });

  test.describe('Error Handling', () => {
    test('CAT-20: should show error state when drills fail to load', async ({ page }) => {
      // Create a new page with mocked error
      const errorPage = new CatalogPage(page);
      await mockFirestoreError(page);
      await errorPage.navigate();

      // Error message should be visible
      await expect(errorPage.emptyStateMessage).toBeVisible();
      await expect(errorPage.retryButton).toBeVisible();
    });

    test('CAT-21: should retry loading drills after error', async ({ page }) => {
      // Start with error
      await mockFirestoreError(page);
      const errorPage = new CatalogPage(page);
      await errorPage.navigate();

      await expect(errorPage.emptyStateMessage).toBeVisible();

      // Fix the mock and retry
      await mockFirebase(page);
      await errorPage.clickRetry();

      // Drills should now load
      await errorPage.waitForDrillsToLoad();
      const drillCount = await errorPage.getDrillCount();
      expect(drillCount).toBeGreaterThan(0);
    });
  });

  test.describe('Performance', () => {
    test('CAT-22: should load drills within acceptable time', async ({ page }) => {
      const startTime = Date.now();

      await catalogPage.navigate();
      await catalogPage.waitForDrillsToLoad();

      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(5000); // Should load within 5 seconds
    });
  });
});
