import { Page, Locator } from '@playwright/test';

export class SignupPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly organizationInput: Locator;
  readonly passwordInput: Locator;
  readonly clubCodeCheckbox: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;
  readonly loginLink: Locator;
  readonly logoImage: Locator;

  constructor(page: Page) {
    this.page = page;
    // Based on actual selectors from app/signup/page.tsx
    this.firstNameInput = page.locator('#signup-first-name');
    this.lastNameInput = page.locator('#signup-last-name');
    this.emailInput = page.locator('#signup-email');
    this.organizationInput = page.locator('#signup-organization');
    this.passwordInput = page.locator('#signup-password');
    this.clubCodeCheckbox = page.locator('input[type="checkbox"]');
    this.submitButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator('.text-red-500');
    this.loginLink = page.locator('a[href="/login"]', { hasText: 'Log in' });
    this.logoImage = page.locator('img[alt="Football EyeQ"]');
  }

  async navigate() {
    await this.page.goto('/signup');
    await this.page.waitForLoadState('networkidle');
  }

  async signup(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    organization?: string;
    hasClubCode?: boolean;
  }) {
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.emailInput.fill(data.email);

    if (data.organization) {
      await this.organizationInput.fill(data.organization);
    }

    await this.passwordInput.fill(data.password);

    if (data.hasClubCode) {
      await this.clubCodeCheckbox.check();
    }

    await this.submitButton.click();
  }

  async hasError(): Promise<boolean> {
    return await this.errorMessage.isVisible({ timeout: 3000 }).catch(() => false);
  }

  async getErrorText(): Promise<string> {
    return await this.errorMessage.textContent() || '';
  }

  async clickLoginLink() {
    await this.loginLink.click();
  }

  async isFormVisible(): Promise<boolean> {
    const allVisible = await Promise.all([
      this.firstNameInput.isVisible(),
      this.lastNameInput.isVisible(),
      this.emailInput.isVisible(),
      this.passwordInput.isVisible(),
      this.submitButton.isVisible(),
    ]);
    return allVisible.every(v => v);
  }

  async getSubmitButtonText(): Promise<string> {
    return await this.submitButton.textContent() || '';
  }
}
