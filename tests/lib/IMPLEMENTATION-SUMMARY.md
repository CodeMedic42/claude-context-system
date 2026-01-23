# Common Context Tests - Implementation Summary

## What Was Built

A simple, straightforward test library that eliminates code duplication across test plans while maintaining clarity and ease of use.

## File Structure

```
tests/lib/
├── context-data/                    # Data classes for parsing context files
│   ├── base-data.js                 # Base class with common parsing logic
│   ├── claude-data.js               # Main CLAUDE.md parser
│   ├── service-claude-data.js       # Service file parser
│   ├── client-claude-data.js        # Client file parser
│   ├── library-claude-data.js       # Library file parser
│   ├── database-claude-data.js      # Database file parser
│   └── index.js                     # Exports all classes
├── common-tests/                    # Test functions (validation logic)
│   ├── claude-tests.js              # CLAUDE.md tests
│   ├── service-tests.js             # Service file tests
│   ├── client-tests.js              # Client file tests
│   ├── library-tests.js             # Library file tests
│   ├── database-tests.js            # Database file tests
│   └── index.js                     # Exports all test functions
└── README.md                        # Documentation
```

## Key Design Decisions

### 1. One Simple Way
Instead of multiple approaches, there's exactly one way to use the library:
1. Create a `ClaudeData` instance
2. Call test functions for each file type
3. Add custom tests as needed

### 2. Separation of Concerns
- **Data classes** - Pure data access interface (no validation logic)
- **Test functions** - All validation logic lives here

Each context file type has its own data class:
- `ClaudeData` - For CLAUDE.md
- `ServiceClaudeData` - For service.claude.md
- `ClientClaudeData` - For client.claude.md
- `LibraryClaudeData` - For library.claude.md
- `DatabaseClaudeData` - For database.claude.md

All inherit from `BaseData` which provides common parsing logic.

### 3. Automatic Discovery
`ClaudeData` automatically:
- Finds CLAUDE.md or claude.md in the fixture path
- Parses all @file references
- Creates instances of sub-context classes
- Makes them accessible by project name

### 4. Test Functions Create describe() Blocks
Each test function creates its own `describe()` block internally:
- `testClaudeFile(contextData)`
- `testServiceFile(serviceData)`
- `testClientFile(clientData)`
- `testLibraryFile(libraryData)`
- `testDatabaseFile(databaseData)`

### 5. Direct Parameter Passing
No callback functions - just pass the data directly:
```javascript
testClaudeFile(contextData);  // Simple and clear
```

## Usage Pattern

```javascript
const { ClaudeData } = require('../../lib/context-data');
const {
  testClaudeFile,
  testServiceFile,
} = require('../../lib/common-tests');

describe('my-test', () => {
  const contextData = new ClaudeData(process.env.TEST_RUN_DIR);

  // Standard tests
  testClaudeFile(contextData);
  testServiceFile(contextData.getProjectContextData('My.Service'));

  // Custom tests
  describe('Custom Validation', () => {
    test('my custom test', () => {
      expect(contextData.hasSection('My Section')).toBe(true);
    });
  });
});
```

## Key Methods

### Data Access (ClaudeData and all sub-context classes)
- `getProjectContextData(name)` - Get sub-context by exact project name (returns null if not found)
- `getSubcontextList()` - Get array of all sub-context instances
- `getContextFilePath()` - Get path to the context file
- `hasSection(name)` - Check if section exists
- `getSection(name)` - Get section content
- `getMetadata()` - Get metadata object
- `checkForPlaceholders()` - Check for unreplaced placeholders
- `validateMetadata()` - Validate metadata format only (not business logic)
- `getProjectName()` - Get the project name (sub-context classes only)
- `getRequiredSections()` - Get required sections for this file type

### Test Functions (where validation logic lives)
- `testClaudeFile(claudeData)` - Validates CLAUDE.md
- `testServiceFile(serviceData)` - Validates service.claude.md
- `testClientFile(clientData)` - Validates client.claude.md
- `testLibraryFile(libraryData)` - Validates library.claude.md
- `testDatabaseFile(databaseData)` - Validates database.claude.md

## Benefits

1. **Simple** - One clear way to do things
2. **Separation of concerns** - Data access separate from validation logic
3. **Type-specific** - Each file type has its own data class and test file
4. **Modular** - Test functions split into separate files for clarity
5. **Automatic** - Auto-discovers and parses all sub-files
6. **Clean** - No callback functions, direct parameter passing
7. **Flexible** - Easy to add custom tests alongside standard tests
8. **Maintainable** - Common logic in base class, specific logic in subclasses
9. **Testable** - Data classes have no side effects, pure data access

## Migration from Old Tests

All existing tests have been updated to use the new library:
- `simple-node-service.test.js` - Service repository
- `library-package.test.js` - Library repository
- `react-client-only.test.js` - Client repository
- `dotnet-update.test.js` - Multi-project with update testing

Each test is now much shorter and clearer, with standard validation handled by the library and custom tests remaining in the test file.
