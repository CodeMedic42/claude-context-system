# Repository Agent Context

## Repository Summary

The claude-context-system is a monorepo that provides automated CLAUDE.md context file management for AI assistants. It offers dual implementations - a Claude Code IDE plugin and a GitHub Copilot CLI tool - both using the same template-based system to generate comprehensive repository documentation. The system analyzes repository structure, identifies projects (services, clients, libraries, databases), and creates modular context files with @file references, enabling AI assistants to better understand project architecture and development patterns.

## High-Level Repository Information

- **Project Types**: Node.js CLI tool, Claude Code IDE plugin, Testing infrastructure
- **Languages**: JavaScript (ES2021), Markdown
- **Frameworks/Libraries**: Node.js (>=14.0.0), Lerna 9.0.3 (monorepo management), Jest 29.7.0 (testing), Husky 9.1.7 (git hooks)

## Repository Structure

```
claude-context-system/
├── .claude/                    # Claude Code local settings
│   └── settings.local.json     # User-specific IDE config
├── .husky/                     # Git hooks via Husky
│   └── pre-commit              # Pre-commit validation
├── .vscode/                    # VS Code workspace config
│   ├── launch.json             # Debug configurations
│   └── settings.json           # Editor settings
├── claude-context-plugin/      # Claude Code IDE plugin
│   ├── .claude-plugin/         # Plugin manifest
│   │   └── plugin.json         # Plugin metadata and commands
│   ├── commands/               # Slash command definitions
│   │   ├── ctx-create.md       # Create CLAUDE.md command
│   │   ├── ctx-update.md       # Update CLAUDE.md command
│   │   └── ctx-rule.md         # Manage rules command
│   ├── templates/              # Context file templates
│   │   ├── CLAUDE.TEMPLATE.md  # Main repository template
│   │   ├── SERVICE.TEMPLATE.md # Backend service template
│   │   ├── CLIENT.TEMPLATE.md  # User client template
│   │   ├── LIBRARY.TEMPLATE.md # Library/plugin template
│   │   └── DATABASE.TEMPLATE.md # Database schema template
│   ├── examples/               # Example configurations
│   ├── rules/                  # Built-in rule files
│   │   └── typescript.md       # TypeScript conventions
│   ├── scripts/                # Build utilities
│   │   └── sync-plugin-version.js # Version synchronization
│   ├── LIBRARY.CLAUDE.md       # Plugin documentation
│   └── package.json            # Plugin metadata
├── copilot-context-cli/        # GitHub Copilot CLI tool
│   ├── bin/                    # Executable entry point
│   │   └── copilot-plugin.js   # CLI wrapper script
│   ├── commands/               # Same commands as plugin
│   ├── templates/              # Same templates as plugin
│   ├── rules/                  # Same rules as plugin
│   ├── CLIENT.CLAUDE.md        # CLI tool documentation
│   └── package.json            # CLI package metadata
├── shared/                     # Shared resources (source of truth)
│   ├── commands/               # Command definitions
│   │   ├── ctx-create.md       # Create command source
│   │   ├── ctx-update.md       # Update command source
│   │   └── ctx-rule.md         # Rule command source
│   └── templates/              # Template sources
│       ├── CLAUDE.TEMPLATE.md  # Main template source
│       ├── SERVICE.TEMPLATE.md # Service template source
│       ├── CLIENT.TEMPLATE.md  # Client template source
│       ├── LIBRARY.TEMPLATE.md # Library template source
│       └── DATABASE.TEMPLATE.md # Database template source
├── plugin-setup/               # Plugin installation utilities
│   ├── plugin-install.js       # Local plugin installer
│   └── plugin-uninstall.js     # Plugin removal tool
├── tests/                      # Test infrastructure
│   ├── cli/                    # Contest CLI test runner
│   │   ├── bin/contest.js      # Test CLI entry point
│   │   ├── commands/           # Test commands (test, rerun, open, list, clean)
│   │   └── lib/                # UI helpers and formatters
│   ├── lib/                    # Core test infrastructure
│   │   ├── execution-context.js # CLI argument parser
│   │   ├── run.js              # Test run orchestrator
│   │   ├── batch.js            # Tool+plan handler
│   │   ├── plan.js             # Test plan loader
│   │   ├── context-data.js     # CLAUDE.md parser
│   │   └── tools/              # Tool implementations
│   │       ├── tool.js         # Abstract base class
│   │       ├── claude-tool.js  # Claude plugin runner
│   │       ├── copilot-tool.js # Copilot CLI runner
│   │       └── index.js        # Tool registry
│   ├── plans/                  # Test scenarios
│   │   ├── simple-node-service/ # Node.js API test
│   │   ├── library-package/    # TypeScript library test
│   │   ├── react-client-only/  # React client test
│   │   └── dotnet-update/      # Incremental update test
│   └── README.md               # Test system documentation
├── .eslintrc.json              # ESLint configuration (airbnb-base)
├── .gitignore                  # Git ignore patterns
├── .npmrc                      # npm configuration
├── jest.config.js              # Jest test configuration
├── lerna.json                  # Lerna monorepo config
├── package.json                # Root workspace package
├── pnpm-lock.yaml              # pnpm dependency lock
├── pnpm-workspace.yaml         # pnpm workspace definition
└── CLAUDE.md                   # This file
```

## Code Organization Patterns

- **Architecture**: Lerna-managed monorepo with dual implementations (Claude plugin + Copilot CLI)
- **Project organization**: Packages in root directories (claude-context-plugin/, copilot-context-cli/), shared resources in shared/, testing infrastructure in tests/
- **Common patterns**:
  - Template-driven documentation generation using markdown templates with instruction placeholders (`<{...}>`)
  - Dual implementation strategy sharing templates/commands via npm sync scripts
  - Modular context file system using @file references for large repositories
  - Git-aware validation requiring clean working tree before operations
