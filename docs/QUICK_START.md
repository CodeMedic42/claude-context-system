# Quick Start Guide

## For Repository Maintainers (Publishing the Plugin)

### 1. Customize the Plugin for Your Company

Update the following files with your company information:

**`.claude-plugin/plugin.json`**:
```json
{
  "author": {
    "name": "Your Company Name"
  },
  "repository": "https://github.com/your-company/claude-context-system"
}
```

**`README.md`**: Update all references to `your-org` with your actual organization name.

### 2. Create a Git Repository

```bash
# Initialize git if not already done
git init

# Add all plugin files
git add .

# Commit
git commit -m "Initial release of claude-md-manager v1.0.0"

# Add remote (GitHub, GitLab, Bitbucket, etc.)
git remote add origin https://github.com/your-company/claude-md-manager.git

# Push
git push -u origin main
```

### 3. Share with Your Team

Send your team the installation instructions:

```bash
# Install the plugin directly from git
claude plugin install https://github.com/your-org/claude-context-system/claude-plugin

# Or using the CLI tool
npm install -g claude-context-updater
claude-ctx plugin install
```

You should now have access to the /ctx-update command!

## For Developers (Using the Plugin)

### Installation

```bash
# Install directly from git repository
claude plugin install https://github.com/your-org/claude-context-system/claude-plugin
```

### First Time Setup - Template Location

Choose one of these options:

**Option A: Shared Template (Recommended)**
```bash
# Create a shared template directory
mkdir -p ~/.claude/templates

# Copy the template files (get path from your team)
cp -r /path/to/template/agent.template ~/.claude/templates/
```

**Option B: Per-Project Template**
```bash
# In your project root
mkdir -p agent.template

# Copy the template file (get path from your team)
cp /path/to/template/agent.template/agent.template.md agent.template/
```

### Using the Command

#### Create a new claude.md
```bash
# Navigate to your repository
cd /path/to/your/project

# Run the command
/ctx-update
```

The command will:
- Analyze your repository
- Generate a fully populated `claude.md` file at the repository root
- Track the git commit SHA for future updates

#### Update an existing claude.md
```bash
# After making changes to your repository
/ctx-update
```

The command will:
- Detect what changed since the last update
- Update relevant sections
- Preserve your customizations
- Update the metadata

### Example Workflow

```bash
# Day 1: Initial setup
cd ~/projects/my-service
/ctx-update
# Result: claude.md created with full documentation

# Day 15: Added new API endpoints
git add . && git commit -m "Add user authentication endpoints"
/ctx-update
# Result: "Services and APIs" section updated

# Day 30: Upgraded dependencies
npm install new-framework@latest
git add . && git commit -m "Upgrade to new framework version"
/ctx-update
# Result: "High-Level Information" and "Frameworks/Libraries" sections updated
```

### Troubleshooting

**"Template file is missing"**
- Ensure you've set up the template in one of the expected locations
- Check: `agent.template/agent.template.md` (project) or `~/.claude/templates/agent.template/agent.template.md` (shared)

**Command not found**
- Verify installation: `/plugin list`
- Reinstall: `/plugin install claude-md-manager@company-tools`

**Updates not detecting changes**
- Ensure you've committed your changes: `git status`
- Check the "Last commit SHA" in your claude.md metadata

## For Template Administrators

### Updating the Template

When you need to release a new template version:

1. **Create new version directory**:
   ```bash
   cp -r agent.template agent.template/v1.2
   ```

2. **Make changes** to `agent.template/v1.2/agent.template.md`

3. **Update the command** in `commands/ctx-update.md` to reference v1.2

4. **Bump plugin version** in `.claude-plugin/plugin.json`

5. **Commit and push**:
   ```bash
   git add .
   git commit -m "Release v1.1.0 with template v1.2"
   git tag v1.1.0
   git push --tags
   ```

6. **Notify team** to update:
   ```bash
   /plugin update claude-md-manager@company-tools
   ```

### Template Best Practices

- Use `{...}` for instructions on what content should be filled in
- Include conditional instructions (e.g., "If there are no services, remove this section")
- Keep sections focused and single-purpose
- Update version numbers when making structural changes
- Test template changes on sample repositories before releasing

## Support

- **Plugin Issues**: File issues in the `your-company/claude-md-manager` repository
- **Template Questions**: Contact your DevTools team
- **Claude Code Help**: Visit https://code.claude.com/docs/
