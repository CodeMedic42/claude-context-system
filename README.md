# Claude Context System

Automated tools to create and maintain `claude.md` context files for AI coding assistants like Claude Code and GitHub Copilot.

## Overview

Claude Context System helps development teams maintain high-quality repository context files that AI assistants can quickly load to understand your codebase. Instead of manually writing documentation, these tools automatically analyze your repository and generate comprehensive `claude.md` files.

### What is claude.md?

`claude.md` is a standardized context file that both **Claude Code** and **GitHub Copilot** can read. It contains:
- Repository summary and purpose
- Project structure and organization
- Languages, frameworks, and dependencies
- Services, APIs, and database schemas
- Environment setup instructions
- Build, test, and run commands
- Documentation references

## Why Use This?

✅ **Save Time** - Automated generation instead of manual documentation
✅ **Stay Current** - Git-aware updates keep context synchronized with code
✅ **Consistent Format** - Standardized template across all repositories
✅ **Works with Both Tools** - Claude Code and GitHub Copilot both read `claude.md`
✅ **Improve AI Quality** - Better context = better AI suggestions

## Repository Structure

```
claude-context-system/
├── claude-plugin/           # Claude Code plugin
│   ├── .claude-plugin/      # Plugin manifest
│   ├── commands/            # Plugin commands
│   │   ├── ctx-update.md    # /ctx-update - Create/update claude.md
│   │   └── ctx-rule.md      # /ctx-rule - Manage reusable rules
│   ├── examples/            # Example rule files
│   └── templates/           # claude.md template
│
├── copilot-instructions/    # GitHub Copilot prompts
│   ├── README.md            # How to use
│   ├── create-prompt.md     # Create new claude.md
│   └── update-prompt.md     # Update existing claude.md
│
├── shared/                  # Shared by both tools
│   ├── templates/           # claude.md template
│   └── utils/               # Repository analysis utilities
│
├── plugin-setup/            # Plugin installation scripts
│   ├── plugin-install.js    # Setup local marketplace & install
│   └── plugin-uninstall.js  # Uninstall & cleanup
│
└── docs/                    # Documentation
	├── README.md            # Comprehensive guide
	├── QUICK_START.md       # Quick reference
	└── claude-guide.md      # Claude Code specific guide
```

## Quick Start

### For Claude Code Users

1. **Install the plugin from a published source:**
   ```bash
   claude plugin install https://github.com/your-org/claude-context-system/claude-plugin
   ```

2. **Or install locally for development:**
   ```bash
   # Clone the repository
   git clone https://github.com/your-org/claude-context-system
   cd claude-context-system

   # Install and setup
   pnpm install
   pnpm run plugin:install
   ```

3. **Create/update claude.md in your repository:**
   ```
   /claude-context-updater:ctx-update
   ```

4. **Manage reusable rules:**
   ```
   /claude-context-updater:ctx-rule add https://company.com/rules/javascript.md
   /claude-context-updater:ctx-rule update
   ```

### For GitHub Copilot Users

1. **Open your repository in VS Code**

2. **Open Copilot Chat** (Ctrl+Shift+I / Cmd+Shift+I)

3. **Copy and paste the prompt from:**
   - [copilot-instructions/create-prompt.md](copilot-instructions/create-prompt.md) - To create new claude.md
   - [copilot-instructions/update-prompt.md](copilot-instructions/update-prompt.md) - To update existing

4. **Copilot analyzes your repo and generates the file**

5. **Save the output as claude.md**

### What Happens

Both tools do the same thing:
1. Analyze your repository structure
2. Detect languages, frameworks, and project type
3. Find services, APIs, and databases
4. Generate or update `claude.md`
5. Track changes with git metadata

The result is a single `claude.md` file that both Claude Code and GitHub Copilot automatically read!

## How It Works

### First Run (Creation)

```bash
# Before
your-repo/
└── (no context file)

# Run command
/ctx-update  (or: agent-context update)

# After
your-repo/
└── claude.md  ← Generated with full repo context
```

### Subsequent Runs (Updates)

```bash
# Make changes to your repo
git commit -m "Add new API endpoint"

# Update context
/ctx-update  (or: agent-context update)

# claude.md is updated with:
# - New API endpoint documented
# - Updated git SHA
# - New timestamp
# - Your customizations preserved
```

## Features

### 🤖 Universal Compatibility
- Works with **Claude Code**
- Works with **GitHub Copilot**
- Works with any AI tool that reads markdown context

### 📊 Intelligent Analysis
- Detects project type (Node.js, Python, Java, etc.)
- Identifies frameworks (React, FastAPI, Spring Boot, etc.)
- Finds APIs and services
- Discovers database schemas
- Locates build and test commands

### 🔄 Smart Updates
- Git-aware: only updates when repo changes
- Preserves your customizations
- Tracks template versions
- Creates backups before major changes

### 📝 Consistent Format
- Shared template ensures consistency
- Works across all company repositories
- Easy to customize for your organization

## Two Ways to Use

| Feature | Claude Code Plugin | Copilot Instructions |
|---------|-------------------|---------------------|
| **Best for** | Claude Code users | GitHub Copilot users |
| **Installation** | `claude plugin install` | None (just copy prompts) |
| **Usage** | `/ctx-update` | Paste prompt in Copilot Chat |
| **AI Engine** | Claude does analysis | Copilot does analysis |
| **Automation** | One command | Copy/paste prompt |
| **Platform** | Claude Code | VS Code with Copilot |

**Same Result:** Both create the same `claude.md` file!

