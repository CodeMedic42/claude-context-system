# Test System Documentation

Automated testing system for the Claude Context System that validates both the Claude Code plugin and Copilot CLI tool against multiple project types.

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Contest CLI](#contest-cli)
- [Test Plans](#test-plans)
- [Core Infrastructure](#core-infrastructure)
- [Creating New Test Plans](#creating-new-test-plans)
- [Development Workflows](#development-workflows)
- [Troubleshooting](#troubleshooting)

---

## Overview

The test system provides automated validation of context generation tools through:

- **Contest CLI** - Interactive command-line tool for running and managing tests
- **Test Plans** - Structured test scenarios with fixtures and validation logic
- **Core Infrastructure** - Reusable components for test orchestration
- **Persistent Results** - Test runs saved to disk for later analysis

### Key Features

✅ **Dual Tool Support** - Tests both Claude Code plugin and Copilot CLI
✅ **Persistent Test Runs** - All results saved to `~/claude-context-test-runs/`
✅ **Interactive Exploration** - Browse test results with the Contest CLI
✅ **Smart Git Setup** - Fixtures initialized with proper git history
✅ **Real-time Streaming** - See tool output as it runs
✅ **Rerun Capability** - Re-test existing runs without regeneration

---

## Quick Start

### Prerequisites

**Tools:**
- Node.js v16+
- pnpm
- Git

**For Claude Plugin:**
- Claude CLI installed (`claude` command)
- Plugin installed locally (`pnpm run plugin:install`)

**For Copilot CLI:**
- Copilot CLI installed (`copilot` command)
- Dependencies installed (`pnpm install`)

### Run Your First Test

```bash
# Install dependencies
pnpm install

# Run a single test plan
pnpm contest test --plans library-package

# View results interactively
pnpm contest list
pnpm contest open --run 1
```

### Common Commands

```bash
# Run all test plans with both tools
pnpm contest test

# Run specific plans with specific tools
pnpm contest test --tools plugin --plans dotnet-update
pnpm contest test --tools cli --plans library-package,simple-node-service

# View all test runs
pnpm contest list

# Explore test results
pnpm contest open --run 5

# Rerun tests from previous run
pnpm contest rerun --run 5

# Clean up old test runs
pnpm contest clean --keep 3
```

---

## Architecture

### High-Level Structure

```
tests/
├── cli/                          # Contest CLI tool
│   ├── bin/contest.js            # Main entry point
│   ├── commands/                 # CLI commands
│   │   ├── test.js               # Run new tests
│   │   ├── rerun.js              # Rerun existing tests
│   │   ├── open.js               # Interactive explorer
│   │   ├── list.js               # List test runs
│   │   └── clean.js              # Clean old runs
│   ├── lib/                      # CLI utilities
│   │   ├── ui-helpers.js         # Inquirer prompts
│   │   ├── jest-formatter.js     # Format Jest output
│   │   └── log-formatter.js      # Format tool logs
│   └── README.md                 # CLI documentation
│
├── plans/                        # Test plans
│   ├── simple-node-service/      # Node.js API test
│   │   ├── setup.js              # Plan configuration & hooks
│   │   ├── simple-node-service.test.js
│   │   └── fixture/              # Test project files
│   ├── library-package/          # TypeScript library test
│   ├── react-client-only/        # React client test
│   └── dotnet-update/            # .NET incremental update test
│
├── lib/                          # Core infrastructure
│   ├── execution-context.js      # CLI argument parser
│   ├── run.js                    # Test run orchestrator
│   ├── batch.js                  # Tool+Plan combination handler
│   ├── plan.js                   # Test plan loader
│   ├── context-data.js           # Claude.md parser/validator
│   └── tools/                    # Tool implementations
│       ├── tool.js               # Abstract base class
│       ├── claude-tool.js        # Claude plugin runner
│       ├── copilot-tool.js       # Copilot CLI runner
│       └── index.js              # Tool registry
│
└── run-tests.js                  # Main test orchestration entry
```

### Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. User runs: pnpm contest test --tools plugin --plans lib │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. ExecutionContext parses args and validates               │
│    - tools: ['plugin']                                      │
│    - plans: ['library-package']                             │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Run orchestrates test execution                          │
│    - Creates run directory: ~/claude-context-test-runs/008/ │
│    - Saves results.json with metadata                       │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Batch handles tool+plan combination                      │
│    - Sets up fixture with git                               │
│    - Executes tool (ClaudeTool or CopilotTool)             │
│    - Runs Jest tests                                        │
│    - Saves batch-results.json                               │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. Results saved to disk                                    │
│    ~/claude-context-test-runs/008/                          │
│    ├── results.json                                         │
│    └── plugin/                                              │
│        └── library-package/                                 │
│            ├── batch-results.json                           │
│            ├── tool.plugin.log                              │
│            └── fixture/                                     │
│                └── CLAUDE.md                                │
└─────────────────────────────────────────────────────────────┘
```

### Component Relationships

```
┌──────────────────┐
│  Contest CLI     │
│  (commands/)     │
└────────┬─────────┘
         │ uses
         ▼
┌──────────────────┐         ┌──────────────────┐
│ ExecutionContext │◄────────│ Command Line     │
│                  │ parses  │ Arguments        │
└────────┬─────────┘         └──────────────────┘
         │ creates
         ▼
┌──────────────────┐
│      Run         │───────┐
│  (orchestrator)  │       │
└────────┬─────────┘       │
         │ creates         │
         ▼                 │ manages
┌──────────────────┐       │
│     Batch        │◄──────┘
│  (tool+plan)     │
└────┬────────┬────┘
     │        │
     │        └─────────────┐
     │                      │
     ▼                      ▼
┌──────────┐         ┌─────────────┐
│   Plan   │         │    Tool     │
│ (config) │         │ (abstract)  │
└──────────┘         └──────┬──────┘
                            │
                ┌───────────┴───────────┐
                │                       │
                ▼                       ▼
         ┌─────────────┐         ┌─────────────┐
         │ ClaudeTool  │         │ CopilotTool │
         │  (plugin)   │         │    (cli)    │
         └─────────────┘         └─────────────┘
```

---

## Contest CLI

The Contest CLI (`pnpm contest`) provides an interactive way to run and manage tests.

### Commands

#### `contest test`

Run tests against tools and plans with interactive confirmation.

```bash
# Run all tests (all tools × all plans)
pnpm contest test

# Run specific tool
pnpm contest test --tools plugin
pnpm contest test --tools cli

# Run specific plans
pnpm contest test --plans library-package
pnpm contest test --plans simple-node-service,react-client-only

# Combine options
pnpm contest test --tools plugin --plans dotnet-update
```

**What it does:**
1. Validates tool and plan selections
2. Shows configuration summary and asks for confirmation
3. Creates new test run directory
4. For each tool+plan combination:
   - Sets up fixture with git repository
   - Executes tool to generate context files
   - Runs Jest tests to validate output
5. Saves all results to `~/claude-context-test-runs/{runNumber}/`

#### `contest rerun`

Rerun tests from a previous run using existing fixtures.

```bash
pnpm contest rerun --run 8
```

**What it does:**
- Loads existing run configuration
- Reruns Jest tests on existing fixtures
- Appends new test results to batch-results.json
- Useful for validating test fixes without regenerating

#### `contest open`

Interactively explore results from a test run.

```bash
pnpm contest open --run 8
```

**Features:**
- Select tool/plan batch to view
- Open fixture directory in file explorer
- View formatted tool generation logs
- Browse test results with colorized Jest output
- Navigate between multiple test runs for same batch

#### `contest list`

List all test runs with metadata.

```bash
pnpm contest list           # Show 10 most recent
pnpm contest list --limit 20  # Show 20 most recent
```

#### `contest clean`

Delete old test runs to free disk space.

```bash
pnpm contest clean           # Keep 5 most recent, delete rest
pnpm contest clean --keep 10 # Keep 10 most recent
pnpm contest clean --force   # Skip confirmation
```

### Test Run Storage

Test runs are saved to: `~/claude-context-test-runs/`

```
claude-context-test-runs/
├── 001/                         # Run number (zero-padded)
│   ├── results.json             # Run metadata
│   ├── plugin/                  # Tool results
│   │   └── library-package/     # Plan results
│   │       ├── batch-results.json   # Batch metadata + test results
│   │       ├── tool.plugin.log      # Tool execution log
│   │       └── fixture/             # Generated fixture
│   │           ├── CLAUDE.md
│   │           ├── package.json
│   │           └── src/
│   └── cli/
│       └── library-package/
└── 002/
```

See [cli/README.md](./cli/README.md) for complete CLI documentation.

---

## Test Plans

Test plans define structured test scenarios with fixtures, setup hooks, and validation tests.

### Plan Structure

```
tests/plans/my-plan/
├── setup.js                      # Plan configuration and hooks
├── my-plan.test.js               # Jest test file
└── fixture/                      # Test project files
    ├── package.json
    ├── src/
    └── README.md
```

### setup.js

Defines plan configuration and lifecycle hooks.

```javascript
module.exports = {
  // Command to run (create, update, rule)
  testCommand: 'create',

  // Optional hooks
  beforeGitSetup: (fixturePath) => {
    // Modify fixture before git init
  },

  afterGitSetup: (fixturePath) => {
    // Modify fixture after git init
    // Example: simulate code changes for update tests
  },

  beforeToolExecution: (fixturePath) => {
    // Run before tool executes
  },

  afterToolExecution: (fixturePath) => {
    // Run after tool executes
  },
};
```

### Test File

Jest test file that validates generated output.

```javascript
const path = require('path');
const fs = require('fs');
const ContextData = require('../../lib/context-data');

describe('my-plan', () => {
  const fixturePath = path.join(process.env.TEST_RUN_DIR, 'fixture');
  let metadata;

  beforeAll(() => {
    const claudeMdPath = path.join(fixturePath, 'CLAUDE.md');
    metadata = new ContextData(claudeMdPath);
  });

  test('should have required sections', () => {
    expect(metadata.hasSection('Repository Summary')).toBe(true);
  });

  test('should have valid metadata', () => {
    expect(metadata.getCommitSha()).toBeTruthy();
  });
});
```

### Existing Test Plans

#### simple-node-service
- **Type:** Node.js Express API
- **Command:** `create`
- **Validates:** Service context generation, API documentation

#### library-package
- **Type:** TypeScript utility library
- **Command:** `create`
- **Validates:** Library documentation, exports, usage examples

#### react-client-only
- **Type:** React frontend application
- **Command:** `create`
- **Validates:** Client documentation, component structure

#### dotnet-update
- **Type:** .NET solution with multiple projects
- **Command:** `update`
- **Special:** Simulates incremental changes (library removal, new API, new CLI)
- **Validates:** Update detection, content preservation, change tracking

---

## Core Infrastructure

### ExecutionContext

Parses and validates command-line arguments.

**Located:** `tests/lib/execution-context.js`

**Responsibilities:**
- Parse `tool=` and `plan=` arguments
- Validate tool and plan selections
- Detect rerun requests
- Load available plans from `tests/plans/`
- Load available tools from `tests/lib/tools/`

**Usage:**
```javascript
const ExecutionContext = require('./lib/execution-context');
const context = new ExecutionContext();
// context.tools = ['plugin', 'cli']
// context.plans = ['library-package']
// context.rerun = 8
```

### Run

Orchestrates complete test run execution.

**Located:** `tests/lib/run.js`

**Responsibilities:**
- Create run directory
- Manage multiple batches (tool × plan combinations)
- Coordinate batch execution
- Save run metadata (`results.json`)
- Report overall results

**Key Methods:**
- `start()` - Execute full test run
- `createBatches()` - Create batch for each tool+plan combo

### Batch

Handles a single tool+plan combination.

**Located:** `tests/lib/batch.js`

**Responsibilities:**
- Set up fixture with git repository
- Execute tool (ClaudeTool or CopilotTool)
- Run Jest tests
- Save batch results (`batch-results.json`)

**Key Methods:**
- `generate()` - Set up fixture and run tool
- `test()` - Execute Jest tests
- `writeBatchResults()` - Persist results to disk

**Batch Lifecycle:**
1. **Setup Fixture:**
   - Copy plan fixture to batch directory
   - Initialize git repository
   - Create base commit (code only)
   - Update context file SHAs
   - Create second commit (with context files)
   - Run `afterGitSetup` hook (if defined)

2. **Generate:**
   - Run `beforeToolExecution` hook
   - Execute tool (ClaudeTool or CopilotTool)
   - Run `afterToolExecution` hook
   - Save generation results

3. **Test:**
   - Run Jest on plan test file
   - Set `TEST_RUN_DIR` env var to batch directory
   - Capture test output
   - Save test results

### Plan

Loads test plan configuration and hooks.

**Located:** `tests/lib/plan.js`

**Responsibilities:**
- Load `setup.js` configuration
- Provide default hooks if not defined
- Expose plan metadata

**Properties:**
- `id` - Plan identifier (directory name)
- `planDir` - Path to plan directory
- `fixtureDir` - Path to fixture subdirectory
- `testCommand` - Command to run (create, update, rule)
- `hooks` - Lifecycle hooks object

### Tool (Abstract)

Base class for tool implementations.

**Located:** `tests/lib/tools/tool.js`

**Interface:**
- `isAvailable()` - Check if tool can run
- `run({ batch, command })` - Execute tool
- `getName()` - Get tool display name
- `getId()` - Get tool identifier

### ClaudeTool

Executes Claude Code plugin via Claude CLI.

**Located:** `tests/lib/tools/claude-tool.js`

**Implementation:**
- Spawns `claude` process with streaming JSON output
- Uses `--bypass` and `--permission-mode bypassPermissions`
- Parses streaming JSON to show real-time progress
- Displays tool uses and text deltas
- Saves full log to `tool.plugin.log`

### CopilotTool

Executes Copilot CLI tool.

**Located:** `tests/lib/tools/copilot-tool.js`

**Implementation:**
- Spawns `node copilot-plugin.js` with command
- Sets `COPILOT_AUTO_APPROVE=true` for non-interactive mode
- Captures stdout/stderr
- Saves full log to `tool.cli.log`

### ContextData

Parses and validates generated CLAUDE.md files.

**Located:** `tests/lib/context-data.js`

**Capabilities:**
- Parse markdown structure
- Extract sections
- Parse metadata
- Identify sub-files (@file references)
- Validate completeness
- Check for placeholders

**Common Usage:**
```javascript
const ContextData = require('./lib/context-data');
const metadata = new ContextData('/path/to/CLAUDE.md');

// Check sections
metadata.hasSection('Repository Summary');
metadata.getSection('Environment Setup');

// Check metadata
metadata.getCommitSha();
metadata.getTemplateVersion();

// Check sub-files
metadata.getServiceFiles();
metadata.doServiceFilesExist();

// Validate
const validation = metadata.validateAll();
```

---

## Creating New Test Plans

### Step 1: Create Plan Directory

```bash
mkdir -p tests/plans/my-new-plan/fixture
```

### Step 2: Add Fixture Files

Create a realistic project in `fixture/`:

```bash
cd tests/plans/my-new-plan/fixture
npm init -y
# Add source files, README, etc.
```

### Step 3: Create setup.js

```javascript
module.exports = {
  testCommand: 'create', // or 'update', 'rule'

  // Optional: Modify fixture after git setup
  afterGitSetup: (fixturePath) => {
    // Simulate changes for update tests
  },
};
```

### Step 4: Create Test File

```javascript
const path = require('path');
const fs = require('fs');
const ContextData = require('../../lib/context-data');

describe('my-new-plan', () => {
  const fixturePath = path.join(process.env.TEST_RUN_DIR, 'fixture');
  let metadata;

  beforeAll(() => {
    const claudeMdPath = path.join(fixturePath, 'CLAUDE.md');
    metadata = new ContextData(claudeMdPath);
  });

  describe('Required Sections', () => {
    test('should have Repository Summary', () => {
      expect(metadata.hasSection('Repository Summary')).toBe(true);
    });
  });

  describe('Metadata', () => {
    test('should have valid commit SHA', () => {
      const sha = metadata.getCommitSha();
      expect(sha).toBeTruthy();
      expect(sha).toMatch(/^[a-f0-9]{40}$/);
    });
  });
});
```

### Step 5: Run Your Test

```bash
pnpm contest test --plans my-new-plan
```

---

## Development Workflows

### Testing Template Changes

```bash
# 1. Modify template
vim shared/templates/CLAUDE.TEMPLATE.md

# 2. Sync to packages
pnpm run sync

# 3. Test with both tools
pnpm contest test --plans library-package

# 4. View results
pnpm contest open --run <run-number>
```

### Debugging Failed Tests

```bash
# 1. Run test
pnpm contest test --plans dotnet-update

# 2. Open results interactively
pnpm contest open --run <run-number>

# 3. Select failed batch

# 4. View tool log to see generation errors

# 5. View Jest output to see test failures

# 6. Open fixture to inspect generated files
```

### Testing Both Tools

```bash
# Run with both tools
pnpm contest test --tools plugin,cli --plans simple-node-service

# Compare results
pnpm contest open --run <run-number>
# Select plugin batch, view results
# Select cli batch, compare
```

### Iterating on a Test Plan

```bash
# 1. Modify test plan
vim tests/plans/library-package/library-package.test.js

# 2. Rerun tests without regenerating
pnpm contest rerun --run <run-number>

# 3. View updated results
pnpm contest open --run <run-number>
```

---

## Troubleshooting

### "Tool is not available"

**For Claude Plugin:**
```bash
which claude                # Check if installed
pnpm run plugin:install     # Install locally
```

**For Copilot CLI:**
```bash
which copilot               # Check if installed
ls copilot-context-cli/bin/copilot-plugin.js  # Check script exists
```

### Generation Failed

1. Open the test run: `pnpm contest open --run <N>`
2. Select the failed batch
3. View tool generation log
4. Look for errors in the log
5. Common issues:
   - Git working tree not clean
   - Template files not found
   - Tool crashed or timed out

### Tests Failed

1. Open the test run: `pnpm contest open --run <N>`
2. Select the batch with failures
3. View test results
4. Common issues:
   - Missing required sections
   - Invalid metadata
   - Unreplaced placeholders
   - Sub-files not created

### Copilot CLI: Template Files Not Found

The Copilot CLI looks for templates at `../templates/` relative to the fixture. If templates are missing:

1. Check that `copilot-context-cli/templates/` exists
2. Run `pnpm run sync` to sync templates
3. The CopilotTool should copy templates to batch directory (fix pending)

### Old Test Runs Taking Up Space

```bash
# Clean up old runs, keep 5 most recent
pnpm contest clean --keep 5

# Or manually delete
rm -rf ~/claude-context-test-runs/<run-number>
```

### Can't Find Test Run

```bash
# List all runs
pnpm contest list

# Check run directory
ls ~/claude-context-test-runs/
```

---

## See Also

- [Contest CLI Documentation](./cli/README.md) - Complete CLI reference
- [ContextData API](./lib/context-data.js) - Parser/validator implementation
- [Main Repository Testing Strategy](../TESTING.md) - Overall testing approach
