# Library Context: Claude Context Plugin

## Library Overview
The Claude Context Plugin is an IDE extension for Claude Code that automates the creation and management of CLAUDE.md context files for AI assistants. It provides slash commands (`/ctx-create`, `/ctx-update`, `/ctx-rule`) that analyze repository structure and generate comprehensive documentation following a template-based system. This plugin helps developers maintain up-to-date context files that enable AI assistants like Claude to better understand project architecture, code organization, and development patterns.

## Library Type
- **Type**: Claude Code IDE Plugin
- **Scope**: Public package (installable via Claude Code plugin system)
- **Language**: Markdown-based commands with JavaScript tooling

## Package Information

### Package Details
- **Package name**: `@claude-context-system/claude-context-plugin`
- **Current version**: 2.1.0
- **Package manager**: pnpm (monorepo), npm (Claude plugin system)
- **Registry**: Local development (via symlink), distributed via Claude marketplace

### Installation

**For Local Development:**
```bash
# From repository root
pnpm run plugin:install
```

This runs `plugin-setup/plugin-install.js` which:
1. Creates `~/.claude/plugins/local-marketplace/` directory structure
2. Generates marketplace.json manifest
3. Symlinks plugin source to `~/.claude/plugins/local-marketplace/plugins/claude-context-updater`
4. Registers marketplace via `claude plugin marketplace add`
5. Installs plugin via `claude plugin install claude-context-updater`

**For Users:**
```bash
# Via Claude Code plugin system (when published)
claude plugin install claude-context-updater
```

## Core Functionality

### Main Features
1. **Context File Creation**: Generates comprehensive CLAUDE.md files from scratch by analyzing repository structure, identifying projects (services, clients, libraries, databases), and populating templates with project-specific information
2. **Context File Updates**: Intelligently updates existing CLAUDE.md files when code changes, preserving user customizations while reflecting new project structure or dependencies
3. **Rule Management**: Manages reusable rule files (built-in, remote, or local) that provide framework-specific guidance (e.g., TypeScript conventions) to AI assistants

### Public API
- **Exported commands** (slash commands in Claude Code):
  - `/ctx-create` - Create new CLAUDE.md file with complete project documentation
  - `/ctx-update` - Update existing CLAUDE.md file to reflect code changes
  - `/ctx-rule` - Manage and apply reusable rule files
- **Exported templates**: 5 markdown templates (CLAUDE, SERVICE, CLIENT, LIBRARY, DATABASE)
- **Exported examples**: Example usage patterns in `examples/` directory
- **Exported rules**: Built-in rule files (e.g., `typescript.md`)

## Usage Examples

### Basic Usage
```bash
# Navigate to your repository in Claude Code
# Run the create command to generate CLAUDE.md
/ctx-create

# The plugin will:
# 1. Verify git working tree is clean
# 2. Analyze repository structure
# 3. Identify all services, clients, libraries, databases
# 4. Generate main CLAUDE.md file
# 5. Generate separate context files for each project (SERVICE.CLAUDE.md, CLIENT.CLAUDE.md, etc.)
# 6. Link all files via @file references
```

### Advanced Usage
```bash
# Update existing context when code changes
/ctx-update

# Manage reusable rules for framework-specific guidance
/ctx-rule

# The update command will:
# 1. Detect what has changed in the repository
# 2. Preserve user customizations in CLAUDE.md
# 3. Update only the sections that need changes
# 4. Maintain proper @file references
```

### Common Patterns
- **Pattern 1: Initial Setup** - Run `/ctx-create` immediately after starting a new project or when first introducing Claude Code to an existing repository to establish comprehensive AI context
- **Pattern 2: Incremental Updates** - Run `/ctx-update` after significant code changes (new services, library additions, architecture changes) to keep AI context synchronized with codebase evolution

## Architecture and Design

