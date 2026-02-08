# Library Context: Claude Context Plugin

## Library Overview [overview] [summary]

The Claude Context Plugin is an official plugin for Claude Code that automates the creation and maintenance of `claude.md` context files across monorepos and multi-project repositories. It provides commands to prepare action plans, execute context generation, and manage reusable rule files for AI assistants.

## Library Type [metadata] [classification]

- **Type**: Claude Code Plugin
- **Scope**: Public package for Claude Code users
- **Language**: JavaScript/Markdown

## Package Information [package] [distribution] [installation]

### Package Details [package] [metadata]

- **Package name**: `@claude-context-system/claude-context-plugin`
- **Current version**: 2.1.0
- **Package manager**: npm/pnpm
- **Registry**: Private package (not published)

### Installation [installation] [setup]

This plugin is installed locally via the repository's plugin installation script:

```bash
pnpm run plugin:install
```

To verify installation:
```bash
claude plugin list
# Should show: claude-context-updater
```

## Core Functionality [features] [api] [functionality]

### Main Features [features] [capabilities]

1. **Context Plan Preparation**: Analyzes repository structure and creates actionable plans for context file generation (`/ctx-prepare`)
2. **Context Execution**: Executes context file generation based on prepared plans with batch processing support (`/ctx-execute`)
3. **Rule Management**: Manages reusable rule files from built-in, remote, or local sources (`/ctx-rule`)

### Public API [api] [exports] [interface]

- **Exported commands**:
  - `/ctx-prepare` (alias: `claude-context-updater:ctx-prepare`): Prepare action plan for repository context files
  - `/ctx-execute` (alias: `claude-context-updater:ctx-execute`): Execute context file generation from action plan
  - `/ctx-rule` (alias: `claude-context-updater:ctx-rule`): Manage reusable rule files

## Architecture and Design [architecture] [design] [patterns]

### Design Principles [design] [principles]

- **Template-based generation**: Uses markdown templates to ensure consistency across projects
- **Incremental updates**: Detects changes and updates only affected projects
- **Batch processing**: Supports controlled execution with `--max-projects` limits
- **Discovery-driven**: Automatically discovers projects and dependencies

### Code Organization [organization] [structure]

- **Directory structure**:
  - `/commands/` - Command definition files (auto-synced from `shared/commands/`)
  - `/templates/` - Context file templates (auto-synced from `shared/templates/`)
  - `/rules/` - Reusable rule files for specific languages/frameworks
  - `/.claude-plugin/` - Plugin metadata and configuration
  - `/scripts/` - Utility scripts for plugin version syncing

- **Module organization**:
  - Commands are defined as markdown files with embedded prompts
  - Templates provide structure for CLAUDE.md, SERVICE.CLAUDE.md, CLIENT.CLAUDE.md, LIBRARY.CLAUDE.md, DATABASE.CLAUDE.md

- **Entry points**:
  - `/.claude-plugin/plugin.json` - Plugin manifest
  - `/commands/` - Command directory referenced by plugin manifest

### Dependencies [dependencies] [packages]

- **Runtime dependencies**: None (pure markdown-based plugin)
- **Dependency philosophy**: Zero-dependency plugin that relies on Claude Code's built-in capabilities

## Internal Code Patterns [code-patterns] [conventions] [implementation]

### File Structure Conventions [structure] [organization]

```
claude-context-plugin/
  ├── .claude-plugin/
  │   └── plugin.json           # Plugin manifest
  ├── commands/                 # Auto-generated command files
  │   ├── README.md             # Warns against direct editing
  │   ├── ctx-prepare.md        # Prepare command
  │   ├── ctx-execute.md        # Execute command
  │   └── ctx-rule.md           # Rule management command
  ├── templates/                # Auto-generated template files
  │   ├── README.md             # Warns against direct editing
  │   ├── CLAUDE.TEMPLATE.md    # Repository-level template
  │   ├── SERVICE.TEMPLATE.md   # Backend service template
  │   ├── CLIENT.TEMPLATE.md    # UI client template
  │   ├── LIBRARY.TEMPLATE.md   # Library/plugin template
  │   └── DATABASE.TEMPLATE.md  # Database schema template
  ├── rules/                    # Language/framework rules
  │   └── typescript.md         # TypeScript-specific rules
  ├── scripts/                  # Utility scripts
  │   └── sync-plugin-version.js
  └── package.json              # Package metadata
```

### Code Style Patterns [style] [conventions]

