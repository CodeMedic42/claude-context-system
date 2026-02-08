# Library Context: Claude Context Updater Plugin

## Library Overview

The Claude Context Updater Plugin is an automated context file manager that creates and maintains comprehensive CLAUDE.md documentation files for repositories. It analyzes repository structure, discovers projects (services, clients, libraries, databases), and generates detailed context documentation following a standardized template system. This enables AI assistants like Claude Code to have deep, structured knowledge about codebases.

## Library Type

- **Type**: Claude Code Plugin
- **Scope**: Public plugin for Claude Code CLI
- **Language**: JavaScript (Node.js)

## Package Information

### Package Details

- **Package name**: `@claude-context-system/claude-context-plugin`
- **Current version**: 2.1.0
- **Package manager**: npm
- **Registry**: Installed locally via Claude Code plugin system

### Installation

Installation is handled through the Claude Code plugin system:

```bash
# Install plugin from repository root
pnpm run plugin:install

# Verify installation
claude plugin list
# Should show: claude-context-updater
```

## Core Functionality

### Main Features

1. **Repository Analysis**: Automatically discovers all projects within a repository by scanning for manifest files (package.json, Cargo.toml, go.mod, etc.) across multiple programming languages
2. **Action Plan Generation**: Creates a comprehensive execution plan that categorizes projects as new, updated, or stable based on git history
3. **Context File Generation**: Creates separate, detailed context files for each project type (SERVICE.CLAUDE.md, CLIENT.CLAUDE.md, LIBRARY.CLAUDE.md, DATABASE.CLAUDE.md)
4. **Incremental Updates**: Intelligently updates only changed projects by analyzing git diffs and commit history
5. **Template-Based Documentation**: Uses structured templates with instruction placeholders to ensure consistent, comprehensive documentation
6. **Dependency Analysis**: Analyzes inter-project dependencies within the repository to determine proper processing order
7. **Multi-Language Support**: Supports JavaScript/TypeScript, Rust, Go, Python, Java, C#/.NET, C/C++, Ruby, PHP, Swift, Kotlin, Scala, and Elixir

### Public API

- **Exported plugins**: Commands registered as Claude Code skills
  - `/ctx-prepare`: Creates an action plan for context file generation/updates
  - `/ctx-execute`: Executes the action plan to generate/update context files
  - `/ctx-rule`: Manages reusable rule files from built-in, remote, or local sources

## Usage Examples

### Basic Usage

The plugin is invoked through Claude Code skills (slash commands):

```bash
# Step 1: Create action plan
/ctx-prepare

# Step 2: Execute context generation (process up to 10 projects)
/ctx-execute --max-projects 10

# Step 3: Continue if needed (resume from where it left off)
/ctx-execute --max-projects 10
```

### Plugin/Middleware Usage

The plugin integrates directly into Claude Code as a skill:

```bash
# After installation, the plugin registers three commands:
# - /ctx-prepare: Analyzes repository and creates action plan
# - /ctx-execute: Generates context files based on action plan
# - /ctx-rule: Manages rule files for specialized contexts

# What this enables:
# - Automated discovery of all projects in monorepos
# - Intelligent categorization (new/updated/stable)
# - Template-driven context generation
# - Incremental updates based on git history
# - Endpoints created: None (CLI commands only)
```

### Common Patterns

- **Initial Context Creation**: Run `/ctx-prepare` followed by `/ctx-execute --max-projects N` where N is the number of projects to process per execution
- **Incremental Updates**: After code changes, run `/ctx-prepare` (detects changes via git diff) then `/ctx-execute --max-projects N` to update only affected projects
- **Large Repository Workflow**: For repos with 100+ projects, use smaller `--max-projects` values (e.g., 10-20) and run multiple iterations to stay within token limits

## Architecture and Design

### Design Principles

- **Template-Driven**: All context files follow standardized templates with instruction placeholders (~:...:~) for consistency
- **Git-Aware**: Leverages git history to detect changes and optimize update workflows
- **Language-Agnostic**: Multi-language support through extensible Language Registry
- **Incremental Processing**: Supports batch processing with `--max-projects` to manage token budgets
- **Stateful Execution**: Maintains progress files to enable resumable execution across multiple runs

### Code Organization

- **Directory structure**:
  - `/commands/` - Skill definition files (.md) that define plugin commands
  - `/templates/` - Template files (CLAUDE.TEMPLATE.md, SERVICE.TEMPLATE.md, CLIENT.TEMPLATE.md, LIBRARY.TEMPLATE.md, DATABASE.TEMPLATE.md)
  - `/rules/` - Reusable rule files for specialized contexts
  - `/scripts/` - Build and sync scripts
  - `/.claude-plugin/` - Plugin metadata (plugin.json)

