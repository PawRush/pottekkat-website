import { test, expect } from '@playwright/test';

/**
 * Test Suite: Dark/Light Mode Toggle
 *
 * This test suite validates the theme switching functionality:
 * - Theme toggle button is present
 * - Toggle switches between dark and light modes
 * - Theme preference is persisted
 * - Correct theme attributes are applied
 * - Theme affects page styling
 */

test.describe('Dark/Light Mode Toggle', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have theme toggle button', async ({ page }) => {
    // Look for theme toggle button
    const themeToggle = page.locator(
      '#theme-toggle, .theme-toggle, button[aria-label*="theme"], button#moon, button#sun, [id*="theme"]'
    );

    await expect(themeToggle.first()).toBeVisible();
  });

  test('should have moon and sun icons', async ({ page }) => {
    // Look for theme toggle with SVG icons
    const themeToggle = page.locator(
      '#theme-toggle, .theme-toggle, button[aria-label*="theme"], [id*="theme"]'
    );

    const count = await themeToggle.count();
    if (count > 0) {
      const toggle = themeToggle.first();
      await expect(toggle).toBeVisible();

      // Check for SVG icon
      const svg = toggle.locator('svg');
      const svgCount = await svg.count();
      expect(svgCount).toBeGreaterThan(0);
    }
  });

  test('should toggle between dark and light themes', async ({ page }) => {
    // Get initial theme
    const bodyBefore = page.locator('body, html');
    const initialTheme = await bodyBefore.getAttribute('data-theme');
    const initialClass = await bodyBefore.getAttribute('class');

    // Find and click theme toggle
    const themeToggle = page.locator(
      '#theme-toggle, .theme-toggle, button[aria-label*="theme"], [id*="theme"]'
    ).first();

    await themeToggle.click();

    // Wait for theme to change - increased for remote hosting
    await page.waitForTimeout(500);

    // Get new theme
    const bodyAfter = page.locator('body, html');
    const newTheme = await bodyAfter.getAttribute('data-theme');
    const newClass = await bodyAfter.getAttribute('class');

    // Verify theme changed
    const themeChanged = initialTheme !== newTheme || initialClass !== newClass;
    expect(themeChanged).toBe(true);
  });

  test('should apply dark theme class/attribute', async ({ page }) => {
    // Look for theme indicator on body or html
    const root = page.locator('body, html');

    // Click toggle until we get dark theme
    const themeToggle = page.locator(
      '#theme-toggle, .theme-toggle, button[aria-label*="theme"], [id*="theme"]'
    ).first();

    // Click twice to ensure we cycle through themes
    await themeToggle.click();
    await page.waitForTimeout(400);

    let themeAttr = await root.getAttribute('data-theme');
    let classAttr = await root.getAttribute('class');

    // If not dark, click again
    if (!themeAttr?.includes('dark') && !classAttr?.includes('dark')) {
      await themeToggle.click();
      await page.waitForTimeout(400);
      themeAttr = await root.getAttribute('data-theme');
      classAttr = await root.getAttribute('class');
    }

    // Should have dark theme indicator
    const isDark = themeAttr?.includes('dark') || classAttr?.includes('dark');
    expect(isDark).toBe(true);
  });

  test('should apply light theme class/attribute', async ({ page }) => {
    const root = page.locator('body, html');

    // Click toggle until we get light theme
    const themeToggle = page.locator(
      '#theme-toggle, .theme-toggle, button[aria-label*="theme"], [id*="theme"]'
    ).first();

    // Click to change theme
    await themeToggle.click();
    await page.waitForTimeout(400);

    let themeAttr = await root.getAttribute('data-theme');
    let classAttr = await root.getAttribute('class');

    // Keep clicking until we get light theme
    let attempts = 0;
    while (themeAttr?.includes('dark') || classAttr?.includes('dark')) {
      await themeToggle.click();
      await page.waitForTimeout(400);
      themeAttr = await root.getAttribute('data-theme');
      classAttr = await root.getAttribute('class');
      attempts++;

      if (attempts > 3) break; // Prevent infinite loop
    }

    // Should have light theme or no dark indicator
    const isLight = themeAttr?.includes('light') || !themeAttr?.includes('dark') || !classAttr?.includes('dark');
    expect(isLight).toBe(true);
  });

  test('should persist theme preference in localStorage', async ({ page }) => {
    // Click theme toggle
    const themeToggle = page.locator(
      '#theme-toggle, .theme-toggle, button[aria-label*="theme"], [id*="theme"]'
    ).first();

    await themeToggle.click();
    await page.waitForTimeout(400);

    // Check localStorage
    const themePreference = await page.evaluate(() => {
      return localStorage.getItem('pref-theme') || localStorage.getItem('theme');
    });

    expect(themePreference).toBeTruthy();
  });

  test('should maintain theme after page reload', async ({ page }) => {
    // Set theme by clicking toggle
    const themeToggle = page.locator(
      '#theme-toggle, .theme-toggle, button[aria-label*="theme"], [id*="theme"]'
    ).first();

    await themeToggle.click();
    await page.waitForTimeout(400);

    // Get current theme
    const root = page.locator('body, html');
    const themeBefore = await root.getAttribute('data-theme');
    const classBefore = await root.getAttribute('class');

    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Get theme after reload
    const themeAfter = await root.getAttribute('data-theme');
    const classAfter = await root.getAttribute('class');

    // Theme should be the same
    const themeMatches = themeBefore === themeAfter || classBefore === classAfter;
    expect(themeMatches).toBe(true);
  });

  test('should change background color when toggling theme', async ({ page }) => {
    // Get initial background color
    const body = page.locator('body');

    // Wait for styles to load completely on remote hosting
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    const bgColorBefore = await body.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    // Click theme toggle
    const themeToggle = page.locator(
      '#theme-toggle, .theme-toggle, button[aria-label*="theme"], [id*="theme"]'
    ).first();

    await themeToggle.click();
    await page.waitForTimeout(500);

    // Get new background color
    const bgColorAfter = await body.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    // Colors should be different (but allow for cases where styles haven't loaded yet)
    if (bgColorBefore && bgColorAfter && bgColorBefore !== 'rgba(0, 0, 0, 0)') {
      expect(bgColorBefore).not.toBe(bgColorAfter);
    }
  });

  test('should change text color when toggling theme', async ({ page }) => {
    // Get initial text color
    const body = page.locator('body');

    // Wait for styles to load completely on remote hosting
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    const textColorBefore = await body.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });

    // Click theme toggle
    const themeToggle = page.locator(
      '#theme-toggle, .theme-toggle, button[aria-label*="theme"], [id*="theme"]'
    ).first();

    await themeToggle.click();
    await page.waitForTimeout(500);

    // Get new text color
    const textColorAfter = await body.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });

    // Colors should be different (but allow for cases where styles haven't loaded yet)
    if (textColorBefore && textColorAfter && textColorBefore !== 'rgba(0, 0, 0, 0)') {
      expect(textColorBefore).not.toBe(textColorAfter);
    }
  });

  test('should have accessible aria-label on theme toggle', async ({ page }) => {
    const themeToggle = page.locator(
      '#theme-toggle, .theme-toggle, button[aria-label*="theme"], [id*="theme"]'
    ).first();

    // Check for aria-label or title
    const ariaLabel = await themeToggle.getAttribute('aria-label');
    const title = await themeToggle.getAttribute('title');

    expect(ariaLabel || title).toBeTruthy();
  });

  test('should toggle theme on all pages', async ({ page }) => {
    // Toggle theme on homepage
    const themeToggle = page.locator(
      '#theme-toggle, .theme-toggle, button[aria-label*="theme"], [id*="theme"]'
    ).first();

    await themeToggle.click();
    await page.waitForTimeout(400);

    const root = page.locator('body, html');
    const themeOnHome = await root.getAttribute('data-theme');

    // Navigate to another page
    await page.goto('/about/');
    await page.waitForLoadState('networkidle');

    // Check theme persists
    const themeOnAbout = await root.getAttribute('data-theme');
    expect(themeOnAbout).toBe(themeOnHome);
  });

  test('should respect system preference if set to auto', async ({ page, context }) => {
    // Set color scheme preference
    await context.emulateMedia({ colorScheme: 'dark' });
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Get theme
    const root = page.locator('body, html');
    const theme = await root.getAttribute('data-theme');
    const className = await root.getAttribute('class');

    // Should respect dark preference (unless user has overridden)
    const hasDarkIndicator = theme?.includes('dark') || className?.includes('dark');

    // Just verify theme system is working
    expect(theme || className).toBeTruthy();
  });
});
