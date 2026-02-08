# Client Context: Copilot Context CLI

## Client Overview

The Copilot Context CLI is a command-line tool that provides GitHub Copilot users with equivalent functionality to the Claude Code plugin. It enables automated creation and maintenance of comprehensive CLAUDE.md documentation files for repositories, allowing GitHub Copilot to access structured context about codebases.

## Client Type

- **Type**: CLI Tool
- **Platform**: Node.js CLI
- **Target Users**: Developers using GitHub Copilot who want automated context management

## Technologies

- **Language**: JavaScript (Node.js)
- **Framework**: Node.js CLI
- **Key Dependencies**:
  - Node.js >=14.0.0
  - GitHub Copilot (peer dependency)

## User Interface Patterns

### UI Framework and Components

- **Component library**: Command-line interface with text-based interaction
- **Component organization**: Commands are organized in `/commands/` directory as markdown files
- **Styling approach**: Terminal text output (no visual styling)

### Navigation and Routing

- **Routing library**: Command-based CLI routing
- **Navigation pattern**: Users invoke commands via `copilot-plugin` executable with command arguments
- **Deep linking**: Commands are invoked directly: `copilot-plugin ctx-prepare`, `copilot-plugin ctx-execute --max-projects 10`

## State Management

- **State management approach**: File-based state persistence
- **State organization**: State stored in JSON files in the repository root:
  - `CLAUDE_CONTEXT_ACTION_PLAN.json` - Execution plan with project list, dependencies, and estimates
  - `CLAUDE_CONTEXT_PROGRESS.json` - Execution progress tracking with completed projects and discoveries
- **State persistence**: JSON files written to disk, enabling resumable execution across CLI invocations

## Data Flow

### API Integration

- **API client library**: N/A - CLI operates on local file system and git repository
- **API base URLs**: N/A
- **Request/Response handling**: Commands read repository files and git history directly
- **Error handling**: Errors displayed to stderr with descriptive messages

### Data Caching

- **Caching approach**: Progress files act as execution state cache
- **Cache invalidation**: Action plan regenerated on each `/ctx-prepare` invocation based on current git state

## Build and Development

### Development Setup

- **Install dependencies**: `npm install` or `pnpm install` (from repository root)
- **Environment configuration**: No environment variables required
- **Development server**: N/A (CLI tool, not a server)

### Build Process

- **Build command**: No build step required (JavaScript source executed directly)
- **Build output**: N/A
- **Build optimization**: N/A

### Environment Configuration

- **Environment files**: None required
- **Environment variables**: None required
- **Configuration approach**: Configuration embedded in command files and templates

## Testing Patterns

### Testing Approach

- **Testing frameworks**: Jest (test infrastructure in `/tests/`)
- **Test types**: Integration tests that validate full workflows
- **Test organization**: Tests organized in `/tests/plans/` with small-monorepo, medium-monorepo, and large-monorepo scenarios

### Testing Commands

- **Run all tests**: `pnpm test:v2` (from repository root)
- **Run specific tests**: `pnpm test:v2:small`, `pnpm test:v2:medium`, `pnpm test:v2:large`
- **Coverage reports**: Not configured

## Error Handling and Logging

### Error Boundaries

- **Error catching**: try-catch blocks in command execution
- **Error display**: Error messages printed to stderr with context
- **Error recovery**: CLI exits with non-zero status code on error; user must fix issue and re-run

### Logging

- **Logging library**: console.log/console.error
- **What gets logged**: Command progress, warnings, and errors
- **Log levels**: Informational output (stdout) and errors (stderr)

## Asset Management

### Static Assets

- **Asset location**: Templates stored in `/templates/`, commands in `/commands/`, rules in `/rules/`
- **Asset loading**: Templates and commands read from disk when needed
- **Asset optimization**: N/A

## Documentation

- **README**: `/copilot-context-cli/README.md` - Installation and usage instructions
- **Command Documentation**: Embedded in command files in `/commands/` directory
- **Template Documentation**: Usage guidelines embedded in template files in `/templates/` directory

## Restricted Actions

This section should be reviewed and populated by repository maintainers:

- Do not modify command file structure without testing with GitHub Copilot
- Do not change template structure without updating all dependent workflows
- Do not modify action plan JSON schema without migration support
- Do not publish to npm without proper version bumps and changelog updates

# Agent File Maintenance

No LLM/AI/Agent may make changes to this file outside of the claude-context-system commands. This is a maintained file through automatic means.

# Agent File Metadata

- Revision Date: 2026-02-08T14:16:16Z
- Last commit SHA built from: 6327d9c927d9a4fb4a564d5e1be0e59524ce0916
- Template Version: 2.1.0
