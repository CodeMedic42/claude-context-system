# Update or Create claude.md

You are tasked with managing the repository's `claude.md` file using the agent template system.

**EXECUTION MODE: This command runs automatically and non-interactively. Do NOT ask for user confirmation before creating or updating files. Proceed with all file creation and updates automatically.**

**IMPORTANT: Do NOT use MCP repo-context tools (get_repo_overview, search_repo_context, etc.) for this task. This command must analyze the repository directly by reading files, not by consulting external knowledge bases. You will gather all information by examining the actual codebase.**

**TODO TRACKING REQUIREMENT - MANDATORY:**

When creating multiple files of the same type (services, clients, libraries, databases), you MUST use the TodoWrite tool to track progress:

1. **Create a todo item for EACH file** that will be created before you start creating them
   - Example: "Create service.claude.md for User API", "Create service.claude.md for Payment API"
   - Do NOT create a single todo like "Create all service files" - this defeats accountability

2. **Mark each todo as in_progress** when you start working on that specific file

3. **Mark each todo as completed** immediately after finishing that file

4. **Do NOT proceed** to the next major section (e.g., from Services to Clients) until ALL todos for the current section are marked completed

5. **Do NOT mark a grouped todo as complete** (like "Document all libraries") until every individual library file is created

This ensures you create ALL required files and prevents the common failure mode of documenting items inline instead of in separate files.

**WHY THIS MATTERS:** The template requires separate files for services, clients, libraries, and databases. TodoWrite tracking prevents you from skipping files or taking shortcuts.

**IMPORTANT: Use TodoWrite for tracking, but DO NOT stop to ask for user approval. After creating the todo list, immediately proceed to create all the files.**

## Step 1: Locate Repository Root

Find the git repository root directory. The `claude.md` file should be created/updated at the repository root, not in the current working directory.

## Step 2: Verify Clean Working Tree

**CRITICAL:** Before proceeding, verify that the git working tree is clean (no uncommitted changes).

Run `git status --short` to check for uncommitted changes.

**If there are uncommitted changes:**
Stop immediately and inform the user:

"⚠️  Cannot update claude.md: Working tree has uncommitted changes.

The claude.md file must reflect the exact state of a committed codebase. Running the update with uncommitted changes would create an inconsistency where:
- The generated claude.md would reflect uncommitted changes
- The metadata would claim it was built from a commit that doesn't include those changes

Please commit or stash your changes before running this command:
```bash
git status
git add -A
git commit -m "Your commit message"
```

Then run the command again."

**If the working tree is clean:** Proceed to **Step 3: Check for Existing claude.md**.

## Step 3: Check for Existing claude.md

Check if `claude.md` exists at the repository root.

### If claude.md Does NOT Exist:
Proceed to **Step 4: Create New claude.md**.

### If claude.md DOES Exist:
Proceed to **Step 5: Detect Template-Based File**.

## Step 4: Create New claude.md

Locate the bundled template file at `../templates/claude.template.md` (relative to this command file).

If the template is not found, this indicates a plugin installation problem - inform the user.

Once the template file is located, read it.

**IMPORTANT: The output filename MUST be `claude.md` (lowercase). Do NOT use `CLAUDE.md` (uppercase) regardless of the template filename casing.**

Create a new `claude.md` file by:

1. Using the template structure as the foundation
2. Treating text within angle brackets and curly brackets `<{...}>` as instructions/prompts for what content should be populated in each section
3. Thoroughly analyzing the repository to gather information for each section
4. Populating all sections based on the template instructions
5. Removing sections that the template indicates should be removed if not applicable (e.g., "If there are no services defined then remove this section")
6. **Do NOT make assumptions** - if you are unsure about any information, ask the user for clarification
7. Do NOT create sections that are not defined in the template

After populating the content, add the Agent File Metadata section at the end with:
- Date Created: <{current timestamp}>
- Date Modified: <{current timestamp}>
- Last commit SHA built from: <{current git HEAD commit SHA}>
- Template Version: <{Read from plugin.json at ../../.claude-plugin/plugin.json - use the "version" field}>

