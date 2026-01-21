# Create CLAUDE.md

You are tasked with creating the repository's `CLAUDE.md` file and all associated project context files using the agent template system.

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

**EXECUTION:** Use TodoWrite for tracking, then immediately proceed to create all the files automatically without asking for user approval.

## Step 1: Locate Repository Root

Find the git repository root directory. The `CLAUDE.md` file should be created at the repository root, not in the current working directory.

## Step 2: Verify Clean Working Tree

**CRITICAL:** Before proceeding, verify that the git working tree is clean (no uncommitted changes).

Run `git status --short` to check for uncommitted changes.

**If there are uncommitted changes:**
Stop immediately and inform the user:

"⚠️  Cannot create CLAUDE.md: Working tree has uncommitted changes.

The CLAUDE.md file must reflect the exact state of a committed codebase. Running the create command with uncommitted changes would create an inconsistency where:
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

Check if a context file exists at the repository root. Check for both `CLAUDE.md` and `claude.md` (case-insensitive check - either name is valid).

### If No Context File Exists:
Proceed to **Step 4: Create New CLAUDE.md**.

### If a Context File Exists:

Check if the existing context file contains an "Agent File Metadata" section (this indicates it was built from this template system).

#### If Agent File Metadata Section EXISTS:

The file was already created by this system. Inform the user:

"⚠️  A CLAUDE.md file already exists and was created by this system (contains Agent File Metadata).

This file should be updated, not recreated. Please use the update command instead:

```
/ctx-update
```

The update command will:
- Preserve your existing content and customizations
- Update only what has changed in the repository
- Maintain the file's history and user-added sections

Aborting creation."

Then **exit without making any changes**.

#### If NO Agent File Metadata Section:

The file exists but was NOT created by this system. Inform the user and request confirmation:

"⚠️  A CLAUDE.md file already exists but was not created by this system.

To create proper context files using this tool, the existing file needs to be replaced.

**What will happen:**
1. The existing CLAUDE.md file will be replaced with a new system-generated version
2. The tool will thoroughly analyze the entire repository structure
3. The tool will also review the content of your existing CLAUDE.md file
4. Both sources (repository analysis + existing file content) will be used to create comprehensive context documentation

**Important:** Since this is a git repository, you can review the changes and revert them if needed using `git diff` and `git restore` commands.

Do you want to proceed with replacing the existing CLAUDE.md file?

Reply with YES to proceed, or NO to cancel."

**Wait for user response:**

- **If user responds YES (or yes, y, Y):**
  - Read and analyze the existing file to extract useful information
  - Proceed to **Step 4: Create New CLAUDE.md**
  - When creating the new file, incorporate:
    - Information gathered from thorough repository analysis (primary source)
    - Relevant content from the existing file (supplementary source)
    - Prioritize accuracy from repo analysis, but preserve valuable existing documentation where applicable

- **If user responds NO (or no, n, N, or anything else):**
  - Inform user: "Creation cancelled. Your existing CLAUDE.md file has not been modified."
  - **Exit without making any changes**

## Step 4: Create New CLAUDE.md

Locate the bundled template file at `../templates/CLAUDE.TEMPLATE.md` (relative to this command file).

If the template is not found, this indicates a plugin installation problem - inform the user.

Once the template file is located, read it.

Create a new `CLAUDE.md` file by:

1. Using the template structure as the foundation
2. Treating text within angle brackets and curly brackets `<{...}>` as instructions/prompts for what content should be populated in each section
3. Thoroughly analyzing the repository to gather information for each section
4. Populating all sections based on the template instructions
5. Removing sections that the template indicates should be removed if not applicable (e.g., "If there are no services defined then remove this section")
6. **If there was an existing non-system file:** Incorporate relevant content from that file where it provides valuable context, but prioritize accuracy from your repository analysis
7. Do NOT create sections that are not defined in the template

**AUTOMATIC PROJECT FILE CREATION:**

When the template identifies services, clients, libraries, or databases that need separate documentation files:

1. **Create a TodoWrite list** with an individual todo item for each file that needs to be created
   - Example: If you find 3 services, 2 libraries, and 1 database, create 6 separate todo items

2. **Proceed automatically** to create ALL identified project files:
   - Use the appropriate template for each type:
     - `SERVICE.TEMPLATE.md` for services
     - `CLIENT.TEMPLATE.md` for clients
     - `LIBRARY.TEMPLATE.md` for libraries
     - `DATABASE.TEMPLATE.md` for databases
   - Create each file in the appropriate location
   - Mark each todo as in_progress when starting, completed when finished
   - Do NOT skip any files
   - Do NOT ask for user approval

3. **In the main CLAUDE.md file**, reference each project file using the `@file` directive:
   ```markdown
   - **Project Name**: @file ./path/to/TYPE.CLAUDE.md
   ```

After populating all content and creating all project files, add the Agent File Metadata section at the end of CLAUDE.md with:
- Date Created: <{current timestamp}>
- Date Modified: <{current timestamp}>
- Last commit SHA built from: <{current git HEAD commit SHA}>
- Template Version: <{Read from plugin.json at ../.claude-plugin/plugin.json (relative to this command file) - use the "version" field}>

Once complete, inform the user:
- That `CLAUDE.md` has been created at the repository root
- List all project files that were created (services, clients, libraries, databases)
- Provide a count of each type

## Important Guidelines

- **Be thorough**: When analyzing the repository, examine all relevant files and configurations
- **Follow template instructions**: Text in `<{...}>` in the template are instructions, not literal content
- **Repository root**: Always work with the context file at the repository root, regardless of where the command is run
- **Template source**: Only the bundled template at `../templates/CLAUDE.TEMPLATE.md` is used
- **No prompts during creation**: Once user confirms (if replacing existing file), proceed automatically to create all files
- **TodoWrite for accountability**: Track every single file creation to ensure nothing is skipped
- **Separate files are mandatory**: Never document projects inline in CLAUDE.md - always create separate files and use @file references
