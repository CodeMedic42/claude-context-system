# Library Context: Claude Context Updater Plugin

## Library Overview

The Claude Context Updater Plugin is a Claude Code plugin that automates the creation and maintenance of `claude.md` context files for AI coding assistants. It analyzes repository structure, detects languages and frameworks, identifies services/APIs/databases, and generates comprehensive documentation that both Claude Code and GitHub Copilot can read. The plugin provides intelligent git-aware updates that preserve user customizations while keeping context synchronized with code changes.

## Library Type

- **Type**: Claude Code Plugin
- **Scope**: Public package (intended for distribution via Claude Code plugin marketplace)
- **Language**: Markdown (command definitions), JavaScript (installation scripts)

## Package Information

### Package Details

- **Package name**: claude-context-updater
- **Current version**: 2.0.0
- **Package manager**: Claude Code plugin system
- **Registry**: Claude Code plugin marketplace (or direct git installation)

### Installation

**From Git Repository:**
```bash
claude plugin install https://github.com/your-org/claude-context-system/claude-plugin
```

**For Local Development:**
```bash
# From repository root
pnpm install
pnpm run plugin:install
```

This creates a symlink to your local plugin directory, allowing immediate testing of changes.

## Core Functionality

### Main Features

1. **Automated claude.md Creation**: Analyzes repository structure and generates comprehensive context documentation from templates
2. **Git-Aware Updates**: Detects changes since last update and only modifies affected sections while preserving user customizations
3. **Template System**: Supports bundled templates with optional user overrides for organization-specific customization
4. **Multi-Project Support**: Handles monorepos and generates separate context files for services, clients, libraries, and databases
5. **Reusable Rules Management**: Allows teams to create and share reusable context rules across repositories

### Public API

**Exposed Commands:**
- `/claude-context-updater:ctx-update` - Create or update claude.md in current repository
- `/claude-context-updater:ctx-rule` - Manage reusable rule files (add, remove, update, list)

**Exported Templates:**
- `claude.template.md` - Main repository context template
- `service.template.md` - Service/API documentation template
- `client.template.md` - Client application documentation template
- `library.template.md` - Library/plugin documentation template
- `database.template.md` - Database schema documentation template

**Configuration:**
- Plugin manifest at `.claude-plugin/plugin.json`
- Optional user template override at `~/.claude/templates/claude.template.md`

## Usage Examples

### Basic Usage

**Creating claude.md for the first time:**
```
# In any git repository with Claude Code CLI
/claude-context-updater:ctx-update
```

The plugin will:
1. Locate the repository root
2. Analyze the codebase structure
3. Generate claude.md with comprehensive context
4. Add metadata for future updates

### Advanced Usage

**Updating an existing claude.md after code changes:**
```
# After making changes and committing
git commit -m "Add new API endpoint"

# Update context (preserves customizations)
/claude-context-updater:ctx-update
```

**Using custom template:**
```bash
# Create custom template override
mkdir -p ~/.claude/templates
cp claude-plugin/templates/claude.template.md ~/.claude/templates/

# Edit template to match organization standards
vim ~/.claude/templates/claude.template.md

# Generate claude.md with custom template
/claude-context-updater:ctx-update
```

### Common Patterns

- **First-Time Setup**: Run `/ctx-update` immediately after creating a new repository to establish baseline context
- **Regular Updates**: Run `/ctx-update` after significant changes (new features, architectural changes, dependency updates)
- **Team Consistency**: Share custom template via `~/.claude/templates/` to ensure consistent documentation across team repositories
- **Monorepo Management**: Plugin automatically detects and creates separate files for each service/client/library in monorepos

## Architecture and Design

### Design Principles

- **Template-Driven**: All output follows structured templates with clear instructions for content population
- **Git-Aware**: Tracks last build commit SHA to intelligently update only what changed
- **User-Preserving**: Never overwrites user customizations without explicit approval
- **Self-Documenting**: Generated files include metadata explaining how they were created
- **Modular**: Separate templates for different project types (service, client, library, database)

### Code Organization

- **Directory structure**:
  ```
  claude-plugin/
  ├── .claude-plugin/plugin.json    # Plugin manifest
  ├── commands/                     # Command definitions (markdown)
  │   ├── ctx-update.md             # Main update command
  │   └── ctx-rule.md               # Rule management command
  ├── templates/                    # Bundled templates
  │   ├── claude.template.md        # Main template
  │   ├── service.template.md       # Service docs
  │   ├── client.template.md        # Client docs
  │   ├── library.template.md       # Library docs
  │   └── database.template.md      # Database docs
  ├── examples/                     # Example outputs
  └── rules/                        # Example reusable rules
  ```

