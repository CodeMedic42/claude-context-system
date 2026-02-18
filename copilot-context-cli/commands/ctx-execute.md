---
description: Execute context file generation from action plan with project count limit
argument-hint: --max-projects <number>
allowed-tools: Bash(git*), Bash(find*), Bash(mkdir*), Read, Write, Edit, Glob, Grep
---

# Context Execution Command

Execute context file generation based on an action plan created by `/ctx-prepare`, `/ctx-create`, or `/ctx-update`.

**Required Parameter:** `--max-projects <number>` - Maximum number of projects to process per execution

**Operation:** $1 (should be "--max-projects")
**Max Projects:** $2 (number of projects to process)

## ⚠️ CRITICAL REQUIREMENT: Preserve User-Added Content

**When updating existing context files (CLAUDE.md, PROJECT.CLAUDE.md, SERVICE.CLAUDE.md, CLIENT.CLAUDE.md, LIBRARY.CLAUDE.md, DATABASE.CLAUDE.md, IAC.CLAUDE.md), you MUST preserve ALL user-added sections.**

**What are user-added sections?**
- Any `##` level heading that does NOT exist in the template
- Examples: "## Architecture Decisions", "## Compliance Requirements", "## Custom Workflows", etc.
- Users add these sections to customize their documentation

**How to preserve:**
1. Load the template file to know which sections are standard
2. Parse existing context file for all `##` headings
3. Compare headings to template - identify which are NOT in template
4. Extract full content of each user-added section (heading + all content until next `##` or `#`)
5. When generating updated file, insert ALL user-added sections:
   - After "## Restricted Actions" section
   - Before "# Agent File Maintenance" section
   - Preserve exact heading text and content
   - Maintain original order

**This applies to:**
- CLAUDE.md (Step 3.2)
- All project context files: PROJECT.CLAUDE.md, SERVICE.CLAUDE.md, CLIENT.CLAUDE.md, LIBRARY.CLAUDE.md, DATABASE.CLAUDE.md, IAC.CLAUDE.md (Step 2.4)

**Failure to preserve user content will break the system and require manual fixes.**

## Prerequisites

Before proceeding, verify:

1. **Action plan exists:**
   - Check for `CLAUDE_CONTEXT_ACTION_PLAN.json` in repository root
   - If not found: ERROR - "No action plan found. Run /ctx-create first."

2. **Progress file exists:**
   - Check for `CLAUDE_CONTEXT_PROGRESS.json` in repository root
   - If not found: ERROR - "No progress file found. Run /ctx-create first."

3. **Max projects provided:**
   - If $1 is not "--max-projects": ERROR - "Missing required parameter. Usage: /ctx-execute --max-projects <number>"
   - If $2 is not a number: ERROR - "Max projects must be a number"
   - If $2 is less than 1: ERROR - "Max projects must be at least 1"

## Important: File Path Requirements

**CRITICAL: All file paths stored in JSON files must be FULL paths, not relative paths.**

When writing to `CLAUDE_CONTEXT_ACTION_PLAN.json` or `CLAUDE_CONTEXT_PROGRESS.json`:
- File paths in `changedFiles` arrays must be full paths (e.g., `"/path/to/repo/src/file.js"`)
- File paths in `files` arrays within notes must be full paths
- File paths in `contextFiles` arrays must be full paths
- Project `path` fields should remain relative to repo root (e.g., `"./packages/project"`)

Example:
```json
{
  "files": [
    {"filePath": "/Users/username/repo/packages/api/src/index.js", "lines": "10-20"}
  ],
  "changedFiles": [
    "/Users/username/repo/packages/api/src/handler.js"
  ]
}
```

## Phase 1: Load Initial Context

**Load required files:**

1. **Load CLAUDE.TEMPLATE.md:**
   - Path: `${TEMPLATE_PATH}/CLAUDE.TEMPLATE.md`
   - This is the main template for the repository-level context file
   - Load this upfront as it's always needed
   - Parse instruction placeholders (~:...:~) to understand topics

   **If this template cannot be fetched:**
   - STOP IMMEDIATELY - indicates an installation or network problem
   - Inform the user:
     ```
     ❌ ERROR: Template file not accessible.
     The CLAUDE.TEMPLATE.md file could not be loaded from ${TEMPLATE_PATH}.
     ```
   - DO NOT PROCEED without the template
   - EXIT IMMEDIATELY without creating any files

