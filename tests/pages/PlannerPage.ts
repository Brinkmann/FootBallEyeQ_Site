import { Page, Locator } from '@playwright/test';

export class PlannerPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly sessionCards: Locator;
  readonly loadingSpinner: Locator;
  readonly upgradePrompt: Locator;
  readonly viewStatsLink: Locator;

  constructor(page: Page) {
    this.page = page;
    // Based on actual selectors from app/planner/page.tsx
    this.pageTitle = page.locator('h3', { hasText: '12-Session Season Plan' });
    this.sessionCards = page.locator('.bg-card.rounded.shadow');
    this.loadingSpinner = page.locator('.animate-spin');
    this.upgradePrompt = page.locator('.bg-primary-light.border.border-primary', { hasText: 'Unlock Your Full Season' });
    this.viewStatsLink = page.locator('a[href="/planner/stats"]');
  }

  async navigate() {
    await this.page.goto('/planner');
    await this.page.waitForLoadState('networkidle');
  }

  async waitForPlannerToLoad() {
    await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
    await this.sessionCards.first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
  }

  async getSessionCardCount(): Promise<number> {
    return await this.sessionCards.count();
  }

  async getSessionCard(sessionNumber: number) {
    return this.page.locator(`text=Session ${sessionNumber}`).locator('..').locator('..');
  }

  async isSessionLocked(sessionNumber: number): Promise<boolean> {
    const lockIcon = this.page.locator(`text=Session ${sessionNumber}`).locator('..').locator('svg path[d*="16.5 10.5V6.75"]');
    return await lockIcon.isVisible({ timeout: 1000 }).catch(() => false);
  }

  async getExerciseCount(sessionNumber: number): Promise<string> {
    const sessionCard = await this.getSessionCard(sessionNumber);
    const countText = sessionCard.locator('text=/\\d+\\/5 exercises/');
    return await countText.textContent() || '';
  }

  async getSessionExercises(sessionNumber: number): Promise<string[]> {
    const sessionCard = await this.getSessionCard(sessionNumber);
    const exercises = sessionCard.locator('.bg-primary-light');
    const count = await exercises.count();
    const exerciseNames: string[] = [];

    for (let i = 0; i < count; i++) {
      const text = await exercises.nth(i).textContent();
      if (text) {
        const name = text.replace(/Remove$/, '').trim();
        exerciseNames.push(name);
      }
    }

    return exerciseNames;
  }

  async removeExercise(sessionNumber: number, exerciseIndex: number) {
    const sessionCard = await this.getSessionCard(sessionNumber);
    const removeButtons = sessionCard.locator('button', { hasText: 'Remove' });
    await removeButtons.nth(exerciseIndex).click();
  }

  async generateSessionCode(sessionNumber: number) {
    const sessionCard = await this.getSessionCard(sessionNumber);
    const generateButton = sessionCard.locator('button', { hasText: 'Generate Code' });
    await generateButton.click();
  }

  async isUpgradePromptVisible(): Promise<boolean> {
    return await this.upgradePrompt.isVisible({ timeout: 3000 }).catch(() => false);
  }

  async clickUpgrade() {
    const upgradeButton = this.upgradePrompt.locator('a[href="/upgrade"]');
    await upgradeButton.click();
  }

  async navigateToCatalogFromSession(sessionNumber: number) {
    const sessionCard = await this.getSessionCard(sessionNumber);
    const catalogLink = sessionCard.locator('a[href="/catalog"]');
    await catalogLink.click();
  }

  async clickViewStats() {
    await this.viewStatsLink.click();
  }

  async hasEmptyState(sessionNumber: number): Promise<boolean> {
    const sessionCard = await this.getSessionCard(sessionNumber);
    const emptyMessage = sessionCard.locator('text=No drills added yet');
    return await emptyMessage.isVisible({ timeout: 1000 }).catch(() => false);
  }
}