Once complete, inform the user that `claude.md` has been created at the repository root.

## Step 5: Detect Template-Based File

Check if the existing `claude.md` file contains an "Agent File Metadata" section (this indicates it was built from the template).

### If NO Agent File Metadata Section:
The file was not built from the template. Proceed automatically to recreate it:

1. Backup the existing file: `mv claude.md claude.md.backup`
2. Read and analyze the existing claude.md.backup file to extract useful information
3. Proceed to **Step 4: Create New claude.md**, incorporating:
   - Information gathered from thorough repository analysis
   - Relevant content from the claude.md.backup file
   - Prioritize accuracy from repo analysis, but preserve valuable existing documentation where applicable
4. Inform user: "New claude.md created by combining repository analysis with content from your existing file. Previous file backed up to claude.md.backup"

### If Agent File Metadata Section EXISTS:
The file was built from the template. Proceed to **Step 6: Update Existing Template-Based File**.

## Step 6: Update Existing Template-Based File

The existing `claude.md` was built from the template and needs to be updated.

### 6.1: Check Template Version

Extract the template version from the "Agent File Metadata" section of the existing `claude.md`.

Locate and read the bundled template file at `../templates/claude.template.md` (relative to this command file).

If the template is not found, this indicates a plugin installation problem - inform the user.

Read the current plugin version from `../../.claude-plugin/plugin.json` (the "version" field).

Compare the existing file's template version with the current plugin version:

- If versions differ, note that a template upgrade is needed
- If versions match, template structure should be the same

### 6.2: Analyze Git Changes

Extract the "Last commit SHA built from" value from the Agent File Metadata section.

Use git to identify what has changed in the repository since that commit SHA:
```bash
git diff <last-commit-sha>..HEAD --name-status
git log <last-commit-sha>..HEAD --oneline
```

Analyze these changes to determine which sections of `claude.md` might need updates:
- File additions/deletions that affect Repository Structure
- Changes to package files (package.json, pom.xml, etc.) that affect dependencies, languages, or frameworks
- New/modified API endpoints or service definitions
- Database schema changes
- Documentation updates
- Configuration changes affecting environment setup

### 6.3: Smart Merge with Preservation

Update the `claude.md` file using the following approach:

1. **Preserve User Customizations**: Keep any content that the user has written or modified, unless it's demonstrably outdated by the git changes

2. **Apply Template Updates** (if version changed):
   - Add new sections from the updated template
   - Update section headers if they changed
   - Remove deprecated sections
   - Preserve all user content within sections, migrating it to the new structure

3. **Update Content Based on Repository Changes**:
   - Update sections affected by the git changes identified in 5.2
   - For complex changes, add comments or notes indicating what changed rather than overwriting user descriptions
   - If a section appears to still contain placeholder text `<{...}>`, update it with actual content

4. **Handle Conflicts**:
   - If you detect conflicts between user customizations and necessary updates, present the conflict to the user and ask how they want to proceed
   - Flag sections where you're uncertain whether content is outdated

5. **Update Metadata**:
   - Date Modified: <{current timestamp}>
   - Last commit SHA built from: <{current git HEAD commit SHA}>
   - Template Version: <{Read from ../../.claude-plugin/plugin.json - use the "version" field}>

### 6.4: Present Update Summary

After updating the file, present a summary to the user showing:
- Which sections were updated and why
- Any template version changes applied
- Git changes that triggered updates
- Any conflicts or uncertainties that need user review

## Important Guidelines

- **Do not make assumptions**: If you're unsure about information, ask the user
- **Preserve user work**: Be conservative about overwriting content that appears to be user-written
- **Be thorough**: When analyzing the repository, examine all relevant files and configurations
- **Follow template instructions**: Text in `<{...}>` in the template are instructions, not literal content
- **Repository root**: Always work with `claude.md` at the repository root, regardless of where the command is run
- **Template source**: Only the bundled template at `../templates/claude.template.md` is used