2. **Load PROJECT.TEMPLATE.md:**
   - Path: `${TEMPLATE_PATH}/PROJECT.TEMPLATE.md`
   - This is the template for project-level context files
   - Load this upfront as it's needed for ALL projects
   - Parse instruction placeholders (~:...:~) to understand topics

   **If this template cannot be fetched:**
   - STOP IMMEDIATELY - indicates an installation or network problem
   - Inform the user:
     ```
     ❌ ERROR: Template file not accessible.
     The PROJECT.TEMPLATE.md file could not be loaded from ${TEMPLATE_PATH}.
     ```
   - DO NOT PROCEED without the template
   - EXIT IMMEDIATELY without creating any files

3. **Load action plan:**
   - Load `CLAUDE_CONTEXT_ACTION_PLAN.json`
   - Contains project list, dependencies, estimates
   - Note the project `status` field ("new", "updated", or "stable")
   - Note removedProjects array

4. **Load progress file:**
   - Load `CLAUDE_CONTEXT_PROGRESS.json`
   - Contains completed projects, next project, discoveries, claudeMdData

**CRITICAL: Do NOT load type-specific templates yet**

**DO NOT load these files in Phase 1:**
- ❌ DO NOT load `${TEMPLATE_PATH}/SERVICE.TEMPLATE.md`
- ❌ DO NOT load `${TEMPLATE_PATH}/CLIENT.TEMPLATE.md`
- ❌ DO NOT load `${TEMPLATE_PATH}/DATABASE.TEMPLATE.md`
- ❌ DO NOT load `${TEMPLATE_PATH}/LIBRARY.TEMPLATE.md`
- ❌ DO NOT load `${TEMPLATE_PATH}/IAC.TEMPLATE.md`

**Why:** Loading all type-specific templates upfront wastes ~40,000-50,000 tokens. These templates will be loaded on-demand in Step 2.4 when processing projects of each specific type.

**Only load them when needed:** When you encounter a project that needs SERVICE.TEMPLATE.md in Step 2.4, load it then. Not before.

**Note:** PROJECT.TEMPLATE.md is loaded upfront because it's needed for ALL projects.

**Calculate execution parameters:**
- Max projects: `$2` (from command argument)
- Identify next project from progress file

**Project counting approach:**
- Count how many projects have been completed in this execution
- Stop when you've processed `maxProjects` number of projects
- Simple: if `projectsProcessedThisExecution >= maxProjects`, stop before the next project

**Example:**
- Max projects: 10
- Completed this execution: 0 projects
- Process projects 1-10 sequentially
- After processing project #10, check: 10 >= 10 ✓ STOP

**IMPORTANT: Just start processing**
- Do NOT inform the user about repository size or how many executions it will take
- Do NOT ask the user for confirmation to proceed
- Do NOT wait for user input
- The user already knows the scope and has executed the command - just begin processing projects immediately

## Phase 2: Process Projects

**CRITICAL: Process projects ONE AT A TIME, sequentially:**
- DO NOT process multiple projects in parallel
- DO NOT use Task agents to process projects concurrently
- DO NOT batch projects together
- Process the next project from the action plan, complete it fully, update the progress file (Step 2.7), then loop back to Step 2.1 for the next project
- The term "batch" in this command refers to "this execution of /ctx-execute", not to processing multiple projects at once

**Why sequential processing is required:**
- Step 2.7 must update the progress file after EACH project
- The progress file tracks completed projects, which is needed for:
  - Token budget calculations (Step 2.1)
  - Resuming from interruptions
  - Phase 3 refinement (needs completedProjects array)
  - Creating main CLAUDE.md (needs full list of context files)
- Using Task agents bypasses Step 2.7, creating files that are never tracked in the progress file
- This breaks the entire workflow - files exist but the system doesn't know about them

