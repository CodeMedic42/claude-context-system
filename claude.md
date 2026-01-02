# Repository Agent Context

## Repository Summary

This repository provides automated tools to create and maintain `claude.md` context files for AI coding assistants like Claude Code and GitHub Copilot. The system includes a Claude Code plugin with commands for creating/updating context files, GitHub Copilot prompts for the same functionality, and shared templates used by both tools. The goal is to help development teams maintain high-quality, standardized repository context documentation that AI assistants can quickly load to understand codebases.

## High-Level Repository Information

- **Project Types**: Monorepo with Claude Code plugin and documentation
- **Languages**: JavaScript (Node.js), Markdown
- **Frameworks/Libraries**:
  - Lerna 9.0.3 (monorepo management)
  - pnpm (package manager and workspaces)
  - Husky 9.1.7 (git hooks)

## Repository Structure

```
claude-context-system/
├── .claude/                    # Claude Code settings
├── .git/                       # Git repository data
├── .gitignore                  # Git ignore patterns
├── .husky/                     # Git hooks for automation
│   └── _/                      # Husky internal files
├── .npmrc                      # npm configuration
├── CLAUDE.md                   # Repository context for Claude (this file)
├── README.md                   # Main repository documentation
├── TESTING.md                  # Testing strategy documentation
├── VERSION_MANAGEMENT.md       # Version management guidelines
├── claude-plugin/              # Claude Code plugin package
│   ├── .claude-plugin/         # Plugin manifest
│   │   └── plugin.json         # Plugin metadata and version
│   ├── README.md               # Plugin documentation
│   ├── library.claude.md       # Plugin library documentation
│   ├── package.json            # Plugin package configuration
│   ├── commands/               # Plugin command definitions
│   │   ├── ctx-update.md       # Create/update claude.md command
│   │   └── ctx-rule.md         # Manage reusable rules command
│   ├── examples/               # Example usage and files
│   │   └── .claude/            # Example Claude settings
│   ├── rules/                  # Reusable rule templates
│   ├── scripts/                # Plugin utility scripts
│   │   └── sync-plugin-version.js # Version sync script
│   ├── templates/              # Template files for generation
│   │   ├── claude.template.md  # Main context template
│   │   ├── service.template.md # Service documentation template
│   │   ├── client.template.md  # Client documentation template
│   │   ├── library.template.md # Library documentation template
│   │   └── database.template.md# Database documentation template
├── copilot-instructions/       # GitHub Copilot prompts
│   ├── README.md               # Copilot usage guide
│   ├── create-prompt.md        # Prompt for creating claude.md
│   └── update-prompt.md        # Prompt for updating claude.md
├── docs/                       # Comprehensive documentation
│   ├── README.md               # Full documentation guide
│   ├── QUICK_START.md          # Quick reference guide
│   └── claude-guide.md         # Claude Code specific guide
├── jest.config.js              # Jest testing configuration
├── lerna.json                  # Lerna configuration
├── node_modules/               # Installed dependencies (ignored)
├── package.json                # Root workspace configuration
├── plugin-setup/               # Plugin installation scripts
│   ├── plugin-install.js       # Local installation script
│   └── plugin-uninstall.js     # Uninstallation script
├── pnpm-lock.yaml              # pnpm lockfile (ignored)
├── pnpm-workspace.yaml         # pnpm workspace configuration
├── shared/                     # Shared components
│   └── templates/              # Shared template files
│       ├── claude.template.md  # Main context template
│       ├── service.template.md # Service documentation template
│       ├── client.template.md  # Client documentation template
│       ├── library.template.md # Library documentation template
│       └── database.template.md# Database documentation template
├── test-runner/                # Interactive test runner CLI
│   ├── .gitignore              # Test runner ignore patterns
│   ├── README.md               # Test runner documentation
│   ├── package.json            # Test runner dependencies
│   └── src/                    # Test runner source code
│       ├── cli.js              # Main CLI entry point
│       ├── commands/           # Test runner commands
│       │   ├── clean-runs.js   # Clean old test runs
│       │   ├── compare-runs.js # Compare test runs
│       │   ├── list-runs.js    # List test runs
│       │   ├── new-run.js      # Create new test run
│       │   └── test-run.js     # Run tests on existing run
│       └── lib/                # Test runner utilities
│           ├── fixture-selector.js # Fixture selection UI
│           ├── parallel-cli-runner.js # Parallel CLI execution
│           ├── test-run-manager.js # Test run management
│           └── token-tracker.js # Token usage tracking
└── tests/                      # Test suite
    ├── README.md               # Test documentation
    ├── QUICKSTART.md           # Test quick start guide
    ├── fixtures/               # Test fixtures
    │   ├── .gitignore          # Fixture ignore patterns
    │   ├── library-package/    # TypeScript library fixture
    │   ├── react-client-only/  # React client fixture
    │   └── simple-node-service/# Node service fixture
    ├── lib/                    # Test utilities
    │   ├── ClaudeMdMetadata.js # Claude.md parser/validator
    │   └── testHelpers.js      # Test helper functions
    ├── library-package.test.js # Library fixture tests
    ├── react-client-only.test.js # React fixture tests
    └── simple-node-service.test.js # Service fixture tests
```

## Code Organization Patterns