### Design Principles
- **Principle 1: Template-Driven** - All context generation follows markdown templates with instruction placeholders (`<{...}>`) that guide content population, ensuring consistency across projects
- **Principle 2: Modular File System** - Separates large repositories into focused context files (main CLAUDE.md + project-specific files) to optimize AI context loading and maintenance
- **Principle 3: Git-Aware** - Requires clean working tree and commits generated files with proper SHAs, ensuring context files always reflect specific committed code states

### Code Organization
- **Directory structure**:
  ```
  claude-context-plugin/
  ├── .claude-plugin/
  │   └── plugin.json          # Plugin manifest (name, version, commands)
  ├── commands/                # Slash command definitions (markdown)
  │   ├── ctx-create.md        # Create command instructions
  │   ├── ctx-update.md        # Update command instructions
  │   └── ctx-rule.md          # Rule management instructions
  ├── templates/               # Context file templates
  │   ├── CLAUDE.TEMPLATE.md   # Main repository template
  │   ├── SERVICE.TEMPLATE.md  # Backend service template
  │   ├── CLIENT.TEMPLATE.md   # User interaction client template
  │   ├── LIBRARY.TEMPLATE.md  # Reusable library template
  │   └── DATABASE.TEMPLATE.md # Database schema template
  ├── examples/                # Example configurations
  ├── rules/                   # Built-in rule files
  │   └── typescript.md        # TypeScript conventions
  ├── scripts/                 # Build/version utilities
  │   └── sync-plugin-version.js
  └── package.json
  ```
- **Module organization**: Plugin is organized by function - commands define behavior, templates define output structure, rules provide framework guidance
- **Entry points**: `.claude-plugin/plugin.json` defines commands that Claude Code loads and exposes as slash commands

### Dependencies
- **Runtime dependencies**: None (pure markdown command definitions)
- **Peer dependencies**: Claude Code CLI (`claude` command) must be installed
- **Optional dependencies**: None
- **Dependency philosophy**: Zero-dependency design - plugin consists of markdown files interpreted by Claude Code, with JavaScript only for development tooling (version sync)

## Internal Code Patterns

### File Structure Conventions
```
# Command files follow this structure:
commands/
  └── ctx-create.md            # Contains:
                               # - Command description
                               # - Detailed step-by-step instructions
                               # - Template processing rules
                               # - Error handling guidance
                               # - Validation checkpoints

# Template files follow this structure:
templates/
  └── CLAUDE.TEMPLATE.md       # Contains:
                               # - Section headers
                               # - Instruction placeholders: <{description}>
                               # - Mandatory rules (e.g., no inline docs)
                               # - Example patterns
                               # - Metadata section template
```

### Code Style Patterns
- **Import conventions**: Not applicable (no imports - markdown files)
- **Naming conventions**: UPPERCASE.TEMPLATE.md for templates, lowercase-with-dash.md for commands
- **File naming**: Descriptive names matching command/template purpose
- **Export patterns**: Files exported via directory structure, referenced in plugin.json

### Implementation Examples

**Example 1: Command Definition Pattern**
```markdown
# In commands/ctx-create.md

## Step 1: Locate Repository Root
Find the git repository root directory. The `CLAUDE.md` file should be created at the repository root, not in the current working directory.

## Step 2: Verify Clean Working Tree
**CRITICAL:** Before proceeding, verify that the git working tree is clean (no uncommitted changes).
Run `git status --short` to check for uncommitted changes.

**If there are uncommitted changes:**
Stop immediately and inform the user...
```

**Example 2: Template Instruction Pattern**
```markdown
# In templates/CLAUDE.TEMPLATE.md

## Repository Summary

<{Brief description of what this service does and its purpose within the organization}>

## High-Level Repository Information

- **Project Types**: <{List all project types, e.g. Node express service, Node Front End client, .Net service, etc. }>
- **Languages**: <{List all languages used in this repository, e.g. Java 17, .Net 9, Javascript, go, python, etc.}>
- **Frameworks/Libraries**: <{Key frameworks, libraries, and versions}>
```

