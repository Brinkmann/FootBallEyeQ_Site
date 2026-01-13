import { Page, Locator } from '@playwright/test';

export class NavigationComponent {
  readonly page: Page;
  readonly logoLink: Locator;
  readonly loginLink: Locator;
  readonly signupLink: Locator;
  readonly logoutButton: Locator;
  readonly profileLink: Locator;
  readonly catalogTab: Locator;
  readonly plannerTab: Locator;
  readonly userName: Locator;
  readonly accountTypeBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    // Based on actual selectors from app/components/Navbar.tsx
    this.logoLink = page.locator('a[href="/"]', { hasText: 'Football EyeQ' }).first();
    this.loginLink = page.locator('a[href="/login"]', { hasText: 'Login' });
    this.signupLink = page.locator('a[href="/signup"]', { hasText: 'Sign Up' });
    this.logoutButton = page.locator('button', { hasText: 'Log out' });
    this.profileLink = page.locator('a[href="/profile"]');
    this.catalogTab = page.locator('a[href="/catalog"]');
    this.plannerTab = page.locator('a[href="/planner"]');
    this.userName = page.locator('.text-gray-700.text-sm').filter({ hasText: /[A-Za-z]+ [A-Za-z]+/ });
    this.accountTypeBadge = page.locator('.px-2.py-1.text-xs.font-medium').first();
  }

  async isLoggedIn(): Promise<boolean> {
    return await this.logoutButton.isVisible({ timeout: 3000 }).catch(() => false);
  }

  async isLoggedOut(): Promise<boolean> {
    const loginVisible = await this.loginLink.isVisible({ timeout: 3000 }).catch(() => false);
    const signupVisible = await this.signupLink.isVisible({ timeout: 3000 }).catch(() => false);
    return loginVisible && signupVisible;
  }

  async getUserName(): Promise<string> {
    return await this.userName.textContent() || '';
  }

  async getAccountType(): Promise<string> {
    return await this.accountTypeBadge.textContent() || '';
  }

  async logout() {
    await this.logoutButton.click();
    // Wait for the logout to complete
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToCatalog() {
    await this.catalogTab.click();
    await this.page.waitForURL('**/catalog');
  }

  async navigateToPlanner() {
    await this.plannerTab.click();
    await this.page.waitForURL('**/planner');
  }

  async navigateToProfile() {
    await this.profileLink.click();
    await this.page.waitForURL('**/profile');
  }

  async clickLogin() {
    await this.loginLink.click();
  }

  async clickSignup() {
    await this.signupLink.click();
  }
}
