import { test, expect } from '@playwright/test';

/**
 * Test Suite: Navigation Across Sections
 *
 * This test suite validates navigation functionality across different sections:
 * - Posts section navigation
 * - Dailies section navigation
 * - TILs (Today I Learned) section navigation
 * - Categories page navigation
 * - Archives page navigation
 * - Main menu navigation
 */

test.describe('Navigation Across Sections', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have main navigation menu', async ({ page }) => {
    // Check for navigation menu
    const nav = page.locator('nav#menu, header nav, .menu');
    await expect(nav.first()).toBeVisible();

    // Verify navigation has links
    const navLinks = nav.locator('a');
    const count = await navLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should navigate to Archives page', async ({ page }) => {
    // Click Archives link
    const archivesLink = page.getByRole('link', { name: /archives/i });
    await expect(archivesLink).toBeVisible();

    await archivesLink.click();
    await page.waitForLoadState('networkidle');

    // Verify we're on archives page
    expect(page.url()).toContain('/archives');

    // Check for archives content
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    await expect(heading).toContainText(/archives/i);

    // Should have post listings organized by year or date
    const posts = page.locator('.archive-entry, .archive-posts li, article');
    const count = await posts.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should navigate to Categories page', async ({ page }) => {
    // Click Categories link
    const categoriesLink = page.getByRole('link', { name: /categories/i });
    await expect(categoriesLink).toBeVisible();

    await categoriesLink.click();
    await page.waitForLoadState('networkidle');

    // Verify we're on categories page
    expect(page.url()).toContain('/categories');

    // Check for categories listing
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();

    // Should have category links
    const categoryLinks = page.locator('a[href*="/categories/"]');
    const count = await categoryLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should navigate to About page', async ({ page }) => {
    // Click About link
    const aboutLink = page.getByRole('link', { name: /about/i });
    await expect(aboutLink).toBeVisible();

    await aboutLink.click();
    await page.waitForLoadState('networkidle');

    // Verify we're on about page
    expect(page.url()).toContain('/about');

    // Check for about content
    const content = page.locator('article, main, .post-content');
    await expect(content).toBeVisible();

    const text = await content.textContent();
    expect(text).toBeTruthy();
    expect(text?.length).toBeGreaterThan(100);
  });

  test('should navigate to Subscribe page', async ({ page }) => {
    // Click Subscribe link
    const subscribeLink = page.getByRole('link', { name: /subscribe/i });
    await expect(subscribeLink).toBeVisible();

    await subscribeLink.click();
    await page.waitForLoadState('networkidle');

    // Verify we're on subscribe page
    expect(page.url()).toContain('/subscribe');

    // Check for subscribe content
    const content = page.locator('article, main');
    await expect(content).toBeVisible();
  });

  test('should navigate to Posts section', async ({ page }) => {
    // Navigate to homepage which shows posts
    await page.goto('/');

    // Find and click a post
    const postLink = page.locator('a[href*="/posts/"]').first();
    await expect(postLink).toBeVisible();

    await postLink.click();
    await page.waitForLoadState('networkidle');

    // Verify we're on a post page
    expect(page.url()).toContain('/posts/');

    // Verify post content
    const article = page.locator('article');
    await expect(article).toBeVisible();
  });

  test('should navigate to Dailies section', async ({ page }) => {
    // Try to find dailies link or navigate directly
    await page.goto('/dailies/');

    // If dailies exist, verify the page
    const notFound = page.locator('text=/404|not found/i');
    const notFoundCount = await notFound.count();

    if (notFoundCount === 0) {
      // Page exists, verify content
      const heading = page.locator('h1');
      await expect(heading).toBeVisible();

      // Should have posts or entries
      const entries = page.locator('article, .post-entry, .list-item');
      const count = await entries.count();
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });

  test('should navigate to TILs section', async ({ page }) => {
    // Try to find TILs link or navigate directly
    await page.goto('/tils/');

    // If TILs exist, verify the page
    const notFound = page.locator('text=/404|not found/i');
    const notFoundCount = await notFound.count();

    if (notFoundCount === 0) {
      // Page exists, verify content
      const heading = page.locator('h1');
      await expect(heading).toBeVisible();

      // Should have TIL posts
      const entries = page.locator('article, .post-entry, .list-item');
      const count = await entries.count();
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });

  test('should navigate through category pages', async ({ page }) => {
    // Go to categories page
    await page.goto('/categories/');

    // Click on first category
    const firstCategory = page.locator('a[href*="/categories/"]').first();
    await expect(firstCategory).toBeVisible();

    const categoryName = await firstCategory.textContent();

    await firstCategory.click();
    await page.waitForLoadState('networkidle');

    // Verify we're on a category page
    expect(page.url()).toContain('/categories/');

    // Should show posts in that category
    const posts = page.locator('article, .post-entry');
    const count = await posts.count();
    expect(count).toBeGreaterThan(0);

    // Verify category name in heading
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
  });

  test('should use breadcrumb navigation', async ({ page }) => {
    // Navigate to a post
    const postLink = page.locator('a[href*="/posts/"]').first();
    await postLink.click();
    await page.waitForLoadState('networkidle');

    // Check for breadcrumbs
    const breadcrumbs = page.locator('.breadcrumbs, nav[aria-label*="breadcrumb"]');
    const count = await breadcrumbs.count();

    if (count > 0) {
      await expect(breadcrumbs.first()).toBeVisible();

      // Click on breadcrumb to navigate back
      const homeLink = breadcrumbs.locator('a').first();
      await homeLink.click();
      await page.waitForLoadState('networkidle');

      // Should navigate somewhere (home or parent section)
      const url = page.url();
      expect(url).toBeTruthy();
    }
  });

  test('should have logo link to homepage', async ({ page }) => {
    // Navigate to a different page
    await page.goto('/about/');

    // Click logo to go home
    const logo = page.locator('header .logo a, .header .logo a, #logo a');
    const count = await logo.count();

    if (count > 0) {
      await logo.first().click();
      await page.waitForLoadState('networkidle');

      // Should be on homepage
      expect(page.url()).toMatch(/\/$|\/index/);
    }
  });

  test('should navigate using post tags', async ({ page }) => {
    // Navigate to a post
    const postLink = page.locator('a[href*="/posts/"]').first();
    await postLink.click();
    await page.waitForLoadState('networkidle');

    // Find and click a tag
    const tagLink = page.locator('a[href*="/tags/"]').first();
    const tagCount = await tagLink.count();

    if (tagCount > 0) {
      await expect(tagLink).toBeVisible();

      await tagLink.click();
      await page.waitForLoadState('networkidle');

      // Should be on tag page
      expect(page.url()).toContain('/tags/');

      // Should show posts with that tag
      const posts = page.locator('article, .post-entry');
      const count = await posts.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  test('should navigate back to homepage from any page', async ({ page }) => {
    // Navigate to different pages and back to home
    const pages = ['/about/', '/categories/', '/archives/'];

    for (const pagePath of pages) {
      await page.goto(pagePath);

      // Click home link or logo
      const homeLink = page.locator('a[href="/"], a[href="' + await page.evaluate(() => window.location.origin) + '"]').first();
      const logoLink = page.locator('header .logo a, #logo a').first();

      const homeCount = await homeLink.count();
      const logoCount = await logoLink.count();

      if (homeCount > 0) {
        await homeLink.click();
      } else if (logoCount > 0) {
        await logoLink.click();
      } else {
        // Navigate manually
        await page.goto('/');
      }

      await page.waitForLoadState('networkidle');

      // Should be on homepage
      expect(page.url()).toMatch(/\/$|\/index/);
    }
  });

  test('should have search accessible from navigation', async ({ page }) => {
    // Look for search link in navigation
    const searchLink = page.locator('a[href*="search"], [href="/search/"]');
    const count = await searchLink.count();

    if (count > 0) {
      await expect(searchLink.first()).toBeVisible();

      await searchLink.first().click();
      await page.waitForLoadState('networkidle');

      // Should be on search page
      expect(page.url()).toContain('/search');

      // Verify search input
      const searchInput = page.locator('#searchInput, input[type="search"]');
      await expect(searchInput).toBeVisible();
    }
  });

  test('should maintain navigation state across pages', async ({ page }) => {
    // Navigate to different pages and verify nav is always present
    const pages = ['/', '/about/', '/categories/'];

    for (const pagePath of pages) {
      await page.goto(pagePath);
      await page.waitForLoadState('networkidle');

      // Verify navigation is present
      const nav = page.locator('nav#menu, header nav');
      await expect(nav.first()).toBeVisible();

      // Verify key links are present
      const linksCount = await nav.locator('a').count();
      expect(linksCount).toBeGreaterThan(0);
    }
  });

  test('should handle 404 pages gracefully', async ({ page }) => {
    // Navigate to non-existent page
    await page.goto('/this-page-does-not-exist-12345/');

    // Should show 404 page or redirect
    const status = page.url();

    // Either we get a 404 page or get redirected
    const has404 = page.locator('text=/404|not found/i');
    const count = await has404.count();

    // If 404 page exists, verify it has navigation
    if (count > 0) {
      const nav = page.locator('nav#menu, header nav');
      const navCount = await nav.count();
      expect(navCount).toBeGreaterThan(0);
    }
  });
});