- **Module organization**: Commands are defined in markdown files that Claude Code loads and executes
- **Entry points**: Command files in `commands/` directory

### Dependencies

- **Runtime dependencies**: None (pure Claude Code plugin)
- **Peer dependencies**: Claude Code CLI must be installed
- **Optional dependencies**: Git (required for git-aware features)
- **Dependency philosophy**: Minimal dependencies to ensure reliability and easy installation

## Internal Code Patterns

### File Structure Conventions

```
claude-plugin/
  commands/
    command-name.md              # Command definition with instructions
  templates/
    template-name.template.md    # Template with {placeholder} instructions
  examples/
    example-name.md              # Example output showing what generated files look like
  .claude-plugin/
    plugin.json                  # Plugin metadata (name, version, description)
```

### Code Style Patterns

- **Command files**: Written in markdown with clear step-by-step instructions for Claude to execute
- **Templates**: Use `{curly braces}` to indicate instructions/prompts that should be replaced with actual content
- **Naming conventions**:
  - Commands: kebab-case (ctx-update.md, ctx-rule.md)
  - Templates: lowercase with .template.md extension
  - Generated files: lowercase (claude.md, service.claude.md)
- **Export patterns**: Templates are read directly from filesystem; commands registered via plugin.json

### Implementation Examples

**Example 1: Command Structure Pattern**

Commands follow this structure:
```markdown
# Command Title

Brief description of what the command does.

## Step 1: Initial Setup
{Instructions for first step}

## Step 2: Processing
{Instructions for main processing}

## Step 3: Output
{Instructions for generating output}

## Error Handling
{Instructions for handling errors}
```

**Example 2: Template Instruction Pattern**

Templates use this pattern for instructions:
```markdown
## Section Name

{Instructions describing what content should go here}
- **Field 1**: {Description of what to include}
- **Field 2**: {Description of what to include}

{Further guidance on how to populate this section}
```

### Adding New Code

**To add a new command:**

1. Create a new markdown file in `claude-plugin/commands/` using kebab-case: `my-command.md`
2. Write step-by-step instructions for Claude to execute (see existing commands for structure)
3. Update `.claude-plugin/plugin.json` to register the new command
4. Test locally using `pnpm run plugin:install`
5. Update plugin README.md to document the new command
6. Create example usage in `examples/` directory if helpful

**To add a new template:**

1. Create template file in `shared/templates/` using format: `type.template.md`
2. Write template structure with `{curly brace}` instructions
3. Run `pnpm run plugin:template:update` to sync to `claude-plugin/templates/`
4. Update relevant command files to reference the new template
5. Test template generation with a real repository
6. Document the template purpose in README.md

### Testing Patterns

**Manual Testing:**
- Install plugin locally: `pnpm run plugin:install`
- Navigate to a test repository
- Run commands and verify output
- Check that generated files match templates
- Verify metadata is correct

**Update Testing:**
- Create claude.md in test repository
- Make code changes and commit
- Run update command
- Verify only relevant sections updated
- Verify user customizations preserved

### Documentation Requirements

- **Command documentation**: Each command must have a README entry explaining usage and examples
- **Template documentation**: Templates should include inline comments explaining each section's purpose
- **Plugin README**: Keep `claude-plugin/README.md` updated with all commands and usage patterns
- **Main README**: Update root `README.md` when adding major features

## Configuration

### Configuration Options

- **Configuration method**: Plugin configuration via `.claude-plugin/plugin.json`
- **Available options**:
  - `name`: Plugin identifier
  - `version`: Plugin version (used in generated file metadata)
  - `description`: Brief description of plugin purpose
  - `commands`: Path to commands directory
- **Default values**: All configuration is in plugin.json; no runtime configuration needed

### Environment Variables

No environment variables required. Plugin uses git commands to detect repository information.

## Type Safety

### TypeScript Support

Not applicable - this is a markdown-based Claude Code plugin. Commands are defined in markdown format that Claude interprets and executes.

## Testing

### Testing Approach

- **Testing framework**: Manual testing in real repositories
- **Test coverage**: Test commands in various repository types (monorepo, single project, different languages)
- **Test types**: Integration testing with real repositories

### Running Tests

Manual testing workflow:
```bash
# Install plugin locally
pnpm run plugin:install

# Test in a sample repository
cd /path/to/test/repo
claude  # Start Claude Code CLI

# Inside Claude session:
/claude-context-updater:ctx-update

# Verify output
cat claude.md
```

### Testing for Consumers

Consumers can test by installing the plugin and running commands in their repositories. No special test utilities needed.

## Building and Development

### Development Setup

```bash
# Clone repository
git clone https://github.com/your-org/claude-context-system
cd claude-context-system

# Install dependencies
pnpm install

# Install plugin locally for testing
pnpm run plugin:install
```

