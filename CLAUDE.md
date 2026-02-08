# Repository Agent Context

## Repository Overview

This repository contains the Claude Context System - an automated context file management system that creates and maintains comprehensive CLAUDE.md documentation files for AI assistants. The system provides two implementations: a Claude Code plugin and a GitHub Copilot CLI tool, both sharing common templates and command definitions. It enables AI assistants to have deep, structured knowledge about codebases through template-driven context generation.

## High-Level Repository Information

- **Project Types**: Claude Code Plugin, Node.js CLI Tool
- **Languages**: JavaScript (Node.js)
- **Frameworks/Libraries**: Commander.js, Inquirer.js, Jest, Lerna (monorepo management)

## Repository Structure

```
claude-context-system/
├── .git/                        # Git repository metadata
├── .husky/                      # Git hooks for pre-commit validation
├── .ctxignore                   # Context file exclusion patterns
├── package.json                 # Root package.json for monorepo orchestration
├── lerna.json                   # Lerna configuration for monorepo management
├── jest.config.js               # Jest test configuration
├── CLAUDE.md                    # This file - main repository context
├── CLAUDE_CONTEXT_ACTION_PLAN.json    # Generated action plan (working file)
├── CLAUDE_CONTEXT_PROGRESS.json       # Execution progress tracking (working file)
│
├── shared/                      # Shared resources across implementations
│   ├── templates/               # Context file templates (CLAUDE, SERVICE, CLIENT, LIBRARY, DATABASE)
│   └── commands/                # Command definitions (ctx-prepare, ctx-execute, ctx-rule)
│
├── claude-context-plugin/       # Claude Code plugin implementation
│   ├── .claude-plugin/          # Plugin metadata and registration
│   ├── commands/                # Auto-synced command files
│   ├── templates/               # Auto-synced template files
│   ├── rules/                   # TypeScript and other language rules
│   └── scripts/                 # Build and sync utilities
│
├── copilot-context-cli/         # GitHub Copilot CLI implementation
│   ├── bin/                     # CLI executable (copilot-plugin.js)
│   ├── commands/                # Auto-synced command files
│   ├── templates/               # Auto-synced template files
│   └── rules/                   # TypeScript and other language rules
│
├── tests/                       # Test infrastructure
│   ├── cli/                     # Contest CLI - test runner tool
│   │   ├── bin/                 # CLI entry point (contest.js)
│   │   ├── commands/            # Test commands (test, list, rerun, etc.)
│   │   └── lib/                 # Test utilities and formatters
│   ├── plans/                   # Test scenarios and fixtures
│   │   ├── small-monorepo/      # 5 projects test scenario
│   │   ├── medium-monorepo/     # 25 projects test scenario
│   │   └── large-monorepo/      # 100 projects test scenario
│   └── tools/                   # Test utilities and repo generators
│
└── plugin-setup/                # Plugin installation and sync scripts
    ├── plugin-install.js        # Install Claude plugin locally
    ├── plugin-uninstall.js      # Uninstall Claude plugin
    ├── sync-plugin-git.js       # Sync from shared to plugin directories
    └── sync-copilot.js          # Sync from shared to copilot directory
```

## Code Organization Patterns

- **Architecture**: Monorepo with multiple packages managed by Lerna
- **Project organization**: Three main projects:
  1. Claude Code plugin (claude-context-plugin/) - Plugin for Claude Code CLI
  2. GitHub Copilot CLI (copilot-context-cli/) - Equivalent CLI tool for Copilot
  3. Contest CLI (tests/cli/) - Test runner for integration testing
- **Common patterns**:
  - Shared templates and commands in /shared/ directory synced to implementation directories
  - Template-driven context generation using instruction placeholders (~:...:~)
  - JSON-based state management (action plans and progress tracking)
  - Multi-language support through Language Registry pattern
- **Naming conventions**:
  - UPPERCASE for template files (e.g., SERVICE.TEMPLATE.md, CLIENT.TEMPLATE.md)
  - kebab-case for command files (e.g., ctx-prepare.md, ctx-execute.md)
  - kebab-case for directory names (e.g., claude-context-plugin)

