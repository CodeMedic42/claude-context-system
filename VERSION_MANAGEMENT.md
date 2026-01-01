# Version Management

This document explains how version numbers and templates are managed across the monorepo.

## Version: Single Source of Truth

Version number is stored in:

**Claude Plugin**: `claude-plugin/.claude-plugin/plugin.json`
```json
{
  "version": "2.0.0"
}
```

## Template: Dual Locations (Automatically Synced!)

The claude.template.md file exists in **two locations**:

1. **Source of Truth**: `shared/templates/claude.template.md`
   - Used by Copilot users who paste it into prompts
   - Should be edited here when making template changes

2. **Plugin Bundle**: `claude-plugin/templates/claude.template.md`
   - Bundled with the Claude plugin for distribution
   - **Automatically synced from shared/** via git pre-commit hook

✅ **AUTOMATED**: When you edit and commit `shared/templates/claude.template.md`, a pre-commit hook automatically:
1. Copies the file to `claude-plugin/templates/claude.template.md`
2. Stages the plugin copy in the same commit

**Setup Required**: Run `npm install` after cloning to install Husky and set up the git hook.

## How Versions Are Used

### Claude Code Plugin

The command at `claude-plugin/commands/ctx-update.md` instructs Claude to:
1. Read the version from `../../.claude-plugin/plugin.json`
2. Use that version in the generated `claude.md` metadata

No hardcoded versions in the command file!

### Copilot Instructions

The Copilot prompts at `copilot-instructions/`:
1. Ask users to paste the template from `shared/templates/claude.template.md`
2. Use the template's version placeholder for metadata

No hardcoded versions in the prompts!

### Template

The template at `shared/templates/claude.template.md` contains a placeholder:
```markdown
- Template Version: {version from plugin.json or cli package.json}
```

Both tools replace this placeholder with their version at runtime.

## Updating Versions

When you need to bump the version:

### For Minor/Patch Updates (e.g., 2.0.0 → 2.0.1)

1. Update `claude-plugin/.claude-plugin/plugin.json`:
   ```json
   "version": "2.0.1"
   ```

2. Update root `package.json` (optional, for monorepo tracking):
   ```json
   "version": "2.0.1"
   ```

3. Commit and tag:
   ```bash
   git add -A
   git commit -m "Bump version to 2.0.1"
   git tag v2.0.1
   git push && git push --tags
   ```

Or use Lerna to version all packages:
   ```bash
   pnpm run version
   ```

That's it! No need to update command files or templates.

## Updating Templates

When you need to change the template structure:

1. Edit `shared/templates/claude.template.md` (source of truth)

2. Commit your changes:
   ```bash
   git add shared/templates/claude.template.md
   git commit -m "Update claude template structure"
   ```

3. The pre-commit hook automatically:
   - Copies to `claude-plugin/templates/claude.template.md`
   - Stages the plugin copy in the same commit
   - Both files are committed together!

### For Major/Minor Updates (e.g., 2.0.0 → 3.0.0)

Same process as above, but also:

1. Update `CHANGELOG.md` with breaking changes
2. Update documentation if command behavior changed
3. Consider migration guide if template structure changed

## Version Semantics

We follow [Semantic Versioning](https://semver.org/):

- **Major (X.0.0)**: Breaking changes, incompatible template structure changes
- **Minor (2.X.0)**: New features, backward-compatible template additions
- **Patch (2.0.X)**: Bug fixes, documentation updates, no template changes

### Template Version = Plugin Version

The "Template Version" in generated `claude.md` files always matches the plugin version that created it. This allows:

- Detecting which version created a file
- Triggering updates when template structure changes
- Backward compatibility handling

## Distribution

### Claude Plugin
Users install via git URL:
```bash
# From git
claude plugin install https://github.com/your-org/claude-context-system/claude-plugin#v2.0.0

# Or using the CLI tool
claude-ctx plugin install
```

### Copilot Instructions
Users copy prompts from `copilot-instructions/` and paste the template when prompted.

## Verification

To verify versions and templates:

```bash
# Check Claude plugin version
jq -r .version claude-plugin/.claude-plugin/plugin.json

# Check root package version
jq -r .version package.json

# Verify templates are in sync
diff shared/templates/claude.template.md claude-plugin/templates/claude.template.md
# Should output nothing if files are identical
```

## Automated Version Management (Future)

Consider adding scripts:

```json
// Root package.json
{
  "scripts": {
    "version:check": "node scripts/check-versions.js",
    "version:sync": "node scripts/sync-versions.js",
    "version:bump": "npm version patch && node scripts/sync-versions.js"
  }
}
```

This would ensure versions stay in sync across the monorepo.

## Summary

### Versions
✅ **DO**: Update version in `claude-plugin/.claude-plugin/plugin.json`
✅ **DO**: Commit and create git tag
✅ **DO**: Let tools read version dynamically

❌ **DON'T**: Hardcode versions in command files
❌ **DON'T**: Hardcode versions in template

### Templates
✅ **DO**: Edit template in `shared/templates/` (source of truth)
✅ **DO**: Run `npm install` after cloning to set up git hooks
✅ **DO**: Let the pre-commit hook automatically sync to plugin bundle

❌ **DON'T**: Edit `claude-plugin/templates/` directly (it gets overwritten)
❌ **DON'T**: Manually copy files (the git hook does this automatically)

The system is designed so you only need to:
- Change version in `plugin.json` when bumping versions
- Edit template in `shared/templates/` - the pre-commit hook automatically syncs it!
