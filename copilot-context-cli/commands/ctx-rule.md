---
description: Manage reusable rule files from built-in, remote, or local sources
argument-hint: [add|update|remove] [builtin-name|url|path]
allowed-tools: Bash(mkdir:*), Bash(ls:*), WebFetch, Read, Write, Edit
---

# Context Rule Manager

Manage reusable rule files in `.claude/rules/` that can be sourced from built-in plugin rules, remote URLs, or local file paths.

**Operation:** $1
**Argument:** $2

## Instructions

### If operation is "add"

1. Determine the source type of $2:
   - If $2 starts with `http://` or `https://`: it's a **URL**
   - If $2 starts with `/` or `./` or `../`: it's a **file path**
   - Otherwise: it's a **built-in rule name** - look for it in the plugin's rules directory

2. Get the content based on source type:
   - **If URL**: Use WebFetch to download the content from $2
   - **If file path**: Use Read tool to read the content from $2
   - **If built-in rule name**:
     - Construct the path: `../rules/$2.md` (relative to this command file)
     - Use Read tool to read the content from that path
     - **If file not found**: Report error "Built-in rule '$2' not found. Available rules: {list files in ../rules/}" and exit

3. Validate the content has proper frontmatter:
   - Parse the frontmatter from the content
   - **If no frontmatter exists**: Report error "Source file must have frontmatter" and exit
   - **If frontmatter exists but no `name` field**: Report error "Source file frontmatter must include a 'name' field" and exit
   - **If frontmatter exists but no `version` field**: Report error "Source file frontmatter must include a 'version' field" and exit
   - Extract all frontmatter fields including the `name` and `version` values

4. Use the `name` field from frontmatter as the rule name

5. Create `.claude/rules/` directory if it doesn't exist (use `mkdir -p .claude/rules`)

6. Check if a rule file with that name already exists:
   - **If it does NOT exist**: Continue to step 7
   - **If it DOES exist**: Present the user with three options:
     - **A: Choose a new name** - Ask the user to provide a new name, then use that name instead
     - **B: Replace the existing file** - Overwrite the existing file with the new rule
     - **C: Cancel** - Exit without making any changes
   - Wait for user's choice and act accordingly

7. Prepare the final frontmatter by merging:
   - **Start with all original frontmatter fields** (including `version`)
   - **Add tracking fields**:
     - **If URL**:
       - `source_url: <the URL from $2>`
       - `downloaded_at: <current ISO timestamp>`
       - `rule_type: remote`
     - **If file path**:
       - `source_path: <the file path from $2>`
       - `copied_at: <current ISO timestamp>`
       - `rule_type: local`
     - **If built-in rule**:
       - `source_builtin: <the built-in rule name from $2>`
       - `copied_at: <current ISO timestamp>`
       - `rule_type: builtin`
   - The final frontmatter should preserve the original version and any other original fields

8. Save the file to `.claude/rules/<rule-name>.md` with the merged frontmatter and original content

9. Report success including:
   - The rule name
   - The version from the source
   - The file path where it was saved
   - Remind user that rules in `.claude/rules/` are automatically loaded by Claude Code

### If operation is "update"

1. If $2 is provided (specific rule name):
   - Find the rule file `.claude/rules/$2.md`
   - Read the file and extract the frontmatter
   - Check for `source_url`, `source_path`, or `source_builtin`:
     - **If `source_url` exists**: Use WebFetch to download the latest content from the URL
     - **If `source_path` exists**: Use Read tool to read the latest content from the file path
     - **If `source_builtin` exists**: Read from `../rules/{source_builtin}.md` (relative to command file)
     - **If none exist**: Report error that this rule cannot be updated (no source tracked)
   - **Validate the new content**:
     - Parse the frontmatter from the new content
     - **If no frontmatter exists**: Report error "Updated source file must have frontmatter" and exit without saving
     - **If frontmatter exists but no `version` field**: Report error "Updated source file frontmatter must include a 'version' field" and exit without saving
     - Extract all frontmatter fields including the `version` value
   - Prepare the updated frontmatter by merging:
     - **Start with all new frontmatter fields** (including the new `version`)
     - **Update tracking fields**:
       - Update timestamp (`downloaded_at` for URL, `copied_at` for path/builtin) to current time
       - Preserve `source_url`, `source_path`, or `source_builtin` and `rule_type`
   - Save the updated content back to the same file
   - Report what was updated including the old and new version numbers

2. If $2 is NOT provided (update all):
   - List all files in `.claude/rules/` (use `ls .claude/rules/*.md`)
   - For each file, read it and check if it has `source_url`, `source_path`, or `source_builtin` in frontmatter
   - For files with a source:
     - Download/read the new content (from URL, path, or ../rules/{builtin}.md)
     - Validate it has frontmatter with a `version` field (skip and report error if not)
     - Update the file with new content and merged frontmatter
   - Report which files were updated (with version changes) and which were skipped (with reasons)

