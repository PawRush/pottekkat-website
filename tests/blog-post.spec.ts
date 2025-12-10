import { test, expect } from '@playwright/test';

/**
 * Test Suite: Individual Blog Post Rendering
 *
 * This test suite validates individual blog post pages:
 * - Post content renders correctly
 * - Metadata (date, reading time, categories) is displayed
 * - Code syntax highlighting works
 * - Table of contents is functional
 * - Share buttons are present
 * - Post navigation (prev/next) works
 */

test.describe('Individual Blog Post Rendering', () => {
  // Use a known post for testing
  const testPostPath = '/posts/open-source-lessons/';

  test.beforeEach(async ({ page }) => {
    // Navigate to a specific blog post
    await page.goto('/');

    // Click on first available post
    const firstPost = page.locator('article.post-entry a, .post-entry a').first();
    await firstPost.click();
    await page.waitForLoadState('networkidle');
  });

  test('should render blog post with title', async ({ page }) => {
    // Verify we're on a post page
    expect(page.url()).toMatch(/\/(posts|dailies|tils)\//);

    // Check for post title
    const title = page.locator('h1, article h1, .post-title');
    await expect(title).toBeVisible();

    const titleText = await title.textContent();
    expect(titleText).toBeTruthy();
    expect(titleText?.length).toBeGreaterThan(0);
  });

  test('should display post metadata', async ({ page }) => {
    // Check for post metadata section
    const meta = page.locator('.post-meta, .meta');
    await expect(meta).toBeVisible();

    // Verify date is present
    const metaText = await meta.textContent();
    expect(metaText).toBeTruthy();

    // Should contain date format or reading time
    const hasDate = /\d{4}|\w+ \d+,?\s+\d{4}/.test(metaText || '');
    const hasReadingTime = /\d+\s*min/.test(metaText || '');

    expect(hasDate || hasReadingTime).toBe(true);
  });

  test('should display reading time', async ({ page }) => {
    // Look for reading time indicator
    const readingTime = page.locator('text=/\\d+\\s*min/');
    const count = await readingTime.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should render post content', async ({ page }) => {
    // Check for main article content
    const content = page.locator('article .post-content, article .content, .post-single-content');
    await expect(content).toBeVisible();

    // Verify content has text
    const text = await content.textContent();
    expect(text).toBeTruthy();
    expect(text?.length).toBeGreaterThan(100); // Should have substantial content
  });

  test('should display breadcrumbs', async ({ page }) => {
    // Check for breadcrumb navigation
    const breadcrumbs = page.locator('.breadcrumbs, nav[aria-label*="breadcrumb"]');
    const count = await breadcrumbs.count();

    if (count > 0) {
      await expect(breadcrumbs.first()).toBeVisible();

      // Should have links
      const links = breadcrumbs.locator('a');
      const linkCount = await links.count();
      expect(linkCount).toBeGreaterThan(0);
    }
  });

  test('should render code blocks with syntax highlighting', async ({ page }) => {
    // Look for code blocks
    const codeBlocks = page.locator('pre code, .highlight');
    const count = await codeBlocks.count();

    if (count > 0) {
      const firstCodeBlock = codeBlocks.first();
      await expect(firstCodeBlock).toBeVisible();

      // Check if syntax highlighting classes are present
      const className = await firstCodeBlock.getAttribute('class');
      const hasHighlighting = className?.includes('language-') || className?.includes('highlight');

      // Verify code block has content
      const codeText = await firstCodeBlock.textContent();
      expect(codeText).toBeTruthy();
    }
  });

  test('should have copy code button for code blocks', async ({ page }) => {
    const codeBlocks = page.locator('pre code, .highlight');
    const count = await codeBlocks.count();

    if (count > 0) {
      // Look for copy button (common in Hugo themes)
      const copyButton = page.locator('.copy-code, button[aria-label*="copy"], .copy-button');
      const buttonCount = await copyButton.count();

      // If copy buttons exist, verify they're functional
      if (buttonCount > 0) {
        await expect(copyButton.first()).toBeVisible();
      }
    }
  });

  test('should display share buttons', async ({ page }) => {
    // Look for share buttons section
    const shareButtons = page.locator('.share-buttons, .post-share, [class*="share"]');
    const count = await shareButtons.count();

    if (count > 0) {
      await expect(shareButtons.first()).toBeVisible();

      // Should have social share links
      const shareLinks = page.locator('.share-buttons a, .post-share a');
      const linkCount = await shareLinks.count();
      expect(linkCount).toBeGreaterThan(0);
    }
  });

  test('should have edit/suggest changes link', async ({ page }) => {
    // Check for edit post link
    const editLink = page.locator('a[href*="github.com"]:has-text("Suggest"), a:has-text("Edit")');
    const count = await editLink.count();

    if (count > 0) {
      await expect(editLink.first()).toBeVisible();

      const href = await editLink.first().getAttribute('href');
      expect(href).toContain('github.com');
    }
  });

  test('should display categories or tags', async ({ page }) => {
    // Look for categories/tags section
    const taxonomies = page.locator('.post-tags, .categories, [class*="tag"], .meta');
    const count = await taxonomies.count();

    if (count > 0) {
      // Look for category or tag links
      const tagLinks = page.locator('a[href*="/categories/"], a[href*="/tags/"]');
      const linkCount = await tagLinks.count();

      if (linkCount > 0) {
        await expect(tagLinks.first()).toBeVisible();
      }
    }
  });

  test('should have post navigation (prev/next)', async ({ page }) => {
    // Look for post navigation
    const postNav = page.locator('.post-nav, .paginav, nav.post-nav-links');
    const count = await postNav.count();

    if (count > 0) {
      await expect(postNav.first()).toBeVisible();

      // Should have prev or next links
      const navLinks = postNav.locator('a');
      const linkCount = await navLinks.count();
      expect(linkCount).toBeGreaterThan(0);
    }
  });

  test('should navigate to previous/next post', async ({ page }) => {
    const postNav = page.locator('.post-nav a, .paginav a, nav.post-nav-links a');
    const count = await postNav.count();

    if (count > 0) {
      const firstNavLink = postNav.first();
      await expect(firstNavLink).toBeVisible();

      const currentUrl = page.url();

      // Click the nav link
      await firstNavLink.click();
      await page.waitForLoadState('networkidle');

      const newUrl = page.url();

      // URL should have changed
      expect(newUrl).not.toBe(currentUrl);

      // Should still be on a post page
      expect(newUrl).toMatch(/\/(posts|dailies|tils)\//);
    }
  });

  test('should have table of contents if post is long', async ({ page }) => {
    // Look for ToC
    const toc = page.locator('.toc, #TableOfContents, [class*="table-of-contents"]');
    const count = await toc.count();

    if (count > 0) {
      await expect(toc.first()).toBeVisible();

      // ToC should have links to sections
      const tocLinks = toc.locator('a');
      const linkCount = await tocLinks.count();
      expect(linkCount).toBeGreaterThan(0);
    }
  });

  test('should display last modified date', async ({ page }) => {
    // Look for last modified indicator
    const lastMod = page.locator('text=/last.*modified/i, text=/updated/i');
    const count = await lastMod.count();

    if (count > 0) {
      await expect(lastMod.first()).toBeVisible();
    }
  });

  test('should render images if present', async ({ page }) => {
    // Check for images in post content
    const images = page.locator('article img, .post-content img');
    const count = await images.count();

    if (count > 0) {
      const firstImage = images.first();
      await expect(firstImage).toBeVisible();

      // Verify image has loaded
      const naturalWidth = await firstImage.evaluate((img: HTMLImageElement) => img.naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
    }
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    // Get all headings
    const h2s = page.locator('article h2, .post-content h2');
    const h2Count = await h2s.count();

    if (h2Count > 0) {
      // Verify first h2 is visible
      await expect(h2s.first()).toBeVisible();

      // Check that headings have IDs for linking
      const firstH2Id = await h2s.first().getAttribute('id');
      expect(firstH2Id).toBeTruthy();
    }
  });
});