### Adding New Code

**To add a new command:**
1. Create a new markdown file under `commands/` using kebab-case naming (e.g., `ctx-export.md`)
2. Structure the command using the established pattern (Step 1, Step 2, etc.)
3. Include detailed instructions, validation gates, and error handling
4. Add the command to `.claude-plugin/plugin.json` commands array
5. Test the command by running it in Claude Code
6. Update examples/ with usage examples
7. Sync to shared/ if command should be available in Copilot CLI: `pnpm run sync`

**To add a new template:**
1. Create a new markdown file under `templates/` using UPPERCASE naming (e.g., `CONFIG.TEMPLATE.md`)
2. Define all sections with instruction placeholders `<{...}>`
3. Include metadata section template at the end
4. Reference the new template in relevant command files
5. Add validation logic to corresponding commands
6. Sync to shared/: `pnpm run template:update`

### Testing Patterns
- **Test file location**: Tests are in monorepo root `tests/` directory (not co-located)
- **Test structure**: Jest test files with describe/it blocks, using ContextData helper for validation
- **Common test utilities**: `tests/lib/context-data.js` for parsing and validating generated CLAUDE.md files
- **Assertion style**: Jest expect assertions with custom validation methods

### Documentation Requirements
- **Code comments**: Command markdown files ARE the documentation - should be self-explanatory with clear instructions
- **README updates**: Examples should be updated when commands change behavior
- **Example code**: Add to `examples/` directory when introducing new patterns
- **Type documentation**: Not applicable (no TypeScript)

## Configuration

### Configuration Options
- **Configuration method**: Plugin configuration via `.claude-plugin/plugin.json` manifest file
- **Available options**:
  - `name`: Plugin identifier (claude-context-updater)
  - `version`: Semantic version (synced from package.json)
  - `description`: Plugin description for marketplace
  - `commands`: Path to commands directory (./commands)
- **Default values**: All configuration is explicit in plugin.json, no runtime defaults

### Environment Variables
No environment variables used. Plugin execution is entirely within Claude Code environment.

## Type Safety

### TypeScript Support
Not applicable - plugin is markdown-based, no TypeScript code.

### Type Exports
Not applicable.

## Testing

### Testing Approach
- **Testing framework**: Jest (version 29.7.0) in monorepo root
- **Test coverage**: Automated validation of generated context files across 4 test scenarios
- **Test types**: Integration tests - full end-to-end command execution with fixture projects

### Running Tests
From monorepo root:
- **Run all tests**: `pnpm contest test`
- **Run specific plans**: `pnpm contest test --tools plugin --plans library-package`
- **Coverage report**: Not configured (integration tests focus on output validation)

### Testing for Consumers
- **Mocking**: Not applicable - plugin is used via Claude Code slash commands
- **Test utilities**: None provided to consumers (internal test infrastructure in monorepo)

## Building and Development

### Development Setup
```bash
# Clone the monorepo
git clone <repository-url>
cd claude-context-system

# Install dependencies
pnpm install

# Install plugin locally (creates symlink)
pnpm run plugin:install

# Verify installation
claude plugin list
```

### Build Process
- **Build command**: No build step (markdown files used directly)
- **Build output**: Not applicable
- **Build targets**: Not applicable

### Development Scripts
From monorepo root:
- `pnpm run plugin:install`: Install plugin via symlink for local development
- `pnpm run plugin:uninstall`: Remove plugin from Claude Code
- `pnpm run plugin:sync`: Copy templates and commands from shared/ directory
- `pnpm run plugin:template:update`: Copy templates from shared/templates/
- `pnpm run plugin:command:update`: Copy commands from shared/commands/
- `pnpm run plugin:reinstall`: Full reinstall (uninstall + sync + install)
- `pnpm run sync`: Sync templates and commands to both plugin and CLI

## Versioning and Releases

