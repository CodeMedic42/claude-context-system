# ⚠️ DO NOT EDIT FILES IN THIS DIRECTORY

**These files are auto-generated from `shared/commands/`**

## Important

- **DO NOT** edit any `.md` files in this directory directly
- Your changes will be **overwritten** on the next sync or commit
- All command files are automatically synced and processed from `shared/commands/`

## Making Changes

To modify command files:

1. **Edit the source files** in `shared/commands/`
2. **Run sync**: `pnpm run sync`
3. **Commit**: Changes will be auto-synced during pre-commit

## What Happens During Sync

The sync process (`plugin-setup/sync-plugin.js`):
1. Copies all `.md` files from `shared/commands/` to this directory
2. Replaces placeholders:
   - `${TEMPLATE_PATH}` → `../templates`
   - `${RULES_PATH}` → `../rules`

This ensures template paths work correctly when the plugin is installed in Claude Code.

## File Structure

```
shared/commands/          ← EDIT HERE (source of truth)
  ├── ctx-prepare.md
  ├── ctx-execute.md
  └── ctx-rule.md

↓ sync via pnpm run sync ↓

claude-context-plugin/commands/   ← AUTO-GENERATED (do not edit)
  ├── ctx-prepare.md
  ├── ctx-execute.md
  └── ctx-rule.md
```
