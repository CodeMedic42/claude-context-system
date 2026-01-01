# Example Rule Files

This directory contains example rule files for testing the `/claude-context-updater:ctx-rule` command.

## Valid Example

### `sample-javascript-rule.md`
A properly formatted rule file with all required frontmatter fields (`name` and `version`).

**Test it:**
```bash
/claude-context-updater:ctx-rule add ./claude-plugin/examples/sample-javascript-rule.md
```

Expected result: Successfully adds the rule to `.claude/rules/javascript-standards.md` (filename comes from the `name` field)

## Invalid Examples (for testing error handling)

### `invalid-rule-no-name.md`
Has frontmatter with `version` but missing the required `name` field.

**Test it:**
```bash
/claude-context-updater:ctx-rule add ./claude-plugin/examples/invalid-rule-no-name.md
```

Expected result: Error message "Source file frontmatter must include a 'name' field"

### `invalid-rule-no-version.md`
Has frontmatter with `name` but missing the required `version` field.

**Test it:**
```bash
/claude-context-updater:ctx-rule add ./claude-plugin/examples/invalid-rule-no-version.md
```

Expected result: Error message "Source file frontmatter must include a 'version' field"

### `invalid-rule-no-frontmatter.md`
Has no frontmatter at all.

**Test it:**
```bash
/claude-context-updater:ctx-rule add ./claude-plugin/examples/invalid-rule-no-frontmatter.md
```

Expected result: Error message "Source file must have frontmatter"

## Testing Name Conflicts

1. Add the valid rule:
   ```bash
   /claude-context-updater:ctx-rule add ./claude-plugin/examples/sample-javascript-rule.md
   ```

2. Try adding it again:
   ```bash
   /claude-context-updater:ctx-rule add ./claude-plugin/examples/sample-javascript-rule.md
   ```

3. The command should detect that `javascript-standards` already exists and offer three options:
   - **A: Choose a new name** - Lets you specify a different name
   - **B: Replace the existing file** - Overwrites the existing rule
   - **C: Cancel** - Exits without changes

## Testing Version Updates

1. Add the valid rule:
   ```bash
   /claude-context-updater:ctx-rule add ./claude-plugin/examples/sample-javascript-rule.md
   ```

2. Edit `sample-javascript-rule.md` and change `version: 1.0.0` to `version: 1.1.0`

3. Update the rule (use the `name` from frontmatter):
   ```bash
   /claude-context-updater:ctx-rule update javascript-standards
   ```

4. The command should report the version change: `1.0.0 → 1.1.0`

## Creating Your Own Rules

To create a new rule file:

1. Start with frontmatter that includes both `name` and `version`:
```markdown
---
name: my-custom-rule
version: 1.0.0
description: Your rule description
author: Your Name
---

# Your Rule Title

Rule content here...
```

**Important:** The `name` field determines the filename in `.claude/rules/`. In this example, it will be saved as `my-custom-rule.md`.

2. Save it anywhere (local file or publish to a URL)

3. Add it using the command:
```bash
# Local file
/claude-context-updater:ctx-rule add ./path/to/your-rule.md

# Remote URL
/claude-context-updater:ctx-rule add https://example.com/rules/your-rule.md
```

4. The rule will be saved to `.claude/rules/my-custom-rule.md` (based on the `name` field, not the source filename)
