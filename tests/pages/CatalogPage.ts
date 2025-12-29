import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { NavigationComponent } from './NavigationComponent';

/**
 * CatalogPage represents the drill catalogue page
 */
export class CatalogPage extends BasePage {
  readonly navigation: NavigationComponent;
  readonly searchInput: Locator;
  readonly filtersButton: Locator;
  readonly closeFiltersButton: Locator;
  readonly eyeqTab: Locator;
  readonly plasticTab: Locator;
  readonly drillCards: Locator;
  readonly emptyStateMessage: Locator;
  readonly retryButton: Locator;

  // Filter elements
  readonly ageGroupFilter: Locator;
  readonly difficultyFilter: Locator;
  readonly gameMomentFilter: Locator;

  constructor(page: Page) {
    super(page);
    this.navigation = new NavigationComponent(page);

    // Main catalog elements
    this.searchInput = page.getByPlaceholder('Search or type to filter...');
    this.filtersButton = page.getByRole('button', { name: 'Filters' });
    this.closeFiltersButton = page.getByRole('button', { name: 'Close' });
    this.eyeqTab = page.getByText('EyeQ', { exact: false });
    this.plasticTab = page.getByText('Plastic', { exact: false });
    this.drillCards = page.getByRole('heading').filter({ hasText: /^[\d]/ });
    this.emptyStateMessage = page.getByText("We couldn't load drills right now.");
    this.retryButton = page.getByRole('button', { name: 'Retry loading drills' });

    // Filter elements
    this.ageGroupFilter = page.getByRole('button', { name: 'Age Group' });
    this.difficultyFilter = page.getByRole('button', { name: 'Difficulty' });
    this.gameMomentFilter = page.getByRole('button', { name: 'Game Moment' });
  }

  /**
   * Navigate to the catalog page
   */
  async navigate() {
    await this.goto('/catalog');
  }

  /**
   * Search for drills
   */
  async search(query: string) {
    await this.searchInput.fill(query);
  }

  /**
   * Clear search
   */
  async clearSearch() {
    await this.searchInput.clear();
  }

  /**
   * Open filters panel
   */
  async openFilters() {
    await this.filtersButton.click();
  }

  /**
   * Close filters panel
   */
  async closeFilters() {
    await this.closeFiltersButton.click();
  }

  /**
   * Select a specific filter option
   */
  async selectFilter(filterName: string, optionName: string) {
    const filterButton = this.page.getByRole('button', { name: filterName });
    await filterButton.click();

    const option = this.page.getByRole('button', { name: new RegExp(optionName, 'i') });
    await option.click();
  }

  /**
   * Switch to EyeQ drills
   */
  async switchToEyeQ() {
    await this.eyeqTab.click();
  }

  /**
   * Switch to Plastic drills
   */
  async switchToPlastic() {
    await this.plasticTab.click();
  }

  /**
   * Get a drill card by title
   */
  getDrillByTitle(title: string): Locator {
    return this.page.getByRole('heading', { name: new RegExp(title) });
  }

  /**
   * Click "Add to Plan" for the first drill
   */
  async addFirstDrillToPlan() {
    const addButton = this.page.getByRole('button', { name: 'Add to Plan' }).first();
    await addButton.scrollIntoViewIfNeeded();
    await addButton.click();
  }

  /**
   * Select a session when adding to plan
   */
  async selectSession(sessionNumber: number) {
    const sessionButton = this.page.getByRole('button', { name: `Session ${sessionNumber}` });
    await sessionButton.click();
  }

  /**
   * Add first drill to a specific session
   */
  async addFirstDrillToSession(sessionNumber: number) {
    await this.addFirstDrillToPlan();
    await this.selectSession(sessionNumber);
  }

  /**
   * Get count of visible drill cards
   */
  async getDrillCount(): Promise<number> {
    return await this.drillCards.count();
  }

  /**
   * Click on a drill card to view details
   */
  async clickDrill(title: string) {
    const drill = this.getDrillByTitle(title);
    await drill.click();
  }

  /**
   * Check if a specific drill is visible
   */
  async isDrillVisible(title: string): Promise<boolean> {
    const drill = this.getDrillByTitle(title);
    return await this.isVisible(drill);
  }

  /**
   * Wait for drills to load
   */
  async waitForDrillsToLoad() {
    await this.drillCards.first().waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Check if empty state is shown
   */
  async isEmptyStateVisible(): Promise<boolean> {
    return await this.isVisible(this.emptyStateMessage);
  }

  /**
   * Click retry button
   */
  async clickRetry() {
    await this.retryButton.click();
  }
}
