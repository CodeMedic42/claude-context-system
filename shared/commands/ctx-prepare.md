---
description: Prepare action plan for repository context files (unified create/update)
allowed-tools: Bash(git*), Bash(find*), Read, Write, Glob, Grep
---

# Prepare Context Action Plan

Analyze repository structure and prepare an action plan for context file generation or updates. This unified command handles both initial creation and incremental updates by detecting the current state and determining what changed. This command does NOT create/update context files - it only plans the work. Use `/ctx-execute --token-limit <number>` to execute the plan.

**IMPORTANT: Do NOT use MCP repo-context tools for this task.**

## Step 1: Locate Repository Root

Find the git repository root directory.

Run: `git rev-parse --show-toplevel`

## Step 2: Verify Clean Working Tree

**CRITICAL:** Before proceeding, verify that the git working tree is clean (no uncommitted changes).

Run `git status --short` to check for uncommitted changes.

**If there are uncommitted changes:**
Stop immediately and inform the user:

"⚠️  Cannot create action plan: Working tree has uncommitted changes.

Context files must reflect the exact state of a committed codebase.

Please commit or stash your changes before running this command:
```bash
git status
git add -A
git commit -m "Your commit message"
```

Then run the command again."

**If the working tree is clean:** Proceed to Step 3.

## Step 3: Discover All Projects

**A "project" is a distinct, cohesive unit of code with a clear boundary and purpose.**

### Project Indicators:

