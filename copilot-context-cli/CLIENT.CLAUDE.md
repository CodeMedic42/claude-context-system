# Client Context: Copilot Context CLI

## Client Overview
The Copilot Context CLI is a command-line interface tool that provides equivalent functionality to the Claude Context Plugin, but for users of GitHub Copilot CLI instead of Claude Code IDE. It automates the creation and management of CLAUDE.md context files by wrapping the same markdown command files (ctx-create, ctx-update, ctx-rule) and executing them through GitHub Copilot's CLI agent. This allows GitHub Copilot users to generate comprehensive repository documentation using the same template system as Claude Code users.

## Client Type
- **Type**: CLI Tool
- **Platform**: Node.js CLI (cross-platform: macOS, Linux, Windows)
- **Target Users**: Developers using GitHub Copilot CLI who want to generate CLAUDE.md context files for their repositories

## Technologies
- **Language**: JavaScript (Node.js ES2021)
- **Framework**: Node.js native (child_process, fs, path)
- **Key Dependencies**:
  - GitHub Copilot CLI (`copilot` command) - Required peer dependency for AI execution
  - Node.js built-in modules (child_process, fs, path) - No external npm dependencies

## User Interface Patterns

### UI Framework and Components
- **Component library**: Terminal-based interface (stdio)
- **Component organization**: Single executable script (`bin/copilot-plugin.js`) with command file system
- **Styling approach**: Plain text output to terminal (no colors, relies on copilot's native output formatting)

### Navigation and Routing
- **Routing library**: Command-line argument parsing (process.argv)
- **Navigation pattern**: Users execute specific commands via: `copilot-plugin <command-name>`
- **Deep linking**: Not applicable (CLI tool)

## State Management
- **State management approach**: Stateless - each command execution is independent
- **State organization**: No persistent state - commands operate on git repository state
- **State persistence**: None - tool reads git repository and file system state on demand

## Data Flow

### API Integration
- **API client library**: None - tool spawns GitHub Copilot CLI as subprocess
- **API base URLs**: Not applicable
- **Request/Response handling**:
  - Reads markdown command files from `commands/` directory
  - Passes command content as prompt to `copilot -p <content>`
  - Relies on GitHub Copilot CLI to execute the command instructions
- **Error handling**:
  - Validates copilot installation before execution
  - Checks user authentication status
  - Exits with error codes on validation failures

### Data Caching
Not applicable - tool is stateless and doesn't cache data.

## Authentication and Authorization

### Authentication Flow
- **Authentication method**: Delegates to GitHub Copilot CLI authentication
- **Login process**:
  1. User must install GitHub Copilot CLI: `npm install -g @github/copilot`
  2. User authenticates via: `copilot` then `/login` command
  3. Tool validates authentication by executing test prompt
- **Token storage**: Handled by GitHub Copilot CLI (not managed by this tool)
- **Session handling**: Persistent across tool invocations (managed by copilot CLI)

### Protected Routes/Screens
Not applicable - all commands require valid copilot authentication.

## User Input and Validation

### Form Handling
Not applicable - CLI tool accepts command name as single argument.

### Input Patterns
- **Required fields**: Command name must be provided
- **Error display**: Error messages printed to stderr with usage instructions
- **User feedback**: Inherits from GitHub Copilot CLI (shows progress, tool use, responses)

## Build and Development

### Development Setup
```bash
# From monorepo root
pnpm install

# Install GitHub Copilot CLI globally (prerequisite)
npm install -g @github/copilot

# Authenticate with Copilot
copilot
# Then run: /login

# Verify installation
copilot --version
```

### Build Process
- **Build command**: No build step required (plain JavaScript)
- **Build output**: Not applicable
- **Build optimization**: Not applicable

### Environment Configuration
- **Environment files**: None
- **Environment variables**:
  - `COPILOT_AUTO_APPROVE=true` - Used in test infrastructure to skip confirmations
- **Configuration approach**: Environment variables for test automation only

## Testing Patterns

### Testing Approach
- **Testing frameworks**: Jest (monorepo root) for integration testing
- **Test types**: Integration tests - full end-to-end execution with fixture projects
- **Test organization**: Tests located in monorepo `tests/` directory

### Testing Commands
From monorepo root:
- **Run all tests**: `pnpm contest test --tools cli`
- **Run specific tests**: `pnpm contest test --tools cli --plans library-package`
- **Coverage reports**: Not configured (integration tests focus on output validation)

### E2E Testing
- **E2E framework**: Custom test infrastructure (Contest CLI)
- **Test scenarios**:
  - simple-node-service: Node.js Express API creation
  - library-package: TypeScript library creation
  - react-client-only: React client creation
  - dotnet-update: Incremental update detection
- **Running E2E tests**: `pnpm contest test --tools cli`

## Error Handling and Logging

### Error Boundaries
- **Error catching**: Try-catch around copilot installation/authentication checks
- **Error display**: Error messages printed to stderr with actionable instructions
- **Error recovery**: Process exits with non-zero code on errors (no recovery)

### Logging
- **Logging library**: console.error for error messages
- **What gets logged**:
  - Installation validation failures
  - Authentication failures
  - Command not found errors
  - Available commands list (on usage errors)
- **Log levels**: Single level (errors only)

### Analytics and Monitoring
Not implemented - tool output is captured only in test infrastructure.

## Asset Management

### Static Assets
- **Asset location**: `commands/` directory (markdown command files)
- **Asset loading**: fs.readFileSync() to load command content
- **Asset optimization**: None required (small markdown files)

### Internationalization (i18n)
Not implemented - English only.

## Performance Optimization

### Performance Patterns
- **Code splitting**: Not applicable (single entry point)
- **Lazy loading**: Not applicable
- **Memoization**: Not applicable (stateless execution)
- **Bundle optimization**: Not applicable (not bundled)

### Performance Monitoring
Not implemented.

## Accessibility

### Accessibility Standards
- **Standards followed**: Terminal accessibility (screen reader compatible via plain text output)
- **Accessibility features**: Plain text output works with terminal screen readers
- **Testing approach**: Not formally tested

## Deployment

### Build for Production
Not applicable - tool is distributed as source code (requires Node.js runtime).

### Deployment Process
- **Deployment target**: npm registry (when published)
- **Deployment command**: `npm publish` (via lerna)
- **CI/CD**: Not yet configured

### Release Process
- **Version management**: Managed by Lerna (monorepo version sync)
- **Release channels**: npm registry (planned)
- **Update mechanism**: Users run `npm update -g copilot-context-cli` (when published)

## Documentation
- **Monorepo README**: `tests/README.md` for test system
- **Usage examples**: Available commands listed via `copilot-plugin` (no args)
- **Command documentation**: Inline in markdown command files (`commands/*.md`)

## Restricted Actions
<!-- AI agents should NOT perform the following actions when working with this CLI tool: -->

<!-- Leave blank initially - user should review and populate -->

# Agent File Metadata

- Date Created: 2026-01-22T15:35:00Z
- Date Modified: 2026-01-22T15:35:00Z
- Last commit SHA built from: cb6bf60e62086eed3c82984c23dcf8555c4f35fa
- Template Version: 2.1.0
