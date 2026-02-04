# Facebook React Test Plan

This test plan uses the real React repository (v19.0.0) to test the context generation system.

## Overview

- **Repository**: https://github.com/facebook/react
- **Version**: v19.0.0
- **Cache Location**: `~/claude-context-test-runs/repo-cache/github.com/facebook/react/v19.0.0.zip`

## How It Works

1. **First Run**: Downloads React v19.0.0 ZIP from GitHub and caches it
2. **Subsequent Runs**: Extracts from cached ZIP file (much faster)
3. **Fixture Setup**: Extracts to test fixture directory and initializes as a new git repo

## Fixture Setup Process

The `beforeFixtureSetup` hook in `setup.js`:

1. Checks if ZIP is cached at `~/claude-context-test-runs/repo-cache/github.com/facebook/react/v19.0.0.zip`
2. If not cached, downloads from GitHub (with progress logging)
3. Extracts ZIP to fixture directory
4. Flattens directory structure (moves contents out of `react-19.0.0/` subdirectory)
5. The existing test infrastructure then runs `git init` on the fixture

## Cache Benefits

- **First run**: ~30-60 seconds (download + extract)
- **Cached runs**: ~5-10 seconds (extract only)
- **Disk usage**: ~50-60 MB for cached ZIP

## Test Configuration

- **Test Command**: `prepare` (creates action plan)
- **Token Limit**: 100,000 (React is a large monorepo)

## Notes

- The downloaded repo has NO git history (just the files at v19.0.0)
- Git is initialized fresh by the test system
- Changes to the fixture do NOT affect the source repository
- Cache is persistent across test runs (manual cleanup required)

## Writing Tests

You can now write tests in this directory:

```javascript
// context-plan.test.js - Test action plan generation
// context-progress-0.test.js - Test progress tracking
// context.test.js - Test generated CLAUDE.md
```

See other test plans for examples.