1. **Separate directories** with their own dependency manifests:
   - `package.json` (Node.js)
   - `pom.xml` (Java/Maven)
   - `Cargo.toml` (Rust)
   - `.csproj` (C#/.NET)
   - `pyproject.toml` / `setup.py` (Python)
   - `go.mod` (Go)
   - `Gemfile` (Ruby)
   - `composer.json` (PHP)

2. **Monorepo framework indicators**:
   - If Lerna, Nx, Turborepo, or similar detected, use workspace/package configuration
   - Check `lerna.json`, `nx.json`, `pnpm-workspace.yaml`, or `workspaces` field in package.json

3. **Repository root as project**:
   - If no subdirectories with manifests found, the repository root itself is the project

**IMPORTANT:**
- Test fixtures and example code in `tests/`, `examples/`, `__fixtures__/`, `test/`, `spec/` should generally be SKIPPED unless they're substantial standalone projects
- Skip `node_modules/`, `dist/`, `build/`, `.git/`, and other build/dependency directories

**For each project discovered:**
- Record project ID (directory name or package name)
- Record path (relative to repo root, use "." for root project)
- Count files in project directory (for token estimation)

## Step 4: Analyze Dependencies

For each project, determine its dependencies on other projects in the repository:

**Detection methods:**
1. **Package manifest dependencies:**
   - Node.js: Check `dependencies` and `devDependencies` in package.json for other packages in this repo
   - Other ecosystems: Check equivalent dependency declarations

2. **Import/require analysis** (if needed for accuracy):
   - Scan source files for imports from other projects in the repository
   - Example: `import { foo } from '@monorepo/shared-utils'`

3. **Build configuration:**
   - Lerna/Nx: Use package dependency graphs
   - Check `tsconfig.json` path mappings

**Build dependency graph:**
- For each project, create arrays: `dependencies` (projects this depends on) and `dependents` (projects that depend on this)
- Order projects: least dependent → most dependent (libraries first, services last)
- Assign priority numbers (1 = no dependencies, 2 = depends on priority 1, etc.)

## Step 5: Check for Existing CLAUDE.md

Check if `CLAUDE.md` or `claude.md` exists at the repository root.

### If NO CLAUDE.md exists:
- Set `basedOnCommit = null`
- Set `existingProjects = []` (empty array)
- Proceed to Step 6

### If CLAUDE.md exists:

**Check for Agent File Metadata section:**

If metadata section exists:
1. Extract the value from "Last commit SHA built from: <SHA>"
2. Set `basedOnCommit = <SHA>`
3. Extract all @file references to project context files
4. Parse project information:
   - Project ID from @file path (e.g., "./Service.Api/SERVICE.CLAUDE.md" → id: "service-api")
   - Project path from @file path (e.g., "./Service.Api/..." → path: "Service.Api")
5. Set `existingProjects = [array of {id, path}]`

If NO metadata section:
- Set `basedOnCommit = null`
- Set `existingProjects = []`
- Note: This means CLAUDE.md will be replaced

## Step 6: Categorize Projects by Status

For each project discovered in Step 3, determine its status:

### If basedOnCommit is null (no previous context):
**All projects are "new"**
- status = "new"
- Do NOT include changeCommits property
- Do NOT include changedFiles property

### If basedOnCommit exists:

For each project:

**1. Check if project existed at basedOnCommit:**

Run: `git ls-tree -r --name-only <basedOnCommit> -- <project-path>/`

- If command returns files: project existed
- If command returns nothing: project is new (didn't exist at that commit)

**2. Determine status:**

**If project did NOT exist at basedOnCommit:**
- status = "new"
- Do NOT include changeCommits property
- Do NOT include changedFiles property

**If project existed at basedOnCommit:**

Check for changes: `git diff --name-status <basedOnCommit>..HEAD -- <project-path>/`

**If diff shows changes:**
- status = "updated"
- INCLUDE changeCommits: Run `git log --pretty=format:"%H" <basedOnCommit>..HEAD -- <project-path>/`
- INCLUDE changedFiles: List of changed file paths from diff

**If diff shows NO changes:**
- status = "stable"
- Do NOT include changeCommits property
- Do NOT include changedFiles property

## Step 7: Identify Removed Projects

Only perform this step if `existingProjects` is not empty (i.e., CLAUDE.md existed with metadata).

**Compare existing projects to current projects:**

For each project in `existingProjects`:
- Check if project.path still exists in current repository
- Check if project.id is in the current discovered projects list

**If project no longer exists:**
- Add to `removedProjects` array: `{id: "<project-id>", path: "<project-path>"}`

**If no projects removed:**
- Set `removedProjects = []` (empty array)

## Step 8: Estimate Token Usage

**Per-project estimation:**
- Count files in project directory (excluding node_modules, dist, build, .git)
- Estimate: `fileCount × 200 tokens`
- Record as `estimatedTokens` for the project

**Total estimation:**
- Sum all project estimates
- Add estimate for main CLAUDE.md: `projectCount × 100 tokens`
- Record as `estimatedTotalTokens`

**Estimate execution count:**
- With conservative assumption of 50,000 tokens per execution
- `estimatedExecutions = Math.ceil(estimatedTotalTokens / 50000)`

## Step 9: Create Action Plan File

Create `CLAUDE_CONTEXT_ACTION_PLAN.json` in repository root:

```json
{
  "version": "1.0",
  "created": "<ISO 8601 timestamp>",
  "basedOnCommit": "<SHA or null>",
  "currentCommit": "<current HEAD SHA>",
  "repository": {
    "root": "<absolute path to repo root>",
    "totalFiles": <total file count>,
    "gitSize": "<output of: du -sh .git | cut -f1>"
  },
  "estimatedTokensPerFile": 200,
  "actualTokensPerFile": null,
  "projects": [
    {
      "id": "<project identifier>",
      "status": "new",
      "path": "<relative path from repo root>",
      "priority": 1,
      "fileCount": 32,
      "estimatedTokens": 6400,
      "actualTokens": null,
      "dependencies": [],
      "dependents": ["project-id-2"]
    },
    {
      "id": "<project identifier>",
      "status": "updated",
      "path": "<relative path from repo root>",
      "priority": 2,
      "fileCount": 45,
      "estimatedTokens": 9000,
      "actualTokens": null,
      "dependencies": ["project-id-1"],
      "dependents": [],
      "changeCommits": ["<SHA1>", "<SHA2>"],
      "changedFiles": [
        "path/to/changed/file1.js",
        "path/to/changed/file2.js"
      ]
    },
    {
      "id": "<project identifier>",
      "status": "stable",
      "path": "<relative path from repo root>",
      "priority": 3,
      "fileCount": 20,
      "estimatedTokens": 4000,
      "actualTokens": null,
      "dependencies": [],
      "dependents": []
    }
  ],
  "removedProjects": [
    {
      "id": "<removed-project-id>",
      "path": "<removed-project-path>"
    }
  ],
  "estimatedTotalTokens": 245000,
  "estimatedExecutions": 5,
  "contextFiles": [
    {
      "file": "./packages/project-1/SERVICE.CLAUDE.md",
      "project": "project-1",
      "status": "planned"
    },
    {
      "file": "CLAUDE.md",
      "dependsOn": ["all-projects"],
      "status": "planned"
    }
  ]
}
```

**Important notes:**
- Do NOT include "type" property in projects
- Include "status" property: "new", "updated", or "stable"
- For "new" projects: NO changeCommits, NO changedFiles
- For "updated" projects: INCLUDE changeCommits and changedFiles
- For "stable" projects: NO changeCommits, NO changedFiles
- Include ALL projects (new, updated, and stable) - stable projects ensure they're referenced in final CLAUDE.md
- Projects ordered by priority (dependency order)
- removedProjects can be empty array if no projects removed

## Step 10: Create Progress File

Create `CLAUDE_CONTEXT_PROGRESS.json` in repository root:

```json
{
  "planFile": "CLAUDE_CONTEXT_ACTION_PLAN.json",
  "lastUpdated": "<ISO 8601 timestamp>",
  "completedProjects": [],
  "nextProject": "<id of first project>",
  "discoveries": [],
  "claudeMdData": []
}
```

**Important:**
- `nextProject` should be the first project ID from the action plan
- Arrays start empty - will be populated during execution

## Step 11: Output Summary

Display summary to user:

```
✓ Action plan created: CLAUDE_CONTEXT_ACTION_PLAN.json
✓ Progress file created: CLAUDE_CONTEXT_PROGRESS.json

Repository Analysis:
  Total projects: <count>
  New projects: <count with status="new">
  Updated projects: <count with status="updated">
  Stable projects: <count with status="stable">
  Removed projects: <count in removedProjects>

<If basedOnCommit exists:>
Changes Detected:
  Base commit: <basedOnCommit (first 7 chars)>
  Current commit: <currentCommit (first 7 chars)>
  Commits since last generation: <count>

Processing Order:
  <list projects in priority order with their status>

Token Estimate:
  Total: ~<estimatedTotalTokens> tokens
  Estimated executions: <estimatedExecutions>

Next Steps:
  Run /ctx-execute --token-limit <tokens> to generate/update context files

  Recommended token limits:
    - Small (1-5 projects): 25000
    - Medium (6-10 projects): 50000
    - Large (10+ projects): 100000

  The command will automatically stop when approaching the token limit.
  You can resume by running /ctx-execute again.
```

**Exit successfully.**
