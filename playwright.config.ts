import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration for Hugo Blog Testing
 *
 * This configuration is optimized for testing a Hugo static site
 * with the PaperMod theme running locally.
 */
export default defineConfig({
  testDir: './tests',

  // Maximum time one test can run
  timeout: 30 * 1000,

  // Test execution configuration
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
    ['json', { outputFile: 'test-results.json' }]
  ],

  // Shared test configuration
  use: {
    // Base URL for the Hugo site
    baseURL: process.env.BASE_URL ?? 'http://localhost:1313',

    // Collect trace on failure for debugging
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video on first retry
    video: 'retain-on-failure',
  },

  // Configure projects for different browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Development server configuration
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: 'hugo server -D --port 1313',
        url: 'http://localhost:1313',
        reuseExistingServer: !process.env.CI,
        timeout: 120 * 1000,
      },
});
