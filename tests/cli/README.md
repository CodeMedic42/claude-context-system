# Contest CLI - Context System Test Runner

**Contest** is a command-line interface for running and managing tests for the Claude Context System. It provides an intuitive way to test context generation tools (Claude Code Plugin and Copilot CLI) against various project fixtures.

## Installation

The CLI is available as a private package script. No separate installation is needed:

```bash
# From repository root
pnpm contest --help
```

## Commands

### `contest test`

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
pnpm contest test -t cli -p library-package,react-client-only
```

**Options:**
- `-t, --tools <tools>` - Comma-separated list of tools: `plugin`, `cli` (default: all)
- `-p, --plans <plans>` - Comma-separated list of plans (default: all available)

**What it does:**
1. Validates your tool and plan selections
2. Shows configuration summary and asks for confirmation
3. Sets up test fixtures with git repositories
4. Executes the selected tool(s) to generate context files
5. Runs Jest tests to validate the output
6. Saves results to `~/claude-context-test-runs/{runNumber}/`

---

### `contest rerun`

Rerun tests from a previous test run using the same configuration.

```bash
# Rerun test run #8
pnpm contest rerun --run 8
pnpm contest rerun -r 8
```

**Options:**
- `-r, --run <number>` - Run number to repeat (required)

**What it does:**
- Loads the configuration from the specified run
- Reruns tests on the existing fixtures (does not regenerate)
- Appends new test results to the batch results

---

### `contest open`

Interactively explore results from a test run.

```bash
# Open test run #8
pnpm contest open --run 8
pnpm contest open -r 8
```

**Options:**
- `-r, --run <number>` - Run number to open (required)

**Interactive Menu:**
1. **Select batch** - Choose a tool/plan combination to inspect
2. **View batch details** - See generation and test results summary
3. **Available actions:**
   - 📂 **Open fixture in file explorer** - Opens the generated fixture directory
   - 📄 **View tool generation log** - Shows formatted output from Claude/Copilot
   - 🧪 **View test results** - Browse and display Jest test results
4. **Navigate** - Return to batch list or exit

**Log Formatting:**
- Claude logs are parsed from streaming JSON and displayed naturally
- Shows Claude's text responses and tool uses (Read, Write, Bash, etc.)
- Jest output is colorized for easy reading

---

### `contest list`

List all test runs with details.

```bash
# List recent test runs
pnpm contest list

# Show more runs
pnpm contest list --limit 20
pnpm contest list -n 20
```

**Options:**
- `-n, --limit <number>` - Number of recent runs to show (default: 10)

**Output:**
```
📊 Test Runs (showing 10 of 15):

Run 015:
  Created: 1/21/2026, 10:30:45 AM
  Tools: plugin, cli
  Plans: library-package, simple-node-service

Run 014:
  Created: 1/21/2026, 9:15:22 AM
  Tools: plugin
  Plans: dotnet-update
...
```

---

### `contest clean`

Delete old test runs to free up disk space.

```bash
# Keep 5 most recent runs, delete the rest
pnpm contest clean

# Keep specific number of runs
pnpm contest clean --keep 10
pnpm contest clean -k 3

# Skip confirmation prompt
pnpm contest clean --force
pnpm contest clean -k 5 --force
```

**Options:**
- `-k, --keep <number>` - Number of recent runs to keep (default: 5)
- `-f, --force` - Skip confirmation prompt

**What it does:**
1. Scans `~/claude-context-test-runs/` for test runs
2. Sorts by run number (descending)
3. Keeps the N most recent runs
4. Asks for confirmation (unless `--force`)
5. Deletes older runs permanently

---

## Test Run Structure

Test runs are saved to: `~/claude-context-test-runs/`

```
claude-context-test-runs/
├── 001/                         # Run number (zero-padded)
│   ├── results.json             # High-level run metadata
│   ├── plugin/                  # Tool-specific results
│   │   ├── library-package/     # Plan-specific results
│   │   │   ├── batch-results.json   # Batch metadata + test results
│   │   │   ├── tool.plugin.log      # Tool generation log
│   │   │   └── fixture/             # Generated test fixture
│   │   │       ├── CLAUDE.md
│   │   │       └── ...
│   │   └── simple-node-service/
│   └── cli/
│       └── library-package/
└── 002/
```

### `results.json`
```json
{
  "runNumber": 1,
  "planIds": ["library-package", "simple-node-service"],
  "toolIds": ["plugin", "cli"]
}
```

### `batch-results.json`
```json
{
  "toolId": "plugin",
  "planId": "library-package",
  "generationResults": {
    "generatedOn": "2026-01-21T10:30:45.123Z",
    "success": true,
    "error": ""
  },
  "testResults": [
    {
      "ranOn": "2026-01-21T10:31:02.456Z",
      "status": "success",
      "passed": 15,
      "failed": 0,
      "log": "... full Jest output ..."
    }
  ]
}
```

---

## Examples

### Run Tests for a New Feature

```bash
# Test dotnet-update plan with both tools
pnpm contest test --plans dotnet-update

# Review output
✓ Confirm configuration

🚀 Starting test run 16
   Plans: dotnet-update
   Tools: plugin, cli

  Generating context: dotnet-update (plugin)...
  ✓ Generated successfully

  Running tests: dotnet-update (plugin)...
  ✓ Tests passed: 12 tests in 2.3s

  Generating context: dotnet-update (cli)...
  ✓ Generated successfully

  Running tests: dotnet-update (cli)...
  ✓ Tests passed: 12 tests in 1.8s

📊 Test Run 16 Complete
Total Passed: 24
Total Failed: 0
Status: ✅ PASSED
```

### Explore Failed Test Results

```bash
# Run returned errors, let's investigate
pnpm contest open --run 16

# Interactive menu:
# 1. Select batch: "plugin / dotnet-update"
# 2. View test results
# 3. See formatted Jest output with failures highlighted
# 4. Open fixture to inspect generated files
```

### Clean Up Old Runs

```bash
# Check what runs exist
pnpm contest list

# Keep only 3 most recent
pnpm contest clean --keep 3

⚠️  Warning: This will delete test runs permanently!
   Keeping: 3 most recent run(s)
   Deleting: 12 run(s)

? Are you sure you want to delete these runs? (y/N)
```

---

## Architecture

The CLI is built on top of the core test infrastructure:

- **Commander.js** - CLI framework and command parsing
- **Inquirer.js** - Interactive prompts and menus
- **ExecutionContext** - Parses test configuration
- **Run** - Orchestrates test execution
- **Batch** - Represents one tool × plan combination
- **Plan** - Test plan with fixture and setup hooks
- **Tool** - Abstract tool runner (ClaudeTool, CopilotTool)

---

## Troubleshooting

### "Tool is not available"

**For Claude Plugin:**
```bash
# Check if claude CLI is installed
which claude

# Install plugin locally
pnpm run plugin:install
```

**For Copilot CLI:**
```bash
# Install dependencies
pnpm install

# Check if copilot-plugin.js exists
ls copilot-context-cli/bin/copilot-plugin.js
```

### "Invalid plan(s)"

Make sure the plan exists in `tests/plans/`:
```bash
ls tests/plans/
# dotnet-update  library-package  react-client-only  simple-node-service
```

### "Run not found"

Check available runs:
```bash
pnpm contest list
```

### Tests are failing

1. Open the run interactively to see detailed logs
2. Check the tool generation log for errors
3. Review Jest output for specific test failures
4. Inspect the generated fixture directory

---

## See Also

- [Main Testing Documentation](../README.md)
- [Test Plans Documentation](../plans/)
- [Core Infrastructure](../lib/)
