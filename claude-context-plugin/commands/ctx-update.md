# Update CLAUDE.md

You are tasked with updating the repository's existing `CLAUDE.md` file and associated project context files.

**IMPORTANT: Do NOT use MCP repo-context tools (get_repo_overview, search_repo_context, etc.) for this task. This command must analyze the repository directly by reading files, not by consulting external knowledge bases. You will gather all information by examining the actual codebase.**

**TODO TRACKING REQUIREMENT - MANDATORY:**

When creating multiple files of the same type (services, clients, libraries, databases), you MUST use the TodoWrite tool to track progress.

1. **Create a todo item for EACH file** that will be created before you start creating them
   - Example: "Create SERVICE.CLAUDE.md for User API", "Create SERVICE.CLAUDE.md for Payment API"
   - Do NOT create a single todo like "Create all service files" - this defeats accountability

2. **Mark each todo as in_progress** when you start working on that specific file

3. **Mark each todo as completed** immediately after finishing that file

4. **Do NOT proceed** to the next major section (e.g., from Services to Clients) until ALL todos for the current section are marked completed

5. **Do NOT mark a grouped todo as complete** (like "Document all libraries") until every individual library file is created

This ensures you create ALL required files and prevents the common failure mode of documenting items inline instead of in separate files.

**WHY THIS MATTERS:** The template requires separate files for services, clients, libraries, and databases. TodoWrite tracking prevents you from skipping files or taking shortcuts.

**EXECUTION:** Use TodoWrite for tracking and proceed automatically to create all files without asking for user approval.

## Step 1: Locate Repository Root

Find the git repository root directory. The `CLAUDE.md` file should be located at the repository root, not in the current working directory.

## Step 2: Verify Clean Working Tree

**CRITICAL:** Before proceeding, verify that the git working tree is clean (no uncommitted changes).

Run `git status --short` to check for uncommitted changes.

**If there are uncommitted changes:**
Stop immediately and inform the user:

"⚠️  Cannot update CLAUDE.md: Working tree has uncommitted changes.

The CLAUDE.md file must reflect the exact state of a committed codebase. Running the update with uncommitted changes would create an inconsistency where:
- The generated CLAUDE.md would reflect uncommitted changes
- The metadata would claim it was built from a commit that doesn't include those changes

Please commit or stash your changes before running this command:
```bash
git status
git add -A
git commit -m "Your commit message"
```

Then run the command again."

**If the working tree is clean:** Proceed to **Step 3: Check for Existing Context File**.

## Step 3: Check for Existing Context File

Check if a context file exists at the repository root. Check for both `CLAUDE.md` and `CLAUDE.md` (case-insensitive check - either name is valid).

### If No Context File Exists:

The update command requires an existing context file. Inform the user:

"⚠️  No CLAUDE.md file found at the repository root.

The update command can only update existing context files created by this system. To create a new context file, please use the create command instead:

```
/ctx-create
```

The create command will:
- Analyze your repository structure
- Generate a complete CLAUDE.md file
- Create all necessary project documentation files (services, clients, libraries, databases)

Aborting update."

Then **exit without making any changes**.

### If a Context File Exists:

Check if the existing context file contains an "Agent File Metadata" section (this indicates it was built from this template system).

**Note:** The file could be named `CLAUDE.md` or `CLAUDE.md` - preserve whatever name the user has.

#### If NO Agent File Metadata Section:

The file exists but was NOT created by this system. Inform the user:

"⚠️  The CLAUDE.md file exists but was not created by this system (no Agent File Metadata found).

The update command can only update files created by this system. To use this system's context management, you need to create a new context file using:

```
/ctx-create
```

The create command will:
- Detect your existing CLAUDE.md file
- Ask for your confirmation to replace it
- Review your existing file content along with the repository
- Generate proper system-managed context files

Aborting update."

Then **exit without making any changes**.

#### If Agent File Metadata Section EXISTS:

The file was built from this template system. Proceed to **Step 4: Update Existing Template-Based File**.

## Step 4: Update Existing Template-Based File

🚨 **CRITICAL STOP - READ THIS FIRST BEFORE DOING ANYTHING** 🚨

**THIS IS AN UPDATE, NOT A REGENERATION:**
- DO NOT regenerate the file from scratch
- DO NOT delete the existing file and create a new one
- DO NOT overwrite user-added sections
- You MUST preserve ALL sections that don't exist in the template

**BEFORE YOU DO ANY WORK**, you must:
1. Read the ENTIRE existing CLAUDE.md file
2. Read the template file
3. Identify which `##` sections exist in CLAUDE.md but NOT in the template
4. These are USER-ADDED SECTIONS - you MUST preserve them EXACTLY
5. Common user-added sections: "Team Members", "Project History", "Architecture Decisions"

