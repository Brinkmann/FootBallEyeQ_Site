import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { NavigationComponent } from './NavigationComponent';

/**
 * LoginPage represents the user login page
 */
export class LoginPage extends BasePage {
  readonly navigation: NavigationComponent;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;
  readonly signupLink: Locator;
  readonly forgotPasswordLink: Locator;

  constructor(page: Page) {
    super(page);
    this.navigation = new NavigationComponent(page);

    // Login form elements
    this.emailInput = page.getByPlaceholder(/email/i).or(
      page.getByLabel(/email/i)
    ).or(
      page.locator('input[type="email"]')
    );
    this.passwordInput = page.getByPlaceholder(/password/i).or(
      page.getByLabel(/password/i)
    ).or(
      page.locator('input[type="password"]')
    );
    this.submitButton = page.getByRole('button', { name: /log in|sign in|login/i });
    this.errorMessage = page.locator('[role="alert"]').or(
      page.getByText(/invalid|error|wrong/i)
    );
    this.signupLink = page.getByRole('link', { name: /sign up|create account|register/i });
    this.forgotPasswordLink = page.getByRole('link', { name: /forgot password|reset password/i });
  }

  /**
   * Navigate to the login page
   */
  async navigate() {
    await this.goto('/login');
  }

  /**
   * Fill in email field
   */
  async enterEmail(email: string) {
    await this.emailInput.fill(email);
  }

  /**
   * Fill in password field
   */
  async enterPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  /**
   * Click the submit button
   */
  async clickSubmit() {
    await this.submitButton.click();
  }

  /**
   * Perform complete login flow
   */
  async login(email: string, password: string) {
    await this.enterEmail(email);
    await this.enterPassword(password);
    await this.clickSubmit();
  }

  /**
   * Check if error message is displayed
   */
  async hasError(): Promise<boolean> {
    return await this.isVisible(this.errorMessage);
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string> {
    return await this.errorMessage.textContent() || '';
  }

  /**
   * Click signup link
   */
  async goToSignup() {
    await this.signupLink.click();
  }

  /**
   * Wait for login to complete (URL change or navigation visibility)
   */
  async waitForLoginSuccess() {
    // Wait for URL to change away from login page or for logout button to appear
    await Promise.race([
      this.page.waitForURL(url => !url.pathname.includes('/login'), { timeout: 10000 }),
      this.navigation.logoutButton.waitFor({ state: 'visible', timeout: 10000 })
    ]);
  }
}