FOR EACH project starting from `nextProject` in progress file:

### Step 2.1: Pre-Check Project Count

**Count projects processed in this execution:**
- Track how many projects you've completed since this `/ctx-execute` command started
- Initialize counter: `projectsProcessedThisExecution = 0`
- Check: `projectsProcessedThisExecution >= maxProjects`

**Decision:**
- IF `projectsProcessedThisExecution >= maxProjects`: STOP execution, skip to Phase 4
- IF `projectsProcessedThisExecution < maxProjects`: **PROCEED with this project**, continue to Step 2.2

**Example with max-projects 10:**
```
Max projects: 10
Projects processed this execution: 8
Check: 8 < 10 ✓ PROCEED
→ Continue to Step 2.2 and process this project
→ After completing, increment counter: projectsProcessedThisExecution = 9
```

**After processing max projects:**
```
Projects processed: 10
Check: 10 >= 10 ✓ STOP

Completed in this execution: 10 projects
Remaining: Y projects
Progress: Z% complete

Run /ctx-execute --max-projects 10 to continue
```

**Important:**
- Once you START a project, COMPLETE it even if it would exceed max projects
- Only stop BEFORE starting a new project, never abandon mid-processing
- The counter tracks projects completed **in this execution only**, not total completed projects
  - EXIT (skip to Phase 4: Final Steps)

### Step 2.2: Load Dependency Context

FOR ALL project statuses:
  - For each dependency in project.dependencies array:
    - Find that project in completedProjects
    - Load its context file(s) from progress file
    - Read the context files to understand the dependency
    - This provides context for analyzing current project

IF project.status is "updated" or "stable":
  - Load existing context file(s) for this project
  - Read current content to understand what exists

IF project.status is "updated":
  - Note the changedFiles array (focus analysis on these files)
  - Note the changeCommits array (understand what changed)

### Step 2.3: Analyze Project and Determine Type

**Determine project type (if not already determined):**

The project type defines what kind of context file to create. Analyze the project to determine its type(s):

**SERVICE** - Backend APIs, microservices, workers:
- Has API endpoints (Express, FastAPI, ASP.NET, etc.)
- Runs as a server/daemon
- Processes background jobs
- Examples: REST API, GraphQL server, message queue worker

**CLIENT** - User-facing interfaces:
- Web applications (React, Vue, Angular)
- Mobile applications
- Desktop applications
- Command-line interfaces (CLIs) that call external services
- Examples: Admin dashboard, mobile app, CLI tool

**LIBRARY** - Shared code, utilities, plugins:
- Provides reusable functionality
- Imported/used by other projects
- No independent execution
- Examples: Utility functions, shared components, plugins

**DATABASE** - Schema definitions, migrations:
- Database schema definitions
- Migration scripts
- ORM models
- Examples: Prisma schema, SQL migrations, TypeORM entities

**IAC** - Infrastructure as Code:
- Infrastructure definitions and configurations
- Cloud resource provisioning
- Infrastructure automation
- Examples: Terraform modules, CloudFormation templates, Pulumi projects, Ansible playbooks

**Multi-type examples:**
- A utility library that also provides a CLI → `["LIBRARY", "CLIENT"]`
- A service that defines database models → `["SERVICE", "DATABASE"]`
- Infrastructure code with helper scripts → `["IAC", "LIBRARY"]`

**Analyze project based on status:**

IF project.status is "new":
  - Analyze entire project directory
  - Read package.json, README.md, configuration files
  - Read key source files to understand purpose and architecture
  - Determine project type(s) based on analysis above
  - Store determined type(s) for Step 2.4

IF project.status is "updated":
  - Check if existing context file type is still accurate
  - Focus analysis on changedFiles from action plan
  - For each commit in changeCommits array, understand what changed
  - If project type changed (e.g., library became library+CLI), detect this
  - Store current type(s) for Step 2.4

