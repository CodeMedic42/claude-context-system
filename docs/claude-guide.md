# Claude Code Guide

Complete guide for using Claude Context System with Claude Code.

## Overview

This plugin helps you maintain high-quality `claude.md` context files that provide Claude Code with essential repository information.

## Installation

### Via Claude Code CLI

```bash
# Install from git repository
claude plugin install https://github.com/your-org/claude-context-system
```

### Verify Installation

```bash
claude plugin list
```

You should see `claude-context-updater` in the list.

## Commands

### /ctx-update

Creates or updates `claude.md` file in your repository.

**Usage:**
```
/ctx-update
```

**Options:**
```
/ctx-update --force           # Force full regeneration
/ctx-update --section setup   # Update only specific section
/ctx-update --dry-run        # Preview changes without writing
```

**First Run (New File):**
1. Analyzes your repository structure
2. Detects languages, frameworks, and dependencies
3. Generates comprehensive claude.md file
4. Adds metadata for future updates

**Subsequent Runs (Update):**
1. Reads metadata from existing file
2. Analyzes git changes since last update
3. Updates only affected sections
4. Preserves your customizations

### /md-sync

Syncs your Claude context to GitHub Copilot format.

**Usage:**
```
/md-sync                     # Interactive sync
/md-sync --auto             # Automatic sync with defaults
/md-sync --setup-hooks      # Install git hooks for auto-sync
```

Creates:
- `.github/copilot-instructions.md` from `claude.md`
- `.github/instructions/*.instructions.md` from `.claude/rules/*.md`

## File Structure

### Main Context File

**Location:** `claude.md` (repository root)

**Alternative:** `.claude/claude.md` (hidden directory)

**Content Structure:**
```markdown
# Repository Agent Context

## Repository Summary
[Project description and purpose]

## High-Level Repository Information
[Languages, frameworks, project types]

## Repository Structure
[ASCII directory tree with comments]

## Services and APIs
[API endpoints and schemas]

## Databases
[Database schemas and tables]

## Environment Setup
[Prerequisites, configuration, local services]

## Running the Application Locally
[Setup and run commands]

## Repository Verification
[Test and lint commands]

## Documentation
[Documentation files and update requirements]

# Agent File Metadata
[Timestamps, git SHA, template version]
```

### Modular Rules

**Location:** `.claude/rules/*.md`

**Purpose:** Path-specific instructions that apply to certain files

**Example:** `.claude/rules/frontend.md`
```markdown
---
paths: "src/components/**/*.tsx"
---

# Frontend Development Rules

- Use functional components
- Follow naming conventions
- Write unit tests
```

**Subdirectories Supported:**
```
.claude/rules/
├── frontend/
│   ├── components.md
│   └── styling.md
├── backend/
│   └── api.md
└── testing.md
```

Claude Code automatically discovers and loads all `.md` files in `.claude/rules/`.

## Context File Hierarchy

Claude Code loads context in this order (priority high to low):

1. **Project Context:** `claude.md` or `.claude/claude.md`
2. **Project Rules:** `.claude/rules/*.md`
3. **User Context:** `~/.claude/claude.md` (your personal preferences)
4. **User Rules:** `~/.claude/rules/*.md`

All files are loaded and accumulated, not overridden.

## Path-Specific Rules

Use YAML frontmatter to make rules apply only to specific files:

```markdown
---
paths: src/api/**/*.ts
---

# API Development Rules

[These rules only apply when working with API TypeScript files]
```

**Glob Patterns:**
- `**/*.ts` - All TypeScript files
- `src/**/*` - All files under src/
- `src/{api,services}/**/*` - Multiple directories
- `**/*.{ts,tsx}` - Multiple extensions

**Without paths:** Rules apply globally to all files

## Customization

### Template Customization

Edit the template at:
```
agent/claude/template/claude.template.md
```

Changes will apply to all future `/ctx-update` operations.