## User Interaction Clients

- **Contest CLI (Test Runner)**: @file ./tests/cli/CLIENT.CLAUDE.md
- **Copilot Context CLI**: @file ./copilot-context-cli/CLIENT.CLAUDE.md

## Libraries and Plugins

- **Claude Context Updater Plugin**: @file ./claude-context-plugin/LIBRARY.CLAUDE.md

## Environment Setup

### Prerequisites

- **Node.js**: Version >=14.0.0 (specified in copilot-context-cli)
- **Package Manager**: pnpm (used throughout repository)
- **Claude Code CLI**: Required for Claude plugin functionality
- **GitHub Copilot**: Required as peer dependency for Copilot CLI

### System Configuration

No special system configuration or environment variables required for basic usage.

### External Dependencies

No external services required. The system operates entirely on local file system and git repository.

## Running the Application Locally

### 1. Environment Setup

```bash
# Install dependencies
pnpm install

# Sync shared resources to implementation directories
pnpm run sync

# Install Claude plugin locally (for Claude Code testing)
pnpm run plugin:install

# Verify plugin installation
claude plugin list
# Should show: claude-context-updater
```

### Usage

**Claude Code Plugin:**
```bash
# Step 1: Create action plan
/ctx-prepare

# Step 2: Execute context generation (process up to 10 projects)
/ctx-execute --max-projects 10

# Step 3: Continue if needed (resume from where it left off)
/ctx-execute --max-projects 10
```

**GitHub Copilot CLI:**
```bash
# Step 1: Create action plan
copilot-plugin ctx-prepare

# Step 2: Execute context generation
copilot-plugin ctx-execute --max-projects 10
```

**Test Runner:**
```bash
# Run integration tests
pnpm contest test

# Run specific test plan
pnpm contest test --plans small-monorepo

# Run tests for specific tool
pnpm contest test --tools plugin --plans small-monorepo
```

## Repository Verification

### Unit Tests

```bash
# Run all integration tests
pnpm test:v2

# Run specific test plans
pnpm test:v2:small      # Small monorepo (5 projects)
pnpm test:v2:medium     # Medium monorepo (25 projects)
pnpm test:v2:large      # Large monorepo (100 projects)

# Using Contest CLI
pnpm contest test --plans small-monorepo,medium-monorepo
```

### Linting and Code Style

```bash
# Run linting
pnpm run lint

# Auto-fix linting issues
pnpm run lint:fix
```

## Documentation

- **Main README**: Repository root README.md (if present) - Overview and getting started
- **Contest CLI**: tests/cli/README.md - Comprehensive test runner documentation
- **Plugin Commands**: claude-context-plugin/commands/ - Embedded command documentation
- **Templates**: shared/templates/ - Template usage guidelines in each template file

**Note to maintainers**: When modifying functionality, ensure corresponding documentation is updated:
- Command files (shared/commands/*.md) for workflow changes
- Template files (shared/templates/*.md) for template structure changes
- README files for usage instructions
- This CLAUDE.md file for repository-level context

## Restricted Actions

Define a list of actions which any ai agent are not allowed to do when working in this repo:

- Do not modify files in claude-context-plugin/commands/ or copilot-context-cli/commands/ directly - these are auto-generated from shared/commands/
- Do not modify files in claude-context-plugin/templates/ or copilot-context-cli/templates/ directly - these are auto-generated from shared/templates/
- Do not modify CLAUDE_CONTEXT_ACTION_PLAN.json or CLAUDE_CONTEXT_PROGRESS.json manually - these are managed by the context generation commands
- Do not change action plan or progress file JSON schemas without providing migration support
- Do not skip the sync step (pnpm run sync) after modifying shared resources
- Do not commit without running pre-commit hooks (husky manages this automatically)

# Agent File Maintenance

No LLM/AI/Agent may make changes to this file outside of the claude-context-system commands. This is a maintained file through automatic means.

# Agent File Metadata

- Revision Date: 2026-02-08T14:18:00Z
- Last commit SHA built from: 6327d9c927d9a4fb4a564d5e1be0e59524ce0916
- Template Version: 2.1.0