- **Architecture**: Monorepo with single package (claude-plugin) managed by Lerna + pnpm workspaces
- **Project organization**:
  - `claude-plugin/` - Claude Code plugin with commands and templates
  - `copilot-instructions/` - GitHub Copilot prompts for equivalent functionality
  - `shared/` - Shared templates and utilities used by both tools
  - `plugin-setup/` - Developer scripts for local plugin installation
  - `test-runner/` - Interactive CLI tool for automated plugin testing
  - `tests/` - Test suite with fixtures and Jest tests
  - `docs/` - Comprehensive documentation
- **Common patterns**:
  - Templates are maintained in `shared/templates/` and synced to `claude-plugin/templates/` via git hooks
  - Both Claude Code plugin and Copilot instructions use the same templates to ensure consistency
  - Plugin commands are defined in markdown files in `claude-plugin/commands/`
  - Version synchronization between `claude-plugin/package.json` and `plugin.json` via postversion script
  - Test fixtures represent real-world project types and are used for automated validation
- **Naming conventions**:
  - Template files use `.template.md` extension
  - Command files use kebab-case (e.g., `ctx-update.md`, `ctx-rule.md`)
  - Generated output files use lowercase (e.g., `claude.md`, `service.claude.md`)

═══════════════════════════════════════════════════════════
## Libraries and Plugins
═══════════════════════════════════════════════════════════

- **Claude Context Updater Plugin**: @file ./claude-plugin/library.claude.md

═══════════════════════════════════════════════════════════

## Environment Setup

### Prerequisites

**Required:**
- Node.js (v16 or higher recommended)
- pnpm (package manager) - Install globally: `npm install -g pnpm`
- Git

**For Plugin Development:**
- Claude Code CLI installed and configured

### System Configuration

No special environment variables or system paths are required.

### External Dependencies

No external services, databases, or programs need to be running locally. This repository is self-contained.

## Running the Application Locally

### 1. Environment Setup

```bash
# Install dependencies (root and all workspace packages)
pnpm install

# For plugin development: Install plugin locally
pnpm run plugin:install
```

The plugin will be symlinked to your local Claude Code configuration, allowing you to test changes immediately.

**Usage in Claude Code:**
- `/claude-context-updater:ctx-update` - Create or update claude.md in any repository
- `/claude-context-updater:ctx-rule` - Manage reusable rule files

**Useful development commands:**
```bash
# Uninstall plugin
pnpm run plugin:uninstall

# Update templates and reinstall plugin
pnpm run plugin:reinstall

# Copy shared templates to plugin directory
pnpm run plugin:template:update

# Start interactive test runner
pnpm run start:test-runner

# Run tests
pnpm test

# Watch mode for tests during development
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

## Repository Verification

### Unit Tests

The repository includes a comprehensive test suite for plugin validation:

```bash
# Run all Jest tests
pnpm test

# Watch mode for development
pnpm test:watch

# Generate coverage report
pnpm test:coverage

# Verbose test output
pnpm test:verbose
```

**Interactive Test Runner:**

The test-runner provides automated plugin testing with fixtures:

```bash
# Start interactive test runner
pnpm run start:test-runner
```

Features:
- Create new test runs with selected fixtures
- Run Claude CLI automatically in bypass mode
- Track token usage and costs
- Compare test runs
- Parallel execution support

**Test Structure:**
- Test fixtures in `tests/fixtures/` (simple-node-service, library-package, react-client-only)
- ClaudeMdMetadata class for parsing and validating generated files
- Jest tests validate sections, sub-files, metadata, and content quality

See `TESTING.md` for comprehensive testing documentation.

### Linting and Code Style

```bash
# Run linting across all packages
pnpm run lint
```

Note: Individual packages may not have linting configured yet. Run this command to check.

## Documentation

**Key Documentation Files:**
- `README.md` - Main repository overview and quick start
- `TESTING.md` - Testing strategy and automated test runner documentation
- `docs/README.md` - Comprehensive guide
- `docs/QUICK_START.md` - Quick reference for getting started
- `docs/claude-guide.md` - Claude Code plugin specific documentation
- `claude-plugin/README.md` - Plugin-specific documentation
- `claude-plugin/library.claude.md` - Library documentation for the plugin itself
- `copilot-instructions/README.md` - GitHub Copilot usage guide
- `VERSION_MANAGEMENT.md` - Guidelines for version management
- `tests/README.md` - Test suite documentation
- `tests/QUICKSTART.md` - Quick start guide for testing
- `test-runner/README.md` - Test runner CLI documentation

**When to Update Documentation:**
- When adding new plugin commands, update `claude-plugin/README.md` and `docs/claude-guide.md`
- When modifying templates, update relevant documentation to reflect changes
- When changing installation process, update `README.md` and `docs/QUICK_START.md`
- When adding new features, update all affected documentation files
- When adding new test fixtures or testing features, update `TESTING.md` and test documentation

## Restricted Actions

*(This section is intentionally left blank for the user to fill in with project-specific restrictions)*

# Agent File Metadata

- Date Created: 2026-01-02T09:04:00Z
- Date Modified: 2026-01-02T13:45:00Z
- Last commit SHA built from: fad03eb4e1133109a8329fe9a12b8cca68708b88
- Template Version: 2.1.0
