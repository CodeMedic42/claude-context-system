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
├── README.md                   # Main repository documentation
├── VERSION_MANAGEMENT.md       # Version management guidelines
├── claude-plugin/              # Claude Code plugin package
│   ├── .claude-plugin/         # Plugin manifest
│   │   └── plugin.json         # Plugin metadata and version
│   ├── README.md               # Plugin documentation
│   ├── commands/               # Plugin command definitions
│   │   ├── ctx-update.md       # Create/update claude.md command
│   │   └── ctx-rule.md         # Manage reusable rules command
│   ├── examples/               # Example usage and files
│   │   └── .claude/            # Example Claude settings
│   ├── rules/                  # Reusable rule templates
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
├── lerna.json                  # Lerna configuration
├── node_modules/               # Installed dependencies (ignored)
├── package.json                # Root workspace configuration
├── plugin-setup/               # Plugin installation scripts
│   ├── plugin-install.js       # Local installation script
│   └── plugin-uninstall.js     # Uninstallation script
├── pnpm-lock.yaml              # pnpm lockfile (ignored)
├── pnpm-workspace.yaml         # pnpm workspace configuration
└── shared/                     # Shared components
    └── templates/              # Shared template files
        ├── claude.template.md  # Main context template
        ├── service.template.md # Service documentation template
        ├── client.template.md  # Client documentation template
        ├── library.template.md # Library documentation template
        └── database.template.md# Database documentation template
```

## Code Organization Patterns

- **Architecture**: Monorepo with single package (claude-plugin) managed by Lerna + pnpm workspaces
- **Project organization**:
  - `claude-plugin/` - Claude Code plugin with commands and templates
  - `copilot-instructions/` - GitHub Copilot prompts for equivalent functionality
  - `shared/` - Shared templates and utilities used by both tools
  - `plugin-setup/` - Developer scripts for local plugin installation
  - `docs/` - Comprehensive documentation
- **Common patterns**:
  - Templates are maintained in `shared/templates/` and synced to `claude-plugin/templates/` via git hooks
  - Both Claude Code plugin and Copilot instructions use the same templates to ensure consistency
  - Plugin commands are defined in markdown files in `claude-plugin/commands/`
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
```

## Repository Verification

### Unit Tests

Currently no automated test suite is configured. Testing is done manually using the plugin commands in real repositories.

### Linting and Code Style

```bash
# Run linting across all packages
pnpm run lint
```

Note: Individual packages may not have linting configured yet. Run this command to check.

## Documentation

**Key Documentation Files:**
- `README.md` - Main repository overview and quick start
- `docs/README.md` - Comprehensive guide
- `docs/QUICK_START.md` - Quick reference for getting started
- `docs/claude-guide.md` - Claude Code plugin specific documentation
- `claude-plugin/README.md` - Plugin-specific documentation
- `copilot-instructions/README.md` - GitHub Copilot usage guide
- `VERSION_MANAGEMENT.md` - Guidelines for version management

**When to Update Documentation:**
- When adding new plugin commands, update `claude-plugin/README.md` and `docs/claude-guide.md`
- When modifying templates, update relevant documentation to reflect changes
- When changing installation process, update `README.md` and `docs/QUICK_START.md`
- When adding new features, update all affected documentation files

## Restricted Actions

*(This section is intentionally left blank for the user to fill in with project-specific restrictions)*

# Agent File Metadata

- Date Created: 2026-01-02T09:04:00Z
- Date Modified: 2026-01-02T09:04:00Z
- Last commit SHA built from: b01b8d1c101fc897799c28d72b86edd2671ec723
- Template Version: 2.0.0
