# ⚠️ DO NOT EDIT FILES IN THIS DIRECTORY

**These files are auto-generated from `shared/templates/`**

## Important

- **DO NOT** edit any `.md` files in this directory directly
- Your changes will be **overwritten** on the next sync or commit
- All template files are automatically synced from `shared/templates/`

## Making Changes

To modify template files:

1. **Edit the source files** in `shared/templates/`
2. **Run sync**: `pnpm run sync`
3. **Commit**: Changes will be auto-synced during pre-commit

## What Happens During Sync

The sync process (`plugin-setup/sync-copilot.js`):
1. Copies all `.md` files from `shared/templates/` to this directory
2. **No modifications** - templates are copied as-is

## File Structure

```
shared/templates/          ← EDIT HERE (source of truth)
  ├── CLAUDE.TEMPLATE.md
  ├── SERVICE.TEMPLATE.md
  ├── CLIENT.TEMPLATE.md
  ├── LIBRARY.TEMPLATE.md
  └── DATABASE.TEMPLATE.md

↓ sync via pnpm run sync ↓

copilot-context-cli/templates/   ← AUTO-GENERATED (do not edit)
  ├── CLAUDE.TEMPLATE.md
  ├── SERVICE.TEMPLATE.md
  ├── CLIENT.TEMPLATE.md
  ├── LIBRARY.TEMPLATE.md
  └── DATABASE.TEMPLATE.md
```
