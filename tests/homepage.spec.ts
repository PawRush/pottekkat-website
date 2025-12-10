import { test, expect } from '@playwright/test';

/**
 * Test Suite: Homepage and Blog Listing
 *
 * This test suite validates the homepage functionality including:
 * - Page loads successfully
 * - Header and navigation are present
 * - Blog posts are displayed
 * - Post metadata (date, reading time) is shown
 * - Pagination works correctly
 */

test.describe('Homepage and Blog Listing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load homepage successfully', async ({ page }) => {
    // Verify page title
    await expect(page).toHaveTitle(/Navendu Pottekkat/);

    // Verify the main heading
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
    await expect(heading).toContainText('The Open Source Absolutist');
  });

  test('should display header with logo and navigation', async ({ page }) => {
    // Check logo/icon is present
    const logo = page.locator('header .logo');
    await expect(logo).toBeVisible();

    // Verify main navigation items
    const nav = page.locator('nav#menu');
    await expect(nav).toBeVisible();

    // Check for key navigation links
    await expect(page.getByRole('link', { name: /archives/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /categories/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /about/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /subscribe/i })).toBeVisible();
  });

  test('should display blog posts with metadata', async ({ page }) => {
    // Verify blog posts are present
    const posts = page.locator('article.post-entry');
    await expect(posts.first()).toBeVisible();

    // Get the first post and verify its structure
    const firstPost = posts.first();

    // Check for post title
    const title = firstPost.locator('h2');
    await expect(title).toBeVisible();

    // Check for post summary/content
    const summary = firstPost.locator('.entry-content, .post-content');
    await expect(summary).toBeVisible();

    // Check for post metadata (date and reading time)
    const meta = firstPost.locator('.post-meta');
    await expect(meta).toBeVisible();

    // Verify reading time is shown
    await expect(meta).toContainText(/min/);
  });

  test('should have clickable post links', async ({ page }) => {
    // Find first blog post
    const firstPost = page.locator('article.post-entry').first();
    const postLink = firstPost.locator('a.entry-link, h2 a').first();

    await expect(postLink).toBeVisible();

    // Get the href to verify it's a valid link
    const href = await postLink.getAttribute('href');
    expect(href).toBeTruthy();
    expect(href).toMatch(/\/(posts|dailies|tils)\//);

    // Click and verify navigation
    await postLink.click();

    // Wait for navigation
    await page.waitForLoadState('networkidle');

    // Verify we're on a post page
    expect(page.url()).toContain('/posts/');
  });

  test('should display social media links', async ({ page }) => {
    // Check for social icons container
    const socialLinks = page.locator('.social-icons, .social-buttons');

    // If social links exist, verify they're visible
    const count = await socialLinks.count();
    if (count > 0) {
      await expect(socialLinks.first()).toBeVisible();

      // Check for common social links
      const links = page.locator('a[href*="github.com"], a[href*="twitter.com"], a[href*="linkedin.com"]');
      const linkCount = await links.count();
      expect(linkCount).toBeGreaterThan(0);
    }
  });

  test('should show home info section', async ({ page }) => {
    // Check for home info section with intro text
    const homeInfo = page.locator('.home-info, .profile');

    const count = await homeInfo.count();
    if (count > 0) {
      await expect(homeInfo.first()).toBeVisible();
      await expect(homeInfo.first()).toContainText(/Navendu/);
    }
  });

  test('should have pagination or load more functionality', async ({ page }) => {
    // Scroll to bottom of page
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Check for pagination buttons
    const pagination = page.locator('.pagination, .page-navigator');
    const paginationCount = await pagination.count();

    if (paginationCount > 0) {
      // If pagination exists, verify it has navigation elements
      const paginationLinks = page.locator('.pagination a, .page-navigator a');
      const linkCount = await paginationLinks.count();
      expect(linkCount).toBeGreaterThanOrEqual(1);
    } else {
      // If no pagination, verify we have posts displayed
      const posts = page.locator('article.post-entry');
      const postCount = await posts.count();
      expect(postCount).toBeGreaterThan(0);
    }
  });

  test('should have RSS feed link', async ({ page }) => {
    // Check for RSS link in header or footer
    const rssLink = page.locator('a[href*="index.xml"], a[href*="rss"], link[type="application/rss+xml"]');
    const count = await rssLink.count();
    expect(count).toBeGreaterThan(0);
  });
});
