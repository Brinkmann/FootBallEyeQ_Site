import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { NavigationComponent } from './NavigationComponent';

/**
 * HomePage represents the landing page of the application
 */
export class HomePage extends BasePage {
  readonly navigation: NavigationComponent;
  readonly heading: Locator;
  readonly ctaButton: Locator;

  constructor(page: Page) {
    super(page);
    this.navigation = new NavigationComponent(page);

    // Main page elements
    this.heading = page.getByRole('heading').first();
    this.ctaButton = page.getByRole('link', { name: 'Get Started' }).or(
      page.getByRole('link', { name: 'Sign Up' })
    );
  }

  /**
   * Navigate to the home page
   */
  async navigate() {
    await this.goto('/');
  }

  /**
   * Click the main CTA button
   */
  async clickCTA() {
    await this.ctaButton.click();
  }
}
