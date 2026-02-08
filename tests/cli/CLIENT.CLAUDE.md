# Client Context: Contest CLI

## Client Overview

Contest is a command-line interface for running Jest-based integration tests for the context management system. It validates the plan/execute workflow by testing against multiple repository scenarios (small-monorepo with 5 projects, medium-monorepo with 25 projects, and large-monorepo with 100 projects). The CLI provides developer-friendly test execution with interactive confirmation, tool filtering, and comprehensive test output.

## Client Type

- **Type**: CLI Tool
- **Platform**: Node.js CLI
- **Target Users**: Developers working on the context management system who need to run integration tests

## Technologies

- **Language**: JavaScript (Node.js)
- **Framework**: Node.js CLI with Commander.js and Inquirer.js
- **Key Dependencies**:
  - Commander.js - CLI framework and command parsing
  - Inquirer.js - Interactive prompts and confirmation
  - Jest - Test runner for integration tests
  - picocolors - Terminal colors
  - node-pty - Terminal emulation for command execution

## User Interface Patterns

### UI Framework and Components

- **Component library**: Command-line interface with colored text output (picocolors)
- **Component organization**: Commands in `/commands/` directory, UI helpers in `/lib/ui-helpers.js`
- **Styling approach**: ANSI colors via picocolors for status indicators and output formatting

### Navigation and Routing

- **Routing library**: Commander.js command routing
- **Navigation pattern**: Users invoke commands via `pnpm contest <command>` with options
- **Deep linking**: Direct command execution: `pnpm contest test --tools plugin --plans small-monorepo`

## State Management

- **State management approach**: In-memory state during test execution, no persistent state
- **State organization**: Test configuration and results maintained in memory during execution
- **State persistence**: No persistent state - each invocation is independent

## Data Flow

### API Integration

- **API client library**: N/A - CLI invokes local tools (Claude plugin, Copilot CLI) via subprocess
- **API base URLs**: N/A
- **Request/Response handling**: Spawns child processes using node-pty, captures stdout/stderr
- **Error handling**: Displays errors from child processes, exits with non-zero status on failure

## Build and Development

### Development Setup

- **Install dependencies**: `pnpm install` (from repository root)
- **Environment configuration**: No environment variables required (except TEST_TOOL set by CLI)
- **Development server**: N/A (CLI tool, not a server)

### Build Process

- **Build command**: No build step required (JavaScript source executed directly)
- **Build output**: N/A
- **Build optimization**: N/A

### Environment Configuration

- **Environment files**: None required
- **Environment variables**:
  - `TEST_TOOL` - Set by CLI to filter tests to specific tool (plugin or cli)
- **Configuration approach**: Configuration via command-line arguments

## Testing Patterns

### Testing Approach

- **Testing frameworks**: Jest for integration testing, Contest CLI as test runner wrapper
- **Test types**: Integration tests validating full workflow across multiple repository sizes
- **Test organization**: Tests in `/tests/plans/` with subdirectories for each test scenario

### Testing Commands

- **Run all tests**: `pnpm contest test`
- **Run specific tests**: `pnpm contest test --tools plugin --plans small-monorepo`
- **Coverage reports**: Not configured

### E2E Testing

- **E2E framework**: Jest with custom test utilities
- **Test scenarios**:
  - small-monorepo: 5 projects, basic workflow validation
  - medium-monorepo: 25 projects, multi-batch execution
  - large-monorepo: 100 projects, extreme scaling
- **Running E2E tests**: `pnpm contest test` or direct Jest: `pnpm test:v2`

## Error Handling and Logging

### Error Boundaries

- **Error catching**: try-catch in command handlers with descriptive error messages
- **Error display**: Colored error output to stderr with context
- **Error recovery**: CLI exits with non-zero status; user must fix and re-run

### Logging

- **Logging library**: Custom log formatter (`/lib/log-formatter.js`) and UI helpers
- **What gets logged**:
  - Test configuration summary
  - Interactive confirmation prompts
  - Jest test output (formatted via custom Jest formatter)
  - Tool execution status
- **Log levels**: Info (stdout) and errors (stderr) with color coding

## Documentation

- **README**: `/tests/cli/README.md` - Comprehensive usage guide with examples
- **Architecture**: Documented in README with CLI components and test infrastructure
- **Troubleshooting**: Common issues and solutions in README

## Restricted Actions

This section should be reviewed and populated by repository maintainers:

- Do not modify test plan structures without updating test validation logic
- Do not change CLI command structure without updating documentation
- Do not modify environment variable handling (TEST_TOOL) without coordinating with test infrastructure
- Do not add new test plans without corresponding test scenario files

# Agent File Maintenance

No LLM/AI/Agent may make changes to this file outside of the claude-context-system commands. This is a maintained file through automatic means.

# Agent File Metadata

- Revision Date: 2026-02-08T14:17:04Z
- Last commit SHA built from: 6327d9c927d9a4fb4a564d5e1be0e59524ce0916
- Template Version: 2.1.0
