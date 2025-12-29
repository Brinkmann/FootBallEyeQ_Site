import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { CatalogPage } from '../pages/CatalogPage';
import { mockFirebase } from '../helpers/test-helpers';
import { navigationLinks } from '../fixtures/test-data';

test.describe('Navigation & Routing', () => {
  test.beforeEach(async ({ page }) => {
    await mockFirebase(page);
  });

  test.describe('Header Navigation', () => {
    test('NAV-01: should navigate to catalog from home page', async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.navigate();

      await homePage.navigation.goToCatalog();

      await expect(page).toHaveURL(/.*catalog/);
    });

    test('NAV-02: should navigate to planner from home page', async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.navigate();

      await homePage.navigation.goToPlanner();

      await expect(page).toHaveURL(/.*planner/);
    });

    test('NAV-03: should navigate to login page', async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.navigate();

      await homePage.navigation.goToLogin();

      await expect(page).toHaveURL(/.*login/);
    });

    test('NAV-04: should navigate to signup page', async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.navigate();

      await homePage.navigation.goToSignup();

      await expect(page).toHaveURL(/.*signup/);
    });

    test('NAV-05: should navigate back to home when clicking logo', async ({ page }) => {
      const catalogPage = new CatalogPage(page);
      await catalogPage.navigate();

      await catalogPage.navigation.clickLogo();

      await expect(page).toHaveURL(/.*\/?$/);
    });

    test('NAV-06: should navigate to all core links', async ({ page }) => {
      const homePage = new HomePage(page);

      for (const link of navigationLinks.core) {
        await homePage.navigate();

        const navLink = page.getByRole('link', { name: link.name })
          .or(page.getByRole('link', { name: link.name.split(' ')[0] })); // Handle shortened mobile names
        await navLink.first().click();

        await expect(page).toHaveURL(new RegExp(link.path));
      }
    });
  });

  test.describe('Mobile Navigation', () => {
    test.use({ viewport: { width: 375, height: 667 } }); // Mobile viewport

    test('NAV-07: should show mobile menu and navigate correctly', async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.navigate();

      // Mobile menu should show "More" button
      await expect(homePage.navigation.mobileMoreButton).toBeVisible();

      // Main links should still be accessible
      await homePage.navigation.goToCatalog();
      await expect(page).toHaveURL(/.*catalog/);
    });

    test('NAV-08: should open mobile More menu and access links', async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.navigate();

      await homePage.navigation.openMobileMenu();

      // Tag Guide should be in the More menu
      const tagGuideLink = page.getByRole('link', { name: 'Tag Guide' });
      await expect(tagGuideLink).toBeVisible();
    });
  });

  test.describe('Footer Navigation', () => {
    test('NAV-09: should navigate to catalog from footer', async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.navigate();

      await homePage.navigation.clickFooterCatalog();

      await expect(page).toHaveURL(/.*catalog/);
    });

    test('NAV-10: should navigate to privacy page from footer', async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.navigate();

      await homePage.navigation.clickFooterPrivacy();

      await expect(page).toHaveURL(/.*privacy/);
    });

    test('NAV-11: should navigate to all footer legal links', async ({ page }) => {
      const homePage = new HomePage(page);

      for (const link of navigationLinks.footer) {
        await homePage.navigate();

        const footerLink = page.locator('footer').getByRole('link', { name: link.name });
        await footerLink.scrollIntoViewIfNeeded();
        await footerLink.click();

        await expect(page).toHaveURL(new RegExp(link.path));
      }
    });
  });

  test.describe('Learn Dropdown Navigation', () => {
    test('NAV-12: should open Learn dropdown and navigate to Why Scanning', async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.navigate();

      await homePage.navigation.goToWhyScanning();

      await expect(page).toHaveURL(/.*why-scanning/);
    });

    test('NAV-13: should navigate to all Learn section links', async ({ page }) => {
      const homePage = new HomePage(page);

      for (const link of navigationLinks.learn) {
        await homePage.navigate();

        // Hover over Learn dropdown (desktop) or open mobile menu
        const isMobile = await homePage.navigation.mobileMoreButton.isVisible();
        if (isMobile) {
          await homePage.navigation.openMobileMenu();
        } else {
          await homePage.navigation.openLearnDropdown();
        }

        const learnLink = page.getByRole('link', { name: link.name });
        await learnLink.click();

        await expect(page).toHaveURL(new RegExp(link.path));
      }
    });
  });

  test.describe('Navigation State', () => {
    test('NAV-14: should highlight active navigation item', async ({ page }) => {
      const catalogPage = new CatalogPage(page);
      await catalogPage.navigate();

      // The catalog link should have the active class/styling
      const catalogLink = catalogPage.navigation.catalogLink.first();
      await expect(catalogLink).toHaveClass(/border-.*e63946|text-.*e63946/);
    });

    test('NAV-15: should maintain navigation state after page refresh', async ({ page }) => {
      const catalogPage = new CatalogPage(page);
      await catalogPage.navigate();

      await page.reload();

      await expect(page).toHaveURL(/.*catalog/);
    });
  });

  test.describe('Browser Navigation', () => {
    test('NAV-16: should support browser back button', async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.navigate();

      await homePage.navigation.goToCatalog();
      await expect(page).toHaveURL(/.*catalog/);

      await page.goBack();
      await expect(page).toHaveURL(/.*\/?$/);
    });

    test('NAV-17: should support browser forward button', async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.navigate();

      await homePage.navigation.goToCatalog();
      await page.goBack();
      await page.goForward();

      await expect(page).toHaveURL(/.*catalog/);
    });
  });
});
