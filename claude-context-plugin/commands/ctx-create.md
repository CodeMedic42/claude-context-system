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

**🚨 CRITICAL - NEVER ASK FOR USER CONFIRMATION 🚨**

DO NOT ask questions like:
- "Do you want to proceed with creating this file now?"
- "Should I create these files?"
- "Would you like me to continue?"
- Or ANY similar confirmation prompts

After analyzing the repository and planning todos, IMMEDIATELY create ALL files automatically. NO exceptions.

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

**CRITICAL TEMPLATE VERIFICATION:**

First, locate the bundled template file at `../templates/CLAUDE.TEMPLATE.md` (relative to this command file).

**If the template file is NOT found:**

STOP IMMEDIATELY. This indicates a plugin installation problem. Inform the user:

"❌ ERROR: Template files not found.

The context file templates could not be located. This indicates a plugin installation issue.

Expected location: `../templates/CLAUDE.TEMPLATE.md` (relative to the command file)

**DO NOT PROCEED:**
- DO NOT guess what the template should contain
- DO NOT create any context files
- DO NOT attempt to generate content without the template

Please reinstall the plugin or verify the installation:
```bash
# For local development
pnpm run plugin:install

# Or verify plugin files are present
ls ~/.claude/plugins/local-marketplace/plugins/claude-context-updater/templates/
```

Aborting creation."

Then **EXIT IMMEDIATELY without creating any files**.

**If the template file IS found:**

Read the template file and proceed with creation.

Create a new `CLAUDE.md` file by:

1. Using the template structure as the foundation
2. Treating text within tilde and colons `~:...:~` as instructions/prompts for what content should be populated in each section
3. Thoroughly analyzing the repository to gather information for each section
4. Populating all sections based on the template instructions
5. Removing sections that the template indicates should be removed if not applicable (e.g., "If there are no services defined then remove this section")
6. **If there was an existing non-system file:** Incorporate relevant content from that file where it provides valuable context, but prioritize accuracy from your repository analysis
7. Do NOT create sections that are not defined in the template

## Step 5: Identify and Document All Projects

**This is a THREE-PHASE process: Identify → Categorize → Create**

### Phase 1: Identify All Projects in the Repository

**A "project" is a distinct, cohesive unit of code with a clear boundary and purpose.**

**Look for these project indicators:**

