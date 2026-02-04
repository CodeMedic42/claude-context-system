---
description: Prepare action plan for repository context files (unified create/update)
allowed-tools: Bash(git*), Bash(find*), Read, Write, Glob, Grep
---

# Prepare Context Action Plan

Analyze repository structure and prepare an action plan for context file generation or updates. This unified command handles both initial creation and incremental updates by detecting the current state and determining what changed. This command does NOT create/update context files - it only plans the work. Use `/ctx-execute --max-projects <number>` to execute the plan.

**IMPORTANT: Do NOT use MCP repo-context tools for this task.**

## Important: File Path Requirements

**CRITICAL: All file paths stored in JSON files must be FULL paths, not relative paths.**

When writing to `CLAUDE_CONTEXT_ACTION_PLAN.json`:
- File paths in `changedFiles` arrays must be full paths (e.g., `"/path/to/repo/src/file.js"`)
- Project `path` fields should remain relative to repo root (e.g., `"./packages/project"`)

Example:
```json
{
  "changedFiles": [
    "/Users/username/repo/packages/api/src/handler.js",
    "/Users/username/repo/packages/api/src/routes.js"
  ],
}
```

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

**GOAL:** Identify all projects within the repository so that we can build context information for all of them.

### What is a Project?

A **project** is a grouping of common tools or business functionality together with a purpose. This includes:
- Libraries and frameworks
- Services and applications
- Test suites and test infrastructure
- Build tools and configuration projects (used within the repo)
- Any cohesive unit of code with a clear purpose

**Key principle: When in doubt, if it has an identifying file, it's a project.**

### How to Identify Projects

**1. Look for identifying files (project manifest files):**

These files indicate a project exists at that location. Examples include (but are not exhaustive):
- **JavaScript/Node**: `package.json`
- **Rust**: `Cargo.toml`
- **Java**: `pom.xml`, `build.gradle`, `build.gradle.kts`
- **C#/.NET**: `*.csproj`, `*.sln`, `*.fsproj`, `*.vbproj`
- **Go**: `go.mod`
- **Python**: `pyproject.toml`, `setup.py`, `requirements.txt`
- **Ruby**: `Gemfile`
- **PHP**: `composer.json`
- **Other**: `Makefile`, `CMakeLists.txt`, `Package.swift`, `mix.exs`, `build.sbt`

**Note:** This list helps you understand what we mean by "identifying files" but is not exhaustive. Use your judgment for other languages and ecosystems.

**2. Don't rely solely on workspace/solution configurations:**

If you find workspace or solution files (e.g., `package.json` with `workspaces`, `*.sln`, `lerna.json`, `nx.json`, `pnpm-workspace.yaml`):
- Use them as a starting point to discover projects
- **BUT** continue searching the repository - don't assume that's the only workspace/solution
- Don't assume because you found a workspace/solution that there are no more workspaces/solutions, keep looking around
- Don't assume because you found a workspace/solution that there are not satellite projects defined outside them, keep looking around
- Search outside the declared workspace paths

**3. Handle nested workspaces:**

After finding projects via a workspace configuration, recursively check subdirectories for their own workspace configurations. Repositories can have nested monorepos.

**4. Search constraints:**

- **Depth limit**: Search up to 3-4 directory levels deep from the repository root
- **Skip dependency/build folders**: Ignore folders that typically contain dependencies or build outputs

Examples of folders to skip (use judgment for others):
- `node_modules/` (Node.js)
- `vendor/` (PHP, Go)
- `target/` (Rust, Java)
- `build/`, `dist/`, `out/` (build outputs)
- `.git/`, `.github/` (version control)
- `__pycache__/`, `.venv/`, `venv/` (Python)
- `bin/`, `obj/` (.NET)

**5. Special cases:**

- **Single-project repository**: If you only find identifying files at the repository root and no subdirectory projects, the entire repository is a single project
- **Private packages**: Include packages marked with `"private": true` - they are still projects

### Build Review List

**Create an in-memory list of all discovered projects.**

For each project, record:
- Project ID (directory name or package name from manifest)
- Path (use absolute path)
- File count (for token estimation - count files in project directory, excluding dependency folders)

