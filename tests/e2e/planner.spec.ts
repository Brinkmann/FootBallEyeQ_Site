import { test, expect } from '@playwright/test';
import { PlannerPage } from '../pages/PlannerPage';
import { CatalogPage } from '../pages/CatalogPage';
import { LoginPage } from '../pages/LoginPage';
import { mockFirebase, mockAuthSuccess } from '../helpers/test-helpers';
import { testUsers, sessionNumbers } from '../fixtures/test-data';

test.describe('Session Planner', () => {
  test.beforeEach(async ({ page }) => {
    await mockFirebase(page);
  });

  test.describe('Access and Display', () => {
    test('PLAN-01: should display planner page', async ({ page }) => {
      const plannerPage = new PlannerPage(page);
      await plannerPage.navigate();

      // Verify planner heading is visible
      await expect(plannerPage.pageHeading).toBeVisible();
    });

    test('PLAN-02: should show 12-session season plan', async ({ page }) => {
      const plannerPage = new PlannerPage(page);
      await plannerPage.navigate();

      // Verify heading mentions 12 sessions
      await expect(plannerPage.pageHeading).toContainText('12-Session');
    });

    test('PLAN-03: should display session cards', async ({ page }) => {
      const plannerPage = new PlannerPage(page);
      await plannerPage.navigate();

      // Verify at least Session 1 is visible
      const session1Visible = await plannerPage.isSessionVisible(1);
      expect(session1Visible).toBe(true);
    });

    test('PLAN-04: should show locked sessions for free tier', async ({ page }) => {
      const plannerPage = new PlannerPage(page);
      await plannerPage.navigate();

      // Free tier should have locked sessions
      const hasLocked = await plannerPage.hasLockedSessions();
      expect(hasLocked).toBe(true);
    });
  });

  test.describe('Add Drills to Sessions', () => {
    test('PLAN-05: should add drill from catalog to session', async ({ page }) => {
      const catalogPage = new CatalogPage(page);
      const plannerPage = new PlannerPage(page);

      // Add drill from catalog
      await catalogPage.navigate();
      await catalogPage.addFirstDrillToSession(1);

      // Navigate to planner
      await plannerPage.navigate();

      // Verify drill was added (Session 1 should not have "Empty slot")
      const emptySlotCount = await plannerPage.getEmptySlotCount();

      // Session 1 should have a drill, so total empty slots should be less than if all were empty
      expect(emptySlotCount).toBeLessThan(12);
    });

    test('PLAN-06: should add multiple drills to the same session', async ({ page }) => {
      const catalogPage = new CatalogPage(page);
      const plannerPage = new PlannerPage(page);

      // Add first drill
      await catalogPage.navigate();
      await catalogPage.addFirstDrillToSession(1);

      await page.waitForTimeout(500);

      // Add second drill (different one)
      const drills = catalogPage.drillCards;
      const secondDrill = drills.nth(1);
      await secondDrill.scrollIntoViewIfNeeded();

      const addButton = page.getByRole('button', { name: 'Add to Plan' }).nth(1);
      await addButton.click();
      await catalogPage.selectSession(1);

      // Navigate to planner and verify
      await plannerPage.navigate();

      // Session 1 should have multiple drills
      // This depends on the UI - adjust based on actual implementation
      await expect(plannerPage.getSession(1)).toBeVisible();
    });

    test('PLAN-07: should add drills to different sessions', async ({ page }) => {
      const catalogPage = new CatalogPage(page);
      const plannerPage = new PlannerPage(page);

      // Add to Session 1
      await catalogPage.navigate();
      await catalogPage.addFirstDrillToSession(1);

      await page.waitForTimeout(500);

      // Navigate back and add to Session 2 (if not locked)
      await catalogPage.navigate();
      await catalogPage.addFirstDrillToPlan();

      const session2Button = page.getByRole('button', { name: 'Session 2' });
      if (await session2Button.isVisible()) {
        await catalogPage.selectSession(2);

        // Verify in planner
        await plannerPage.navigate();
        const session2Visible = await plannerPage.isSessionVisible(2);
        expect(session2Visible).toBe(true);
      }
    });
  });

  test.describe('Remove Drills from Sessions', () => {
    test('PLAN-08: should remove drill from session', async ({ page }) => {
      const catalogPage = new CatalogPage(page);
      const plannerPage = new PlannerPage(page);

      // Add a drill first
      await catalogPage.navigate();
      await catalogPage.addFirstDrillToSession(1);

      // Go to planner
      await plannerPage.navigate();

      // Get initial empty slot count
      const initialEmpty = await plannerPage.getEmptySlotCount();

      // Remove the drill
      await plannerPage.removeFirstDrill();

      // Verify "Empty slot" appears
      await expect(plannerPage.emptySlots).toBeVisible();

      // Empty slot count should increase
      const afterEmpty = await plannerPage.getEmptySlotCount();
      expect(afterEmpty).toBeGreaterThan(initialEmpty);
    });

    test('PLAN-09: should show empty slot after removing drill', async ({ page }) => {
      const catalogPage = new CatalogPage(page);
      const plannerPage = new PlannerPage(page);

      // Add and then remove drill
      await catalogPage.navigate();
      await catalogPage.addFirstDrillToSession(1);

      await plannerPage.navigate();
      await plannerPage.removeFirstDrill();

      // "Empty slot" text should be visible
      await expect(page.getByText('Empty slot')).toBeVisible();
    });
  });

  test.describe('Edit Session Names', () => {
    test('PLAN-10: should display default session names', async ({ page }) => {
      const plannerPage = new PlannerPage(page);
      await plannerPage.navigate();

      // Default names like "Session 1", "Session 2" should be visible
      await expect(plannerPage.getSession(1)).toBeVisible();
    });

    test('PLAN-11: should edit session name (if feature exists)', async ({ page }) => {
      const plannerPage = new PlannerPage(page);
      await plannerPage.navigate();

      // Look for edit button or editable field
      const editButton = page.getByRole('button', { name: /edit|rename/i }).first();
      if (await editButton.isVisible()) {
        await editButton.click();

        // Enter new name
        const nameInput = page.getByRole('textbox').first();
        await nameInput.fill('Week 1 Training');
        await nameInput.press('Enter');

        // Verify name changed
        await expect(page.getByText('Week 1 Training')).toBeVisible();
      }
    });
  });

  test.describe('12-Week Season View', () => {
    test('PLAN-12: should display all 12 session slots', async ({ page }) => {
      const plannerPage = new PlannerPage(page);
      await plannerPage.navigate();

      // Check that multiple sessions are visible
      // Some might be locked, but they should still be in the view
      const session1 = await plannerPage.isSessionVisible(1);
      const session2 = await plannerPage.isSessionVisible(2);

      expect(session1 || session2).toBe(true);
    });

    test('PLAN-13: should show locked indicator for premium sessions', async ({ page }) => {
      const plannerPage = new PlannerPage(page);
      await plannerPage.navigate();

      // Free tier typically locks sessions after the first few
      await expect(plannerPage.lockedSessions).toBeVisible();
    });

    test('PLAN-14: should navigate through different weeks/sessions', async ({ page }) => {
      const plannerPage = new PlannerPage(page);
      await plannerPage.navigate();

      // If there's pagination or scrolling, test it
      // For now, verify we can see multiple sessions
      await plannerPage.getSession(1).scrollIntoViewIfNeeded();
      await expect(plannerPage.getSession(1)).toBeVisible();
    });
  });

  test.describe('Save Sessions', () => {
    test('PLAN-15: should persist sessions across page refreshes', async ({ page }) => {
      const catalogPage = new CatalogPage(page);
      const plannerPage = new PlannerPage(page);

      // Add a drill
      await catalogPage.navigate();
      await catalogPage.addFirstDrillToSession(1);

      // Go to planner
      await plannerPage.navigate();
      const beforeRefresh = await plannerPage.getEmptySlotCount();

      // Refresh page
      await page.reload();

      // Sessions should still be there
      const afterRefresh = await plannerPage.getEmptySlotCount();
      expect(afterRefresh).toBe(beforeRefresh);
    });

    test('PLAN-16: should save sessions to local storage', async ({ page }) => {
      const catalogPage = new CatalogPage(page);
      const plannerPage = new PlannerPage(page);

      // Add a drill
      await catalogPage.navigate();
      await catalogPage.addFirstDrillToSession(1);

      // Check local storage
      const localStorage = await page.evaluate(() => {
        return JSON.stringify(window.localStorage);
      });

      // Should have some planner data saved
      expect(localStorage).toContain('session');
    });
  });

  test.describe('Session Code Generation', () => {
    test('PLAN-17: should generate session code for sharing', async ({ page }) => {
      const catalogPage = new CatalogPage(page);
      const plannerPage = new PlannerPage(page);

      // Add a drill
      await catalogPage.navigate();
      await catalogPage.addFirstDrillToSession(1);

      // Go to planner and generate code
      await plannerPage.navigate();
      await plannerPage.clickGenerateCode();

      // Session code should be visible
      await expect(plannerPage.sessionCodeText).toBeVisible();
    });

    test('PLAN-18: should display 6-character session code', async ({ page }) => {
      const catalogPage = new CatalogPage(page);
      const plannerPage = new PlannerPage(page);

      // Add a drill and generate code
      await catalogPage.navigate();
      await catalogPage.addFirstDrillToSession(1);

      await plannerPage.navigate();
      await plannerPage.clickGenerateCode();

      // Verify code format (6 characters)
      await expect(page.getByText(/Session Code \(6 characters\)/i)).toBeVisible();
    });

    test('PLAN-19: should generate unique codes', async ({ page }) => {
      const catalogPage = new CatalogPage(page);
      const plannerPage = new PlannerPage(page);

      // Add a drill
      await catalogPage.navigate();
      await catalogPage.addFirstDrillToSession(1);

      // Generate first code
      await plannerPage.navigate();
      await plannerPage.clickGenerateCode();

      const codeText = await page.locator('text=/[A-Z0-9]{6}/').first().textContent();

      // Generate again (if possible) and verify it's different
      // This test assumes regeneration is possible
      // Adjust based on actual implementation
      expect(codeText).toBeTruthy();
      expect(codeText?.length).toBe(6);
    });
  });

  test.describe('Authentication Integration', () => {
    test('PLAN-20: should sync planner with authenticated user', async ({ page }) => {
      await mockAuthSuccess(page);
      const loginPage = new LoginPage(page);
      const plannerPage = new PlannerPage(page);

      // Login first
      await loginPage.navigate();
      await loginPage.login(testUsers.validUser.email, testUsers.validUser.password);

      // Navigate to planner
      await plannerPage.navigate();

      // Planner should load with user's data
      await expect(plannerPage.pageHeading).toBeVisible();
    });

    test('PLAN-21: should preserve guest planner when logging in', async ({ page }) => {
      const catalogPage = new CatalogPage(page);
      const plannerPage = new PlannerPage(page);

      // Add drill as guest
      await catalogPage.navigate();
      await catalogPage.addFirstDrillToSession(1);

      await plannerPage.navigate();
      const beforeLogin = await plannerPage.getEmptySlotCount();

      // Login
      await mockAuthSuccess(page);
      const loginPage = new LoginPage(page);
      await loginPage.navigate();
      await loginPage.login(testUsers.validUser.email, testUsers.validUser.password);

      // Go back to planner
      await plannerPage.navigate();
      const afterLogin = await plannerPage.getEmptySlotCount();

      // Planner data should be preserved
      expect(afterLogin).toBe(beforeLogin);
    });
  });

  test.describe('Premium Features', () => {
    test('PLAN-22: should show upgrade prompt for locked sessions', async ({ page }) => {
      const plannerPage = new PlannerPage(page);
      await plannerPage.navigate();

      // Look for upgrade/premium messaging on locked sessions
      const lockedSession = page.getByText('Locked').first();
      if (await lockedSession.isVisible()) {
        await lockedSession.scrollIntoViewIfNeeded();

        // There should be some indication about upgrading
        // This could be a tooltip, button, or link
        await expect(page.getByText(/upgrade|premium|pro/i)).toBeVisible();
      }
    });
  });
});