**Example - If the existing file has:**
```markdown
## Repository Summary
<content>
## Team Members          ← This section is NOT in the template
- Alice Johnson
- Bob Smith
## High-Level Repository Information
<content>
```

**The updated file MUST have:**
```markdown
## Repository Summary
<updated analysis>
## Team Members          ← PRESERVED EXACTLY from existing file
- Alice Johnson
- Bob Smith
## High-Level Repository Information
<updated analysis>
```

**VERIFICATION**: Before finalizing ANY file (CLAUDE.md, SERVICE.CLAUDE.md, etc.), verify that EVERY user-added section from the original is present in the updated version.

---

The existing context file was built from the template and needs to be updated.

**IMPORTANT:** Preserve the existing filename - do NOT rename the file. If the user has `CLAUDE.md`, keep it as `CLAUDE.md`. If they have `CLAUDE.md`, keep it as `CLAUDE.md`.

### 4.1: Check Template Version

Extract the template version from the "Agent File Metadata" section of the existing context file.

Locate and read the bundled template file at `../templates/CLAUDE.TEMPLATE.md` (relative to this command file).

If the template is not found, this indicates a plugin installation problem - inform the user.

Read the current plugin version from `../.claude-plugin/plugin.json` (relative to this command file, the "version" field).

Compare the existing file's template version with the current plugin version:

- If versions differ, note that a template upgrade is needed
- If versions match, template structure should be the same

### 4.2: Analyze Git Changes

Extract the "Last commit SHA built from" value from the Agent File Metadata section.

Use git to identify what has changed in the repository since that commit SHA:
```bash
git diff <last-commit-sha>..HEAD --name-status
git log <last-commit-sha>..HEAD --oneline
```

Analyze these changes to determine which sections of `CLAUDE.md` might need updates:
- File additions/deletions that affect Repository Structure
- Changes to package files (package.json, pom.xml, etc.) that affect dependencies, languages, or frameworks
- New/modified API endpoints or service definitions
- Database schema changes
- Documentation updates
- Configuration changes affecting environment setup

**Pattern Recognition for New Projects:**

When analyzing git changes, specifically flag patterns that indicate new projects requiring documentation:

**CLI Tools (clients):**
- `A  */bin/*.js` or `A  */cli.js` or `A  */cli/*.js`
- `A  *-cli/package.json` or `A  *-context-cli/package.json`
- New package.json with `"bin": {...}` field added
- Executable files with shebang lines (`#!/usr/bin/env node`)
- Files with command-line parsing (commander, yargs, inquirer imports)

**Services (backend APIs):**
- `A  */server.js` or `A  */app.js` or `A  */index.js` with server code
- New Dockerfile, docker-compose.yml for services
- New package.json with dependencies: "express", "fastapi", "koa", "hapi", "nestjs"
- New directories like `services/*`, `apps/backend/*`, `api/*`
- Files with HTTP endpoint definitions (routes, controllers)

**Libraries (packages):**
- `A  packages/*/package.json` in monorepo
- `A  libs/*/package.json` or `A  libraries/*/package.json`
- New package.json with `"main": "..."`, `"exports": {...}`, or `"types": "..."`
- New directories with reusable components or utilities meant for import

**Databases (schemas):**
- `A  */migrations/` or `A  database/migrations/`
- `A  prisma/schema.prisma` or `A  */prisma/schema.prisma`
- New ORM entity files (TypeORM, Sequelize, Mongoose models)
- `A  */schema.sql` or database definition files

**Directory Renames/Moves:**
- `R  old-name/ new-name/` - Check if projects were renamed and update @file references accordingly

### 4.3: Identify and Create New Project Files

After analyzing git changes in Step 4.2, scan for NEW projects that need documentation. Use the pattern recognition from Step 4.2 to identify candidates.

**For each project type, check if new projects exist:**

1. **New Services**:
   - Look for git changes matching service patterns (server.js, Dockerfile, Express/FastAPI dependencies)
   - Check if SERVICE.CLAUDE.md already exists for each service
   - If service exists but no documentation file → FLAG for creation

2. **New Clients**:
   - Look for git changes matching client patterns (CLI tools with bin/, frontend apps, mobile apps)
   - Check if CLIENT.CLAUDE.md already exists for each client
   - If client exists but no documentation file → FLAG for creation

