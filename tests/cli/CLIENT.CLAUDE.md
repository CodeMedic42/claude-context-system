# Client Context: Contest CLI

## Client Overview [overview] [summary]

Contest CLI is a command-line test runner for the Claude Context System. It provides an interactive interface for running Jest-based integration tests against the context generation workflow, supporting both the Claude Code plugin and Copilot CLI implementations across various test plans (small, medium, and large monorepos).

## Client Type [metadata] [platform]

- **Type**: CLI Tool
- **Platform**: Node.js CLI
- **Target Users**: Developers and maintainers of the Claude Context System who need to run integration tests

## Technologies [technologies] [stack]

- **Language**: JavaScript (Node.js)
- **Framework**: Commander.js for CLI framework and command parsing
- **Key Dependencies**:
  - `commander`: CLI framework for command parsing and routing
  - `inquirer`: Interactive confirmation prompts
  - `jest`: Test runner for .test.js files (executed via child_process)
  - Native Node.js modules: `child_process`, `fs`, `path`

## User Input and Validation [input] [validation] [forms]

### Input Patterns [input] [patterns] [ux]

- **Command syntax**:
  - `pnpm contest test [options]` - Run tests
  - `pnpm contest rerun [options]` - Rerun previous tests
  - `pnpm contest open [options]` - Explore test results
  - `pnpm contest list [options]` - List test runs
  - `pnpm contest clean [options]` - Delete old test runs

- **Required fields**: None for basic usage; optional flags for filtering
- **Error display**: Commander.js provides built-in help and validation for invalid commands/options
- **User feedback**: Interactive confirmation via Inquirer before test execution; Jest provides real-time test output

## Build and Development [build] [development] [setup]

### Development Setup [development] [setup] [installation]

```bash
# Install dependencies from repository root
pnpm install

# Run contest CLI
pnpm contest --help
```

### Environment Configuration [configuration] [environment]

- **Environment variables**:
  - `TEST_TOOL`: Optional filter for single tool (set automatically by `--tools` flag)
  - Standard Jest environment variables

- **Prerequisites**:
  - Node.js (compatible with repository requirements)
  - For plugin tests: Claude Code with `claude-context-updater` plugin installed
  - For CLI tests: `copilot-plugin` executable available

## Testing Commands [testing] [commands]

### Running Tests [testing] [execution]

```bash
# Run all tests (all tools × all plans)
pnpm contest test

# Run specific tool
pnpm contest test --tools plugin
pnpm contest test --tools cli

# Run specific plans
pnpm contest test --plans small-monorepo
pnpm contest test --plans small-monorepo,medium-monorepo

# Combine options
pnpm contest test --tools plugin --plans small-monorepo

# Stop after preparation (for debugging)
pnpm contest test --prepare-only
```

### Test Management Commands [testing] [management]

```bash
# List recent test runs
pnpm contest list
pnpm contest list --limit 20

# Explore test results interactively
pnpm contest open
pnpm contest open --run 5

# Rerun a previous test
pnpm contest rerun --run 5
pnpm contest rerun --run 5 --step execution

# Clean up old test runs
pnpm contest clean
pnpm contest clean --keep 10
pnpm contest clean --force
```

## Error Handling and Logging [errors] [logging] [debugging]

### Error Boundaries [errors] [error-handling] [recovery]

- **Error catching**: Command handlers catch validation and execution errors
- **Error display**: Errors written to stderr with context-specific messages
- **Error recovery**: Process exits with code 1 on errors; Jest exit code propagated for test failures

### Logging [logging] [observability]

- **Logging library**: Custom formatter utilities (`log-formatter.js`, `jest-formatter.js`)
- **What gets logged**:
  - Test configuration summary before execution
  - Jest test output with custom formatting
  - Validation errors for invalid tool/plan selections
- **Log levels**: Info messages to stdout, errors to stderr

## Asset Management [assets] [resources] [static-files]

### Static Assets [assets] [images] [fonts]

- **Asset location**:
  - `/bin/` - CLI entry point (`contest.js`)
  - `/commands/` - Command implementation files (test.js, rerun.js, open.js, list.js, clean.js)
  - `/lib/` - Utility libraries (jest-formatter.js, log-formatter.js, ui-helpers.js)
  - `../plans/` - Test plan directories with Jest test suites
  - `../lib/` - Shared test infrastructure (ActionPlan, ProgressData, tool runners)

- **Asset loading**: Commands and utilities loaded via `require()` with relative paths

## Performance Optimization [performance] [optimization] [efficiency]

### Performance Patterns [performance] [patterns] [optimization]

- **Test isolation**: Each test plan creates temporary repositories in `/tmp` for isolation
- **Parallel execution**: Jest runs tests in parallel by default
- **Cleanup**: Temporary directories cleaned up automatically after test completion

## Documentation [documentation] [reference]

- **Command help**: Built-in via Commander.js (`--help` flag)
- **Usage guide**: `/tests/cli/README.md` provides comprehensive usage documentation
- **Test plan documentation**: Individual test plans documented in `/tests/plans/` directories

## Restricted Actions [security] [restrictions] [policies]

- Do not run tests with `--force` flag in production environments without understanding cleanup implications
- Do not modify test infrastructure without verifying compatibility with both plugin and CLI tool runners
- Do not remove prerequisite checks for Claude plugin or Copilot CLI availability

# Agent File Maintenance [metadata] [maintenance]

No LLM/AI/Agent may make changes to this file outside of the claude-context-system commands. This is a maintained file through automatic means.

# Agent File Metadata [metadata] [tracking]

- Revision Date: 2026-02-08T20:24:46Z
- Last commit SHA built from: 6684ab3d1d822df39e33e648286066130a30f747
- Template Version: 2.1.0