- **Module organization**: Commands are defined as markdown files with embedded instructions that Claude Code interprets and executes
- **Entry points**: Commands are registered via plugin.json pointing to the `/commands/` directory

### Dependencies

- **Runtime dependencies**: None - Pure command files that Claude Code interprets
- **Peer dependencies**: Claude Code CLI (required host environment)
- **Dependency philosophy**: Zero runtime dependencies - the plugin consists of markdown command files and templates that Claude Code processes natively

## Internal Code Patterns

### File Structure Conventions

```
claude-context-plugin/
  ├── .claude-plugin/
  │   └── plugin.json           # Plugin metadata and registration
  ├── commands/
  │   ├── README.md             # Warning about auto-generated files
  │   ├── ctx-prepare.md        # Prepare action plan command
  │   ├── ctx-execute.md        # Execute context generation command
  │   └── ctx-rule.md           # Rule management command
  ├── templates/
  │   ├── CLAUDE.TEMPLATE.md    # Main repository context template
  │   ├── SERVICE.TEMPLATE.md   # Service/API project template
  │   ├── CLIENT.TEMPLATE.md    # Client/UI project template
  │   ├── LIBRARY.TEMPLATE.md   # Library/plugin project template
  │   └── DATABASE.TEMPLATE.md  # Database schema template
  ├── rules/
  │   └── typescript.md         # TypeScript-specific rules
  ├── scripts/
  │   └── sync-plugin-version.js # Version sync utility
  └── package.json              # Package metadata
```

### Code Style Patterns

- **File naming**: UPPERCASE for template files (e.g., SERVICE.TEMPLATE.md), kebab-case for command files (e.g., ctx-prepare.md)
- **Placeholder syntax**: Instruction placeholders use tilde-colon syntax: `~:instruction here:~`
- **Template sections**: Templates follow a structured section hierarchy with clear EXCLUDE/INCLUDE guidance

### Adding New Code

**To add a new template:**
1. Create the template file in `shared/templates/` using UPPERCASE naming (e.g., `NEWTYPE.TEMPLATE.md`)
2. Follow the existing template structure with instruction placeholders
3. Add section guidance (EXCLUDE/INCLUDE) for each major section
4. Include Template Usage Guidelines at the top
5. Add metadata section at the bottom
6. Run `pnpm run sync` to propagate to plugin directory

**To add a new command:**
1. Create the command file in `shared/commands/` using kebab-case (e.g., `ctx-newcommand.md`)
2. Document the command purpose, parameters, and step-by-step workflow
3. Use `${TEMPLATE_PATH}` and `${RULES_PATH}` placeholders for path references
4. Run `pnpm run sync` to propagate to plugin directory
5. Command will be auto-registered as `/ctx-newcommand` skill in Claude Code

## Building and Development

### Development Setup

```bash
# Install dependencies (from repository root)
pnpm install

# Install plugin locally for testing
pnpm run plugin:install

# Verify installation
claude plugin list
```

### Development Scripts

- `sync`: Syncs templates and commands from shared directories
- `template:update`: Copies templates from shared/templates
- `command:update`: Copies commands from shared/commands
- `postversion`: Runs sync-plugin-version.js after version bump

## Documentation

### API Documentation

- **Documentation location**: Command files in `/commands/` contain comprehensive documentation embedded as step-by-step instructions
- **Documentation format**: Markdown with embedded workflow instructions
- **Template documentation**: Each template file contains usage guidelines and section instructions

### Examples and Guides

- **Examples directory**: `/tests/plans/` contains test scenarios (small-monorepo, medium-monorepo, large-monorepo)
- **Guide topics**:
  - Repository analysis and project discovery
  - Action plan structure and interpretation
  - Template-based context generation
  - Incremental update workflows

## Compatibility

### Platform Support

- **Node.js versions**: Requires Node.js (version determined by Claude Code requirements)
- **Platform compatibility**: Works on any platform supported by Claude Code (macOS, Linux, Windows)

### Framework Integration

- **Claude Code**: Integrates as a native plugin through the Claude Code plugin system

## Maintenance Status

- **Status**: Actively maintained

## Restricted Actions

This section should be reviewed and populated by repository maintainers:

- Do not modify template structure without updating all dependent projects
- Do not change action plan JSON schema without migration support
- Do not modify command file structure without testing in Claude Code
- Do not publish plugin without proper version bumps and changelog updates

# Agent File Maintenance

No LLM/AI/Agent may make changes to this file outside of the claude-context-system commands. This is a maintained file through automatic means.

# Agent File Metadata

- Revision Date: 2026-02-08T14:14:42Z
- Last commit SHA built from: 6327d9c927d9a4fb4a564d5e1be0e59524ce0916
- Template Version: 2.1.0
