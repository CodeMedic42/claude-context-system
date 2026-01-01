# Repository Agent Context

## Repository Summary

Claude Context System is a toolset that creates and maintains `claude.md` context files for AI coding assistants like Claude Code and GitHub Copilot. It provides automated repository analysis and documentation generation to help AI assistants better understand codebases.

## High-Level Repository Information

- **Project Types**: Documentation/Tooling repository, Claude Code plugin, Node.js CLI, GitHub Copilot instructions
- **Languages**: JavaScript (Node.js), Markdown (documentation), JSON (configuration)
- **Frameworks/Libraries**: Claude Code Plugin System v1.0+, Node.js 14+, Commander.js (CLI framework)

## Repository Structure

```
claude-context-system/
├── package.json                      # Root monorepo configuration
├── README.md                         # Main documentation and overview
├── VERSION_MANAGEMENT.md             # Version and template sync guide
│
├── claude-plugin/                    # Claude Code plugin implementation
│   ├── .claude-plugin/
│   │   └── plugin.json               # Plugin manifest and metadata
│   ├── commands/
│   │   └── ctx-update.md              # /ctx-update command implementation
│   ├── templates/
│   │   └── claude.template.md        # Bundled template for plugin
│   ├── examples/
│   │   ├── claude.example.md         # Example generated output
│   │   └── .claude/rules/            # Example rule files
│   └── README.md                     # Plugin documentation
│
├── cli/                              # CLI tool (claude-ctx command)
│   ├── bin/
│   │   └── claude-ctx.js             # CLI executable entry point
│   ├── src/
│   │   ├── index.js                  # CLI setup with commander
│   │   ├── commands/                 # Command implementations
│   │   │   ├── context/              # Context management commands
│   │   │   └── plugin/               # Plugin management commands
│   │   ├── utils/                    # Utility modules
│   │   │   ├── claude-file.js        # claude.md file operations
│   │   │   ├── context-file.js       # Context file parsing
│   │   │   ├── version.js            # Semantic versioning utilities
│   │   │   └── download.js           # File fetching (URL/local)
│   │   └── constants.js              # Paths and configuration
│   ├── package.json                  # CLI package configuration
│   └── README.md                     # CLI documentation
│
├── copilot-instructions/             # GitHub Copilot prompts
│   ├── create-prompt.md              # Prompt to create claude.md
│   ├── update-prompt.md              # Prompt to update claude.md
│   └── README.md                     # Copilot usage guide
│
├── shared/                           # Shared components
│   └── templates/
│       └── claude.template.md        # Source of truth template
│
└── docs/                             # Extended documentation
    ├── README.md                     # Complete guide
    ├── QUICK_START.md                # Quick reference
    └── claude-guide.md               # Claude Code specific features
```

## Libraries and Plugins

### Claude Code Plugin: claude-context-updater

A Claude Code plugin that automates the creation and maintenance of `claude.md` context files.

**Installation:**

```bash
# From git repository
claude plugin install https://github.com/your-org/claude-context-system/claude-plugin
```

**Usage:**

```
/ctx-update
```

This command will:
1. Analyze your repository structure, languages, frameworks, and project types
2. Detect services, APIs, databases, and dependencies
3. Generate or update `claude.md` at the repository root
4. Track changes using git metadata (commit SHA, timestamps)
5. Preserve user customizations during updates

**Features:**
- Automated repository analysis
- Git-aware smart updates (only updates when repository changes)
- Template versioning and upgrade support
- Preserves user customizations during updates
- Works with both Claude Code and GitHub Copilot

**Template Customization:**

You can override the bundled template by creating a custom template at:
```
~/.claude/templates/claude.template.md
```

The plugin will use your custom template if it exists, otherwise it uses the bundled template.

### GitHub Copilot Instructions

For users who prefer GitHub Copilot, the repository includes prompts that achieve the same functionality:

1. Open Copilot Chat in VS Code
2. Use prompts from `copilot-instructions/create-prompt.md` or `update-prompt.md`
3. Provide the template from `shared/templates/claude.template.md`
4. Save the generated output as `claude.md`

See [copilot-instructions/README.md](copilot-instructions/README.md) for detailed instructions.

### CLI Tool: claude-ctx

A Node.js command-line tool for managing the claude-context-updater plugin and user-level context files.

**Installation:**

```bash
npm install -g claude-context-manager
```

This installs the `claude-ctx` command globally.

**Features:**

1. **Plugin Management** (via `~/.claude/plugins.json`):
   ```bash
   claude-ctx plugin install [version]    # Install the plugin
   claude-ctx plugin uninstall            # Uninstall the plugin
   ```
   - Supports git and local installation methods
   - Detects if already installed
   - Handles reinstallation
   - Automatically restarts Claude Code notification