- **Naming conventions**:
  - Uppercase for template files: CLAUDE.TEMPLATE.md, SERVICE.TEMPLATE.md
  - Uppercase for generated context files: CLAUDE.md, SERVICE.CLAUDE.md
  - kebab-case for command files: ctx-create.md, ctx-update.md
  - kebab-case for directories: claude-context-plugin, copilot-context-cli

## Libraries and Plugins

- **Claude Context Plugin**: @file ./claude-context-plugin/LIBRARY.CLAUDE.md

## User Interaction Clients

- **Copilot Context CLI**: @file ./copilot-context-cli/CLIENT.CLAUDE.md

## Environment Setup

### Prerequisites

**Required Tools:**
- Node.js v16+ (development runtime)
- pnpm (package manager for monorepo)
- Git (repository management and version control)

**For Claude Plugin Development:**
- Claude CLI installed (`claude` command available)
- Claude Code IDE access

**For Copilot CLI Development:**
- GitHub Copilot CLI installed (`copilot` command)
- GitHub Copilot subscription and authentication

### System Configuration

**Node.js Version:**
Ensure Node.js v16 or higher is installed:
```bash
node --version  # Should be v16.0.0 or higher
```

**pnpm Installation:**
```bash
npm install -g pnpm
```

**Environment Variables:**
- `COPILOT_AUTO_APPROVE=true` - Used in test infrastructure to skip interactive confirmations (test automation only)

### External Dependencies

**Claude CLI (for plugin development):**
```bash
# Installation instructions at: https://claude.ai/download
# Verify installation:
claude --version
```

**GitHub Copilot CLI (for CLI tool development):**
```bash
# Install globally
npm install -g @github/copilot

# Authenticate
copilot
# Then run: /login

# Verify installation:
copilot --version
```

## Running the Application Locally

### 1. Environment Setup

**Clone and Install Dependencies:**
```bash
# Clone the repository
git clone <repository-url>
cd claude-context-system

# Install all dependencies (root + all packages)
pnpm install

# Verify installation
pnpm list --depth=0
```

**Install Claude Plugin Locally (for plugin development):**
```bash
pnpm run plugin:install

# This creates:
# - Symlink at ~/.claude/plugins/local-marketplace/plugins/claude-context-updater
# - Marketplace registry at ~/.claude/plugins/local-marketplace/
# - Registers marketplace with Claude Code
# - Installs plugin

# Verify installation:
claude plugin list
# Should show: claude-context-updater (2.1.0)
```

**Access via Claude Code IDE:**
- Open any repository in Claude Code
- Run: `/ctx-create` to create CLAUDE.md
- Run: `/ctx-update` to update existing CLAUDE.md
- Run: `/ctx-rule` to manage rule files

**Access via Copilot CLI:**
```bash
cd copilot-context-cli

# Run directly (from package directory):
node bin/copilot-plugin.js ctx-create

# Or install globally (when published):
npm install -g copilot-context-cli
copilot-plugin ctx-create
```

## Repository Verification

### Unit Tests

**Run Integration Tests:**
```bash
# Run all tests against both tools (plugin + CLI)
pnpm contest test

# Run specific tool
pnpm contest test --tools plugin
pnpm contest test --tools cli

# Run specific test plan
pnpm contest test --plans library-package
pnpm contest test --plans simple-node-service,react-client-only

# Combine filters
pnpm contest test --tools plugin --plans dotnet-update
```

**Test Plans Available:**
- `simple-node-service` - Tests Node.js Express API context generation
- `library-package` - Tests TypeScript library context generation
- `react-client-only` - Tests React client context generation
- `dotnet-update` - Tests incremental update detection with .NET solution

**View Test Results:**
```bash
# List all test runs
pnpm contest list

# Interactively explore results
pnpm contest open --run <run-number>

# Rerun tests from previous run
pnpm contest rerun --run <run-number>
```

**Test Results Location:**
All test runs are saved to: `~/claude-context-test-runs/<run-number>/`

### Linting and Code Style

**Run ESLint:**
```bash
# Check all JavaScript files
pnpm run lint

# Fix auto-fixable issues
pnpm run lint:fix
```

**ESLint Configuration:**
- Base config: airbnb-base
- Environment: Node.js ES2021
- Rules: Standard airbnb rules with import plugin

## Documentation

**Repository Documentation:**
- `tests/README.md` - Comprehensive test system documentation (test infrastructure, CLI, test plans, development workflows)
- `claude-context-plugin/examples/` - Example plugin configurations and rule files
- `claude-context-plugin/LIBRARY.CLAUDE.md` - Claude plugin documentation
- `copilot-context-cli/CLIENT.CLAUDE.md` - Copilot CLI documentation

**Template Documentation:**
Templates are self-documenting - instruction placeholders (`<{...}>`) describe what content should be populated in each section.

**Important:** Keep documentation synchronized with code changes:
- Update README.md files when test infrastructure changes
- Update LIBRARY.CLAUDE.md when plugin behavior changes
- Update CLIENT.CLAUDE.md when CLI tool behavior changes
- Update template files when documentation structure changes
- Run `pnpm run sync` to propagate shared template/command changes

## Restricted Actions

<!-- AI agents should NOT perform the following actions when working with this repository: -->

<!-- User should review and populate this section with project-specific restrictions -->

# Agent File Metadata

- Date Created: 2026-01-22T15:40:00Z
- Date Modified: 2026-01-22T15:40:00Z
- Last commit SHA built from: cb6bf60e62086eed3c82984c23dcf8555c4f35fa
- Template Version: 2.1.0
