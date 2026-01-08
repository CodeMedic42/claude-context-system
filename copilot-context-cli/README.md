# Copilot Context Manager

GitHub Copilot CLI tool for automated `claude.md` context file management. Provides the same functionality as the Claude Code plugin but for GitHub Copilot users.

## Overview

This package provides custom commands for GitHub Copilot CLI to create and maintain repository context documentation files (`claude.md`) that help AI assistants quickly understand codebases.

## Installation

### Global Installation (Recommended)

```bash
npm install -g copilot-context-manager
```

### Local Development

```bash
cd copilot-context-manager
npm install
npm link
```

## Usage

```bash
copilot-plugin <command-name>
```

### Available Commands

#### ctx-update

Create or update the `claude.md` file for your repository:

```bash
copilot-plugin ctx-update
```

This command will:
- Analyze your repository structure and dependencies
- Create or update `claude.md` with comprehensive context
- Generate separate documentation files for services, clients, libraries, and databases
- Track versions and metadata for future updates

#### ctx-rule

Manage reusable rule files from built-in, remote, or local sources:

```bash
# Add a built-in rule
copilot-plugin ctx-rule add typescript

# Add a rule from a URL
copilot-plugin ctx-rule add https://example.com/rules/javascript.md

# Add a rule from a local file
copilot-plugin ctx-rule add ./my-rules/security.md

# Update all rules
copilot-plugin ctx-rule update

# Update specific rule
copilot-plugin ctx-rule update typescript

# Remove a rule
copilot-plugin ctx-rule remove typescript
```

## How It Works

When you run `copilot-plugin <command-name>`, the tool:

1. Validates that GitHub Copilot CLI is installed and authenticated
2. Locates the command file at `commands/<command-name>.md`
3. Passes the file path to Copilot CLI via `-p 'execute /path/to/command.md'`
4. Copilot reads the markdown file and executes the instructions using available tools

## Command Structure

Each command is a markdown file containing detailed instructions for Copilot to follow. The commands use:

- Clear step-by-step procedures
- Conditional logic for different scenarios
- Tool specifications (Read, Write, Bash, WebFetch, etc.)
- Template-based content generation

## Requirements

- Node.js 14+
- GitHub Copilot CLI installed and authenticated (`npm install -g @github/copilot`)
- Git repository (for context generation commands)

## Templates

The package includes templates for generating context documentation:

- `claude.template.md` - Main repository context template
- `service.template.md` - Service/API documentation template
- `client.template.md` - Client application template
- `library.template.md` - Library/package template
- `database.template.md` - Database schema template

Templates are synchronized from the shared templates directory and can be customized by users in `~/.claude/templates/`.

## Built-in Rules

The package includes reusable rule templates for common coding standards and best practices. These can be added to your repository using the `ctx-rule` command.

## Related Tools

This tool provides equivalent functionality to the Claude Code plugin (`claude-context-updater`) for GitHub Copilot users. Both tools:
- Use the same templates and commands
- Generate compatible output files
- Support the same rule management system

## License

MIT
