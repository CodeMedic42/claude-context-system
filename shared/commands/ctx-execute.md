---
description: Execute context file generation from action plan with token-bounded batching
argument-hint: --token-limit <number>
allowed-tools: Bash(git*), Bash(find*), Bash(mkdir*), Read, Write, Edit, Glob, Grep
---

# Context Execution Command

Execute context file generation based on an action plan created by `/ctx-prepare`, `/ctx-create`, or `/ctx-update`.

**Required Parameter:** `--token-limit <number>` - Maximum tokens to consume per execution

**Operation:** $1 (should be "--token-limit")
**Token Limit:** $2 (number of tokens)

## Prerequisites

Before proceeding, verify:

1. **Action plan exists:**
   - Check for `CLAUDE_CONTEXT_ACTION_PLAN.json` in repository root
   - If not found: ERROR - "No action plan found. Run /ctx-create first."

2. **Progress file exists:**
   - Check for `CLAUDE_CONTEXT_PROGRESS.json` in repository root
   - If not found: ERROR - "No progress file found. Run /ctx-create first."

3. **Token limit provided:**
   - If $1 is not "--token-limit": ERROR - "Missing required parameter. Usage: /ctx-execute --token-limit <number>"
   - If $2 is not a number: ERROR - "Token limit must be a number"
   - If $2 is less than 10000: ERROR - "Token limit too low. Minimum: 10000 tokens"

## Phase 1: Load Template Context

**CRITICAL TEMPLATE VERIFICATION:**

This tool uses specialized template files which define the structure of context files which will be created.

There 5 template files you should be able to find. You will fetch and load these files. If the path to these files requires you to load them from the web then you will do this.

- ${TEMPLATE_PATH}/CLAUDE.TEMPLATE.md
- ${TEMPLATE_PATH}/SERVICE.TEMPLATE.md
- ${TEMPLATE_PATH}/CLIENT.TEMPLATE.md
- ${TEMPLATE_PATH}/DATABASE.TEMPLATE.md
- ${TEMPLATE_PATH}/LIBRARY.TEMPLATE.md

**If the template file cannot be fetched:**

STOP IMMEDIATELY. This indicates an installation, network, or repository problem. Inform the user:

```
❌ ERROR: Template files not accessible.

The context file templates could not be loaded from ${TEMPLATE_PATH}.
```

**DO NOT PROCEED:**
- You will NOT guess what the template should contain
- You will NOT create any context files
- You will NOT attempt to generate content without the template

Then **EXIT IMMEDIATELY without creating any files**.

**Load required files:**

1. Template files:
   - These template files define what information to track
   - Parse instruction placeholders (~:...:~) to understand topics

2. Load `CLAUDE_CONTEXT_ACTION_PLAN.json`
   - Contains project list, dependencies, estimates
   - Note the project `status` field ("new", "updated", or "stable")
   - Note removedProjects array

3. Load `CLAUDE_CONTEXT_PROGRESS.json`
   - Contains completed projects, next project, discoveries, claudeMdData

**Calculate execution parameters:**
- Safety threshold: `$2 * 0.9` (stop at 90% of token limit)
- Initialize token counter: `currentTokens = 0`
- Identify next project from progress file

## Phase 2: Process Projects

FOR EACH project starting from `nextProject` in progress file:

### Step 2.1: Pre-Check Token Budget