IF project.status is "stable":
  - Check if any completed dependencies have changes that affect this project
  - IF dependencies changed in a way that impacts this project:
    - Analyze affected areas of this project
    - Prepare to update context file
  - ELSE:
    - Skip detailed analysis (no changes needed)
    - Record existing type(s) from context file for Phase 3 reference
    - Continue to Step 2.4 (will skip file creation)

### Step 2.4: Create/Update Context Files

**Handle context files based on project status:**

**IMPORTANT: Always create/update PROJECT.CLAUDE.md FIRST, then type-specific files.**

**Step 2.4a: Create/Update PROJECT.CLAUDE.md**

FOR ALL project statuses ("new", "updated", "stable"):

IF project.status is "new":
  - **Create new PROJECT.CLAUDE.md file: `{project.path}/PROJECT.CLAUDE.md`**
  - Use PROJECT.TEMPLATE.md loaded in Phase 1
  - **Extract and populate project metadata:**
    - **Project Name:** From manifest (package.json name, Cargo.toml name, etc.) or directory name
    - **Project Path:** Relative path from repository root (e.g., "./apps/user-service")
    - **Version:** From manifest.version field
    - **Status:** Detect using heuristics:
      - Check for "deprecated" in README, package.json keywords
      - Recent commits (< 1 month) = "active"
      - Recent commits (< 6 months) = "stable"
      - Older = "maintenance"
      - Default: "active"
    - **License:** From manifest.license field
    - **Project Overview:** From manifest.description or README summary
  - **Project Types:** List all types determined in Step 2.3 (e.g., ["SERVICE", "DATABASE"])
  - **Technical Documentation links:**
    - For each type, add @file reference to {TYPE}.CLAUDE.md
    - Example: `- **Service Implementation**: @file ./SERVICE.CLAUDE.md`
  - **Documentation Links:**
    - Check for README.md → add as `./README.md`
    - Check for CHANGELOG.md → add if exists
    - Check for docs/ directory → add if exists
    - Parse README for additional doc links (architecture docs, API docs, etc.)
  - **Ownership & Team:**
    - Parse CODEOWNERS file (if exists) for this project path
    - Extract maintainers from package.json maintainers/contributors fields
    - Extract contact info from package.json (bugs.url, repository.url, homepage)
  - **Project Relationships:**
    - **Depends On:** Analyze manifest dependencies, match to other projects in repo
    - **Used By:** Find projects that depend on this one
    - **Related:** Detect sibling/related projects (same parent dir, similar naming)
    - For each relationship, add @file reference to their PROJECT.CLAUDE.md
  - **Environments:**
    - Parse .env.example, .env.sample for PORT or URLs
    - Parse config files (config.js, config.json) for environment URLs
    - Parse README for deployment URLs or badges
    - Only include this section if URLs are detected, otherwise remove it
  - Include metadata:
    - Revision Date: current timestamp
    - Last commit SHA built from: current HEAD commit (40-character full SHA)
    - Template Version: (extract from PROJECT.TEMPLATE.md)
    - Project Types: Array of types (e.g., ["SERVICE", "DATABASE"])

IF project.status is "updated":
  - **Read existing PROJECT.CLAUDE.md file**
  - **CRITICAL: Identify and preserve user-added sections:**
    1. Load PROJECT.TEMPLATE.md to know standard sections
    2. Parse existing PROJECT.CLAUDE.md for all `##` level headings
    3. Identify user-added sections (headings NOT in template)
    4. Extract user-added content (full section until next `##` or `#`)
  - **Update project metadata if changed:**
    - Re-extract version, status, license from current manifest
    - Update project types if changed (add/remove types)
    - Update technical documentation links if types changed
    - Re-scan for new documentation files
    - Re-extract ownership information if changed
    - Re-analyze project relationships (dependencies may have changed)
    - Re-scan for environment URLs
  - **CRITICAL: Preserve user-added sections:**
    - Insert ALL user-added sections after "## Restricted Actions"
    - Before "# Agent File Maintenance"
    - Maintain exact heading text and content
    - Preserve original order
  - Update metadata:
    - Revision Date: current timestamp
    - Last commit SHA built from: current HEAD commit
    - Keep Template Version unchanged
    - Update Project Types array if types changed

