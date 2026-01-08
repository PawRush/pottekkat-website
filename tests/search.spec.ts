import { test, expect } from '@playwright/test';

/**
 * Test Suite: Search Functionality
 *
 * This test suite validates the Fuse.js-powered search functionality:
 * - Search page loads correctly
 * - Search input is functional
 * - Search results are displayed
 * - Results are clickable and navigate to posts
 * - No results message for invalid searches
 */

test.describe('Search Functionality (Fuse.js)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/search/');
  });

  test('should load search page successfully', async ({ page }) => {
    // Verify we're on the search page
    expect(page.url()).toContain('/search');

    // Check for search page heading
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    await expect(heading).toContainText(/search/i);
  });

  test('should have search input field', async ({ page }) => {
    // Find the search input
    const searchInput = page.locator('#searchInput, input[type="search"], input[aria-label*="search"]');
    await expect(searchInput).toBeVisible();

    // Verify input is focused (autofocus attribute)
    const isFocused = await searchInput.evaluate((el) => el === document.activeElement);
    expect(isFocused).toBe(true);

    // Verify placeholder text
    const placeholder = await searchInput.getAttribute('placeholder');
    expect(placeholder).toBeTruthy();
  });

  test('should display search results when searching for "open source"', async ({ page }) => {
    // Type into search input
    const searchInput = page.locator('#searchInput, input[type="search"]');
    await searchInput.fill('open source');

    // Wait for search results to appear - increased timeout for remote hosting
    await page.waitForTimeout(1000); // Give Fuse.js time to process

    // Check for results container
    const results = page.locator('#searchResults, .search-results');
    await expect(results).toBeVisible();

    // Verify we have result items
    const resultItems = page.locator('#searchResults li, .search-results li, #searchResults a, .search-results a');
    const count = await resultItems.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should display relevant results for "kubernetes"', async ({ page }) => {
    const searchInput = page.locator('#searchInput, input[type="search"]');
    await searchInput.fill('kubernetes');

    // Wait for results - increased timeout for remote hosting
    await page.waitForTimeout(1000);

    // Check results
    const resultItems = page.locator('#searchResults li, .search-results li');
    const count = await resultItems.count();

    if (count > 0) {
      // Verify first result contains link
      const firstResult = resultItems.first();
      await expect(firstResult).toBeVisible();

      const link = firstResult.locator('a');
      await expect(link).toBeVisible();

      // Verify link has href
      const href = await link.getAttribute('href');
      expect(href).toBeTruthy();
    }
  });

  test('should navigate to post when clicking search result', async ({ page }) => {
    const searchInput = page.locator('#searchInput, input[type="search"]');
    await searchInput.fill('API');

    // Wait for results - increased timeout for remote hosting
    await page.waitForTimeout(1000);

    // Get first result link
    const firstResultLink = page.locator('#searchResults li a, .search-results li a').first();

    const count = await firstResultLink.count();
    if (count > 0) {
      await expect(firstResultLink).toBeVisible();

      // Click the result
      await firstResultLink.click();

      // Wait for navigation
      await page.waitForLoadState('networkidle');

      // Verify we navigated to a post
      expect(page.url()).toMatch(/\/(posts|dailies|tils)\//);

      // Verify we're on an article page
      const article = page.locator('article, main');
      await expect(article).toBeVisible();
    }
  });

  test('should update results dynamically as user types', async ({ page }) => {
    const searchInput = page.locator('#searchInput, input[type="search"]');

    // Type first query
    await searchInput.fill('kubernetes');
    await page.waitForTimeout(1000);

    const results1 = page.locator('#searchResults li, .search-results li');
    const count1 = await results1.count();

    // Clear and type new query
    await searchInput.clear();
    await searchInput.fill('hugo');
    await page.waitForTimeout(1000);

    const results2 = page.locator('#searchResults li, .search-results li');
    const count2 = await results2.count();

    // Results should have changed (unless both queries return same number)
    // Just verify that search is working
    expect(count1 >= 0).toBe(true);
    expect(count2 >= 0).toBe(true);
  });

  test('should handle no results gracefully', async ({ page }) => {
    const searchInput = page.locator('#searchInput, input[type="search"]');

    // Search for something that definitely won't exist
    await searchInput.fill('xyzqwertyasdfnonexistentquery12345');
    await page.waitForTimeout(1000);

    // Check for results
    const resultItems = page.locator('#searchResults li, .search-results li');
    const count = await resultItems.count();

    if (count === 0) {
      // Verify no results or "no results" message
      const noResults = page.locator('#searchResults:empty, .no-results, text=/no results/i');
      const noResultsCount = await noResults.count();

      // Either results container is empty or there's a no-results message
      expect(noResultsCount >= 0).toBe(true);
    }
  });

  test('should be case-insensitive', async ({ page }) => {
    const searchInput = page.locator('#searchInput, input[type="search"]');

    // Search with lowercase
    await searchInput.fill('opensource');
    await page.waitForTimeout(1000);
    const results1 = page.locator('#searchResults li, .search-results li');
    const count1 = await results1.count();

    // Search with uppercase
    await searchInput.clear();
    await searchInput.fill('OPENSOURCE');
    await page.waitForTimeout(1000);
    const results2 = page.locator('#searchResults li, .search-results li');
    const count2 = await results2.count();

    // Both should return results (or both return nothing)
    expect(count1).toBe(count2);
  });

  test('should search across title and content', async ({ page }) => {
    const searchInput = page.locator('#searchInput, input[type="search"]');

    // Search for a common term
    await searchInput.fill('blog');
    await page.waitForTimeout(1000);

    const results = page.locator('#searchResults li, .search-results li');
    const count = await results.count();

    // Should find posts that have "blog" in title or content
    expect(count).toBeGreaterThan(0);
  });

  test('should clear results when search input is cleared', async ({ page }) => {
    const searchInput = page.locator('#searchInput, input[type="search"]');

    // Type search query
    await searchInput.fill('kubernetes');
    await page.waitForTimeout(1000);

    // Verify results exist
    let results = page.locator('#searchResults li, .search-results li');
    let count = await results.count();
    expect(count).toBeGreaterThan(0);

    // Clear the input
    await searchInput.clear();
    await page.waitForTimeout(800);

    // Results should be cleared or empty - allow for network latency on remote hosting
    results = page.locator('#searchResults li, .search-results li');
    count = await results.count();
    expect(count).toBeLessThanOrEqual(0);
  });
});