### Build Process

No build process required - plugin consists of markdown files that are read directly. However, templates are synced using:

```bash
# Copy shared templates to plugin directory
pnpm run plugin:template:update
```

This is automated via git hooks when committing changes to `shared/templates/`.

### Development Scripts

- `pnpm run plugin:install` - Install plugin locally via symlink
- `pnpm run plugin:uninstall` - Remove local plugin installation
- `pnpm run plugin:reinstall` - Uninstall, update templates, and reinstall
- `pnpm run plugin:template:update` - Copy shared templates to plugin directory

## Versioning and Releases

### Versioning Strategy

- **Versioning scheme**: Semantic Versioning (semver)
- **Breaking changes**: Major version bump when template structure changes incompatibly
- **Deprecation policy**: Announce deprecations in release notes and provide migration path

### Release Process

1. Update version in `claude-plugin/.claude-plugin/plugin.json`
2. Update version in root `package.json`
3. Run `pnpm run version` to update all packages via Lerna
4. Update CHANGELOG.md with changes
5. Commit version changes: `git commit -m "chore(release): publish v2.0.0"`
6. Tag release: `git tag v2.0.0`
7. Push with tags: `git push && git push --tags`
8. Publish to plugin marketplace (or distribute via git URL)

### Changelog

- **Changelog location**: Root `VERSION_MANAGEMENT.md` explains versioning strategy
- **Changelog format**: Keep a Changelog format in CHANGELOG.md (when created)

## Documentation

### API Documentation

- **Documentation location**:
  - `claude-plugin/README.md` - Plugin overview and usage
  - `claude-plugin/commands/` - Command implementation details
  - Root `README.md` - Project overview
  - `docs/` directory - Comprehensive guides

- **Documentation format**: Markdown
- **Documentation generation**: No automated generation; manually maintained

### Examples and Guides

- **Examples directory**: `claude-plugin/examples/`
- **Guide topics**:
  - Quick Start (README.md)
  - Installation and Setup (docs/QUICK_START.md)
  - Claude Code Specific Features (docs/claude-guide.md)
  - Template Customization (README.md)

## Compatibility

### Platform Support

- **Node.js versions**: Not applicable (runs within Claude Code, which handles Node.js)
- **Claude Code version**: Compatible with Claude Code CLI
- **Platform compatibility**: Works on any platform that supports Claude Code (macOS, Linux, Windows)

### Framework Integration

This plugin is framework-agnostic and works with repositories using any programming language or framework.

## Performance Considerations

### Performance Characteristics

- **Performance goals**: Complete repository analysis in under 30 seconds for typical repositories
- **Bundle size**: Minimal (markdown files only, ~50KB total)
- **Performance benchmarks**: Performance depends on repository size and git history

### Optimization Tips

- Use `.gitignore` patterns to exclude large directories from analysis
- For very large monorepos, consider creating claude.md files at sub-project level
- Git operations are the slowest part; ensure `.git` directory is local (not on network drive)

## Security

### Security Considerations

- **Input validation**: Plugin reads repository files but does not execute code
- **Security audits**: No formal security audits (low risk surface area)
- **Vulnerability reporting**: Report security issues via GitHub Issues

### Safe Usage Patterns

- Only run plugin in trusted repositories (it reads all files)
- Review generated output before committing to version control
- Custom templates can execute arbitrary Claude instructions, so only use trusted templates

## Migration and Upgrade Guides

### Upgrading

- **Breaking changes**: Major version changes may alter template structure
- **Migration guides**: Check release notes when upgrading major versions
- **Codemod tools**: Not applicable - manual template updates may be needed

## Contributing

### How to Contribute

- **Contribution process**: Fork repository, make changes, submit pull request
- **Code style**: Follow existing markdown formatting in command and template files
- **Pull request process**: PRs reviewed by maintainers; must test in real repositories before merge

### Development Guidelines

- Test all commands in multiple repository types before submitting PR
- Update documentation when adding new commands or templates
- Ensure templates sync correctly between `shared/` and `claude-plugin/`
- Follow semver for version bumps

## Support and Maintenance

### Support Channels

- **Issues**: https://github.com/your-org/claude-context-system/issues
- **Discussions**: https://github.com/your-org/claude-context-system/discussions

### Maintenance Status

- **Status**: Actively maintained
- **Maintainers**: Project team at your-org

## Restricted Actions

*(Intentionally left blank for user to populate with project-specific restrictions)*

# Library File Metadata

- Date Created: 2026-01-02T09:06:00Z
- Date Modified: 2026-01-02T09:06:00Z
- Last commit SHA built from: b01b8d1c101fc897799c28d72b86edd2671ec723
- Template Version: 2.0.0