IF project.status is "stable":
  - **Read existing PROJECT.CLAUDE.md file**
  - Check if dependencies changed (affecting Project Relationships section)
  - IF relationships need update:
    - **CRITICAL: Preserve user-added sections** (same as "updated")
    - Update only "Project Relationships" section
    - Update metadata (Revision Date, commit SHA)
  - ELSE:
    - Do NOT modify PROJECT.CLAUDE.md
    - Record existing file path for Phase 3 reference

**Step 2.4b: Create/Update Type-Specific Context Files**

IF project.status is "new":
  - FOR EACH type determined in Step 2.3:
    - **Load template for this TYPE if not already loaded:**
      - SERVICE → load `${TEMPLATE_PATH}/SERVICE.TEMPLATE.md`
      - CLIENT → load `${TEMPLATE_PATH}/CLIENT.TEMPLATE.md`
      - DATABASE → load `${TEMPLATE_PATH}/DATABASE.TEMPLATE.md`
      - LIBRARY → load `${TEMPLATE_PATH}/LIBRARY.TEMPLATE.md`
      - IAC → load `${TEMPLATE_PATH}/IAC.TEMPLATE.md`
      - If already loaded in memory, reuse it
    - **Create new context file: `{project.path}/{TYPE}.CLAUDE.md`**
      - **CRITICAL**: The filename MUST be `{TYPE}.CLAUDE.md` where TYPE is SERVICE, CLIENT, DATABASE, LIBRARY, or IAC
      - **Examples**: `SERVICE.CLAUDE.md`, `CLIENT.CLAUDE.md`, `DATABASE.CLAUDE.md`, `LIBRARY.CLAUDE.md`, `IAC.CLAUDE.md`
      - **WRONG**: Do NOT name it `CLAUDE_CONTEXT.md` or `CONTEXT.md` or `{projectName}.md`
      - **RIGHT**: If type is LIBRARY, filename is `LIBRARY.CLAUDE.md`
    - Use the template for this TYPE
    - Populate all sections based on template instructions
    - Include metadata:
      - Revision Date: current timestamp
      - Last commit SHA built from: current HEAD commit (40-character full SHA)
      - Template Version: (extract from template file)

IF project.status is "updated":
  - FOR EACH type determined in Step 2.3:
    - Read existing context file: `{project.path}/{TYPE}.CLAUDE.md`
      - **Remember**: filename is `{TYPE}.CLAUDE.md` (e.g., `SERVICE.CLAUDE.md`, `IAC.CLAUDE.md`)
    - **CRITICAL: Identify and preserve user-added sections:**
      1. **Load template for this TYPE** (to know which sections are standard)
      2. **Parse existing file** - extract all `##` level headings
      3. **Identify user-added sections** - any `##` heading NOT in the template
      4. **Extract user-added content** - full section including heading + content until next `##` or `#`
      5. **Store user-added sections** for preservation (see step below)
    - If type changed (new types added or removed):
      - Delete context files for removed types
      - For newly added types: **Load template if not already loaded** (same as "new" status above)
      - Create context files for newly added types (filename: `{TYPE}.CLAUDE.md`)
    - For existing types:
      - Update sections affected by changes in changedFiles
      - Keep sections that weren't affected by changes
      - **CRITICAL: Preserve user-added sections:**
        - Insert ALL user-added sections after "## Restricted Actions"
        - Before "# Agent File Maintenance"
        - Maintain exact heading text and content
        - Preserve original order
        - Add blank line between sections
      - Update metadata:
        - Revision Date: current timestamp
        - Last commit SHA built from: current HEAD commit (40-character full SHA)
        - Keep Template Version unchanged

IF project.status is "stable":
  - IF dependencies changed in a way that affects this project (determined in Step 2.3):
    - Read existing context file(s)
    - **CRITICAL: Preserve user-added sections** (same process as "updated" status):
      1. Load template to identify standard sections
      2. Parse existing file for all `##` headings
      3. Identify user-added sections (not in template)
      4. Extract and store user-added content
    - Update only the affected sections (usually Dependencies section)
    - **Preserve user-added sections** - insert after "## Restricted Actions", before "# Agent File Maintenance"
    - Update metadata:
      - Revision Date: current timestamp
      - Last commit SHA built from: current HEAD commit (40-character full SHA)
      - Keep Template Version unchanged
  - ELSE:
    - Do NOT modify context files
    - Record existing context file paths for Phase 3 reference

