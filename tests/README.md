# Plugin Testing Guide

This directory contains automated tests for the Claude Context Updater plugin.

## Test Structure

```
tests/
├── lib/
│   ├── ClaudeMdMetadata.js       # Parser/validator for claude.md files
│   └── testHelpers.js            # Test utilities
├── fixtures/
│   ├── simple-node-service/      # Test fixture: Node.js service
│   ├── library-package/          # Test fixture: TypeScript library
│   └── react-client-only/        # Test fixture: React client app
├── simple-node-service.test.js   # Tests for simple-node-service fixture
├── library-package.test.js       # Tests for library-package fixture
├── react-client-only.test.js     # Tests for react-client-only fixture
└── README.md                     # This file
```

## How It Works

### Two-Step Process

**Step 1: Generate Fixtures** (manual, uses Claude CLI)
```bash
pnpm run test:generate
```
This runs the plugin via Claude CLI to create `claude.md` files for each fixture.

**Step 2: Run Tests** (automated, uses Jest)
```bash
pnpm test
```
Tests validate the generated files using the ClaudeMdMetadata class.

### 1. ClaudeMdMetadata Class

The `ClaudeMdMetadata` class is the core of the testing system. It:

- Loads and parses a `claude.md` file
- Extracts all sections (Repository Summary, Services and APIs, etc.)
- Parses metadata (dates, commit SHA, template version)
- Identifies referenced sub-files (service.claude.md, client.claude.md, etc.)
- Provides validation methods

**Example usage:**

```javascript
const ClaudeMdMetadata = require('./lib/ClaudeMdMetadata');

const metadata = new ClaudeMdMetadata('/path/to/repo/claude.md');

// Check sections
if (metadata.hasSection('Services and APIs')) {
  const content = metadata.getSection('Services and APIs');
  console.log(content);
}

// Check sub-files
const serviceFiles = metadata.getServiceFiles();
console.log(`Found ${serviceFiles.length} service files`);

// Validate
const validation = metadata.validateAll();
if (!validation.valid) {
  console.error('Errors:', validation.errors);
}
```

### 2. Test Fixtures

Each fixture is a complete mini-repository that represents a different type of project:

- **simple-node-service**: A basic Express.js REST API (should generate service.claude.md)
- **library-package**: A TypeScript utility library (should generate library.claude.md)
- **react-client-only**: A React frontend app (should generate client.claude.md)

### 3. Individual Test Files

Each fixture has its own test file that:

1. **Checks claude.md exists** (expects it was already generated)
2. **Creates ClaudeMdMetadata instance**
3. **Runs tests** to verify:
   - Required sections exist
   - Correct project-type sections exist (Services, Clients, Libraries, Databases)
   - Appropriate sub-files were created
   - Metadata is valid
   - No unreplaced placeholders
   - All referenced files exist

## Running Tests

### Quick Start

See [QUICKSTART.md](QUICKSTART.md) for the fastest way to get started.

### Full Workflow

**Step 1: Install dependencies**
```bash
pnpm install
```

**Step 2: Generate test fixtures** (uses Claude CLI)
```bash
pnpm run test:generate
```
This opens Claude CLI for each fixture and prompts you to run the plugin command.

**Step 3: Run tests**
```bash
pnpm test                    # Run all tests
pnpm test simple-node        # Run specific test
pnpm test:watch              # Watch mode
pnpm test:coverage           # With coverage
pnpm test:verbose            # Detailed output
```

### Manual Generation (Single Fixture)

To generate a specific fixture manually:

```bash
cd tests/fixtures/simple-node-service

# Initialize git if needed
git init && git add . && git commit -m "Initial commit"

# Run Claude CLI
claude

# In Claude, run the command:
/claude-context-updater:ctx-update

# Return to root and test
cd ../../..
pnpm test simple-node-service
```

## Adding New Test Fixtures

To add a new test fixture:

1. **Create fixture directory:**
   ```bash
   mkdir tests/fixtures/my-new-fixture
   ```

