import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { NavigationComponent } from './NavigationComponent';

/**
 * SignupPage represents the user registration page
 */
export class SignupPage extends BasePage {
  readonly navigation: NavigationComponent;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;
  readonly successMessage: Locator;
  readonly loginLink: Locator;

  constructor(page: Page) {
    super(page);
    this.navigation = new NavigationComponent(page);

    // Signup form elements
    this.firstNameInput = page.getByPlaceholder(/first name/i).or(
      page.getByLabel(/first name/i)
    ).or(
      page.locator('input[name="fname"]')
    );
    this.lastNameInput = page.getByPlaceholder(/last name/i).or(
      page.getByLabel(/last name/i)
    ).or(
      page.locator('input[name="lname"]')
    );
    this.emailInput = page.getByPlaceholder(/email/i).or(
      page.getByLabel(/email/i)
    ).or(
      page.locator('input[type="email"]')
    );
    this.passwordInput = page.getByPlaceholder(/^password$/i).or(
      page.getByLabel(/^password$/i)
    ).or(
      page.locator('input[type="password"]').first()
    );
    this.confirmPasswordInput = page.getByPlaceholder(/confirm|re-enter/i).or(
      page.getByLabel(/confirm|re-enter/i)
    ).or(
      page.locator('input[type="password"]').last()
    );
    this.submitButton = page.getByRole('button', { name: /sign up|create account|register/i });
    this.errorMessage = page.locator('[role="alert"]').or(
      page.getByText(/error|invalid|exists/i)
    );
    this.successMessage = page.getByText(/success|welcome|created/i);
    this.loginLink = page.getByRole('link', { name: /log in|sign in|login/i });
  }

  /**
   * Navigate to the signup page
   */
  async navigate() {
    await this.goto('/signup');
  }

  /**
   * Fill in first name
   */
  async enterFirstName(firstName: string) {
    await this.firstNameInput.fill(firstName);
  }

  /**
   * Fill in last name
   */
  async enterLastName(lastName: string) {
    await this.lastNameInput.fill(lastName);
  }

  /**
   * Fill in email
   */
  async enterEmail(email: string) {
    await this.emailInput.fill(email);
  }

  /**
   * Fill in password
   */
  async enterPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  /**
   * Fill in confirm password
   */
  async enterConfirmPassword(password: string) {
    if (await this.confirmPasswordInput.count() > 0) {
      await this.confirmPasswordInput.fill(password);
    }
  }

  /**
   * Click submit button
   */
  async clickSubmit() {
    await this.submitButton.click();
  }

  /**
   * Perform complete signup flow
   */
  async signup(firstName: string, lastName: string, email: string, password: string) {
    await this.enterFirstName(firstName);
    await this.enterLastName(lastName);
    await this.enterEmail(email);
    await this.enterPassword(password);
    await this.enterConfirmPassword(password);
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
   * Check if success message is displayed
   */
  async hasSuccess(): Promise<boolean> {
    return await this.isVisible(this.successMessage);
  }

  /**
   * Click login link
   */
  async goToLogin() {
    await this.loginLink.click();
  }

  /**
   * Wait for signup to complete
   */
  async waitForSignupSuccess() {
    // Wait for URL to change away from signup page or for logout button to appear
    await Promise.race([
      this.page.waitForURL(url => !url.pathname.includes('/signup'), { timeout: 10000 }),
      this.navigation.logoutButton.waitFor({ state: 'visible', timeout: 10000 })
    ]);
  }
}
