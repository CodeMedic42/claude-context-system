# Repository Agent Context

## Repository Overview [overview] [summary]

The Claude Context System is an automated context file manager for AI assistants, providing tools to create and maintain `claude.md` documentation across monorepos and multi-project repositories. It supports Claude Code via plugin, enabling AI assistants to understand complex codebases through structured, automatically-generated context files.

## High-Level Repository Information [metadata] [technologies]

- **Project Types**: Claude Code plugin, Node.js testing tools
- **Languages**: JavaScript, Markdown
- **Frameworks/Libraries**:
  - Claude Code plugin system (v2.1.0)
  - Lerna v9.0.3 for monorepo management
  - Jest v29.7.0 for testing
  - Inquirer v8.2.7 for interactive prompts

## Repository Structure [structure] [organization]

```
claude-context-system/
├── .claude/                   # Claude Code configuration
├── .husky/                    # Git hooks (pre-commit)
├── .vscode/                   # VS Code settings
├── claude-context-plugin/     # Claude Code plugin package
│   ├── .claude-plugin/        # Plugin manifest
│   ├── commands/              # Auto-synced command files
│   ├── templates/             # Auto-synced template files
│   ├── rules/                 # Language/framework rules
│   └── scripts/               # Plugin utility scripts
├── plugin-setup/              # Installation and sync scripts
├── shared/                    # Source of truth for templates/commands
│   ├── commands/              # Command definitions (synced to plugin)
│   └── templates/             # Context file templates (synced to plugin)
├── tests/                     # Test infrastructure
│   ├── cli/                   # Contest CLI test runner
│   ├── jest-common/           # Shared Jest configuration
│   ├── lib/                   # Test utilities and helpers
│   ├── plans/                 # Test plans (small/medium/large monorepos)
│   └── tools/                 # Tool runner implementations
├── package.json               # Root package with Lerna config
└── lerna.json                 # Lerna monorepo configuration
```

## Code Organization Patterns [architecture] [patterns]

- **Architecture**: Lerna-managed monorepo with plugin and test infrastructure
- **Project organization**:
  - `/claude-context-plugin/` - Claude Code plugin implementation
  - `/shared/` - Source of truth for commands and templates, synced to plugin
  - `/tests/` - Comprehensive test infrastructure with CLI runner
  - `/plugin-setup/` - Installation and synchronization scripts
- **Common patterns**:
  - Auto-sync workflow: Commands and templates are authored in `/shared/` and automatically synced to plugin via pre-commit hooks
  - Template-based generation: All context files generated from markdown templates with instruction placeholders
- **Naming conventions**:
  - Commands use kebab-case with `ctx-` prefix (`ctx-prepare`, `ctx-execute`, `ctx-rule`)
  - Templates use `{TYPE}.TEMPLATE.md` format
  - Generated files use `{TYPE}.CLAUDE.md` format
  - Package directories use kebab-case

## User Interaction Clients [clients] [frontend] [ui]

- **Contest CLI**: @file ./tests/cli/CLIENT.CLAUDE.md

## Libraries and Plugins [libraries] [packages] [reusable]

- **Claude Context Plugin**: @file ./claude-context-plugin/LIBRARY.CLAUDE.md

## Environment Setup [setup] [environment] [prerequisites]

### Prerequisites [prerequisites] [requirements]

- **Node.js**: v14.0.0 or higher (compatible with Claude Code runtime)
- **pnpm**: Package manager for monorepo dependency management
- **Claude Code**: Required for using the plugin (`claude-context-plugin`)

### System Configuration [configuration] [environment] [setup]

- **Environment variables**: None required for basic usage; Jest tests may use `TEST_TOOL` for filtering
- **System paths**: Plugin installed to Claude Code's plugin directory (`~/.claude/plugins/`)

### External Dependencies [dependencies] [external] [services]

None required. The system operates independently without external services or databases.

## Running the Application Locally [development] [local] [setup]

### 1. Environment Setup [setup] [installation]

```bash
# Install dependencies
pnpm install

# Sync commands and templates from shared/ to packages
pnpm run sync

# Install Claude Code plugin (for plugin testing)
pnpm run plugin:install

# Verify plugin installation
claude plugin list
# Should show: claude-context-updater
```

### Using the Plugin

```bash
# Navigate to any repository
cd /path/to/your/repo

# Prepare action plan
/ctx-prepare

# Execute context generation
/ctx-execute --max-projects 10
```

## Repository Verification [testing] [verification] [quality]

### Unit Tests [testing] [unit-tests]

```bash
# Run integration tests using Contest CLI
pnpm contest test

# Run specific test plans
pnpm contest test --plans small-monorepo
pnpm contest test --plans medium-monorepo,large-monorepo
```

### Linting and Code Style [linting] [code-quality] [style]

```bash
# Run ESLint
pnpm run lint

# Auto-fix linting issues
pnpm run lint:fix
```

## Documentation [documentation] [reference]

- **Command documentation**: Each command file in `shared/commands/` contains comprehensive usage instructions
- **Template documentation**: Templates in `shared/templates/` include inline instructions for context generation
- **Test CLI documentation**: `tests/cli/README.md` provides Contest CLI usage guide

**Important**: When modifying commands or templates, always edit files in `shared/` directory, not in the package-specific directories. Changes are automatically synced via `pnpm run sync` or pre-commit hooks.

## Restricted Actions [security] [restrictions] [policies]



# Agent File Maintenance [metadata] [maintenance]

No LLM/AI/Agent may make changes to this file outside of the claude-context-system commands. This is a maintained file through automatic means.

# Agent File Metadata [metadata] [tracking]

- Revision Date: 2026-02-08T20:24:46Z
- Last commit SHA built from: 6684ab3d1d822df39e33e648286066130a30f747
- Template Version: 2.1.0
- Last generated by: /ctx-execute command
- Total projects: 2 (1 library, 1 client)
- Generation status: Complete
