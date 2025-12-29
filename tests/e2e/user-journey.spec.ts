import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { CatalogPage } from '../pages/CatalogPage';
import { SignupPage } from '../pages/SignupPage';
import { PlannerPage } from '../pages/PlannerPage';
import { LoginPage } from '../pages/LoginPage';
import { mockFirebase, mockAuthSuccess, generateTestUser, clearSession } from '../helpers/test-helpers';

test.describe('Core User Journey', () => {
  test.beforeEach(async ({ page }) => {
    await mockFirebase(page);
    await clearSession(page);
  });

  test('JOURNEY-01: Complete flow - Browse drill → Sign up → Add drill to session → Save session', async ({ page }) => {
    const homePage = new HomePage(page);
    const catalogPage = new CatalogPage(page);
    const signupPage = new SignupPage(page);
    const plannerPage = new PlannerPage(page);

    // Step 1: Start at home page
    await homePage.navigate();
    await expect(page).toHaveURL(/.*\/?$/);

    // Step 2: Navigate to catalog and browse drills
    await homePage.navigation.goToCatalog();
    await expect(page).toHaveURL(/.*catalog/);

    // Verify drills are loaded
    await catalogPage.waitForDrillsToLoad();
    const drillCount = await catalogPage.getDrillCount();
    expect(drillCount).toBeGreaterThan(0);

    // Step 3: Search for a specific drill
    await catalogPage.search('rondo');
    const rondoDrill = catalogPage.getDrillByTitle('Rondo Awareness');
    await expect(rondoDrill).toBeVisible();

    // Step 4: Navigate to signup (user decides to create account)
    await catalogPage.navigation.goToSignup();
    await expect(page).toHaveURL(/.*signup/);

    // Step 5: Sign up with new user
    const newUser = generateTestUser();
    await mockAuthSuccess(page, {
      uid: 'journey-user-123',
      email: newUser.email,
      displayName: `${newUser.firstName} ${newUser.lastName}`
    });

    await signupPage.signup(
      newUser.firstName,
      newUser.lastName,
      newUser.email,
      newUser.password
    );

    // Wait for signup to complete and redirect
    await page.waitForURL(url => !url.pathname.includes('/signup'), { timeout: 10000 });

    // Verify user is logged in
    await expect(signupPage.navigation.logoutButton).toBeVisible({ timeout: 5000 });

    // Step 6: Go back to catalog and add drill to session
    await catalogPage.navigate();
    await catalogPage.clearSearch(); // Clear previous search
    await catalogPage.addFirstDrillToSession(1);

    // Step 7: Navigate to planner to verify drill was added
    await plannerPage.navigate();
    await expect(plannerPage.pageHeading).toBeVisible();

    // Verify session has a drill (fewer empty slots)
    const emptySlots = await plannerPage.getEmptySlotCount();
    expect(emptySlots).toBeLessThan(12); // At least one slot should be filled

    // Step 8: Generate session code (save/share session)
    await plannerPage.clickGenerateCode();
    await expect(plannerPage.sessionCodeText).toBeVisible();

    // Step 9: Verify session persists after navigation
    await catalogPage.navigate();
    await plannerPage.navigate();

    // Session should still have the drill
    const emptyAfterNav = await plannerPage.getEmptySlotCount();
    expect(emptyAfterNav).toBe(emptySlots);
  });

  test('JOURNEY-02: Guest user flow - Browse → Add to plan → Login to save', async ({ page }) => {
    const catalogPage = new CatalogPage(page);
    const plannerPage = new PlannerPage(page);
    const loginPage = new LoginPage(page);

    // Step 1: Browse catalog as guest
    await catalogPage.navigate();
    await catalogPage.waitForDrillsToLoad();

    // Step 2: Add drills to plan as guest
    await catalogPage.addFirstDrillToSession(1);

    await page.waitForTimeout(500);

    // Add another drill
    const secondAddButton = page.getByRole('button', { name: 'Add to Plan' }).nth(1);
    if (await secondAddButton.isVisible()) {
      await secondAddButton.scrollIntoViewIfNeeded();
      await secondAddButton.click();
      await catalogPage.selectSession(1);
    }

    // Step 3: View planner as guest
    await plannerPage.navigate();
    const guestEmptySlots = await plannerPage.getEmptySlotCount();

    // Step 4: Decide to login to save progress
    await loginPage.navigate();

    // Mock successful login
    await mockAuthSuccess(page);
    await loginPage.login('existing@example.com', 'password123');

    // Wait for login to complete
    await page.waitForURL(url => !url.pathname.includes('/login'), { timeout: 10000 });

    // Step 5: Verify planner data is preserved
    await plannerPage.navigate();
    const afterLoginEmptySlots = await plannerPage.getEmptySlotCount();

    expect(afterLoginEmptySlots).toBe(guestEmptySlots);
  });

  test('JOURNEY-03: Returning user flow - Login → Browse catalog → Update plan', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const catalogPage = new CatalogPage(page);
    const plannerPage = new PlannerPage(page);

    // Step 1: Login as returning user
    await mockAuthSuccess(page);
    await loginPage.navigate();
    await loginPage.login('returning@example.com', 'password123');

    // Wait for login to complete
    await page.waitForURL(url => !url.pathname.includes('/login'), { timeout: 10000 });
    await expect(loginPage.navigation.logoutButton).toBeVisible({ timeout: 5000 });

    // Step 2: Navigate to catalog
    await catalogPage.navigate();
    await catalogPage.waitForDrillsToLoad();

    // Step 3: Use filters to find specific drills
    await catalogPage.openFilters();
    await catalogPage.selectFilter('Difficulty', 'Advanced');
    await catalogPage.closeFilters();

    // Step 4: Add filtered drill to plan
    await catalogPage.addFirstDrillToSession(1);

    // Step 5: Go to planner and verify
    await plannerPage.navigate();
    await expect(plannerPage.pageHeading).toBeVisible();

    // Step 6: Generate and share session
    await plannerPage.clickGenerateCode();
    await expect(plannerPage.sessionCodeText).toBeVisible();
  });

  test('JOURNEY-04: Multi-session planning flow', async ({ page }) => {
    const catalogPage = new CatalogPage(page);
    const plannerPage = new PlannerPage(page);

    // Step 1: Browse catalog
    await catalogPage.navigate();
    await catalogPage.waitForDrillsToLoad();

    // Step 2: Add drills to different sessions
    // Add to Session 1
    await catalogPage.addFirstDrillToSession(1);
    await page.waitForTimeout(500);

    // Add different drill to Session 1
    const drills = catalogPage.drillCards;
    const secondDrill = drills.nth(1);
    await secondDrill.scrollIntoViewIfNeeded();

    const addButton2 = page.getByRole('button', { name: 'Add to Plan' }).nth(1);
    if (await addButton2.isVisible()) {
      await addButton2.click();
      await catalogPage.selectSession(1);
      await page.waitForTimeout(500);
    }

    // Try to add to Session 2 (if not locked)
    const addButton3 = page.getByRole('button', { name: 'Add to Plan' }).nth(2);
    if (await addButton3.isVisible()) {
      await addButton3.scrollIntoViewIfNeeded();
      await addButton3.click();

      const session2Button = page.getByRole('button', { name: 'Session 2' });
      if (await session2Button.isVisible()) {
        await catalogPage.selectSession(2);
      }
    }

    // Step 3: Review planner
    await plannerPage.navigate();
    await expect(plannerPage.pageHeading).toBeVisible();

    // Verify sessions have drills
    const emptySlots = await plannerPage.getEmptySlotCount();
    expect(emptySlots).toBeLessThan(12);

    // Step 4: Edit plan by removing a drill
    if (await plannerPage.removeButtons.first().isVisible()) {
      const beforeRemove = await plannerPage.getEmptySlotCount();
      await plannerPage.removeFirstDrill();

      const afterRemove = await plannerPage.getEmptySlotCount();
      expect(afterRemove).toBeGreaterThan(beforeRemove);
    }
  });

  test('JOURNEY-05: Exercise type switching flow', async ({ page }) => {
    const catalogPage = new CatalogPage(page);
    const plannerPage = new PlannerPage(page);

    // Step 1: Browse EyeQ drills
    await catalogPage.navigate();
    await catalogPage.waitForDrillsToLoad();

    const eyeqDrill = catalogPage.getDrillByTitle('Rondo Awareness');
    await expect(eyeqDrill).toBeVisible();

    // Step 2: Add EyeQ drill to session
    await catalogPage.addFirstDrillToSession(1);

    // Step 3: Switch to Plastic cones
    await catalogPage.switchToPlastic();

    const plasticDrill = catalogPage.getDrillByTitle('First-Touch Finishing');
    await expect(plasticDrill).toBeVisible();

    // Step 4: Add Plastic drill to session
    await catalogPage.addFirstDrillToPlan();
    const sessionButton = page.getByRole('button', { name: 'Session 1' });
    if (await sessionButton.isVisible()) {
      await catalogPage.selectSession(1);
    }

    // Step 5: View combined planner
    await plannerPage.navigate();
    await expect(plannerPage.pageHeading).toBeVisible();

    // Both drill types should be in the planner
    const emptySlots = await plannerPage.getEmptySlotCount();
    expect(emptySlots).toBeLessThan(12);
  });

  test('JOURNEY-06: Search and filter combination flow', async ({ page }) => {
    const catalogPage = new CatalogPage(page);

    // Step 1: Navigate to catalog
    await catalogPage.navigate();
    await catalogPage.waitForDrillsToLoad();

    const initialCount = await catalogPage.getDrillCount();
    expect(initialCount).toBeGreaterThan(0);

    // Step 2: Apply search
    await catalogPage.search('sprint');
    const searchCount = await catalogPage.getDrillCount();

    // Step 3: Apply filters on top of search
    await catalogPage.openFilters();
    await catalogPage.selectFilter('Age Group', 'Performance Phase');
    await catalogPage.closeFilters();

    // Step 4: Verify combined filters work
    const filteredCount = await catalogPage.getDrillCount();
    expect(filteredCount).toBeLessThanOrEqual(searchCount);

    // Step 5: Clear search and verify filters still apply
    await catalogPage.clearSearch();
    await page.waitForTimeout(500);

    const afterClearCount = await catalogPage.getDrillCount();
    expect(afterClearCount).toBeGreaterThanOrEqual(filteredCount);
  });

  test('JOURNEY-07: Mobile user journey', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    const homePage = new HomePage(page);
    const catalogPage = new CatalogPage(page);
    const plannerPage = new PlannerPage(page);

    // Step 1: Start at home on mobile
    await homePage.navigate();

    // Step 2: Navigate using mobile menu
    await homePage.navigation.goToCatalog();
    await expect(page).toHaveURL(/.*catalog/);

    // Step 3: Browse and search on mobile
    await catalogPage.waitForDrillsToLoad();
    await catalogPage.search('finishing');

    // Step 4: Add drill to plan on mobile
    await catalogPage.addFirstDrillToSession(1);

    // Step 5: Navigate to planner
    await plannerPage.navigation.goToPlanner();
    await expect(plannerPage.pageHeading).toBeVisible();

    // Verify drill was added
    const emptySlots = await plannerPage.getEmptySlotCount();
    expect(emptySlots).toBeLessThan(12);
  });

  test('JOURNEY-08: Error recovery flow', async ({ page }) => {
    const catalogPage = new CatalogPage(page);

    // Step 1: Simulate error loading drills
    await page.route('**/firestore.googleapis.com/**', (route) =>
      route.fulfill({ status: 500, body: '{}' })
    );

    await catalogPage.navigate();

    // Step 2: Verify error state
    await expect(catalogPage.emptyStateMessage).toBeVisible();
    await expect(catalogPage.retryButton).toBeVisible();

    // Step 3: Fix connection and retry
    await mockFirebase(page);
    await catalogPage.clickRetry();

    // Step 4: Verify drills load successfully
    await catalogPage.waitForDrillsToLoad();
    const drillCount = await catalogPage.getDrillCount();
    expect(drillCount).toBeGreaterThan(0);

    // Step 5: Continue normal flow
    await catalogPage.addFirstDrillToSession(1);
  });
});
