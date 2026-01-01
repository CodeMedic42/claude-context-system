# Claude Code Plugin - Claude Context System

Claude Code plugin for creating and updating `claude.md` context files.

## Installation

```bash
claude plugin install https://github.com/your-org/claude-context-system/claude-plugin
```

## Usage

### Create or Update claude.md

Simply run:
```
/ctx-update
```

The command will:
1. Analyze your repository structure
2. Detect languages, frameworks, and project type
3. Find services, APIs, and databases
4. Generate or update `claude.md` at repository root
5. Track changes with git metadata

### First Run (Creation)
- Creates new `claude.md` with full repository analysis
- Adds metadata for future updates

### Subsequent Runs (Updates)
- Analyzes git changes since last update
- Updates only affected sections
- Preserves your customizations
- Updates metadata (timestamp, git SHA)

## Template

The plugin includes a bundled template at `templates/claude.template.md`.

### Custom Template (Optional)

You can override the bundled template by creating:
```
~/.claude/templates/claude.template.md
```

The plugin will use your custom template if it exists, otherwise it uses the bundled template.

## What Gets Created

A `claude.md` file at your repository root with:

- Repository summary and purpose
- Project structure
- Languages and frameworks
- Services and APIs
- Database schemas
- Environment setup instructions
- Build and test commands
- Documentation references
- Metadata (timestamps, git SHA, template version)

Both Claude Code and GitHub Copilot automatically read this file!

## Features

✅ **Automated Analysis** - Scans repo automatically
✅ **Git-Aware Updates** - Only updates when repo changes
✅ **Smart Merging** - Preserves your customizations
✅ **Template Versioning** - Tracks template versions
✅ **Universal Format** - Works with Claude Code and Copilot

## Command Details

See [commands/ctx-update.md](commands/ctx-update.md) for the full command implementation and algorithm.

## Examples

See [examples/claude.example.md](examples/claude.example.md) for a real-world example of the generated output.

## Troubleshooting

### "Template not found"
This indicates a plugin installation problem. The template should be bundled at `../shared/templates/claude.template.md`. Try reinstalling the plugin.

### "Not a git repository"
The command must be run inside a git repository. Initialize git first:
```bash
git init
```

### Updates not detecting changes
Check that the metadata section in `claude.md` has the correct git SHA. You can force a full regeneration by recreating the file.

## See Also

- [Main Documentation](../README.md) - Overview of the entire project
- [Copilot Instructions](../copilot-instructions/) - Alternative for GitHub Copilot users
- [Shared Templates](../shared/templates/) - Template used by this plugin
