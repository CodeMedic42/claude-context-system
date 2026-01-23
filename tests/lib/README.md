# Common Context Tests Library

A simple, reusable test library for validating CLAUDE.md context files across all test plans.

## File Structure

```
tests/lib/
├── context-data/           # Data classes (pure data access)
│   ├── base-data.js
│   ├── claude-data.js
│   ├── service-claude-data.js
│   ├── client-claude-data.js
│   ├── library-claude-data.js
│   ├── database-claude-data.js
│   └── index.js
└── common-tests/           # Test functions (validation logic)
    ├── claude-tests.js
    ├── service-tests.js
    ├── client-tests.js
    ├── library-tests.js
    ├── database-tests.js
    └── index.js
```

## Design Philosophy

- **Data classes** - Pure data access interface to context files (no validation logic)
- **Test functions** - All validation logic lives in test functions
- **Separation** - Each context file type has its own test file

## Quick Start

```javascript
const { ClaudeData } = require('../../lib/context-data');
const {
  testClaudeFile,
  testServiceFile,
} = require('../../lib/common-tests');

describe('my-test', () => {
  const contextData = new ClaudeData(process.env.TEST_RUN_DIR);

  // Test CLAUDE.md
  testClaudeFile(contextData, {
    subContextFileCount: 1
  });

  // Test service.claude.md
  const serviceData = contextData.getProjectContextData('My.Service');
  testServiceFile(serviceData);

  // Custom tests
  describe('Custom Validation', () => {
    test('my custom test', () => {
      expect(contextData.hasSection('My Section')).toBe(true);
    });
  });
});
```

## ClaudeData Class

**Purpose:** Data access interface to CLAUDE.md files (no validation logic)

**Constructor:**
```javascript
const contextData = new ClaudeData(fixturePath);
// Automatically finds CLAUDE.md or claude.md
// Automatically parses all @file references and creates sub-context instances
```

**Data Access Methods:**
- `getProjectContextData(projectName)` - Get sub-context instance by project name (returns null if not found)
- `getSubcontextList()` - Get array of all sub-context instances
- `getContextFilePath()` - Get path to CLAUDE.md
- `hasSection(sectionName)` - Check if section exists
- `getSection(sectionName)` - Get section content
- `getMetadata()` - Get metadata object
- `getDateCreated()` - Get date created
- `getDateModified()` - Get date modified
- `getCommitSha()` - Get commit SHA
- `getTemplateVersion()` - Get template version
- `checkForPlaceholders()` - Check for unreplaced placeholders
- `validateMetadata()` - Validate metadata format (only formatting, not business logic)

## Test Functions

Each function creates a `describe()` block with standard validation tests.

### Available from `common-tests/index.js`
- `testClaudeFile(claudeData)` - Tests for CLAUDE.md (from `claude-tests.js`)
- `testServiceFile(serviceData)` - Tests for service.claude.md (from `service-tests.js`)
- `testClientFile(clientData)` - Tests for client.claude.md (from `client-tests.js`)
- `testLibraryFile(libraryData)` - Tests for library.claude.md (from `library-tests.js`)
- `testDatabaseFile(databaseData)` - Tests for database.claude.md (from `database-tests.js`)

**Import from index:** You can import all functions from `common-tests/index.js` or import specific functions from individual test files.

**Note:** All validation logic lives in these test functions, not in the data classes.

## Sub-Context Classes

Each sub-context file has its own class:
- `ServiceClaudeData` - For service.claude.md files
- `ClientClaudeData` - For client.claude.md files
- `LibraryClaudeData` - For library.claude.md files
- `DatabaseClaudeData` - For database.claude.md files

All inherit from `BaseData` and have the same interface as `ClaudeData`.

## Examples

### Service Repository
```javascript
const contextData = new ClaudeData(process.env.TEST_RUN_DIR);

testClaudeFile(contextData, {
  subContextFileCount: 1
});

testServiceFile(contextData.getProjectContextData('MyService'));
```

### Client Repository
```javascript
const contextData = new ClaudeData(process.env.TEST_RUN_DIR);

testClaudeFile(contextData, {
  subContextFileCount: 1
});
testClientFile(contextData.getProjectContextData('MyClient'));
```

### Library Repository
```javascript
const contextData = new ClaudeData(process.env.TEST_RUN_DIR);

testClaudeFile(contextData, {
  subContextFileCount: 1
});
testLibraryFile(contextData.getProjectContextData('MyLibrary'));
```

### Multi-Project Repository
```javascript
const contextData = new ClaudeData(process.env.TEST_RUN_DIR);

testClaudeFile(contextData, {
  subContextFileCount: 2
});
testServiceFile(contextData.getProjectContextData('Service.Api'));
testClientFile(contextData.getProjectContextData('Service.Cli'));

describe('Custom Tests', () => {
  test('should have 1 service and 1 client', () => {
    const subcontexts = contextData.getSubcontextList();
    const services = subcontexts.filter(ctx => ctx.constructor.name === 'ServiceClaudeData');
    const clients = subcontexts.filter(ctx => ctx.constructor.name === 'ClientClaudeData');
    expect(services.length).toBe(1);
    expect(clients.length).toBe(1);
  });
});
```

## Custom Assertions

Use the data classes for custom assertions:

```javascript
// Check section existence
expect(contextData.hasSection('My Section')).toBe(true);

// Get section content
const content = contextData.getSection('Repository Summary');
expect(content).toContain('expected text');

// Count sub-contexts by type
const subcontexts = contextData.getSubcontextList();
const services = subcontexts.filter(ctx => ctx.constructor.name === 'ServiceClaudeData');
expect(services.length).toBe(2);

// Access sub-context data
const serviceData = contextData.getProjectContextData('My.Service');
expect(serviceData.hasSection('API Documentation')).toBe(true);
```

## Project Name Matching

Project names are extracted from the @file path:
- `@file ./MyService/service.claude.md` → project name is `MyService`
- `@file ./Service.Api/service.claude.md` → project name is `Service.Api`
- `@file ./my-lib/library.claude.md` → project name is `my-lib`

Use exact project names when calling `getProjectContextData()`.