### Step 2.5: Take Notes for CLAUDE.md

WHILE analyzing project, look for information matching CLAUDE.TEMPLATE.md sections:

- Repository Overview
- High-Level Repository Information (project types, languages, frameworks)
- Repository Structure
- Code Organization Patterns
- Environment Setup (prerequisites, system config, external dependencies)
- Running the Application Locally
- Repository Verification (unit tests, linting)
- Documentation

WHEN you find relevant information:
- Add note to claudeMdData in progress file
- **IMPORTANT: Use FULL file paths in the files array**
- Structure:
  ```json
  {
    "fromProject": "current-project-id",
    "notes": [
      {
        "topic": "Environment Setup - Prerequisites",
        "files": [
          {"filePath": "/full/path/to/repo/packages/project/package.json", "lines": "3-5"}
        ],
        "note": "Requires Node.js v16.0.0 or higher"
      }
    ]
  }
  ```

### Step 2.6: Track Discoveries

IF you discover something unexpected:

**Missed Project:**
- Found imports from a project not in action plan
- Add to discoveries array:
  ```json
  {
    "type": "missed-project",
    "discoveredDuring": "current-project-id",
    "discoveredAt": "timestamp",
    "data": {
      "projectId": "discovered-project-id",
      "path": "./path/to/project",
      "evidence": ["file.js:12", "other.js:34"],
      "affectedProjects": ["current-project-id"],
      "addedToPlan": true
    }
  }
  ```
- Add new project to action plan immediately after current project
- Update current project's dependencies array
- Check all completed projects' context files for references
- Update affected project dependencies in action plan

**Deprecated Code:**
- Project appears abandoned or explicitly deprecated
- Add to discoveries array:
  ```json
  {
    "type": "deprecated-code",
    "discoveredDuring": "current-project-id",
    "discoveredAt": "timestamp",
    "data": {
      "projectId": "current-project-id",
      "lastModified": "date",
      "indicator": "reason for deprecation assessment",
      "migrationTarget": "replacement-project-id or null"
    }
  }
  ```

**Common Pattern:**
- Same configuration, architecture, or pattern across multiple projects
- Add to discoveries array:
  ```json
  {
    "type": "common-pattern",
    "discoveredDuring": "current-project-id",
    "discoveredAt": "timestamp",
    "data": {
      "pattern": "description of pattern",
      "occurrences": ["project-id-1", "project-id-2"],
      "relevantFor": "CLAUDE.md section name"
    }
  }
  ```

### Step 2.7: Update Progress File

After completing project:

1. Add to completedProjects (use FULL paths for contextFiles):
   ```json
   {
     "id": "project-id",
     "status": "new|updated|stable",
     "types": ["SERVICE"],
     "contextFiles": [
       {"type": "PROJECT", "path": "/full/path/to/repo/packages/project/PROJECT.CLAUDE.md"},
       {"type": "SERVICE", "path": "/full/path/to/repo/packages/project/SERVICE.CLAUDE.md"}
     ]
   }
   ```
   Note: Include status and types array for reference in Phase 3
   Note: PROJECT.CLAUDE.md is ALWAYS first in contextFiles array, followed by type-specific files

2. Update nextProject to next in action plan

3. Add any new notes to claudeMdData

4. Add any discoveries to discoveries array

5. Update action plan (if missed projects added)

6. Record estimated tokens for this project (from action plan)

7. Update lastUpdated timestamp

8. Save both progress file and action plan

### Step 2.8: Continue or Stop

- Check if more projects remain
- If yes: Loop to Step 2.1 for next project
- If no: Continue to Phase 3

## Phase 3: Refinement Phase

**This phase runs when all projects are complete.**

IF nextProject is null (all projects done):

