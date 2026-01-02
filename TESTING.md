# Testing Strategy for Claude Context Updater Plugin

## Overview

This document describes the automated testing strategy for the Claude Context Updater plugin. The test infrastructure includes an interactive test-runner CLI that automates fixture generation, testing, and results tracking.

## Architecture

### Key Components

1. **Test Runner CLI** (`test-runner/`)
   - Interactive CLI for creating and managing test runs
   - Automates Claude CLI execution for multiple fixtures
   - Tracks token usage and costs
   - Runs Jest tests automatically
   - Parallel execution support with interactive UI
   - Start with: `pnpm run start:test-runner`

2. **ClaudeMdMetadata Class** (`tests/lib/ClaudeMdMetadata.js`)
   - Parses and validates `claude.md` files
   - Extracts sections, metadata, and file references
   - Provides validation methods
   - Reusable across all test files

3. **Test Fixtures** (`tests/fixtures/`)
   - Mini-repositories representing different project types
   - Each fixture is a complete, realistic project
   - Examples: Node service, React client, TypeScript library

4. **Individual Test Files** (`tests/*.test.js`)
   - One test file per fixture
   - Tests validate the generated `claude.md` files
   - Check for correct sections, sub-files, and metadata
   - Support both fixture-based and test-run-based execution

5. **Test Helpers** (`tests/lib/testHelpers.js`)
   - Utilities for running plugin and managing fixtures
   - Git operations, file cleanup, etc.

## Test Workflow

### Automated Test Runner (Recommended)

**Start the interactive test runner:**
```bash
pnpm run start:test-runner
```

The test runner provides:
- **Create new test run**: Select fixtures, generate claude.md files, run tests
- **Run tests for existing run**: Re-run tests without regenerating
- **List all test runs**: View history with token usage and results
- **Compare test runs**: Diff between two runs
- **Clean up old runs**: Remove test run directories

**Features:**
- Copies fixtures to isolated test run directories
- Runs Claude CLI automatically in bypass mode
- Tracks token usage and actual costs
- Shows improved cost estimates based on historical data
- Runs Jest tests automatically
- Parallel execution for multiple fixtures

### Manual Testing (Alternative)

**Run Jest tests directly:**
```bash
pnpm test
```

This validates pre-generated `claude.md` files in the fixtures directories.

## Test Structure

### Example Test File Pattern

```javascript
describe('fixture-name', () => {
  let metadata;

  beforeAll(async () => {
    // Run plugin to generate claude.md
    await runPluginCommand(fixturePath);

    // Create metadata instance
    metadata = new ClaudeMdMetadata(claudeMdPath);
  });

  describe('Required Sections', () => {
    test('should have Repository Summary', () => {
      expect(metadata.hasSection('Repository Summary')).toBe(true);
    });
  });

  describe('Project Type Sections', () => {
    test('should have Services and APIs section', () => {
      expect(metadata.hasSection('Services and APIs')).toBe(true);
    });
  });

  describe('Sub-files', () => {
    test('should have created service.claude.md', () => {
      const files = metadata.getServiceFiles();
      expect(files.length).toBe(1);
      expect(metadata.doServiceFilesExist()).toBe(true);
    });
  });

  describe('Metadata', () => {
    test('should have valid metadata', () => {
      const validation = metadata.validateMetadata();
      expect(validation.valid).toBe(true);
    });
  });
});
```

## Test Fixtures

### Existing Fixtures

1. **simple-node-service**
   - Type: Node.js Express service
   - Expected: `service.claude.md` created
   - Expected sections: Services and APIs
   - No clients, libraries, or databases

2. **library-package**
   - Type: TypeScript utility library
   - Expected: `library.claude.md` created
   - Expected sections: Libraries and Plugins
   - No services, clients, or databases

3. **react-client-only**
   - Type: React frontend application
   - Expected: `client.claude.md` created
   - Expected sections: User Interaction Clients
   - No services, libraries, or databases

### Future Fixtures

- **monorepo-with-services**: Multiple services in one repo
- **mixed-languages**: Java + TypeScript + Python
- **existing-claude-md**: Repository with existing claude.md (test update logic)
- **nextjs-full-stack**: Both client and service (hybrid)
- **with-database**: Repository with Prisma/TypeORM schemas

## Running Tests

```bash
# Install dependencies
pnpm install

# Generate test fixtures (one-time or when plugin changes)
pnpm run test:generate

# Run all tests
pnpm test

# Run specific test
pnpm test simple-node-service

# Watch mode (for development)
pnpm test:watch

# Coverage report
pnpm test:coverage

# Verbose output
pnpm test:verbose
```

## ClaudeMdMetadata API

### Core Methods

- `hasSection(name)` - Check if section exists
- `getSection(name)` - Get section content
- `getServiceFiles()` - Get array of service file references
- `getClientFiles()` - Get array of client file references
- `getLibraryFiles()` - Get array of library file references
- `getDatabaseFiles()` - Get array of database file references
- `doServiceFilesExist()` - Verify service files exist on disk
- `validateMetadata()` - Validate metadata completeness
- `checkForPlaceholders()` - Find unreplaced `{placeholders}`
- `validateAll()` - Run all validations

## Adding New Tests

### Step 1: Create Fixture

```bash
mkdir tests/fixtures/my-new-fixture
cd tests/fixtures/my-new-fixture

# Add realistic project files
```

### Step 2: Create Test File

```bash
cp tests/simple-node-service.test.js tests/my-new-fixture.test.js
```

### Step 3: Customize Tests

Edit the test file to match expected behavior:
- Which sections should exist?
- Which sub-files should be created?
- Any special validations?

### Step 4: Generate and Test

```bash
# Generate claude.md in fixture (manually for now)
cd tests/fixtures/my-new-fixture
# Run plugin...

# Run tests
cd ../../..
pnpm test my-new-fixture
```

## Best Practices

1. **Keep fixtures realistic** - Use real project structures
2. **Test both presence and absence** - Verify expected sections exist AND unexpected ones don't
3. **Validate sub-files** - Don't just check references, verify files exist
4. **Check metadata quality** - Ensure dates, SHAs, versions are valid
5. **Look for placeholders** - Catch unreplaced `{instructions}`

## Future Enhancements

- [ ] Automate plugin execution via Claude API
- [ ] Add snapshot testing for content comparison
- [ ] Test update functionality (not just creation)
- [ ] Add performance benchmarks
- [ ] Test monorepo scenarios
- [ ] Test mixed-language projects
- [ ] Test update/merge logic with existing claude.md
- [ ] Add GitHub Actions CI integration
- [ ] Create test coverage badges

## Troubleshooting

### Tests failing with "claude.md not found"

Generate the claude.md file manually in the fixture directory first.

### Sub-file validation fails

Ensure the plugin actually created the referenced files (service.claude.md, etc.).

### Metadata validation fails

Check that:
- Commit SHA is 40-character hex
- Template version is valid semver (X.Y.Z)
- Dates are valid ISO 8601 format

## CI Integration

Example GitHub Actions workflow:

```yaml
name: Plugin Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - run: pnpm install
      - run: pnpm test
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
```

## Summary

This testing strategy provides:

✅ **Reusable validation** via ClaudeMdMetadata class
✅ **Clear test structure** - one file per fixture
✅ **Comprehensive checks** - sections, sub-files, metadata, content quality
✅ **Easy to extend** - add new fixtures and tests easily
✅ **Production-ready** - can integrate with CI/CD

The current implementation provides the foundation. Future work will focus on automating plugin execution to make tests fully automated.