3. **New Libraries**:
   - Look for git changes matching library patterns (packages/* with package.json, reusable modules)
   - Check if LIBRARY.CLAUDE.md already exists for each library
   - If library exists but no documentation file → FLAG for creation

4. **New Databases**:
   - Look for git changes matching database patterns (migrations/, prisma schema, ORM entities)
   - Check if DATABASE.CLAUDE.md already exists for each database
   - If database exists but no documentation file → FLAG for creation

**Verification Method:**

For each candidate project identified:
- Determine where its documentation file SHOULD be located
- Check if that file exists: `ls <expected-path>/[type].CLAUDE.md`
- If file does NOT exist → Add to "New Projects to Create" list

**If ZERO new projects are identified:**
- Continue to Step 4.4 (Smart Merge with Preservation)
- Proceed with structural updates

**If ONE OR MORE new projects are identified:**
- Create TodoWrite items for ALL identified projects
- Proceed AUTOMATICALLY to create all project files:
  - Use the appropriate template for each type (SERVICE.TEMPLATE.md, CLIENT.TEMPLATE.md, etc.)
  - Create each file in the appropriate location
  - Mark each todo as in_progress when starting, completed when finishing
  - Do NOT skip any files
  - Do NOT ask for user approval
- Update main CLAUDE.md with @file references for new projects
- Then proceed to Step 4.4 for remaining structural updates

### 4.4: Smart Merge with Preservation

**CRITICAL: This is NOT a full regeneration. You MUST preserve user-added sections.**

Update the `CLAUDE.md` file using the following approach:

#### 4.4.1: Identify User-Added Sections

Before making any changes, identify which sections are user-added (not in the template):

**Algorithm for detecting user-added sections:**

1. **Parse both files into sections:**
   - Read the existing `CLAUDE.md` file and extract all `##` (h2) section headers
   - Read the template file and extract all `##` section headers (ignoring placeholder text `<{...}>`)

2. **Compare section lists:**
   - For each `##` section in the existing file, check if a section with the SAME NAME exists in the template
   - Sections that exist in the file but NOT in the template = **user-added sections**
   - Sections that exist in both = **template sections** (may have user modifications)

3. **Common user-added sections to look for:**
   - `## Team Members` - Team roster (very common)
   - `## Project History` - Historical context
   - `## Architecture Decisions` - ADRs or design rationale
   - `## Security Notes` - Security considerations
   - `## Deployment History` - Deployment records
   - `## Known Issues` - Issue tracking
   - Any other section not present in the template

4. **Record the position:**
   - Note where each user-added section appears relative to template sections
   - Example: "Team Members appears after Repository Summary and before High-Level Repository Information"

#### 4.4.2: Preserve User-Added Sections

When reconstructing the updated file:

1. **Start with the template structure** as the foundation

2. **For each user-added section found in 4.4.1:**
   - Copy the ENTIRE section from the existing file (header + content)
   - Insert it in the SAME RELATIVE POSITION as it appeared in the original file
   - If it was between two template sections, insert it between those same sections in the new file

3. **Example preservation:**
   ```
   Existing file has:
   ## Repository Summary
   <content>
   ## Team Members          ← User-added
   <content>
   ## High-Level Repository Information
   <content>

   Updated file must have:
   ## Repository Summary
   <updated content from analysis>
   ## Team Members          ← Preserved from existing file
   <exact content from existing file>
   ## High-Level Repository Information
   <updated content from analysis>
   ```

4. **Preserve user-modified content within template sections:**
   - If a template section contains content that appears to be user-written (not placeholder text), preserve it
   - Only update if git changes make it demonstrably outdated
   - When in doubt, keep the existing content

#### 4.4.3: Apply Template Updates

After preserving user sections:

1. **Apply Template Updates** (if version changed):
   - Add new sections from the updated template
   - Update section headers if they changed
   - Remove deprecated sections
   - Preserve all user content within sections, migrating it to the new structure

2. **Update Content Based on Repository Changes**:
   - Update sections affected by the git changes identified in 4.2
   - For complex changes, add comments or notes indicating what changed rather than overwriting user descriptions
   - If a section appears to still contain placeholder text `<{...}>`, update it with actual content

3. **Update Metadata**:
   - Date Modified: <{current timestamp}>
   - Last commit SHA built from: <{current git HEAD commit SHA}>
   - Template Version: <{Read from ../.claude-plugin/plugin.json (relative to command file) - use the "version" field}>

**VERIFICATION STEP:**

Before finalizing the updated file, verify:
- [ ] All user-added sections from the original file are present in the updated file
- [ ] User-added sections are in the same relative position
- [ ] No user content was lost or overwritten without cause

#### 4.4.4: Apply Same Preservation Logic to Sub-Files

**CRITICAL: The same preservation logic applies to ALL context files (SERVICE.CLAUDE.md, CLIENT.CLAUDE.md, LIBRARY.CLAUDE.md, DATABASE.CLAUDE.md).**

When updating any existing sub-file:

1. **Check if the file has Agent File Metadata section:**
   - If YES: It was generated from template → apply preservation logic from 4.4.1-4.4.3
   - If NO: It's a custom file → auto-replace it (see below)

2. **For files WITH metadata (system-generated):**
   - Parse the existing sub-file for user-added sections
   - Read the corresponding template (service.template.md, client.template.md, library.template.md, database.template.md)
   - Compare sections in existing file vs template
   - Identify user-added sections (e.g., "## Team Members", "## Deployment History")
   - Preserve user sections in same relative position using the same algorithm from 4.4.1-4.4.2
   - Update based on git changes affecting that specific project
   - Preserve unchanged content

3. **For files WITHOUT metadata (non-system files):**
   - Read and analyze the existing file to extract useful information
   - Replace the file with a new system-generated version using the appropriate template
   - Incorporate relevant content from the old file where it provides valuable context
   - Prioritize accuracy from current code analysis, but preserve valuable existing documentation where applicable
   - Add Agent File Metadata section to mark it as system-managed

**Example for SERVICE.CLAUDE.md WITH metadata:**
```
Existing Service.Api/SERVICE.CLAUDE.md has:
## Service Overview
<content>
## Team Members          ← User-added
- Alice Johnson (Lead Developer)
## Technologies
<content>

Updated Service.Api/SERVICE.CLAUDE.md must have:
## Service Overview
<updated content based on code analysis>
## Team Members          ← Preserved exactly
- Alice Johnson (Lead Developer)
## Technologies
<updated content based on changes>
```

**Common user-added sections in sub-files:**
- `## Team Members` - Team responsible for this component
- `## Changelog` - Component-specific change history
- `## Migration Notes` - Important upgrade information
- `## Troubleshooting` - Known issues and solutions
- `## Performance Notes` - Performance characteristics
- Any custom sections added by the team

### 4.5: Present Update Summary

After updating the file, present a summary to the user showing:
- Which sections were updated and why
- Any template version changes applied
- Git changes that triggered updates
- Any conflicts or uncertainties that need user review

**NEW PROJECTS CREATED:**

If new project files were created, include:

```
📁 NEW PROJECT FILES CREATED

Based on git changes analysis (since <last-commit-sha>):

✓ Services: [N] new service(s)
  - ./path/to/service1/SERVICE.CLAUDE.md
  - ./path/to/service2/SERVICE.CLAUDE.md

✓ Clients: [N] new client(s)
  - ./path/to/client1/CLIENT.CLAUDE.md

✓ Libraries: [N] new library(s)
  - ./path/to/lib1/LIBRARY.CLAUDE.md
  - ./path/to/lib2/LIBRARY.CLAUDE.md

✓ Databases: [N] new database(s)
  - ./path/to/db1/DATABASE.CLAUDE.md

Total: [N] new files created automatically
```

**SUB-FILES REPLACED:**

If any sub-files were replaced (had no metadata), include:

```
🔄 SUB-FILES REPLACED

The following files existed but were not system-managed (no metadata). They have been replaced with system-generated versions:
  - ./path/to/project/SERVICE.CLAUDE.md (content from old file incorporated)
  - ./path/to/another/LIBRARY.CLAUDE.md (content from old file incorporated)

These files now include Agent File Metadata and will be properly managed going forward.
```

## Important Guidelines

- **CRITICAL - Preserve user-added sections**: When updating existing files, you MUST identify and preserve sections that don't exist in the template (like "Team Members"). Use the algorithm in Step 4.4.1-4.4.2 to detect and preserve these sections in their original positions. This applies to ALL context files (CLAUDE.md, SERVICE.CLAUDE.md, CLIENT.CLAUDE.md, etc.)
- **Preserve user work**: Be conservative about overwriting content that appears to be user-written. When in doubt, keep existing content and only update what's demonstrably outdated by git changes
- **Updates are NOT regenerations**: This command updates existing files, it does not regenerate them. Updates must preserve user content and only modify what needs updating based on repository changes
- **Be thorough**: When analyzing the repository, examine all relevant files and configurations
- **Follow template instructions**: Text in `<{...}>` in the template are instructions, not literal content
- **Repository root**: Always work with the context file at the repository root, regardless of where the command is run
- **Preserve filenames**: When updating existing files, preserve the filename (CLAUDE.md or CLAUDE.md) - do not rename
- **Template source**: Only the bundled template at `../templates/CLAUDE.TEMPLATE.md` is used
- **No user prompts**: All file creation and updates happen automatically without asking for approval
- **TodoWrite for accountability**: Track every single new file creation to ensure nothing is skipped