### Step 3.1: Process Discoveries

FOR EACH discovery in discoveries array:

**IF discovery.type == "missed-project":**
- Load the newly created context file for missed project
- FOR EACH project in discovery.affectedProjects:
  - Re-read that project's context file(s)
  - Update with cross-references to missed project
  - Add notes about how it uses the dependency
  - Save updated context file

**IF discovery.type == "deprecated-code":**
- Ensure context file has prominent deprecation warning
- If migrationTarget exists:
  - Read migrationTarget's context file
  - Add note about legacy code that should be migrated
  - Save updated context file

**IF discovery.type == "common-pattern":**
- Review all occurrences in discovery.occurrences
- Synthesize pattern into claudeMdData
- Ensure consistency across affected project context files

**IF discovery.type == [other types]:**
- Handle appropriately based on discovery data

### Step 3.2: Create/Update Main CLAUDE.md

**CRITICAL: Preserve User-Added Content**

IF CLAUDE.md already exists (updating, not creating new):
1. **Read existing CLAUDE.md file**
2. **Identify user-added sections:**
   - Parse all `##` level headings in existing file
   - Compare against template headings
   - Any `##` heading NOT in template = user-added section
   - Extract full content of each user-added section (heading + all content until next `##` or `#`)
3. **Store user-added sections** for insertion in step 7 below

**Use CLAUDE.TEMPLATE.md structure:**

1. Use template loaded in Phase 1:
   - Process line by line

2. For each instruction placeholder (~:...:~):
   - Check claudeMdData for notes matching this topic
   - Synthesize notes from all projects into coherent content
   - Replace placeholder with synthesized content

3. For Projects section (NEW):
   - List ALL projects (from completedProjects in progress file)
   - Include projects with status "new", "updated", AND "stable"
   - Do NOT include projects from removedProjects array
   - Format: `- **Project Name**: @file ./path/to/PROJECT.CLAUDE.md`
   - Order by priority/dependency (libraries first, services last) or alphabetically
   - Each project appears once in this section

4. For project-type sections (Services, Clients, Libraries, Databases, IAC):
   - List all CURRENT projects (from completedProjects in progress file)
   - Include projects with status "new", "updated", AND "stable"
   - Do NOT include projects from removedProjects array
   - Format: `- **Project Name**: @file ./path/to/TYPE.CLAUDE.md`
   - Group by type, alphabetically within each group
   - For projects with multiple types, list them in each relevant section
   - **Important:** These sections reference TYPE-SPECIFIC files (SERVICE.CLAUDE.md, CLIENT.CLAUDE.md, etc.), NOT PROJECT.CLAUDE.md

5. Handle removed projects:
   - Do NOT reference removed projects in CLAUDE.md
   - Their context files should be deleted or ignored
   - If needed, add note in discoveries about removed projects

6. Update metadata section:
   - Revision Date: current timestamp
   - Last commit SHA built from: current HEAD commit (40-character full SHA)
   - Template Version: (extract from template file)

7. **CRITICAL: Preserve user-added sections (if updating existing file):**
   - After "## Restricted Actions" section
   - Before "# Agent File Maintenance" section
   - Insert ALL user-added sections that were identified above
   - Preserve exact heading text and content
   - Maintain original order of user-added sections
   - Add blank line between each section

8. Write CLAUDE.md to repository root

**Example of preserved user section:**
```markdown
## Restricted Actions

*(template content here)*

## Architecture Decisions

This section documents key architectural decisions made during development.
Decision records are maintained in the /docs/adr/ directory.

## Project History

(user's custom content preserved exactly as-is)

# Agent File Maintenance
```

## Phase 4: Final Steps

**Output summary:**

IF all projects complete (Phase 3 executed):
```
✓ Context generation complete!

Total projects: X
Context files created: Y

CLAUDE.md created at repository root.
```

ELSE (stopped due to max projects):
```
Execution complete. Processed maximum projects.

Completed in this execution: X projects
Remaining: Y projects
Progress: Z% complete

Run /ctx-execute --max-projects <number> to continue
```

**Exit successfully.**
