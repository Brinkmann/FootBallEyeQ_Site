import { Page, Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly heroSection: Locator;
  readonly getStartedButton: Locator;
  readonly learnMoreLink: Locator;
  readonly featuresSection: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heroSection = page.locator('main').first();
    this.getStartedButton = page.locator('a[href="/signup"]').first();
    this.learnMoreLink = page.locator('a[href="/how-it-works"]').first();
    this.featuresSection = page.locator('section').filter({ hasText: /features/i });
  }

  async navigate() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }

  async clickGetStarted() {
    await this.getStartedButton.click();
  }

  async clickLearnMore() {
    await this.learnMoreLink.click();
  }

  async isHeroVisible(): Promise<boolean> {
    return await this.heroSection.isVisible();
  }
}
