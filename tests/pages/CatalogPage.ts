import { Page, Locator } from '@playwright/test';

export class CatalogPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly searchInput: Locator;
  readonly favoritesButton: Locator;
  readonly filterButton: Locator;
  readonly exerciseCards: Locator;
  readonly loadMoreButton: Locator;
  readonly clearFiltersButton: Locator;
  readonly resultsCount: Locator;
  readonly loadingSpinner: Locator;
  readonly errorMessage: Locator;
  readonly noResultsMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    // Based on actual selectors from app/catalog/page.tsx
    this.pageTitle = page.locator('h1', { hasText: 'Drill Catalogue' });
    this.searchInput = page.locator('input[placeholder*="Search"]');
    this.favoritesButton = page.locator('button').filter({ has: page.locator('svg').filter({ has: page.locator('path[d*="11.645"]') }) });
    this.filterButton = page.locator('button').filter({ hasText: /filter/i });
    this.exerciseCards = page.locator('.bg-card.border.border-divider.rounded-2xl.shadow-md');
    this.loadMoreButton = page.locator('button', { hasText: 'Load more drills' });
    this.clearFiltersButton = page.locator('button', { hasText: 'Clear all filters' });
    this.resultsCount = page.locator('text=Showing').locator('..');
    this.loadingSpinner = page.locator('.animate-spin');
    this.errorMessage = page.locator('.bg-red-50.border.border-red-200');
    this.noResultsMessage = page.locator('text=No drills match your search');
  }

  async navigate() {
    await this.page.goto('/catalog');
    await this.page.waitForLoadState('networkidle');
  }

  async waitForDrillsToLoad() {
    await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
    await this.exerciseCards.first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
  }

  async search(query: string) {
    await this.searchInput.fill(query);
    await this.page.waitForTimeout(500);
  }

  async clearSearch() {
    await this.searchInput.clear();
    await this.page.waitForTimeout(500);
  }

  async clickFavoritesButton() {
    await this.favoritesButton.click();
  }

  async getExerciseCount(): Promise<number> {
    return await this.exerciseCards.count();
  }

  async getResultsText(): Promise<string> {
    return await this.resultsCount.textContent() || '';
  }

  async clickLoadMore() {
    await this.loadMoreButton.click();
    await this.page.waitForTimeout(500);
  }

  async isLoadMoreVisible(): Promise<boolean> {
    return await this.loadMoreButton.isVisible({ timeout: 3000 }).catch(() => false);
  }

  async clearAllFilters() {
    await this.clearFiltersButton.click();
  }

  async hasNoResults(): Promise<boolean> {
    return await this.noResultsMessage.isVisible({ timeout: 3000 }).catch(() => false);
  }

  async hasError(): Promise<boolean> {
    return await this.errorMessage.isVisible({ timeout: 3000 }).catch(() => false);
  }

  async getFirstExerciseCard() {
    return this.exerciseCards.first();
  }

  async getExerciseCard(index: number) {
    return this.exerciseCards.nth(index);
  }

  async getExerciseTitle(index: number): Promise<string> {
    const card = this.exerciseCards.nth(index);
    const title = card.locator('h2');
    return await title.textContent() || '';
  }

  async favoriteExercise(index: number) {
    const card = this.exerciseCards.nth(index);
    const favoriteBtn = card.locator('button[aria-label*="favorite"]');
    await favoriteBtn.click();
  }

  async addExerciseToPlan(index: number, sessionNumber: number) {
    const card = this.exerciseCards.nth(index);
    const addButton = card.locator('button', { hasText: 'Add to Plan' });
    await addButton.click();
    await this.page.waitForSelector('text=Add to which session?');
    const sessionButton = this.page.locator('button', { hasText: `Session ${sessionNumber}` });
    await sessionButton.click();
  }

  async previewExercise(index: number) {
    const card = this.exerciseCards.nth(index);
    const previewButton = card.locator('button', { hasText: 'Preview' });
    await previewButton.click();
  }
}