- **Import conventions**: N/A (markdown-based plugin)
- **Naming conventions**: Commands use kebab-case with `ctx-` prefix
- **File naming**: Templates use `{TYPE}.TEMPLATE.md`, generated files use `{TYPE}.CLAUDE.md`
- **Export patterns**: Commands referenced via directory path in plugin.json

### Adding New Code [development] [contribution] [adding-features]

**IMPORTANT: Commands and templates are auto-generated. Do NOT edit them directly in this directory.**

**To add a new command:**
1. Create command file in `shared/commands/` (repository root)
2. Run sync: `pnpm run sync` or commit (auto-syncs via pre-commit hook)
3. Command will be available after plugin reload

**To add a new template:**
1. Create template file in `shared/templates/` (repository root)
2. Run sync: `pnpm run sync` or commit (auto-syncs via pre-commit hook)
3. Update commands to reference new template type

**To add a new rule:**
1. Create rule file directly in `rules/` directory (rules are NOT auto-synced)
2. Test with `/ctx-rule add` command
3. Commit to repository

## Usage Examples [examples] [usage] [how-to]

### Basic Usage [examples] [basic] [getting-started]

**Workflow for creating context files:**

```bash
# 1. Prepare action plan (analyzes repository)
/ctx-prepare

# 2. Execute context generation (process all or batch)
/ctx-execute --max-projects 10

# 3. If needed, continue processing remaining projects
/ctx-execute --max-projects 10
```

### Advanced Usage [examples] [advanced]

**Managing rules:**

```bash
# Add a built-in rule
/ctx-rule add typescript

# Add a rule from URL
/ctx-rule add https://example.com/rules/react.md

# Add a local rule file
/ctx-rule add ./my-custom-rules.md

# List installed rules
/ctx-rule list

# Remove a rule
/ctx-rule remove typescript
```

### Common Patterns [patterns] [best-practices]

- **Pattern 1: Incremental updates**: After code changes, run `/ctx-prepare` to detect what changed, then `/ctx-execute` to update only affected projects
- **Pattern 2: Batch processing**: For large repos, use smaller `--max-projects` values (5-10) to avoid token limits
- **Pattern 3: Review generated files**: Always review `CLAUDE_CONTEXT_ACTION_PLAN.json` before executing

## Building and Development [build] [development] [setup]

### Development Setup [development] [setup]

```bash
# Install dependencies from repository root
pnpm install

# Sync commands and templates
pnpm run sync

# Install plugin locally for testing
pnpm run plugin:install

# Verify installation
claude plugin list
```

### Development Scripts [development] [scripts]

- `template:update`: Copy templates from shared/templates/
- `command:update`: Copy commands from shared/commands/
- `sync`: Run both template:update and command:update
- `postversion`: Auto-sync plugin version after version bump

## Documentation

### API Documentation [documentation] [api-reference]

- **Documentation location**: Command files in `/commands/` directory contain full usage documentation
- **Documentation format**: Markdown with embedded instructions for Claude

### Examples and Guides [documentation] [examples] [guides]

- **Examples directory**: N/A - examples embedded in command files
- **Guide topics**:
  - Context preparation workflow (in `ctx-prepare.md`)
  - Execution and batch processing (in `ctx-execute.md`)
  - Rule management (in `ctx-rule.md`)

## Compatibility [compatibility] [platform-support] [requirements]

### Platform Support [compatibility] [platforms]

- **Node.js versions**: Compatible with Claude Code's Node.js runtime
- **Claude Code version**: Requires Claude Code with plugin support

### Framework Integration [integration] [frameworks]

- **Claude Code**: Primary integration - plugin designed specifically for Claude Code

## Maintenance Status [maintenance] [status] [support]

- **Status**: Actively maintained
- **Maintainers**: Part of claude-context-system monorepo

## Restricted Actions [security] [restrictions] [policies]

- Do not edit files in `/commands/` or `/templates/` directories directly - they are auto-generated from `shared/`
- Do not modify plugin version in `plugin.json` without syncing package.json version
- Do not publish this package publicly without proper configuration updates

# Agent File Maintenance [metadata] [maintenance]

No LLM/AI/Agent may make changes to this file outside of the claude-context-system commands. This is a maintained file through automatic means.

# Agent File Metadata [metadata] [tracking]

- Revision Date: 2026-02-08T20:24:46Z
- Last commit SHA built from: 6684ab3d1d822df39e33e648286066130a30f747
- Template Version: 2.1.0
