import { Page, Locator } from '@playwright/test';

/**
 * NavigationComponent handles all navigation-related interactions
 */
export class NavigationComponent {
  readonly page: Page;
  readonly logo: Locator;
  readonly loginButton: Locator;
  readonly signupButton: Locator;
  readonly logoutButton: Locator;
  readonly profileButton: Locator;
  readonly mobileMoreButton: Locator;

  // Main navigation links
  readonly catalogLink: Locator;
  readonly plannerLink: Locator;
  readonly tagGuideLink: Locator;

  // Learn dropdown links
  readonly learnDropdown: Locator;
  readonly whyScanningLink: Locator;
  readonly howItWorksLink: Locator;
  readonly ecosystemLink: Locator;
  readonly useCasesLink: Locator;

  // Footer links
  readonly footerCatalogLink: Locator;
  readonly footerPlannerLink: Locator;
  readonly footerPrivacyLink: Locator;
  readonly footerTermsLink: Locator;

  constructor(page: Page) {
    this.page = page;

    // Header elements
    this.logo = page.getByRole('link', { name: 'Football EyeQ' }).first();
    this.loginButton = page.getByRole('link', { name: 'Login' });
    this.signupButton = page.getByRole('link', { name: 'Sign Up' });
    this.logoutButton = page.getByRole('button', { name: 'Log out' });
    this.profileButton = page.locator('a[href="/profile"]');
    this.mobileMoreButton = page.getByRole('button', { name: 'More' });

    // Main navigation
    this.catalogLink = page.getByRole('link', { name: 'Drill Catalogue' }).or(page.getByRole('link', { name: 'Catalogue' }));
    this.plannerLink = page.getByRole('link', { name: 'Session Planner' }).or(page.getByRole('link', { name: 'Planner' }));
    this.tagGuideLink = page.getByRole('link', { name: 'Tag Guide' });

    // Learn dropdown
    this.learnDropdown = page.getByRole('button', { name: 'Learn' });
    this.whyScanningLink = page.getByRole('link', { name: 'Why Scanning' });
    this.howItWorksLink = page.getByRole('link', { name: 'How It Works' });
    this.ecosystemLink = page.getByRole('link', { name: 'Ecosystem' });
    this.useCasesLink = page.getByRole('link', { name: 'Use Cases' });

    // Footer links
    this.footerCatalogLink = page.locator('footer').getByRole('link', { name: 'Drill Catalogue' });
    this.footerPlannerLink = page.locator('footer').getByRole('link', { name: 'Session Planner' });
    this.footerPrivacyLink = page.locator('footer').getByRole('link', { name: 'Privacy Policy' });
    this.footerTermsLink = page.locator('footer').getByRole('link', { name: 'Terms of Service' });
  }

  /**
   * Click on the logo to go to homepage
   */
  async clickLogo() {
    await this.logo.click();
  }

  /**
   * Navigate to catalog page
   */
  async goToCatalog() {
    await this.catalogLink.click();
  }

  /**
   * Navigate to planner page
   */
  async goToPlanner() {
    await this.plannerLink.click();
  }

  /**
   * Navigate to login page
   */
  async goToLogin() {
    await this.loginButton.click();
  }

  /**
   * Navigate to signup page
   */
  async goToSignup() {
    await this.signupButton.click();
  }

  /**
   * Click logout button
   */
  async logout() {
    await this.logoutButton.click();
  }

  /**
   * Check if user is logged in
   */
  async isLoggedIn(): Promise<boolean> {
    try {
      await this.logoutButton.waitFor({ state: 'visible', timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Open mobile menu (if on mobile viewport)
   */
  async openMobileMenu() {
    if (await this.mobileMoreButton.isVisible()) {
      await this.mobileMoreButton.click();
    }
  }

  /**
   * Open Learn dropdown (desktop)
   */
  async openLearnDropdown() {
    await this.learnDropdown.hover();
  }

  /**
   * Navigate to a Learn section link
   */
  async goToWhyScanning() {
    const isMobile = await this.mobileMoreButton.isVisible();
    if (isMobile) {
      await this.openMobileMenu();
    } else {
      await this.openLearnDropdown();
    }
    await this.whyScanningLink.click();
  }

  /**
   * Click footer link to catalog
   */
  async clickFooterCatalog() {
    await this.footerCatalogLink.scrollIntoViewIfNeeded();
    await this.footerCatalogLink.click();
  }

  /**
   * Click footer privacy link
   */
  async clickFooterPrivacy() {
    await this.footerPrivacyLink.scrollIntoViewIfNeeded();
    await this.footerPrivacyLink.click();
  }
}
