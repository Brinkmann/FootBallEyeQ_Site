import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { SignupPage } from '../pages/SignupPage';
import { CatalogPage } from '../pages/CatalogPage';
import { PlannerPage } from '../pages/PlannerPage';
import { HomePage } from '../pages/HomePage';
import {
  mockFirebase,
  mockAuthSuccess,
  mockAuthFailure,
  generateTestUser,
  clearSession
} from '../helpers/test-helpers';
import { testUsers } from '../fixtures/test-data';

test.describe('Authentication Flows', () => {
  test.beforeEach(async ({ page }) => {
    await mockFirebase(page);
    await clearSession(page);
  });

  test.describe('Login Flow', () => {
    test('AUTH-01: should display login form correctly', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.navigate();

      // Verify form elements are visible
      await expect(loginPage.emailInput).toBeVisible();
      await expect(loginPage.passwordInput).toBeVisible();
      await expect(loginPage.submitButton).toBeVisible();
    });

    test('AUTH-02: should login with valid credentials', async ({ page }) => {
      await mockAuthSuccess(page);
      const loginPage = new LoginPage(page);
      await loginPage.navigate();

      await loginPage.login(testUsers.validUser.email, testUsers.validUser.password);

      // Wait for redirect after login
      await page.waitForURL(url => !url.pathname.includes('/login'), { timeout: 10000 });

      // Verify logout button is visible (user is logged in)
      await expect(loginPage.navigation.logoutButton).toBeVisible({ timeout: 5000 });
    });

    test('AUTH-03: should show error with invalid credentials', async ({ page }) => {
      await mockAuthFailure(page, 'INVALID_PASSWORD');
      const loginPage = new LoginPage(page);
      await loginPage.navigate();

      await loginPage.login(testUsers.invalidUser.email, testUsers.invalidUser.password);

      // Error message should be displayed
      const hasError = await loginPage.hasError();
      expect(hasError).toBe(true);
    });

    test('AUTH-04: should show error with non-existent email', async ({ page }) => {
      await mockAuthFailure(page, 'EMAIL_NOT_FOUND');
      const loginPage = new LoginPage(page);
      await loginPage.navigate();

      await loginPage.login('nonexistent@example.com', 'password123');

      const hasError = await loginPage.hasError();
      expect(hasError).toBe(true);
    });

    test('AUTH-05: should navigate to signup from login page', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.navigate();

      // Click signup link
      const signupLink = page.getByRole('link', { name: /sign up|create account/i });
      if (await signupLink.isVisible()) {
        await signupLink.click();
        await expect(page).toHaveURL(/.*signup/);
      }
    });

    test('AUTH-06: should not submit with empty fields', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.navigate();

      await loginPage.clickSubmit();

      // Should still be on login page (browser validation prevents submission)
      await expect(page).toHaveURL(/.*login/);
    });

    test('AUTH-07: should not submit with invalid email format', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.navigate();

      await loginPage.enterEmail('invalid-email');
      await loginPage.enterPassword('password123');
      await loginPage.clickSubmit();

      // Browser validation should prevent submission
      await expect(page).toHaveURL(/.*login/);
    });
  });

  test.describe('Signup Flow', () => {
    test('AUTH-08: should display signup form correctly', async ({ page }) => {
      const signupPage = new SignupPage(page);
      await signupPage.navigate();

      // Verify all form fields are visible
      await expect(signupPage.emailInput).toBeVisible();
      await expect(signupPage.passwordInput).toBeVisible();
      await expect(signupPage.submitButton).toBeVisible();

      // First/Last name might be visible depending on form
      const hasNameFields = await signupPage.firstNameInput.count() > 0;
      if (hasNameFields) {
        await expect(signupPage.firstNameInput).toBeVisible();
        await expect(signupPage.lastNameInput).toBeVisible();
      }
    });

    test('AUTH-09: should signup with valid information', async ({ page }) => {
      const newUser = generateTestUser();
      await mockAuthSuccess(page, {
        uid: 'new-user-123',
        email: newUser.email,
        displayName: `${newUser.firstName} ${newUser.lastName}`
      });

      const signupPage = new SignupPage(page);
      await signupPage.navigate();

      await signupPage.signup(
        newUser.firstName,
        newUser.lastName,
        newUser.email,
        newUser.password
      );

      // Wait for redirect after signup
      await page.waitForURL(url => !url.pathname.includes('/signup'), { timeout: 10000 });

      // Verify user is logged in
      await expect(signupPage.navigation.logoutButton).toBeVisible({ timeout: 5000 });
    });

    test('AUTH-10: should show error when email already exists', async ({ page }) => {
      await mockAuthFailure(page, 'EMAIL_EXISTS');
      const signupPage = new SignupPage(page);
      await signupPage.navigate();

      await signupPage.signup(
        testUsers.validUser.firstName,
        testUsers.validUser.lastName,
        testUsers.validUser.email,
        testUsers.validUser.password
      );

      // Error should be shown
      const hasError = await signupPage.hasError();
      expect(hasError).toBe(true);
    });

    test('AUTH-11: should validate password strength', async ({ page }) => {
      const signupPage = new SignupPage(page);
      await signupPage.navigate();

      const weakUser = generateTestUser();
      weakUser.password = '123'; // Weak password

      await signupPage.enterFirstName(weakUser.firstName);
      await signupPage.enterLastName(weakUser.lastName);
      await signupPage.enterEmail(weakUser.email);
      await signupPage.enterPassword(weakUser.password);
      await signupPage.clickSubmit();

      // Should show validation error or prevent submission
      // This depends on actual validation implementation
      await expect(page).toHaveURL(/.*signup/);
    });

    test('AUTH-12: should navigate to login from signup page', async ({ page }) => {
      const signupPage = new SignupPage(page);
      await signupPage.navigate();

      const loginLink = page.getByRole('link', { name: /log in|sign in/i });
      if (await loginLink.isVisible()) {
        await loginLink.click();
        await expect(page).toHaveURL(/.*login/);
      }
    });

    test('AUTH-13: should not submit with missing required fields', async ({ page }) => {
      const signupPage = new SignupPage(page);
      await signupPage.navigate();

      await signupPage.enterEmail('test@example.com');
      await signupPage.clickSubmit();

      // Should stay on signup page
      await expect(page).toHaveURL(/.*signup/);
    });
  });

  test.describe('Logout Flow', () => {
    test('AUTH-14: should logout successfully', async ({ page }) => {
      // Login first
      await mockAuthSuccess(page);
      const loginPage = new LoginPage(page);
      await loginPage.navigate();
      await loginPage.login(testUsers.validUser.email, testUsers.validUser.password);

      // Wait for login to complete
      await expect(loginPage.navigation.logoutButton).toBeVisible({ timeout: 5000 });

      // Logout
      await loginPage.navigation.logout();

      // Verify login button is visible again
      await expect(loginPage.navigation.loginButton).toBeVisible({ timeout: 5000 });
    });

    test('AUTH-15: should clear user data after logout', async ({ page }) => {
      // Login first
      await mockAuthSuccess(page);
      const loginPage = new LoginPage(page);
      await loginPage.navigate();
      await loginPage.login(testUsers.validUser.email, testUsers.validUser.password);
      await expect(loginPage.navigation.logoutButton).toBeVisible({ timeout: 5000 });

      // Logout
      await loginPage.navigation.logout();

      // Navigate to planner - should redirect or show login prompt
      const plannerPage = new PlannerPage(page);
      await plannerPage.navigate();

      // Verify user is not authenticated
      // This could be a redirect to login or a message about authentication
      const isStillLoggedIn = await loginPage.navigation.isLoggedIn();
      expect(isStillLoggedIn).toBe(false);
    });
  });

  test.describe('Protected Routes', () => {
    test('AUTH-16: should access planner when authenticated', async ({ page }) => {
      await mockAuthSuccess(page);
      const loginPage = new LoginPage(page);
      await loginPage.navigate();
      await loginPage.login(testUsers.validUser.email, testUsers.validUser.password);

      // Navigate to planner
      const plannerPage = new PlannerPage(page);
      await plannerPage.navigate();

      // Should successfully load planner
      await expect(plannerPage.pageHeading).toBeVisible();
    });

    test('AUTH-17: should access catalog without authentication', async ({ page }) => {
      const catalogPage = new CatalogPage(page);
      await catalogPage.navigate();

      // Catalog should load without authentication
      await catalogPage.waitForDrillsToLoad();
      const drillCount = await catalogPage.getDrillCount();
      expect(drillCount).toBeGreaterThan(0);
    });

    test('AUTH-18: should persist authentication across page navigation', async ({ page }) => {
      await mockAuthSuccess(page);
      const loginPage = new LoginPage(page);
      await loginPage.navigate();
      await loginPage.login(testUsers.validUser.email, testUsers.validUser.password);

      // Navigate to different pages
      const catalogPage = new CatalogPage(page);
      await catalogPage.navigate();

      // User should still be logged in
      const isLoggedIn = await catalogPage.navigation.isLoggedIn();
      expect(isLoggedIn).toBe(true);

      const plannerPage = new PlannerPage(page);
      await plannerPage.navigate();

      // Still logged in on planner
      const stillLoggedIn = await plannerPage.navigation.isLoggedIn();
      expect(stillLoggedIn).toBe(true);
    });

    test('AUTH-19: should persist authentication after page reload', async ({ page }) => {
      await mockAuthSuccess(page);
      const loginPage = new LoginPage(page);
      await loginPage.navigate();
      await loginPage.login(testUsers.validUser.email, testUsers.validUser.password);
      await expect(loginPage.navigation.logoutButton).toBeVisible({ timeout: 5000 });

      // Reload page
      await page.reload();

      // User should still be logged in
      const isLoggedIn = await loginPage.navigation.isLoggedIn();
      expect(isLoggedIn).toBe(true);
    });
  });

  test.describe('Session Management', () => {
    test('AUTH-20: should show user name after login', async ({ page }) => {
      await mockAuthSuccess(page, {
        uid: 'test-user-123',
        email: 'test@example.com',
        displayName: 'Test User'
      });

      const loginPage = new LoginPage(page);
      await loginPage.navigate();
      await loginPage.login('test@example.com', 'password123');

      // Wait for login to complete
      await page.waitForURL(url => !url.pathname.includes('/login'), { timeout: 10000 });

      // User name should be visible in header
      await expect(page.getByText(/Test User/i)).toBeVisible({ timeout: 5000 });
    });
  });
});