## Step 4: Analyze Dependencies

For each project in the review list, determine its dependencies on other projects in the repository.

**Read dependencies from manifest files only:**

- **Node.js**: Read `package.json` and check `dependencies`, `devDependencies`, and `peerDependencies`
- **Rust**: Read `Cargo.toml` and check `[dependencies]` and `[dev-dependencies]` sections
- **Java/Maven**: Read `pom.xml` and check `<dependencies>` section
- **Other ecosystems**: Read the equivalent dependency declarations from manifest files

**Match dependencies to projects in the repository:**

- For each dependency listed, check if it matches any project in the review list (by name or ID)
- If it matches, add it to the project's `dependencies` array

**Build dependency graph:**

- For each project, create `dependencies` array (projects this depends on)
- Calculate `dependents` array (projects that depend on this one)
- Order projects: least dependent → most dependent (libraries first, services last)
- Assign priority numbers (1 = no dependencies, 2 = depends on priority 1, etc.)

**Important:**
- Only read manifest files. Do NOT scan source code or analyze imports.
- Do NOT create temporary scripts to perform this analysis. Simply read the manifest files directly.

## Step 5: Check for Existing CLAUDE.md and Add to Review List

Check if `CLAUDE.md` or `claude.md` exists at the repository root.

### If NO CLAUDE.md exists:
- Set `basedOnCommit = null`
- The review list from Step 3 is complete
- Proceed to Step 6

### If CLAUDE.md exists:

**Check for Agent File Metadata section:**

If metadata section exists:
1. Extract the value from "Last commit SHA built from: <SHA>"
2. Set `basedOnCommit = <SHA>`
3. Extract all @file references to project context files
4. Parse project information from each @file reference:
   - Project path from @file path (e.g., `@file ./packages/foo/SERVICE.CLAUDE.md` → path: `./packages/foo`)
   - Project ID from path (e.g., `./packages/foo` → id: `foo`)

5. **Add missing projects to review list:**
   - For each project found in CLAUDE.md:
     - Check if project path is already in the review list (from Step 3)
     - If NOT in review list: Check if the folder still exists and looks like a project (has identifying files)
     - Add it to the review list (even if folder doesn't exist - we'll categorize it as removed later)

If NO metadata section:
- Set `basedOnCommit = null`
- The review list from Step 3 is complete
- Note: CLAUDE.md will be replaced since it has no metadata

## Step 6: Categorize Projects from Review List

Now categorize each project in the review list based on whether `basedOnCommit` exists.

### If basedOnCommit is null (no previous CLAUDE.md):

**All projects in review list are "new":**
- Mark all projects with status = "new"
- Do NOT include changeCommits property
- Do NOT include changedFiles property
- Skip to Step 7

### If basedOnCommit exists (updating existing CLAUDE.md):

For each project in the review list, determine its category:

**1. Check if project existed at basedOnCommit:**

Run: `git ls-tree -r --name-only <basedOnCommit> -- <project-path>/`

**If project did NOT exist at basedOnCommit:**
- This is a new project, but don't categorize it yet (will be done in Step 7)
- Continue to next project

**If project existed at basedOnCommit:**

**2. Check if project still exists now:**

- Check if project folder exists in current repository
- Check if it still has identifying files (looks like a project)

**If project NO LONGER exists or doesn't look like a project:**
- status = "removed"
- Continue to next project

**If project still exists:**

**3. Check for changes:**

Run: `git diff --name-status <basedOnCommit>..HEAD -- <project-path>/`

**If diff shows changes:**
- status = "updated"
- INCLUDE changeCommits: Run `git log --pretty=format:"%H" <basedOnCommit>..HEAD -- <project-path>/`
- INCLUDE changedFiles: List of changed file paths from diff (**use FULL paths, not relative**)

**If diff shows NO changes:**
- status = "stable"
- Do NOT include changeCommits property
- Do NOT include changedFiles property

**4. Special case - Detect renames and moves:**

For projects marked "removed", check git history to see if they were renamed or moved:

