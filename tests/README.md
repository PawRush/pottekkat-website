# Playwright Test Suite for Hugo Blog (PaperMod Theme)

This comprehensive test suite validates the functionality of a Hugo static site using the PaperMod theme.

## Test Coverage

### 1. Homepage Tests (`homepage.spec.ts`)
- Homepage loads successfully
- Header with logo and navigation
- Blog post listings with metadata
- Clickable post links
- Social media links
- Home info section
- Pagination functionality
- RSS feed links

### 2. Search Tests (`search.spec.ts`)
- Search page loads correctly
- Search input field with autofocus
- Live search results with Fuse.js
- Results display and navigation
- Dynamic result updates
- No results handling
- Case-insensitive search
- Content and title searching
- Result clearing

### 3. Blog Post Tests (`blog-post.spec.ts`)
- Post title rendering
- Metadata display (date, reading time)
- Post content rendering
- Breadcrumb navigation
- Code syntax highlighting
- Copy code buttons
- Share buttons
- Edit/suggest changes links
- Categories and tags
- Post navigation (prev/next)
- Table of contents
- Last modified dates
- Image rendering
- Heading hierarchy

### 4. Theme Toggle Tests (`theme-toggle.spec.ts`)
- Theme toggle button visibility
- Dark/light mode switching
- Theme attributes and classes
- localStorage persistence
- Theme persistence after reload
- Background/text color changes
- Accessibility (aria-labels)
- Cross-page theme consistency
- System preference support

### 5. Navigation Tests (`navigation.spec.ts`)
- Main navigation menu
- Archives page navigation
- Categories page navigation
- About page navigation
- Subscribe page navigation
- Posts section navigation
- Dailies section navigation
- TILs section navigation
- Category page navigation
- Breadcrumb navigation
- Logo home link
- Tag navigation
- Search accessibility
- Navigation state consistency
- 404 page handling

## Prerequisites

- Hugo installed (`brew install hugo`)
- Node.js and pnpm installed
- Git submodules initialized

## Installation

```bash
# Install dependencies
pnpm install

# Install Playwright browsers
pnpm exec playwright install chromium
```

## Running Tests

```bash
# Run all tests
pnpm test

# Run tests in UI mode
pnpm test:ui

# Run tests in headed mode (see browser)
pnpm test:headed

# Run specific test file
pnpm exec playwright test tests/homepage.spec.ts

# Run tests in debug mode
pnpm test:debug

# Run with specific project
pnpm exec playwright test --project=chromium
```

## Hugo Server

The Playwright configuration automatically starts the Hugo server on port 1313. If you want to start it manually:

```bash
# Start Hugo development server
hugo server -D --port 1313

# Build production site
hugo --minify
```

## Test Reports

After running tests, view the HTML report:

```bash
pnpm exec playwright show-report
```

## CI/CD Integration

Tests are configured for CI environments with:
- Automatic retries (2 attempts)
- Screenshot on failure
- Video recording on failure
- Trace collection for debugging

## File Structure

```
tests/
├── homepage.spec.ts      # Homepage and blog listing tests
├── search.spec.ts        # Search functionality tests
├── blog-post.spec.ts     # Individual post rendering tests
├── theme-toggle.spec.ts  # Dark/light mode tests
├── navigation.spec.ts    # Cross-section navigation tests
└── README.md            # This file
```

## Configuration

Edit `playwright.config.ts` to:
- Change base URL
- Add more browsers (Firefox, Safari, Mobile)
- Adjust timeouts
- Modify reporter settings
- Update web server configuration

## Troubleshooting

### Hugo server not starting
```bash
# Kill existing Hugo processes
pkill -f hugo

# Restart server manually
hugo server -D --port 1313
```

### Tests timing out
- Increase timeout in `playwright.config.ts`
- Check Hugo server is running
- Verify site builds without errors

### Theme submodules not initialized
```bash
git submodule update --init --recursive
```

## Best Practices

1. Run tests in headless mode for CI/CD
2. Use UI mode for debugging test failures
3. Keep selectors flexible (use roles and accessible attributes)
4. Add waits for dynamic content
5. Use meaningful test descriptions
6. Group related tests in describe blocks

## Contributing

When adding new tests:
1. Follow existing test patterns
2. Use descriptive test names
3. Add appropriate waits for dynamic content
4. Test both positive and negative scenarios
5. Ensure tests are independent and can run in any order

## License

MIT