### If operation is "remove"

1. Validate that $2 is provided (rule name required)
2. Check if `.claude/rules/$2.md` exists
3. Read the file and show the user:
   - The rule name
   - The version
   - The source (URL or path, if available)
   - When it was last downloaded/copied
   - The rule type (remote or local)
4. Ask for confirmation to delete
5. If confirmed, delete the file
6. Report success

### If operation is invalid or missing

Report the valid operations:
- `add <builtin-name|url|path>` - Add a new rule file from a built-in rule name, URL, or local file path
- `update [rule-name]` - Update a specific rule or all rules from their sources (built-in, URLs, or paths)
- `remove <rule-name>` - Remove a rule file

## Examples

### Source File Format (Required)

All rule source files MUST have frontmatter with both `name` and `version` fields:

```markdown
---
name: javascript-standards
version: 1.2.0
description: JavaScript coding standards
author: Engineering Team
---

# JavaScript Standards

Always use strict mode...
```

The `name` field determines the filename in `.claude/rules/` (e.g., `javascript-standards.md`)

### Usage Examples

```bash
# Add a built-in rule (provided by the plugin)
/claude-context-updater:ctx-rule add typescript

# Add a rule from a URL (remote)
/claude-context-updater:ctx-rule add https://raw.githubusercontent.com/company/standards/main/javascript.md

# Add a rule from a local file (for testing)
/claude-context-updater:ctx-rule add ./my-rules/javascript.md

# Add an internal security policy from company intranet
/claude-context-updater:ctx-rule add https://company.internal/policies/ai-security-rules.md

# Add from a local file with absolute path
/claude-context-updater:ctx-rule add /Users/username/Documents/rules/security.md

# Update all rules (remote, local, and built-in)
/claude-context-updater:ctx-rule update

# Update specific rule (will show version change)
/claude-context-updater:ctx-rule update typescript-standards

# Remove a rule
/claude-context-updater:ctx-rule remove typescript-standards
```

### Result File Format

**After adding a built-in rule:**

The file in `.claude/rules/typescript-standards.md` will look like:

```markdown
---
name: typescript-standards
version: 1.0.0
description: TypeScript coding standards and best practices
author: Claude Context System
category: language-standards
tags: [typescript, javascript, type-safety, coding-standards]
source_builtin: typescript
copied_at: 2025-12-31T13:45:00.000Z
rule_type: builtin
---

# TypeScript Coding Standards and Best Practices
...
```

**After adding a rule from URL:**

The file in `.claude/rules/javascript-standards.md` will look like:

```markdown
---
name: javascript-standards
version: 1.2.0
description: JavaScript coding standards
author: Engineering Team
source_url: https://raw.githubusercontent.com/company/standards/main/javascript.md
downloaded_at: 2025-12-31T13:45:00.000Z
rule_type: remote
---

# JavaScript Standards

Always use strict mode...
```

Note: The filename is determined by the `name` field (`javascript-standards.md`), not by the source filename.

## Notes

- **Required Frontmatter Fields**: All source rule files MUST have frontmatter with:
  - **`name`**: Determines the filename in `.claude/rules/` (e.g., "javascript-standards" → "javascript-standards.md")
    - Should be kebab-case or snake_case for filesystem compatibility
    - No `.md` extension needed - it's added automatically
  - **`version`**: Tracks the version of the rule
    - Can be any string format (e.g., "1.0.0", "2024-12-31", "v2")
    - Version is preserved when copying and tracked for reference
    - Update operations show version changes for visibility
    - Version is not used for validation or comparison - it's purely for tracking
- Rule files in `.claude/rules/` are automatically loaded by Claude Code
- The frontmatter tracks the source (URL, file path, or built-in name) so updates can be automated
- **Built-in rules** (`rule_type: builtin`): Provided by the plugin, tracked with `source_builtin`
  - Ready-to-use best practice rules (e.g., TypeScript, Python, JavaScript standards)
  - Located in the plugin's `rules/` directory
  - Can be updated when the plugin is updated
  - Easy to add: just use the rule name without a path or URL
- **Remote rules** (`rule_type: remote`): Downloaded from URLs, tracked with `source_url`
  - Ideal for team-wide standards, company policies, public best practices
  - Can be updated when the source changes
  - Distributed via GitHub, company intranet, CDN, etc.
- **Local rules** (`rule_type: local`): Copied from local files, tracked with `source_path`
  - Useful for testing rules before publishing them remotely
  - Can be updated if the source file changes
  - Good for personal or project-specific rules during development
- This enables centralized rule management for teams while supporting local development workflows
