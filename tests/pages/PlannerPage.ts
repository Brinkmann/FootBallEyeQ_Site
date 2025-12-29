import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { NavigationComponent } from './NavigationComponent';

/**
 * PlannerPage represents the session planner page
 */
export class PlannerPage extends BasePage {
  readonly navigation: NavigationComponent;
  readonly pageHeading: Locator;
  readonly sessionCards: Locator;
  readonly emptySlots: Locator;
  readonly removeButtons: Locator;
  readonly generateCodeButton: Locator;
  readonly sessionCodeText: Locator;
  readonly lockedSessions: Locator;

  constructor(page: Page) {
    super(page);
    this.navigation = new NavigationComponent(page);

    // Main planner elements
    this.pageHeading = page.getByRole('heading', { name: '12-Session Season Plan' });
    this.sessionCards = page.getByText(/Session \d+/).first();
    this.emptySlots = page.getByText('Empty slot');
    this.removeButtons = page.getByRole('button', { name: 'Remove' });
    this.generateCodeButton = page.getByRole('button', { name: 'Generate Code' });
    this.sessionCodeText = page.getByText('Session Code (6 characters):');
    this.lockedSessions = page.getByText('Locked');
  }

  /**
   * Navigate to the planner page
   */
  async navigate() {
    await this.goto('/planner');
  }

  /**
   * Get a specific session card
   */
  getSession(sessionNumber: number): Locator {
    return this.page.getByText(`Session ${sessionNumber}`);
  }

  /**
   * Check if a session is visible
   */
  async isSessionVisible(sessionNumber: number): Promise<boolean> {
    const session = this.getSession(sessionNumber);
    return await this.isVisible(session);
  }

  /**
   * Check if a session is locked
   */
  async isSessionLocked(sessionNumber: number): Promise<boolean> {
    const sessionContainer = this.page.locator(`[data-session="${sessionNumber}"]`).or(
      this.getSession(sessionNumber).locator('..')
    );
    const lockedText = sessionContainer.getByText('Locked');
    return await this.isVisible(lockedText);
  }

  /**
   * Remove the first drill from a session
   */
  async removeFirstDrill() {
    await this.removeButtons.first().click();
  }

  /**
   * Remove a specific drill by index
   */
  async removeDrill(index: number) {
    await this.removeButtons.nth(index).click();
  }

  /**
   * Click generate code button
   */
  async clickGenerateCode() {
    await this.generateCodeButton.scrollIntoViewIfNeeded();
    await this.generateCodeButton.click();
  }

  /**
   * Check if session code is displayed
   */
  async isSessionCodeVisible(): Promise<boolean> {
    return await this.isVisible(this.sessionCodeText);
  }

  /**
   * Get count of empty slots
   */
  async getEmptySlotCount(): Promise<number> {
    return await this.emptySlots.count();
  }

  /**
   * Check if planner is empty
   */
  async isEmpty(): Promise<boolean> {
    const count = await this.getEmptySlotCount();
    return count > 0;
  }

  /**
   * Wait for planner to load
   */
  async waitForPlannerToLoad() {
    await this.pageHeading.waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Check if any sessions are locked
   */
  async hasLockedSessions(): Promise<boolean> {
    return await this.isVisible(this.lockedSessions);
  }

  /**
   * Get drill title in a session
   */
  async getDrillInSession(sessionNumber: number): Promise<string | null> {
    const session = this.getSession(sessionNumber);
    const drillHeading = session.locator('..').getByRole('heading').first();

    try {
      return await drillHeading.textContent();
    } catch {
      return null;
    }
  }
}
