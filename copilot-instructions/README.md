# Copilot Instructions - Claude Context System

Instructions for using GitHub Copilot to create and update `claude.md` context files.

## Overview

If you use GitHub Copilot in VS Code, you can use these prompts to automatically generate and update `claude.md` files. Copilot will analyze your repository and create the context file for you.

## Prerequisites

- VS Code installed
- GitHub Copilot extension installed and authenticated
- Repository open in VS Code workspace

## How to Use

### Creating a New claude.md

1. Open your repository in VS Code
2. Open Copilot Chat (Click chat icon in sidebar, or `Ctrl+Shift+I` / `Cmd+Shift+I`)
3. Copy the entire prompt from [create-prompt.md](create-prompt.md)
4. Paste it into Copilot Chat
5. Copilot will ask for the template
6. Open `../shared/templates/claude.template.md` from this repository
7. Copy the entire template file
8. Paste it back to Copilot
9. Wait for Copilot to analyze your repository and generate the content
10. Copy the generated content
11. Create a new file named `claude.md` in your repository root
12. Paste the content and save

### Updating an Existing claude.md

1. Open your repository in VS Code
2. Open Copilot Chat
3. Copy the entire prompt from [update-prompt.md](update-prompt.md)
4. Paste it into Copilot Chat
5. Copilot will ask for the template
6. Open `../shared/templates/claude.template.md` from this repository
7. Copy the entire template file
8. Paste it back to Copilot
9. Wait for Copilot to analyze changes and update the content
10. Review the changes
11. Copy the updated content and replace your existing `claude.md`

## Why Two Steps?

The prompts ask you to provide the template file separately. This ensures:
- ✅ **Always current** - You use the latest template version
- ✅ **No duplication** - Single source of truth in `shared/templates/`
- ✅ **Easy updates** - Template changes automatically apply
- ✅ **Customizable** - You can use a custom template if desired

## Tips for Best Results

### 1. Use @workspace
When pasting prompts, you can reference the workspace:
```
@workspace [paste prompt here]
```
This gives Copilot better context about your repository.

### 2. Be Specific
If Copilot's output misses something, ask follow-up questions:
- "Can you add more detail about the API endpoints?"
- "What about the database schema?"
- "Include information about the testing framework"

### 3. Review and Edit
Copilot generates a good starting point, but always:
- Review the output for accuracy
- Add domain-specific details
- Remove irrelevant sections
- Add custom notes for your team

### 4. Keep It Updated
Periodically use the update prompt after significant changes:
- New features added
- Dependencies changed
- Architecture updates
- New services or APIs

## What Copilot Analyzes

Copilot will examine:
- File structure and directories
- Package managers (package.json, pom.xml, requirements.txt, etc.)
- Configuration files
- Source code structure
- README and documentation
- Test files
- Build scripts

## Troubleshooting

### "Copilot didn't generate complete output"
- Try asking: "Continue from where you left off"
- Or: "Generate the rest of the claude.md file"

### "Output is too generic"
- Ask for more specifics: "Add more detail about [specific section]"
- Reference specific files: "Look at src/api/ for the API details"

### "Copilot missed something important"
- Manually edit the claude.md to add it
- Or ask: "Also include information about [topic]"

### "Need to regenerate from scratch"
- Just paste the create prompt again
- Copilot will generate a fresh version

## Automation Options

### Manual Approach (Current)
Use these prompts whenever you need to update.

### Future: VS Code Extension
We're considering a VS Code extension that would automate this workflow with a single command. Let us know if you'd be interested!

### Alternative: GitHub Actions
You could create a GitHub Action that uses Copilot to update claude.md on push/PR.

## File Format

The generated `claude.md` file:
- Works with both **Claude Code** and **GitHub Copilot**
- Uses a standard format across all repositories
- Includes metadata (timestamps, git SHA, version)
- Can be customized after generation

## See Also

- [Main Documentation](../README.md) - Overview of the project
- [Claude Plugin](../claude-plugin/README.md) - For Claude Code users
- [Template](../shared/templates/claude.template.md) - Template used

## Feedback

If you have suggestions for improving these prompts, please let us know!
