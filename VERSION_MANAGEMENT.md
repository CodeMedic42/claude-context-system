# Version Management

This document explains how version numbers and templates are managed across the monorepo.

## Version: Single Source of Truth

**Lerna Monorepo**: `lerna.json`
```json
{
  "version": "2.0.0"
}
```

When you run `pnpm run version`, Lerna updates:
1. `lerna.json` (source of truth)
2. All workspace `package.json` files:
   - `package.json` (root)
   - `claude-plugin/package.json`
   - `test-runner/package.json`
3. A `postversion` hook automatically syncs to `claude-plugin/.claude-plugin/plugin.json`

**Result**: All version numbers stay in sync automatically.

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

### Automated Version Bump (Recommended)

Simply run Lerna's version command:

```bash
pnpm run version
```

**What happens automatically:**
1. Lerna prompts you for version type (major/minor/patch)
2. Updates all `package.json` files in workspace:
   - `package.json` (root)
   - `lerna.json`
   - `claude-plugin/package.json`
   - `test-runner/package.json`
3. **Automatic sync**: The `postversion` hook in `claude-plugin/package.json` runs and syncs the version to `.claude-plugin/plugin.json`
4. Creates a git commit and tag
5. You just need to push:
   ```bash
   git push && git push --tags
   ```

**That's it!** The plugin manifest version is automatically kept in sync.

### Manual Version Bump (Not Recommended)

If you need to manually update versions:

1. Update `claude-plugin/.claude-plugin/plugin.json`:
   ```json
   "version": "2.0.1"
   ```

2. Update all package.json files:
   - `package.json` (root)
   - `lerna.json`
   - `claude-plugin/package.json`
   - `test-runner/package.json`

3. Commit and tag:
   ```bash
   git add -A
   git commit -m "Bump version to 2.0.1"
   git tag v2.0.1
   git push && git push --tags
   ```

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

## How It Works

The version sync automation uses a `postversion` hook:

**File:** `claude-plugin/package.json`
```json
{
  "version": "2.0.0",
  "scripts": {
    "postversion": "node scripts/sync-plugin-version.js"
  }
}
```

**File:** `claude-plugin/scripts/sync-plugin-version.js`
- Reads version from `package.json`
- Writes it to `.claude-plugin/plugin.json`
- Runs automatically after Lerna updates the version

This ensures the plugin manifest is always in sync with the package version.

## Summary

### Versions
✅ **DO**: Run `pnpm run version` to bump versions automatically
✅ **DO**: Let the postversion hook sync to `.claude-plugin/plugin.json`
✅ **DO**: Push commits and tags after version bump
✅ **DO**: Let tools read version dynamically

❌ **DON'T**: Manually edit `.claude-plugin/plugin.json` (it syncs automatically)
❌ **DON'T**: Hardcode versions in command files
❌ **DON'T**: Hardcode versions in template

### Templates
✅ **DO**: Edit template in `shared/templates/` (source of truth)
✅ **DO**: Run `npm install` after cloning to set up git hooks
✅ **DO**: Let the pre-commit hook automatically sync to plugin bundle

❌ **DON'T**: Edit `claude-plugin/templates/` directly (it gets overwritten)
❌ **DON'T**: Manually copy files (the git hook does this automatically)

The system is designed so you only need to:
- Run `pnpm run version` to bump versions - the postversion hook syncs everything!
- Edit template in `shared/templates/` - the pre-commit hook automatically syncs it!
