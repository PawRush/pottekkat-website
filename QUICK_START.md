# Quick Start Guide - Hugo Blog Testing

## Prerequisites Check

```bash
# Verify installations
hugo version         # Should show v0.152.2
pnpm --version      # Should show v10.x or higher
node --version      # Should show v22.x or higher
```

## First Time Setup

```bash
# Navigate to project
cd /Volumes/workplace/AWSDeployAgentScripts/repos/pottekkat-website

# Initialize git submodules (themes)
git submodule update --init --recursive

# Install Node dependencies
pnpm install

# Install Playwright browsers
pnpm exec playwright install chromium
```

## Build and Serve

```bash
# Build the site
hugo --minify

# Start development server
hugo server -D --port 1313

# Server will be available at: http://localhost:1313
```

## Run Tests

### Basic Testing

```bash
# Run all tests (Hugo server must be running)
pnpm test

# Run with visual UI
pnpm test:ui

# Run in headed mode (watch browser)
pnpm test:headed
```

### Specific Tests

```bash
# Homepage tests only
pnpm exec playwright test tests/homepage.spec.ts

# Search tests only
pnpm exec playwright test tests/search.spec.ts

# Blog post tests only
pnpm exec playwright test tests/blog-post.spec.ts

# Theme toggle tests only
pnpm exec playwright test tests/theme-toggle.spec.ts

# Navigation tests only
pnpm exec playwright test tests/navigation.spec.ts
```

### Debug Mode

```bash
# Debug a specific test
pnpm test:debug

# Or debug specific file
pnpm exec playwright test tests/homepage.spec.ts --debug
```

## View Results

```bash
# Open HTML report
pnpm exec playwright show-report

# View test results JSON
cat test-results.json

# Check screenshots (if tests failed)
open test-results/
```

## Common Commands

```bash
# Clean and rebuild
rm -rf public/ && hugo --minify

# Clean test results
rm -rf test-results/ playwright-report/

# Kill Hugo server
pkill -f "hugo server"

# Restart everything
pkill -f "hugo server" && hugo server -D --port 1313
```

## Test Coverage

- ✅ **Homepage** - 8 tests
- ✅ **Search** - 10 tests (Fuse.js)
- ✅ **Blog Posts** - 15 tests
- ✅ **Theme Toggle** - 12 tests (Dark/Light mode)
- ✅ **Navigation** - 15 tests (Posts, Dailies, TILs)

**Total: 60 comprehensive tests**

## Project Structure

```
pottekkat-website/
├── content/              # Hugo content (Markdown)
│   ├── posts/           # Blog posts
│   ├── dailies/         # Daily entries
│   └── tils/            # Today I Learned
├── themes/              # Hugo themes
│   ├── PaperMod/        # Main theme
│   └── plausible-hugo/  # Analytics theme
├── tests/               # Playwright tests
│   ├── homepage.spec.ts
│   ├── search.spec.ts
│   ├── blog-post.spec.ts
│   ├── theme-toggle.spec.ts
│   └── navigation.spec.ts
├── playwright.config.ts # Test configuration
├── package.json         # Dependencies
└── config.yml          # Hugo configuration
```

## Troubleshooting

### Hugo Server Won't Start

```bash
# Kill existing processes
pkill -f "hugo server"

# Check port availability
lsof -ti:1313 | xargs kill -9

# Restart
hugo server -D --port 1313
```

### Tests Failing

```bash
# Verify Hugo server is running
curl http://localhost:1313

# Check Hugo build has no errors
hugo --minify

# Run tests with more verbosity
pnpm exec playwright test --reporter=line
```

### Themes Missing

```bash
# Reinitialize submodules
git submodule update --init --recursive

# Force update
git submodule update --remote --merge
```

### Dependencies Issues

```bash
# Clean install
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Reinstall Playwright
pnpm exec playwright install --force
```

## Documentation

- 📖 **Full Setup Guide**: `TESTING_SETUP.md`
- 📋 **Test Documentation**: `tests/README.md`
- ⚙️ **Playwright Config**: `playwright.config.ts`
- 🌐 **Hugo Config**: `config.yml`

## Support

For issues or questions:
1. Check `TESTING_SETUP.md` for detailed information
2. View `tests/README.md` for test-specific docs
3. Consult Playwright docs: https://playwright.dev
4. Hugo documentation: https://gohugo.io/documentation/

---

**Quick Tip**: Run `pnpm test:ui` for the best debugging experience!