Run: `git log --follow --name-status --pretty=format:"%H" <basedOnCommit>..HEAD -- <old-project-path>/`

- Look for `R` (rename) operations in the output
- Check if any projects in review list might be the renamed version
- If you find existing context files (e.g., `SERVICE.CLAUDE.md`, `LIBRARY.CLAUDE.md`) in the new location, this is likely a rename
- If confident it's a rename: update the project status from "removed" to "updated" and update its path
- If uncertain: keep it as "removed" and let the new location be marked as "new"

**5. Special case - Detect splits and merges:**

For projects that seem related (similar names, shared code):

Run: `git log --stat <basedOnCommit>..HEAD -- <project-paths>`

- Look for patterns of code moving between projects
- Check for existing context files in multiple locations
- If you detect a split (one project became multiple): mark old as "removed", new ones as "new"
- If you detect a merge (multiple became one): mark old ones as "removed", merged one as "updated"
- If uncertain: don't make assumptions, use default categorization

## Step 7: Mark Remaining Projects as New

Any project in the review list that has NOT been categorized yet should be marked as:
- status = "new"
- Do NOT include changeCommits property
- Do NOT include changedFiles property

## Step 8: Separate Removed Projects

Create the `removedProjects` array:

1. Find all projects with status = "removed"
2. For each removed project, add to array: `{id: "<project-id>", path: "<project-path>"}`
3. Remove these projects from the review list

If no projects were removed:
- Set `removedProjects = []` (empty array)

## Step 9: Order Projects by Dependencies

Now that we have all projects categorized (new, updated, stable), order them by dependency priority:

**For projects in the review list (excluding removed projects):**

1. Analyze dependencies between projects (as described in Step 4)
2. Order projects: least dependent → most dependent (libraries first, services last)
3. Assign priority numbers:
   - Priority 1 = no dependencies on other projects in repo
   - Priority 2 = depends only on priority 1 projects
   - Priority 3 = depends on priority 1 or 2 projects
   - And so on...

This ordering ensures dependencies are built before dependents during context generation.

## Step 10: Estimate Token Usage (Reference Only)

**Note:** Token estimates are for user reference to understand project sizes. The `/ctx-execute` command uses `--max-projects` to control execution, not token limits.

**Per-project estimation:**
- Count files in project directory (excluding node_modules, dist, build, .git)
- Estimate: `fileCount × 200 tokens`
- Record as `estimatedTokens` for the project

**Total estimation:**
- Sum all project estimates
- Add estimate for main CLAUDE.md: `projectCount × 100 tokens`
- Record as `estimatedTotalTokens`

**Suggested max-projects value:**
- For small repos (< 10 projects): Start with `--max-projects 5`
- For medium repos (10-30 projects): Start with `--max-projects 10`
- For large repos (30+ projects): Start with `--max-projects 10-20`
- Users can adjust based on their needs and Claude Code's context limits

## Step 11: Create Action Plan File

Create `CLAUDE_CONTEXT_ACTION_PLAN.json` in repository root.

**The `projects` array contains all projects from the review list (new, updated, stable) ordered by dependency priority.**

**The `removedProjects` array contains projects that were in CLAUDE.md but no longer exist.**

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
        "/full/path/to/repo/path/to/changed/file1.js",
        "/full/path/to/repo/path/to/changed/file2.js"
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

## Step 12: Create Progress File

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

## Step 13: Output Summary

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

Token Estimate (Reference):
  Total: ~<estimatedTotalTokens> tokens (for reference only)
  Average per project: ~<estimatedTotalTokens / projectCount> tokens

Next Steps:
  Run /ctx-execute --max-projects <number> to generate/update context files

  Suggested starting values:
    - Small repos (< 10 projects): --max-projects 5
    - Medium repos (10-30 projects): --max-projects 10
    - Large repos (30+ projects): --max-projects 10-20

  Note: Adjust based on your needs. Smaller values = more frequent iterations, larger values = fewer runs but longer execution time.

  The command will automatically stop when approaching the token limit.
  You can resume by running /ctx-execute again.
```

**Exit successfully.**