BEFORE starting this project:
- Check: `currentTokens + project.estimatedTokens > safetyThreshold`
- IF TRUE:
  - STOP execution (don't start this project)
  - OUTPUT summary:
    ```
    Token limit approaching. Stopping before next project.

    Completed this batch: X projects
    Remaining: Y projects
    Progress: Z% complete

    Run /ctx-execute --token-limit <number> to continue
    ```
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

**Multi-type examples:**
- A utility library that also provides a CLI → `["LIBRARY", "CLIENT"]`
- A service that defines database models → `["SERVICE", "DATABASE"]`

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

IF project.status is "new":
  - FOR EACH type determined in Step 2.3:
    - Create new context file: `{project.path}/{TYPE}.CLAUDE.md`
    - Use template loaded in Phase 1 for this TYPE
    - Populate all sections based on template instructions
    - Include metadata:
      - Revision Date: current timestamp
      - Last commit SHA built from: current HEAD commit (40-character full SHA)
      - Template Version: (extract from template file)

IF project.status is "updated":
  - FOR EACH type determined in Step 2.3:
    - Read existing context file: `{project.path}/{TYPE}.CLAUDE.md`
    - If type changed (new types added or removed):
      - Delete context files for removed types
      - Create context files for newly added types
    - For existing types:
      - Update sections affected by changes in changedFiles
      - Keep sections that weren't affected by changes
      - Update metadata:
        - Revision Date: current timestamp
        - Last commit SHA built from: current HEAD commit (40-character full SHA)
        - Keep Template Version unchanged

IF project.status is "stable":
  - IF dependencies changed in a way that affects this project (determined in Step 2.3):
    - Read existing context file(s)
    - Update only the affected sections (usually Dependencies section)
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
- Structure:
  ```json
  {
    "fromProject": "current-project-id",
    "notes": [
      {
        "topic": "Environment Setup - Prerequisites",
        "files": [
          {"filePath": "./packages/project/package.json", "lines": "3-5"}
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

1. Add to completedProjects:
   ```json
   {
     "id": "project-id",
     "status": "new|updated|stable",
     "types": ["SERVICE"],
     "contextFiles": [
       {"type": "SERVICE", "path": "./packages/project/SERVICE.CLAUDE.md"}
     ]
   }
   ```
   Note: Include status and types array for reference in Phase 3

2. Update nextProject to next in action plan

3. Add any new notes to claudeMdData

4. Add any discoveries to discoveries array

5. Update action plan (if missed projects added)

6. Update actualTokens field for this project

7. Update lastUpdated timestamp

8. Save both progress file and action plan

### Step 2.8: Update Token Counter

- Calculate actual tokens consumed for this project
- Update: `currentTokens += actualTokens`
- Calculate refined estimate: `actualTokensPerFile = totalActual / totalFiles`
- Use for remaining projects

### Step 2.9: Continue or Stop

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

**Use CLAUDE.TEMPLATE.md structure:**

1. Use template loaded in Phase 1:
   - Process line by line

2. For each instruction placeholder (~:...:~):
   - Check claudeMdData for notes matching this topic
   - Synthesize notes from all projects into coherent content
   - Replace placeholder with synthesized content

3. For project-type sections (Services, Clients, Libraries, Databases):
   - List all CURRENT projects (from completedProjects in progress file)
   - Include projects with status "new", "updated", AND "stable"
   - Do NOT include projects from removedProjects array
   - Format: `- **Project Name**: @file ./path/to/TYPE.CLAUDE.md`
   - Group by type, alphabetically within each group
   - For projects with multiple types, list them in each relevant section

4. Handle removed projects:
   - Do NOT reference removed projects in CLAUDE.md
   - Their context files should be deleted or ignored
   - If needed, add note in discoveries about removed projects

5. Update metadata section:
   - Revision Date: current timestamp
   - Last commit SHA built from: current HEAD commit (40-character full SHA)
   - Template Version: (extract from template file)

6. Write CLAUDE.md to repository root

## Phase 4: Final Steps

**Output summary:**

IF all projects complete (Phase 3 executed):
```
✓ Context generation complete!

Total projects: X
Context files created: Y
Tokens consumed: ~Z

CLAUDE.md created at repository root.
```

ELSE (stopped due to token limit):
```
Batch complete. Stopped at token threshold.

Completed this batch: X projects (A tokens)
Remaining: Y projects (~B tokens estimated)
Progress: Z% complete

Run /ctx-execute --token-limit <number> to continue
```

**Exit successfully.**
