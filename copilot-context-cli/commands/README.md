# ⚠️ DO NOT EDIT FILES IN THIS DIRECTORY

**These files are auto-generated from `shared/commands/`**

## Important

- **DO NOT** edit any `.md` files in this directory directly
- Your changes will be **overwritten** on the next sync or commit
- All command files are automatically synced from `shared/commands/`

## Making Changes

To modify command files:

1. **Edit the source files** in `shared/commands/`
2. **Run sync**: `pnpm run sync`
3. **Commit**: Changes will be auto-synced during pre-commit

## What Happens During Sync

The sync process (`plugin-setup/sync-copilot.js`):
1. Copies all `.md` files from `shared/commands/` to this directory
2. Preserves placeholders (`${TEMPLATE_PATH}`, `${RULES_PATH}`) as-is
3. Placeholders are replaced **at runtime** by `bin/copilot-plugin.js`

## Runtime Replacement

When the CLI runs (`copilot-context-cli/bin/copilot-plugin.js`):
- Reads the command file
- Replaces `${TEMPLATE_PATH}` with absolute path to installed templates
- Replaces `${RULES_PATH}` with absolute path to installed rules
- Passes processed content to Copilot CLI

This ensures templates can be found regardless of:
- Where the CLI is installed (global npm install)
- Where the user runs the command from

## File Structure

```
shared/commands/          ← EDIT HERE (source of truth)
  ├── ctx-prepare.md      (has ${TEMPLATE_PATH} placeholders)
  ├── ctx-execute.md
  └── ctx-rule.md

↓ sync via pnpm run sync ↓

copilot-context-cli/commands/   ← AUTO-GENERATED (do not edit)
  ├── ctx-prepare.md      (has ${TEMPLATE_PATH} placeholders)
  ├── ctx-execute.md
  └── ctx-rule.md

↓ runtime replacement in bin/copilot-plugin.js ↓

Copilot receives:
  ${TEMPLATE_PATH} → /usr/local/lib/node_modules/copilot-context-cli/templates
  ${RULES_PATH} → /usr/local/lib/node_modules/copilot-context-cli/rules
```
