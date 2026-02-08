# Client Context: Copilot Context CLI

## Client Overview [overview] [summary]

The Copilot Context CLI is a command-line interface tool that provides equivalent functionality to the Claude Code plugin for GitHub Copilot users. It enables automated creation and maintenance of `claude.md` context files across repositories, integrating seamlessly with GitHub Copilot CLI.

## Client Type [metadata] [platform]

- **Type**: CLI Tool
- **Platform**: Node.js CLI (cross-platform)
- **Target Users**: Developers using GitHub Copilot who want to automate context file management

## Technologies [technologies] [stack]

- **Language**: JavaScript (Node.js)
- **Framework**: Node.js CLI with child_process spawning
- **Key Dependencies**:
  - `@github/copilot` (peer dependency): GitHub Copilot CLI for execution
  - Native Node.js modules: `child_process`, `fs`, `path` for CLI orchestration

## User Input and Validation [input] [validation] [forms]

### Input Patterns [input] [patterns] [ux]

- **Command syntax**: `copilot-plugin <command-name>` where command-name is: `ctx-prepare`, `ctx-execute`, or `ctx-rule`
- **Prerequisites validation**: Tool validates GitHub Copilot CLI installation and authentication before execution
- **Error display**: Clear error messages guide users to install Copilot or log in if prerequisites are missing
- **User feedback**: Copilot CLI provides interactive feedback during command execution with tool permissions and progress

## Build and Development [build] [development] [setup]

### Development Setup [development] [setup] [installation]

```bash
# Install dependencies from repository root
pnpm install

# Sync commands and templates from shared/
pnpm run sync

# Link CLI for local testing (from copilot-context-cli directory)
npm link
```

### Environment Configuration [configuration] [environment]

- **Prerequisites**:
  - Node.js >= 14.0.0
  - GitHub Copilot CLI installed globally: `npm install -g @github/copilot`
  - GitHub Copilot authentication: User must be logged in via `copilot` CLI

## Error Handling and Logging [errors] [logging] [debugging]

### Error Boundaries [errors] [error-handling] [recovery]

- **Error catching**: Main script validates prerequisites and catches spawn errors
- **Error display**: Errors written to stderr with clear guidance for resolution:
  - Missing Copilot CLI: Instructions to install `@github/copilot`
  - Not logged in: Instructions to run `copilot` and `/login`
  - Command not found: Lists available commands
- **Error recovery**: Process exits with appropriate exit codes (1 for errors, propagates Copilot exit code)

### Logging [logging] [observability]

- **Logging library**: Native `console.error` for user-facing messages
- **What gets logged**: Prerequisites validation failures, command execution errors
- **Log levels**: All messages to stderr; Copilot CLI output inherits stdio

## Asset Management [assets] [resources] [static-files]

### Static Assets [assets] [images] [fonts]

- **Asset location**:
  - `/commands/` - Command definition markdown files (auto-synced from `shared/commands/`)
  - `/templates/` - Context file templates (auto-synced from `shared/templates/`)
  - `/rules/` - Language/framework-specific rule files
- **Asset loading**: Read via `fs.readFileSync()`, paths replaced dynamically
- **Asset optimization**: Placeholder replacement (`${TEMPLATE_PATH}`, `${RULES_PATH}`) ensures absolute paths work regardless of CWD

## Deployment [deployment] [release] [ci-cd]

### Build for Production [build] [production] [deployment]

- **Production build**: No build step required (JavaScript CLI)
- **Build verification**: Test via `npm link` and run commands in test repositories

### Deployment Process [deployment] [release] [process]

- **Deployment target**: npm registry (future) or local installation via repository
- **Deployment command**: Currently installed via repository scripts:
  ```bash
  # From repository root
  pnpm run copilot:sync  # Syncs files to copilot-context-cli
  ```

### Release Process [release] [versioning] [distribution]

- **Version management**: Semver via Lerna monorepo versioning (`lerna version`)
- **Release channels**: Currently local/private, designed for npm publication
- **Update mechanism**: Users update via git pull and re-sync

## Documentation [documentation] [reference]

- **Command documentation**: Embedded in `/commands/*.md` files - provides full usage instructions
- **Installation guide**: Package README (to be created)
- **Sync documentation**: `/commands/README.md` explains auto-sync workflow

## Restricted Actions [security] [restrictions] [policies]

- Do not edit files in `/commands/` or `/templates/` directories directly - they are auto-generated from `shared/`
- Do not modify prerequisite checks without ensuring backward compatibility with existing Copilot CLI versions
- Do not remove the `--allow-all-tools` and `--allow-all-paths` flags as they enable automated context generation

# Agent File Maintenance [metadata] [maintenance]

No LLM/AI/Agent may make changes to this file outside of the claude-context-system commands. This is a maintained file through automatic means.

# Agent File Metadata [metadata] [tracking]

- Revision Date: 2026-02-08T20:24:46Z
- Last commit SHA built from: 6684ab3d1d822df39e33e648286066130a30f747
- Template Version: 2.1.0