## Installation

### Claude Code Plugin

```bash
# From git repository
claude plugin install https://github.com/your-org/claude-context-system/claude-plugin
```

See [Claude Plugin Documentation](claude-plugin/README.md)

### Copilot Instructions

No installation needed! Just use the prompts:

1. Open VS Code with GitHub Copilot active
2. Navigate to [copilot-instructions/](copilot-instructions/)
3. Copy prompts and paste into Copilot Chat

See [Copilot Instructions Guide](copilot-instructions/README.md)

## Usage Examples

### Create New claude.md

**Claude Code:**
```
/ctx-update
```

**Copilot:**
1. Open Copilot Chat
2. Paste prompt from `copilot-instructions/create-prompt.md`
3. Save output as `claude.md`

### Update Existing File

**Claude Code:**
```
/ctx-update
```

**Copilot:**
1. Open Copilot Chat
2. Paste prompt from `copilot-instructions/update-prompt.md`
3. Replace existing `claude.md` with output

## Customization

### Template Customization

The shared template is at `shared/templates/claude.template.md`. Edit this file to customize the format and sections for your organization.

### Organization-Wide Deployment

1. Fork or clone this repository
2. Customize the template in `shared/templates/`
3. Update company info in `claude-plugin/.claude-plugin/plugin.json`
4. Distribute to your team via:
   - Git repository URL
   - Share copilot-instructions/ directory

## Documentation

- 📘 [Complete Guide](docs/README.md) - Full documentation
- ⚡ [Quick Start](docs/QUICK_START.md) - Get started fast
- 🎯 [Claude Code Guide](docs/claude-guide.md) - Plugin-specific features

## Example claude.md

See [example file](claude-plugin/examples/claude.example.md) for what the generated output looks like.

## Development

This is a monorepo containing:

1. **Claude Code Plugin** (`claude-plugin/`) - Claude Code plugin with commands
2. **Copilot Instructions** (`copilot-instructions/`) - For GitHub Copilot users
3. **Shared Components** (`shared/`) - Templates and utilities used by both
4. **Plugin Setup Scripts** (`plugin-setup/`) - Local development installation

### Setup

After cloning the repository:

```bash
# Install pnpm globally (if not already installed)
npm install -g pnpm

# Install all dependencies (root and all workspace packages)
pnpm install
```

This will:
- Install root dependencies (Husky, Lerna)
- Set up git hooks for automatic template syncing
- Install dependencies for all packages in the monorepo (via pnpm workspaces)

### Contributing

1. Clone the repository
2. Run `npm install` to set up git hooks
3. Make changes to templates or prompts
4. Test with both Claude Code and Copilot
5. Submit pull request

**Note**: When you edit `shared/templates/claude.template.md`, the pre-commit hook will automatically copy it to `claude-plugin/templates/claude.template.md` and include both files in your commit.

### Monorepo Management with Lerna + pnpm

This monorepo uses **Lerna** (v9) with **pnpm workspaces** for managing multiple packages.

**Why pnpm?**
- Faster installs and less disk space
- Strict dependency resolution
- Better monorepo support

**Useful commands:**

```bash
# Install dependencies (root and all packages)
pnpm install

# Run tests in all packages
pnpm run test

# Run linting in all packages
pnpm run lint

# Build all packages
pnpm run build

# See which packages changed since last release
pnpm run changed

# Version all packages (interactive)
pnpm run version

# Publish all changed packages to npm
pnpm run publish

# Publish canary (pre-release) versions
pnpm run publish:canary

# Execute a command in all packages
pnpm run exec -- <command>

# Clean all node_modules in packages
pnpm run clean
```

**Package-specific commands:**

```bash
# Run script in specific package
pnpm --filter claude-plugin <script>

# Install dependency in specific package
pnpm --filter claude-plugin add <package>
```

**Plugin Development:**

```bash
# Install plugin locally for testing
pnpm run plugin:install

# Make changes to plugin code (they're live via symlink)
# Test in any Claude session: /claude-context-updater:ctx-update

# Uninstall when done testing
pnpm run plugin:uninstall
```

## FAQ

**Q: Do I need to install both tools?**
A: No! Choose one:
- Claude Code users → Install the plugin
- GitHub Copilot users → Use the prompts (no installation)

**Q: Will GitHub Copilot automatically use claude.md?**
A: Yes! Copilot natively supports reading `claude.md` files.

**Q: Can I use both approaches in the same repo?**
A: Yes! They create the same file format. Claude users can run `/ctx-update`, Copilot users can use the prompts.

**Q: How do I keep claude.md updated?**
A: Run the update command after significant changes, or set up git hooks/CI automation.

**Q: Can I manually edit claude.md?**
A: Yes! The tools preserve your customizations during updates.

**Q: Does this work with other AI tools?**
A: Yes! Any AI tool that reads markdown context can use `claude.md`.

## Version History

### v2.0.0 (Current)
- Simplified to single file format (`claude.md`)
- Claude Code plugin with `/md-update` command
- GitHub Copilot instructions with chat prompts
- Shared template system
- Removed sync complexity

### v1.2.0
- (Previous complex version with dual formats)

### v1.0.0
- Initial release (Claude Code only)

## License

MIT License - see [LICENSE](LICENSE) file

## Support

- 📝 [GitHub Issues](https://github.com/your-org/claude-context-system/issues)
- 💬 [Discussions](https://github.com/your-org/claude-context-system/discussions)

---

**Made with ❤️ for teams using AI-assisted development**