2. **User-Level Context Management:**
   ```bash
   claude-ctx context create <path>       # Create new context file
   claude-ctx context install [id] <uri>  # Install from URL or local path
   claude-ctx context list                # List installed contexts
   claude-ctx context update <id>         # Update to latest version
   claude-ctx context uninstall <id>      # Remove a context
   ```

**How It Works:**

- **Plugin management**: Directly edits `~/.claude/plugins.json` to install/uninstall plugins
- **Context management**: Manages files in `~/.claude/claude.md` and `~/.claude/contexts/`
- Context files apply to all Claude Code sessions across all projects
- Uses YAML frontmatter with semantic versioning for context files
- Tracks metadata (URIs, versions) as JSON comments in claude.md
- Validates context files before installation
- Compares versions and only updates if remote version is higher

**Context File Format:**

```markdown
---
claude-context-version: "1.0"
version: "1.0.0"
name: "Backend Rules"
description: "Optional description"
created: "2025-01-15T10:00:00Z"
---

# Backend Rules

Your content here...
```

**Dependencies:**
- Node.js 14.0.0 or higher
- commander (CLI framework)
- inquirer (interactive prompts)
- semver (version comparison)
- axios (HTTP downloads)
- chalk (colored output)
- yaml (frontmatter parsing)
- ora (loading spinners)

See [cli/README.md](cli/README.md) for complete documentation.

## Environment Setup

### Prerequisites

- **Git**: Repository must be a git repository
- **Claude Code** (for plugin usage): Claude Code CLI installed and configured
- **VS Code + GitHub Copilot** (for Copilot usage): VS Code with GitHub Copilot extension

### System Configuration

No special environment variables or system paths are required. The tools work with standard git repositories.

### Local Services

No local services need to be running. This is a documentation and tooling repository.

## Running the Application Locally

This is a documentation/tooling repository with no application to run. The plugin is consumed by Claude Code, and the prompts are used directly in GitHub Copilot Chat.

### 1. Development Setup

For plugin or CLI development:

```bash
# Clone the repository
git clone https://github.com/your-org/claude-context-system
cd claude-context-updater

# Install pnpm globally (if not already installed)
npm install -g pnpm

# Install dependencies
pnpm install

# Install plugin locally for testing (via CLI)
claude-ctx plugin install

# Or test CLI locally
cd cli
npm link
claude-ctx --help
```

### 2. Testing the Plugin

```bash
# In any git repository
/md-update
```

The command will create or update `claude.md` in the repository root.

## Repository Verification

### Unit Tests

Testing is performed manually by:
1. Running `/ctx-update` in various repository types
2. Verifying the generated `claude.md` content
3. Testing update functionality with git changes
4. Ensuring user customizations are preserved
5. Testing CLI commands: `node cli/bin/claude-ctx.js --help`

Run tests across all packages:
```bash
pnpm run test
```

### Linting and Code Style

Run linting across all packages:
```bash
pnpm run lint
```

For markdown-based documentation, manual review ensures:
- Markdown formatting is correct
- Template placeholders use consistent `{...}` syntax
- JSON files are valid
- Documentation is clear and accurate

## Documentation

Key documentation files that should be kept up-to-date:

- **README.md** - Main overview, installation, and usage instructions
- **VERSION_MANAGEMENT.md** - Version and template synchronization process
- **claude-plugin/README.md** - Claude Code plugin documentation
- **copilot-instructions/README.md** - GitHub Copilot usage guide
- **docs/README.md** - Comprehensive documentation
- **docs/QUICK_START.md** - Quick reference guide
- **docs/claude-guide.md** - Claude Code specific features

When making changes:
- Update README.md if installation, usage, or features change
- Update VERSION_MANAGEMENT.md if versioning process changes
- Keep template files in sync (shared/templates/ and claude-plugin/templates/)
- Update plugin.json version when making releases

## Restricted Actions

When working in this repository:
- Do NOT modify `claude-plugin/templates/claude.template.md` directly - always edit `shared/templates/claude.template.md` first, then copy
- Do NOT hardcode version numbers in command files or templates - versions should be read dynamically from plugin.json
- Do NOT create inconsistencies between the two template locations
- Do NOT add dependencies without careful consideration - this should remain a lightweight tooling repository

# Agent File Metadata

- Date Created: 2025-12-29T00:00:00Z
- Date Modified: 2025-12-29T00:00:00Z
- Last commit SHA built from: d2ff8fb44352682bf3a22e84fd4b7bb1528a41ee
- Template Version: 2.0.0
