import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;
  readonly signupLink: Locator;
  readonly logoLink: Locator;

  constructor(page: Page) {
    this.page = page;
    // Based on actual selectors from app/login/page.tsx
    this.emailInput = page.locator('#login-email');
    this.passwordInput = page.locator('#login-password');
    this.submitButton = page.locator('button[type="submit"]', { hasText: 'Log In' });
    this.errorMessage = page.locator('[role="alert"]');
    this.signupLink = page.locator('a[href="/signup"]', { hasText: 'Sign up for free' });
    this.logoLink = page.locator('a[href="/"]', { hasText: 'Football EyeQ' });
  }

  async navigate() {
    await this.page.goto('/login');
    await this.page.waitForLoadState('networkidle');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async hasError(): Promise<boolean> {
    return await this.errorMessage.isVisible({ timeout: 3000 }).catch(() => false);
  }

  async getErrorText(): Promise<string> {
    return await this.errorMessage.textContent() || '';
  }

  async clickSignupLink() {
    await this.signupLink.click();
  }

  async isEmailInputVisible(): Promise<boolean> {
    return await this.emailInput.isVisible();
  }

  async isPasswordInputVisible(): Promise<boolean> {
    return await this.passwordInput.isVisible();
  }

  async isSubmitButtonVisible(): Promise<boolean> {
    return await this.submitButton.isVisible();
  }
}
