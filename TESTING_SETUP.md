# Hugo Blog Testing Setup - Complete

## Overview

This document summarizes the comprehensive Playwright test suite created for the pottekkat-website Hugo blog.

## Setup Completed

### 1. Dependencies Installed

- **Hugo v0.152.2** - Static site generator installed via Homebrew
- **Git Submodules** - PaperMod and plausible-hugo themes initialized
- **Node.js & pnpm** - Package manager for JavaScript dependencies
- **Playwright v1.57.0** - E2E testing framework with Chromium browser

### 2. Project Structure

```
/Volumes/workplace/AWSDeployAgentScripts/repos/pottekkat-website/
├── tests/
│   ├── homepage.spec.ts        # Homepage and blog listing tests (8 tests)
│   ├── search.spec.ts          # Search functionality tests (10 tests)
│   ├── blog-post.spec.ts       # Individual post tests (15 tests)
│   ├── theme-toggle.spec.ts    # Dark/light mode tests (12 tests)
│   ├── navigation.spec.ts      # Cross-section navigation (15 tests)
│   └── README.md              # Test documentation
├── playwright.config.ts        # Playwright configuration
├── package.json               # Project dependencies and scripts
└── node_modules/              # Installed dependencies
```

### 3. Hugo Site Details

- **Base URL**: http://localhost:1313
- **Title**: Navendu Pottekkat - The Open Source Absolutist
- **Theme**: PaperMod with plausible analytics
- **Content Sections**:
  - Posts (main blog articles)
  - Dailies (daily entries)
  - TILs (Today I Learned)
  - Books, Newsletters, etc.
- **Features**:
  - Fuse.js powered search
  - Dark/light mode toggle
  - RSS feeds
  - Social sharing
  - Code syntax highlighting
  - Reading time estimation
  - Category and tag taxonomies

## Test Suite Coverage (60 Total Tests)

### 1. Homepage Tests (`homepage.spec.ts`) - 8 Tests

Tests the main landing page functionality:

```typescript
✓ Load homepage successfully with correct title
✓ Display header with logo and navigation menu
✓ Show blog posts with metadata (date, reading time)
✓ Verify clickable post links
✓ Display social media links
✓ Show home info section with introduction
✓ Pagination or load more functionality
✓ RSS feed link availability
```

**Key Validations:**
- Page loads with proper title
- Navigation menu with Archives, Categories, About, Subscribe
- Blog post entries with titles, summaries, and metadata
- Social icons for GitHub, Twitter, LinkedIn, etc.
- Home info with author introduction
- Pagination navigation

### 2. Search Tests (`search.spec.ts`) - 10 Tests

Tests the Fuse.js-powered search functionality:

```typescript
✓ Load search page successfully
✓ Search input field with autofocus
✓ Display results for "open source" query
✓ Show relevant results for "kubernetes"
✓ Navigate to post when clicking result
✓ Update results dynamically as typing
✓ Handle no results gracefully
✓ Case-insensitive search
✓ Search across title and content
✓ Clear results when input is cleared
```

**Key Validations:**
- Search page loads with input field
- Live search with Fuse.js integration
- Dynamic result updates
- Result navigation to actual posts
- Empty state handling
- Case-insensitive matching

### 3. Blog Post Tests (`blog-post.spec.ts`) - 15 Tests

Tests individual blog post rendering:

```typescript
✓ Render post with title
✓ Display post metadata (date, time, etc.)
✓ Show reading time estimate
✓ Render post content
✓ Display breadcrumb navigation
✓ Syntax highlighting for code blocks
✓ Copy code buttons
✓ Share buttons
✓ Edit/suggest changes link to GitHub
✓ Display categories and tags
✓ Post navigation (prev/next)
✓ Navigate through post links
✓ Table of contents for long posts
✓ Last modified date
✓ Image rendering and proper heading hierarchy
```

**Key Validations:**
- Full post content with proper formatting
- Metadata display (author, date, reading time)
- Code blocks with syntax highlighting
- Share buttons for social media
- Category and tag links
- Navigation to adjacent posts
- Breadcrumb navigation
- GitHub edit links

### 4. Theme Toggle Tests (`theme-toggle.spec.ts`) - 12 Tests

Tests dark/light mode switching:

```typescript
✓ Theme toggle button visibility
✓ Moon and sun icons present
✓ Toggle between dark and light themes
✓ Apply dark theme class/attribute
✓ Apply light theme class/attribute
✓ Persist theme in localStorage
✓ Maintain theme after page reload
✓ Change background color when toggling
✓ Change text color when toggling
✓ Accessible aria-label on toggle
✓ Theme consistency across pages
✓ Respect system preference
```

**Key Validations:**
- Theme toggle button with SVG icons
- Dark/light mode switching
- localStorage persistence
- Theme attributes on body/html
- Color changes (background, text)
- Cross-page theme consistency
- Accessibility attributes

### 5. Navigation Tests (`navigation.spec.ts`) - 15 Tests

Tests navigation across different site sections:

```typescript
✓ Main navigation menu presence
✓ Navigate to Archives page
✓ Navigate to Categories page
✓ Navigate to About page
✓ Navigate to Subscribe page
✓ Navigate to Posts section
✓ Navigate to Dailies section
✓ Navigate to TILs section
✓ Navigate through category pages
✓ Use breadcrumb navigation
✓ Logo link to homepage
✓ Navigate using post tags
✓ Search accessibility from navigation
✓ Maintain navigation state across pages
✓ Handle 404 pages gracefully
```

