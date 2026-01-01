# Claude Context System - Complete Documentation

Comprehensive guide for the Claude Context System - tools for creating and maintaining `claude.md` context files.

## What It Does

The Claude Context System provides the `/ctx-update` command which:

- **Creates** new `claude.md` files with automatic repository analysis
- **Updates** existing `claude.md` files by analyzing git changes
- **Preserves** your customizations while applying updates
- Works with both Claude Code and GitHub Copilot

## Features

- Automatic repository analysis (languages, frameworks, structure, services, APIs)
- Git-aware updates (only updates when repository changes)
- Template version management
- Smart merging that preserves user customizations
- Standardized documentation structure across all projects

## Installation

### Claude Code Plugin

Install directly from git:

```bash
claude plugin install https://github.com/your-org/claude-context-system/claude-plugin
```

### CLI Tool

Install the CLI globally:

```bash
npm install -g claude-context-updater
```

Then use it to manage the plugin:

```bash
claude-ctx plugin install
```

## Usage

### Creating a New claude.md

Simply run:
```bash
/ctx-update
```

The command will:
1. Detect there's no `claude.md` file
2. Read the template
3. Analyze your repository
4. Generate a fully populated `claude.md` at the repository root
5. Add metadata tracking the git commit and template version

### Updating an Existing claude.md

Run the same command:
```bash
/ctx-update
```

The command will:
1. Detect the existing `claude.md` was built from the template
2. Check if the template version has changed
3. Analyze git commits since the last update
4. Update relevant sections based on code changes
5. Preserve your customizations
6. Update metadata with new commit SHA and timestamp

### Replacing a Non-Template claude.md

If you have a `claude.md` that wasn't created from the template:
```bash
/ctx-update
```

The command will ask if you want to replace it with a template-based version.

## Template Structure

The template includes sections for:

- **Repository Summary**: Brief description and purpose
- **High-Level Information**: Languages, frameworks, project types
- **Repository Structure**: ASCII directory tree
- **Services and APIs**: Service definitions and schemas
- **Libraries and Plugins**: Usage and installation instructions
- **Databases**: Schema information
- **Environment Setup**: Prerequisites and configuration
- **Running Locally**: Setup and execution steps
- **Repository Verification**: Testing and linting commands
- **Documentation**: Links to additional docs

## Template Customization

### Creating a Custom Template

1. Copy the base template:
   ```bash
   cp agent.template/agent.template.md agent.template/v1.2/agent.template.md
   ```

2. Modify the new template as needed

3. Update the version number in your `claude.md` metadata

### Template Instructions

Text within curly brackets `{...}` in the template are instructions for what content should be populated. For example:

```markdown
## Repository Summary

{Brief description of what this service does and its purpose within the organization}
```

The command will replace `{Brief description...}` with actual content by analyzing your repository.

## How It Works

### Detection Logic

The command identifies template-based files by checking for the "Agent File Metadata" section, which includes:
- Date Created
- Date Modified
- Last commit SHA built from
- Template Version

### Update Intelligence

When updating, the command:

1. **Compares template versions** - Applies structural changes if template upgraded
2. **Analyzes git history** - Identifies code changes since last update
3. **Maps changes to sections** - Determines which documentation sections are affected
4. **Smart merging** - Preserves user content while applying necessary updates
5. **Conflict detection** - Asks for user input when uncertain

### Update Examples

| Git Change | Sections Updated |
|------------|------------------|
| New API endpoint added | Services and APIs |
| package.json dependencies changed | High-Level Information, Frameworks/Libraries |
| New files/directories | Repository Structure |
| Database migration | Databases |
| README.md updated | Documentation |
| Environment variable added | Environment Setup, System Configuration |

## Publishing to Your Organization

To distribute this plugin to your company:

### 1. Create a Company Repository

```bash
git init claude-md-manager
cd claude-md-manager
# Copy plugin files here
git add .
git commit -m "Initial plugin release"
```

### 2. Push to Your Git Server

```bash
git remote add origin https://github.com/your-company/claude-md-manager.git
git push -u origin main
```

### 3. Instruct Team Members

Share these installation instructions with your team:

```bash
# Install from git repository
claude plugin install https://github.com/your-org/claude-context-system/claude-plugin

# Or use the CLI tool
npm install -g claude-context-updater
claude-ctx plugin install
```

### 4. Version Updates

When releasing updates:

1. Update the version in `.claude-plugin/plugin.json`
2. Commit and tag the release
3. Push with tags: `git push --tags`
4. Team members reinstall to update: `claude plugin install https://github.com/your-org/claude-context-system/claude-plugin`

## Troubleshooting

### Template Not Found

If you see "template file is missing":

1. Check if `agent.template/agent.template.md` exists in repository root
2. Check if `~/.claude/templates/agent.template/agent.template.md` exists
3. Copy the template to one of these locations

### Command Not Found

If `/ctx-update` is not recognized:

1. Verify the plugin is installed: `/plugin list`
2. Reinstall if needed: `/plugin install claude-md-manager@company-tools`

### Updates Not Working

If updates aren't being applied:

1. Check that your repository is a git repository
2. Verify the "Last commit SHA" in the metadata section
3. Run `git log` to ensure there are commits since that SHA

## Support

For issues or questions, contact your DevTools team or file an issue in the plugin repository.

## License

MIT