### Versioning Strategy
- **Versioning scheme**: Semantic Versioning (semver)
- **Breaking changes**: Major version bump when command behavior or template structure changes
- **Deprecation policy**: Commands marked deprecated in documentation before removal in next major version

### Release Process
1. Update version in package.json (managed by Lerna)
2. Run `pnpm run postversion` to sync version to `.claude-plugin/plugin.json`
3. Commit version changes: `git commit -m "chore(release): publish 2.1.0"`
4. Tag release: `git tag v2.1.0`
5. Push to repository: `git push && git push --tags`

### Changelog
- **Changelog location**: Not currently maintained (TODO)
- **Changelog format**: Keep a Changelog format (planned)

## Documentation

### API Documentation
- **Documentation location**:
  - Command documentation: Inline in markdown command files
  - Plugin overview: `claude-context-plugin/examples/` directory
  - Test system: `tests/README.md`
  - Monorepo overview: Repository root README (planned)
- **Documentation format**: Markdown
- **Documentation generation**: Not applicable (hand-written documentation)

### Examples and Guides
- **Examples directory**: `claude-context-plugin/examples/`
- **Guide topics**: Example configurations, usage patterns

## Compatibility

### Platform Support
- **Node.js versions**: Not directly relevant (runs in Claude Code environment)
- **Claude Code versions**: Compatible with Claude Code CLI supporting plugin system
- **Platform compatibility**: macOS, Linux, Windows (anywhere Claude Code CLI runs)

### Framework Integration
Not applicable - plugin is used via Claude Code IDE, not integrated into other frameworks.

## Performance Considerations

### Performance Characteristics
- **Performance goals**: Complete repository analysis and CLAUDE.md generation within 2-5 minutes for typical repositories
- **Bundle size**: ~100KB (markdown files only)
- **Tree-shaking**: Not applicable
- **Performance benchmarks**: Tested against 4 project types (Node.js service, TypeScript library, React client, .NET solution)

### Optimization Tips
- Run `/ctx-create` on clean git working tree to avoid validation failures
- For large monorepos, consider running during low-activity periods as full repository analysis can be time-intensive
- Use `/ctx-update` instead of `/ctx-create` for incremental changes to preserve customizations

## Security

### Security Considerations
- **Input validation**: Commands validate git repository state (clean working tree) before execution
- **Security audits**: None conducted (markdown-only plugin)
- **Vulnerability reporting**: Report via GitHub issues (when repository is public)

### Safe Usage Patterns
- Always commit code changes before running `/ctx-create` or `/ctx-update` to ensure context files reflect committed state
- Review generated CLAUDE.md files before committing to avoid exposing sensitive information (API keys, credentials)

## Migration and Upgrade Guides

### Upgrading
- **Breaking changes**: Documented in git commit messages (changelog planned)
- **Migration guides**: Not yet available
- **Codemod tools**: Not applicable

## Contributing

### How to Contribute
- **Contribution process**: Fork repository, make changes, submit pull request
- **Code style**: Follow existing markdown structure for commands and templates
- **Pull request process**: Requires test validation via `pnpm contest test`

### Development Guidelines
- Maintain template consistency across all template files
- Ensure commands include proper validation checkpoints
- Test changes against all 4 test plans before submitting PR
- Sync changes to shared/ directory: `pnpm run sync`

## Support and Maintenance

### Support Channels
- **Issues**: GitHub issues (when public)
- **Discussions**: Not yet configured
- **Chat**: Not available

### Maintenance Status
- **Status**: Actively maintained
- **Maintainers**: Core development team

## Restricted Actions
<!-- AI agents should NOT perform the following actions when working with this plugin: -->

<!-- Leave blank initially - user should review and populate -->

# Library File Metadata

- Date Created: 2026-01-22T15:30:00Z
- Date Modified: 2026-01-22T15:30:00Z
- Last commit SHA built from: cb6bf60e62086eed3c82984c23dcf8555c4f35fa
- Template Version: 2.1.0