**Key Validations:**
- All navigation menu items functional
- Section pages (Archives, Categories, About, Subscribe)
- Content sections (Posts, Dailies, TILs)
- Category and tag navigation
- Breadcrumb navigation
- Logo home link
- Consistent navigation across pages
- 404 error handling

## Running the Tests

### Start Hugo Server (Manual)

```bash
cd /Volumes/workplace/AWSDeployAgentScripts/repos/pottekkat-website
hugo server -D --port 1313
```

### Run All Tests

```bash
# Run all tests
pnpm test

# Run with UI mode for debugging
pnpm test:ui

# Run in headed mode (see browser)
pnpm test:headed

# Run specific test file
pnpm exec playwright test tests/homepage.spec.ts

# Run tests for specific section
pnpm exec playwright test --grep "search"
```

### Run Tests by Browser

```bash
# Chromium (default)
pnpm exec playwright test --project=chromium

# Add Firefox or WebKit in playwright.config.ts to test other browsers
```

### View Test Reports

```bash
# Generate and view HTML report
pnpm exec playwright show-report

# JSON results
cat test-results.json
```

## Test Architecture

### Configuration (`playwright.config.ts`)

- **Timeout**: 30 seconds per test
- **Retries**: 2 retries in CI, 0 locally
- **Reporters**: HTML, List, JSON
- **Screenshots**: On failure
- **Video**: On first retry
- **Trace**: On first retry for debugging

### Test Patterns Used

1. **Page Object Model (Implicit)**
   - Locators defined inline for maintainability
   - Flexible selectors using multiple strategies

2. **Accessibility-First Selectors**
   - Prefer `getByRole`, `getByLabel`
   - Fall back to specific IDs/classes when needed

3. **Conditional Testing**
   - Tests adapt to missing optional features
   - Graceful handling of theme-specific elements

4. **Wait Strategies**
   - `waitForLoadState('networkidle')` for navigation
   - Explicit waits for dynamic content
   - Timeout configuration for search delays

## Known Considerations

### Hugo Server Redirects

The Hugo development server may redirect from `/` to `/en/v1.0.0-beta.4/` or similar paths. The tests handle this by:
- Using flexible URL matching
- Checking for content rather than exact URLs
- Adapting to theme-specific routing

### PaperMod Theme Features

Tests are optimized for PaperMod theme which includes:
- Built-in search with Fuse.js
- Theme toggle (dark/light mode)
- Breadcrumb navigation
- Code copy buttons
- Share buttons
- Post navigation (prev/next)

### Dynamic Content

Some features depend on content availability:
- Search results vary by query
- Post navigation may not appear on first/last post
- ToC only appears on long posts
- Tags/categories depend on taxonomy setup

## Maintenance

### Updating Tests

When updating the site:

1. **New Features**: Add corresponding tests
2. **Theme Changes**: Update selectors if needed
3. **Content Structure**: Adjust test expectations
4. **URLs**: Update base URLs in config

### Debugging Failed Tests

```bash
# Run single test in debug mode
pnpm exec playwright test tests/homepage.spec.ts --debug

# View screenshots of failures
open test-results/*/test-failed-*.png

# Check trace files
pnpm exec playwright show-trace test-results/*/trace.zip
```

### CI/CD Integration

Tests are configured for CI with:
- Automatic retries (2x)
- Screenshot capture on failure
- Video recording on first retry
- JSON report for parsing
- Exit code 1 on any failure

## File Locations

All files are located at:
```
/Volumes/workplace/AWSDeployAgentScripts/repos/pottekkat-website/
```

### Key Files

- `playwright.config.ts` - Playwright configuration
- `package.json` - Dependencies and scripts
- `tests/*.spec.ts` - Test files (5 files, 60 tests)
- `tests/README.md` - Test documentation
- `test-results/` - Test execution results
- `playwright-report/` - HTML test reports

## Next Steps

### Recommended Enhancements

1. **Add Mobile Testing**
   - Uncomment mobile projects in config
   - Test responsive layouts
   - Verify mobile navigation

2. **Add Firefox/Safari**
   - Enable additional browser projects
   - Test cross-browser compatibility

3. **Performance Testing**
   - Add Lighthouse CI integration
   - Monitor page load times
   - Check Core Web Vitals

4. **Visual Regression**
   - Add screenshot comparison tests
   - Verify theme consistency
   - Check layout stability

5. **Accessibility Testing**
   - Add axe-core integration
   - Check WCAG compliance
   - Verify keyboard navigation

## Success Criteria Met

✅ Hugo installed and configured
✅ Site builds successfully (682 pages)
✅ Hugo server running on localhost:1313
✅ Playwright installed with Chromium
✅ 5 comprehensive test suites created
✅ 60 total tests covering:
   - Homepage and blog listing
   - Search functionality (Fuse.js)
   - Individual blog post rendering
   - Dark/light mode toggle
   - Navigation across sections (posts, dailies, TILs)
✅ Test documentation created
✅ Package scripts for easy execution

## Summary

A production-ready Playwright test suite has been created for the pottekkat-website Hugo blog. The test suite covers all major functionality including homepage, search, blog posts, theme switching, and navigation. Tests are well-documented, maintainable, and ready for CI/CD integration.

The tests follow best practices including:
- Accessibility-first selectors
- Flexible locators that adapt to content
- Proper wait strategies
- Comprehensive error handling
- Clear, descriptive test names
- Organized test structure

The setup is complete and ready for continuous testing as the site evolves.