2. **Add fixture files:**
   Create a realistic project structure (package.json, source files, etc.)

3. **Create test file:**
   ```bash
   cp tests/simple-node-service.test.js tests/my-new-fixture.test.js
   ```

4. **Customize tests:**
   Update the test file to match your fixture's expected output:
   - Which sections should exist?
   - Which sub-files should be created?
   - Any special validations?

5. **Generate claude.md:**
   Run the plugin in the fixture directory

6. **Run tests:**
   ```bash
   pnpm test my-new-fixture
   ```

## Test Patterns

### Testing for Section Presence

```javascript
test('should have Services and APIs section', () => {
  expect(metadata.hasSection('Services and APIs')).toBe(true);
});
```

### Testing for Section Absence

```javascript
test('should NOT have Databases section', () => {
  expect(metadata.hasSection('Databases')).toBe(false);
});
```

### Testing Sub-files

```javascript
test('should have created service.claude.md file', () => {
  const serviceFiles = metadata.getServiceFiles();
  expect(serviceFiles.length).toBe(1);
  expect(metadata.doServiceFilesExist()).toBe(true);
});
```

### Testing Metadata

```javascript
test('should have valid metadata', () => {
  const validation = metadata.validateMetadata();
  expect(validation.valid).toBe(true);
});
```

### Testing Content Quality

```javascript
test('should not have unreplaced placeholders', () => {
  const check = metadata.checkForPlaceholders();
  expect(check.hasPlaceholders).toBe(false);
});
```

## ClaudeMdMetadata API Reference

### Constructor

```javascript
new ClaudeMdMetadata(claudeMdPath)
```

### Section Methods

- `hasSection(name)` - Check if section exists
- `getSection(name)` - Get section content
- `getAllSectionNames()` - Get all section names

### Metadata Methods

- `getMetadata()` - Get all metadata
- `getDateCreated()` - Get creation date
- `getDateModified()` - Get modification date
- `getCommitSha()` - Get git commit SHA
- `getTemplateVersion()` - Get template version

### Sub-file Methods

- `getServiceFiles()` - Get array of service file references
- `getClientFiles()` - Get array of client file references
- `getLibraryFiles()` - Get array of library file references
- `getDatabaseFiles()` - Get array of database file references
- `doServiceFilesExist()` - Check if all service files exist
- `doClientFilesExist()` - Check if all client files exist
- `doLibraryFilesExist()` - Check if all library files exist
- `doDatabaseFilesExist()` - Check if all database files exist

### Validation Methods

- `validateRequiredSections(sections)` - Validate required sections exist
- `validateForbiddenSections(sections)` - Validate sections don't exist
- `validateMetadata()` - Validate metadata is complete and correct
- `checkForPlaceholders()` - Check for unreplaced `{placeholders}`
- `validateSubFilesExist()` - Validate all referenced files exist
- `validateAll()` - Run all validations

## Continuous Integration

To run tests in CI (GitHub Actions):

```yaml
# .github/workflows/test.yml
name: Plugin Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Install dependencies
        run: pnpm install

      - name: Run tests
        run: pnpm test

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
```

## Troubleshooting

### "claude.md not found" Error

The test expects a `claude.md` file to exist in the fixture directory. Generate it by:

1. Running the plugin manually in that fixture
2. Or implementing automated plugin execution (future enhancement)

### Tests Failing After Template Changes

If you update the templates:

1. Regenerate all fixture `claude.md` files
2. Update tests if section names or structure changed
3. Run tests to verify

### Sub-file Not Found Errors

Ensure all referenced files (service.claude.md, etc.) were actually created by the plugin and are in the expected locations.

## Future Enhancements

- [ ] Automate plugin execution via Claude API
- [ ] Add snapshot testing for content comparison
- [ ] Add performance benchmarks
- [ ] Test update functionality (not just creation)
- [ ] Add tests for monorepo fixtures
- [ ] Add tests for mixed-language fixtures
- [ ] Add tests for existing-claude-md fixture
