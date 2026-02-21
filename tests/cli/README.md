# Contest CLI - Test Runner for tests

**Contest** is a command-line interface for running Jest-based tests for the new plan/execute workflow. This is the tests version which works with the refactored command structure.

## Installation

The CLI is available as a private package script. No separate installation is needed:

```bash
# From repository root
pnpm contest --help
```

## Commands

### `contest test`

Run Jest tests against tools and plans with interactive confirmation.

```bash
# Run all tests (all plans)
pnpm contest test

# Run specific plans
pnpm contest test --plans small-monorepo
pnpm contest test --plans small-monorepo,medium-monorepo
```

**Options:**
- `-p, --plans <plans>` - Comma-separated list of plans (default: all available)

**What it does:**
1. Validates your plan selections
2. Shows configuration summary and asks for confirmation
3. Runs Jest with the specified test plans
4. Displays full Jest output with test results

**Available Plans:**
- `small-monorepo` - 5 projects, basic workflow validation
- `medium-monorepo` - 25 projects, multi-batch execution
- `large-monorepo` - 100 projects, extreme scaling

---

### Other Commands (Not Yet Implemented)

The following commands exist but are not yet adapted for Jest-based tests:

- `contest rerun` - Rerun previous test runs
- `contest open` - Interactively explore test results
- `contest list` - List all test runs
- `contest clean` - Delete old test runs

These will be implemented as needed to work with Jest's output structure.

---

## Examples

### Run Tests for Small Monorepo

```bash
# Test small-monorepo plan
pnpm contest test --plans small-monorepo

# Review output
✓ Confirm configuration

Running tests for:
  Plans: small-monorepo
  Tools: plugin

# Jest output follows...
PASS tests/plans/small-monorepo/small-monorepo.test.js
  Small Monorepo - Plan/Execute Workflow
    Planning Phase (/ctx-create)
      ✓ should run ctx-create successfully (45023ms)
      ✓ should create action plan file (2ms)
      ...
```

### Run All Tests

```bash
# Run all test plans
pnpm contest test

# This will take a while:
# - small-monorepo: ~5-10 minutes
# - medium-monorepo: ~20-30 minutes
# - large-monorepo: ~60 minutes
```

---

## Alternative: Direct Jest Commands

You can also run Jest directly without the contest CLI:

```bash
# Run all tests tests
pnpm test:v2

# Run specific plan
pnpm test:v2:small
pnpm test:v2:medium
pnpm test:v2:large

# Or use Jest directly
jest --config jest.config.tests.js tests/plans/small-monorepo
```

---

## Architecture

The CLI wraps Jest and provides:

- **Commander.js** - CLI framework and command parsing
- **Inquirer.js** - Interactive confirmation
- **Jest** - Test runner for .test.js files
- **TEST_TOOL env var** - Optional tool filtering

The test infrastructure uses:
- **ActionPlan** - Parses CLAUDE_CONTEXT_ACTION_PLAN.json
- **ProgressData** - Parses CLAUDE_CONTEXT_PROGRESS.json
- **Common tests** - Reusable validation functions
- **Tool runner** - ClaudeTool

---

## Troubleshooting

### "Invalid plan(s)"

Make sure the plan exists in `tests/plans/`:
```bash
ls tests/plans/
# large-monorepo  medium-monorepo  small-monorepo
```

### "Tool is not available"

```bash
# Install plugin locally
pnpm run plugin:install

# Verify installation
claude plugin list
# Should show: claude-context-updater
```

### Tests are failing

1. Check Jest output for specific test failures
2. Tests create temporary directories that are cleaned up automatically
3. Check if /tmp has space (tests create temporary repos)
4. Verify plugin is installed

---

## See Also

- [tests Documentation](../README.md) - Test infrastructure overview
- [Test Plans](../plans/) - Individual test plan details
- [Core Classes](../lib/) - ActionPlan, ProgressData, etc.