### Rule Templates

Add new rule templates:
```
agent/claude/template/rules.template/your-rule.md
```

These become available during `/ctx-update` initialization.

### Local Overrides

Create `claude.local.md` for personal, machine-specific settings:
- Automatically gitignored
- Loaded after project context
- Perfect for local paths, credentials (though avoid committing secrets!)

## Best Practices

### 1. Keep It Updated

Run `/ctx-update` after significant changes:
- New dependencies added
- Major refactoring
- New services or APIs added
- Documentation updates

### 2. Review Generated Content

Always review the output:
- Ensure accuracy
- Add domain-specific context
- Remove irrelevant sections
- Customize for your team's needs

### 3. Use Modular Rules

Break down rules into focused files:
```
.claude/rules/
├── coding-standards.md    # General standards
├── security.md            # Security guidelines
├── testing.md             # Testing requirements
└── deployment.md          # Deployment procedures
```

### 4. Preserve Customizations

The plugin preserves your customizations during updates:
- Filled-in template sections
- User-added sections
- Comments and notes

### 5. Version Control

Commit these files:
- `claude.md`
- `.claude/rules/*.md`
- `.claude/settings.json` (project settings)

Exclude:
- `claude.local.md` (personal settings)
- `.claude/settings.local.json` (local permissions)

## Import System

Claude.md files can import other files:

```markdown
# Repository Context

See @README.md for project overview.

For API documentation, see @docs/API.md.

# Additional Instructions

@~/.claude/my-shared-rules.md
```

**Features:**
- Supports relative and absolute paths
- Recursive imports (up to 5 levels deep)
- Not evaluated inside code blocks

## Viewing Active Context

Use Claude Code's built-in command:

```
/memory
```

Shows:
- Which context files are loaded
- Path to each file
- Option to open files for editing

## Troubleshooting

### "Template not found"

**Solution:** Ensure plugin is installed correctly:
```bash
claude plugin list
claude plugin install https://github.com/your-org/claude-context-system
```

### "Git repository not found"

**Solution:** Initialize git repository:
```bash
git init
git add .
git commit -m "Initial commit"
```

### Updates not detecting changes

**Solution:** Check metadata section has correct git SHA:
```markdown
# Agent File Metadata
- **Last Commit SHA**: abc123def
```

Run with `--force` to regenerate:
```
/ctx-update --force
```

### Customizations being overwritten

**Issue:** Template sections without user content get regenerated

**Solution:** Add any custom content to preserve sections, or add a comment:
```markdown
## Services and APIs

<!-- Customized for our project -->

[Your content here]
```

## Advanced Usage

### Conditional Rules

Rules without `paths` apply globally. Use strategically:

```markdown
# Global Coding Standards
[Applies everywhere]
```

```markdown
---
paths: "src/api/**/*"
---

# API-Specific Standards
[Only applies to API files]
```

### Sharing Rules Across Projects

Symlink shared rules:

```bash
ln -s ~/shared-rules/security.md .claude/rules/security.md
```

Or use imports:
```markdown
@~/.claude/shared-rules/security.md
```

### Organization-Wide Templates

1. Customize templates in this repo
2. Host on internal git server
3. Team installs from your repo
4. Updates distributed via git pull

## Integration with VS Code

When using Claude Code in VS Code:

1. Context files are automatically loaded
2. Use `/memory` to view active context
3. Edit context files directly in VS Code
4. Changes take effect immediately

## See Also

- [Quick Start Guide](QUICK_START.md)
- [Copilot Guide](copilot-guide.md) - For using both tools
- [Unified Approach](unified-approach.md) - Cross-tool strategy
- [Complete Documentation](README.md) - Original docs

## Examples

See example files in:
```
agent/claude/examples/
├── claude.example.md
└── .claude/rules/
    ├── frontend.md
    └── backend.md
```

These show real-world usage and best practices.