1. **Separate directories** with their own dependency manifests:
   - `package.json` (Node.js)
   - `pom.xml` (Java/Maven)
   - `Cargo.toml` (Rust)
   - `.csproj` (C#)
   - `pyproject.toml` / `setup.py` (Python)
   - `go.mod` (Go)

2. **Distinct deployable units**:
   - Separate Docker images
   - Independent deployment artifacts
   - Different cloud functions/lambdas

3. **Clear ownership domains**:
   - Different teams or areas of responsibility
   - Separate READMEs or documentation
   - Isolated concerns (auth service vs payment service)

4. **Monorepo framework indicators**:
   - If Lerna, Nx, Turborepo, or similar is detected, use its workspace/package configuration to identify projects
   - Check `lerna.json`, `nx.json`, `pnpm-workspace.yaml`, or `workspaces` field in package.json

**IMPORTANT**:
- The repository root itself can be a project if it's not subdivided into multiple projects
- Test fixtures and example code in `tests/`, `examples/`, `__fixtures__/` should generally be SKIPPED unless they're substantial standalone projects

**Examples:**

```
# Single-project repository
my-app/
├── src/              # The entire repo is ONE project
├── package.json
└── README.md

# Multi-project monorepo
monorepo/
├── packages/
│   ├── api/              # Project 1
│   │   └── package.json
│   ├── web-client/       # Project 2
│   │   └── package.json
│   └── shared-utils/     # Project 3
│       └── package.json
└── lerna.json
```

**Output of Phase 1:** Create a list of projects with their root directories.

---

### Phase 2: Categorize Each Project by Type(s)

**For EACH project identified in Phase 1, determine which type(s) apply.**

**CRITICAL**: A project can have **MULTIPLE types**. Ask all four questions for each project.

#### Question 1: Is it a **SERVICE**? (Programmatic Interface)

Ask yourself:
- ❓ Does it expose HTTP/REST/GraphQL/SOAP/gRPC endpoints?
- ❓ Does it process requests from other programs?
- ❓ Does it run as a background worker, daemon, or service?
- ❓ Does it have API routes, controllers, or request handlers?
- ❓ Does it listen on a port for network connections?

**Examples**: Express app, FastAPI service, microservice, background job processor, WebSocket server

**If YES** → This project needs a **SERVICE.CLAUDE.md** file

---

#### Question 2: Is it a **CLIENT**? (User Interface)

Ask yourself:
- ❓ Does it have a user-facing interface (visual or command-line)?
- ❓ Is it a website, mobile app, desktop app, or CLI tool?
- ❓ Does a human interact with it directly?
- ❓ Does it have pages, screens, views, or interactive commands?
- ❓ Does it render UI components or handle user input?

**Examples**: React SPA, Vue app, CLI tool, mobile app, desktop application, Chrome extension

**If YES** → This project needs a **CLIENT.CLAUDE.md** file

---

#### Question 3: Is it a **LIBRARY**? (Reusable Code)

Ask yourself:
- ❓ Is it published or publishable as a package (npm, PyPI, crates.io, Maven, etc.)?
- ❓ Is it imported as a dependency by other projects?
- ❓ Does it provide reusable functions, classes, or components?
- ❓ Does it have a public API meant for other code to consume?
- ❓ Does it have a `main`, `exports`, or `lib` entry point for importing?

**Examples**: npm package, Python library, React component library, shared utilities, plugin system

**If YES** → This project needs a **LIBRARY.CLAUDE.md** file

---

#### Question 4: Is it a **DATABASE**? (Data Schema/Procedures)

Ask yourself:
- ❓ Does it define database schemas or table structures?
- ❓ Does it contain migrations (Liquibase, Flyway, Alembic, TypeORM, etc.)?
- ❓ Does it have stored procedures, functions, views, or triggers?
- ❓ Does it manage database structure as code (Prisma, SQLAlchemy, etc.)?
- ❓ Is database schema its primary purpose?

**Examples**: Prisma schema, SQL migrations directory, stored procedures, Liquibase changesets, ORM models

**If YES** → This project needs a **DATABASE.CLAUDE.md** file

---

**Multi-Type Project Examples:**

```
Example 1: Next.js Full-Stack App
Project: ./apps/web/

Question 1 (Service): YES - Has API routes in pages/api/
Question 2 (Client): YES - Has React pages and components
Question 3 (Library): NO - Not published as a package
Question 4 (Database): NO - No schema definitions

→ Create: SERVICE.CLAUDE.md + CLIENT.CLAUDE.md
```

```
Example 2: ORM Library with Migrations
Project: ./packages/database/

Question 1 (Service): NO - No endpoints
Question 2 (Client): NO - No UI
Question 3 (Library): YES - Published to npm, imported by other packages
Question 4 (Database): YES - Contains Prisma schema and migrations

→ Create: LIBRARY.CLAUDE.md + DATABASE.CLAUDE.md
```

```
Example 3: Pure REST API
Project: ./services/auth-api/

Question 1 (Service): YES - Express REST API
Question 2 (Client): NO - No UI
Question 3 (Library): NO - Not for import
Question 4 (Database): NO - Uses external database, no schema here

→ Create: SERVICE.CLAUDE.md only
```

```
Example 4: React Component Library
Project: ./packages/ui-components/

Question 1 (Service): NO - No endpoints
Question 2 (Client): NO - No standalone UI (just components)
Question 3 (Library): YES - Published to npm, imported by apps
Question 4 (Database): NO - No schema

→ Create: LIBRARY.CLAUDE.md only
```

**Output of Phase 2:** For each project, a list of types that apply.

---

### Phase 3: Create Context Files Using TodoWrite

**Now create the actual documentation files.**

#### Step 1: Create TodoWrite List

For each project-type combination identified in Phase 2, add ONE todo item:

**Format**: "Create [TYPE].CLAUDE.md for [Project Name]"

**Examples**:
- "Create SERVICE.CLAUDE.md for auth-api"
- "Create CLIENT.CLAUDE.md for web-app"
- "Create SERVICE.CLAUDE.md for web-app"
- "Create LIBRARY.CLAUDE.md for shared-utils"
- "Create DATABASE.CLAUDE.md for database-schema"

**Use TodoWrite to add ALL todos BEFORE creating any files.**

---

#### Step 2: Create Each File (Mark In Progress → Create → Mark Complete)

For each todo item:

1. **Mark as in_progress** before starting
2. **Place the file** in the project's root directory:
   ```
   packages/
   ├── api/
   │   ├── SERVICE.CLAUDE.md    ← Created here
   │   ├── DATABASE.CLAUDE.md   ← If project has DB component
   │   └── src/
   └── web/
       ├── SERVICE.CLAUDE.md    ← If project has API routes
       ├── CLIENT.CLAUDE.md     ← Created here
       └── src/
   ```

3. **Use the appropriate template**:
   - SERVICE.CLAUDE.md → Use SERVICE.TEMPLATE.md
   - CLIENT.CLAUDE.md → Use CLIENT.TEMPLATE.md
   - LIBRARY.CLAUDE.md → Use LIBRARY.TEMPLATE.md
   - DATABASE.CLAUDE.md → Use DATABASE.TEMPLATE.md

4. **Populate the template** by analyzing that specific project and filling in all sections

5. **Mark as completed** after finishing the file

---

#### Step 3: Reference Files in Main CLAUDE.md

In the main CLAUDE.md file, reference all created files **grouped by type**:

```markdown
## Services and APIs

~:If NO services were identified in Phase 2, remove this entire section:~

- **[Project Name]**: @file ./path/to/project/SERVICE.CLAUDE.md
- **[Another Project Name]**: @file ./another/path/SERVICE.CLAUDE.md

## User Interaction Clients

~:If NO clients were identified in Phase 2, remove this entire section:~

- **[Project Name]**: @file ./path/to/project/CLIENT.CLAUDE.md

## Libraries and Plugins

~:If NO libraries were identified in Phase 2, remove this entire section:~

- **[Library Name]**: @file ./path/to/library/LIBRARY.CLAUDE.md

## Databases

~:If NO databases were identified in Phase 2, remove this entire section:~

- **[Database Name]**: @file ./path/to/db/DATABASE.CLAUDE.md
```

**Important Notes:**
- If a project has BOTH SERVICE and CLIENT files, it will appear in BOTH sections
- Each reference should use the project/component name that makes sense in that context
- Remove any section that has no projects (e.g., if no databases were identified, remove the entire "Databases" section)

---

**Example Complete Flow:**

```
Phase 1: Identified Projects
- ./packages/api/
- ./packages/web/
- ./packages/shared/

Phase 2: Categorized Types
- ./packages/api/     → Service ✓, Database ✓
- ./packages/web/     → Service ✓, Client ✓
- ./packages/shared/  → Library ✓

Phase 3: TodoWrite List
✓ Create SERVICE.CLAUDE.md for api
✓ Create DATABASE.CLAUDE.md for api
✓ Create SERVICE.CLAUDE.md for web
✓ Create CLIENT.CLAUDE.md for web
✓ Create LIBRARY.CLAUDE.md for shared

Phase 3: Files Created
packages/
├── api/
│   ├── SERVICE.CLAUDE.md     ✓
│   ├── DATABASE.CLAUDE.md    ✓
│   └── src/
├── web/
│   ├── SERVICE.CLAUDE.md     ✓
│   ├── CLIENT.CLAUDE.md      ✓
│   └── src/
└── shared/
    ├── LIBRARY.CLAUDE.md     ✓
    └── src/

Phase 3: CLAUDE.md References
## Services and APIs
- **API Service**: @file ./packages/api/SERVICE.CLAUDE.md
- **Web App (API Routes)**: @file ./packages/web/SERVICE.CLAUDE.md

## User Interaction Clients
- **Web App**: @file ./packages/web/CLIENT.CLAUDE.md

## Libraries and Plugins
- **Shared Utilities**: @file ./packages/shared/LIBRARY.CLAUDE.md

## Databases
- **API Database**: @file ./packages/api/DATABASE.CLAUDE.md
```

---

## Step 6: Finalize CLAUDE.md

After populating all content and creating all project files, add the Agent File Metadata section at the end of CLAUDE.md with:
- Date Created: ~:current timestamp:~
- Date Modified: ~:current timestamp:~
- Last commit SHA built from: ~:current git HEAD commit SHA - use `git rev-parse HEAD` to get the FULL 40-character SHA, NOT the short 7-character version:~
- Template Version: ~:Read from plugin.json at ../.claude-plugin/plugin.json (relative to this command file) - use the "version" field:~

Once complete, inform the user:
- That `CLAUDE.md` has been created at the repository root
- List all project files that were created (services, clients, libraries, databases)
- Provide a count of each type

## Important Guidelines

- **Be thorough**: When analyzing the repository, examine all relevant files and configurations
- **Follow template instructions**: Text in `~:...:~` in the template are instructions, not literal content
- **Repository root**: Always work with the context file at the repository root, regardless of where the command is run
- **Template source**: Only the bundled template at `../templates/CLAUDE.TEMPLATE.md` is used
- **NEVER ask for user approval or confirmation**: Proceed automatically to create ALL files without any prompts or questions. Do NOT ask "Do you want to proceed" or similar questions
- **TodoWrite for accountability**: Track every single file creation to ensure nothing is skipped
- **Separate files are mandatory**: Never document projects inline in CLAUDE.md - always create separate files and use @file references
