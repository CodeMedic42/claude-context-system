# Update Existing claude.md - Copilot Prompt

## Instructions

1. Copy the prompt below and paste it into GitHub Copilot Chat in VS Code
2. Copilot will ask you for the current template
3. Open `../shared/templates/claude.template.md` in this repository
4. Copy the entire template file
5. Paste it back to Copilot when requested
6. Copilot will analyze changes and update your claude.md

---

You are tasked with updating an existing claude.md file in this repository based on recent changes.

## Step 1: Read Existing claude.md

First, read the existing claude.md file at the repository root.

## Step 2: Request Current Template

Ask the user: "Please provide the current claude.md template file. Open `shared/templates/claude.template.md` from the claude-context-updater repository and paste its contents here."

Wait for the user to provide the template.

## Step 3: Extract Metadata

From the "Agent File Metadata" section at the bottom of the existing claude.md, extract:
- **Last Commit SHA**: This is the git commit the file was last built from
- **Template Version**: The version of the template used

## Step 4: Analyze Git Changes

Compare the repository changes since the last commit SHA:

```bash
# Get list of changed files
git diff {LAST_COMMIT_SHA}..HEAD --name-status

# Get commit messages
git log {LAST_COMMIT_SHA}..HEAD --oneline
```

Analyze what changed:
- File additions/deletions → affects Repository Structure
- Changes to package.json, pom.xml, requirements.txt, etc. → affects Languages/Frameworks
- Changes in src/, api/, routes/ directories → may affect Services/APIs section
- Changes in database migrations or models → affects Databases section
- Changes to .env.example, docker-compose.yml → affects Environment Setup
- Changes to README or docs/ → affects Documentation section

## Step 5: Update Affected Sections

Using the template provided by the user, update the claude.md file following these rules:

### 5.1: Preserve User Customizations

**IMPORTANT**: If a section appears to have been customized by the user (contains real content, not placeholder text in `{...}`), preserve that content unless it's clearly outdated by the git changes.

### 5.2: Update Changed Sections

For sections affected by git changes:
- **Repository Structure**: If files/directories were added or removed, update the tree
- **Languages/Frameworks**: If dependencies changed, update the lists
- **Services/APIs**: If API files changed, update endpoints and schemas
- **Databases**: If migrations or models changed, update schemas
- **Environment Setup**: If config files changed, update setup instructions
- **Documentation**: If docs changed, update references

### 5.3: Keep Unchanged Sections

If a section wasn't affected by the git changes, leave it as-is (preserve user content).

### 5.4: Update Metadata

Always update the metadata section:
```markdown
# Agent File Metadata

- **Date Created**: {Keep the original date from existing file}
- **Date Modified**: {Current date and time in ISO format}
- **Last Commit SHA**: {Current git commit SHA from git rev-parse HEAD}
- **Template Version**: 2.0.0
```

## Step 6: Generate Updated claude.md

Using the template structure provided by the user, generate the complete updated claude.md file with:
1. All sections from the template structure
2. Updates applied to changed sections based on git analysis
3. User customizations preserved from the existing file
4. Updated metadata (Date Modified, Last Commit SHA)

## Important Guidelines

1. **Preserve user work**: Don't overwrite sections that users have carefully written
2. **Be surgical**: Only update what changed based on git diff
3. **Keep the structure**: Maintain the same section order and format
4. **Be specific**: Use actual file names and commands from the repository
5. **Current timestamp**: Use the actual current date/time
6. **Don't remove sections**: Even if empty, keep sections that exist (unless they have note "remove if not applicable")

## Example Update Scenarios

### Scenario: Dependencies Changed
If package.json was modified:
- Update "Frameworks/Libraries" section with new/changed dependencies
- Keep all other sections unchanged

### Scenario: New API Endpoints Added
If new route files added in src/api/:
- Update "Services and APIs" section with new endpoints
- Update "Repository Structure" if new directories created
- Keep other sections unchanged

### Scenario: Documentation Updated
If README.md or docs/ changed:
- Update "Documentation" section to reflect new docs
- Keep all other sections unchanged

### Scenario: No Structural Changes
If only implementation details changed (not structure, dependencies, or APIs):
- Keep all content sections unchanged
- Only update the metadata (Date Modified, Last Commit SHA)

## Generate the Update

Now, analyze the git changes and generate the complete updated claude.md file.
