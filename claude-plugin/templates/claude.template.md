# Repository Agent Context

## Repository Summary

{Brief description of what this service does and its purpose within the organization}

## High-Level Repository Information

- **Project Types**: {List all project types, e.g. Node express service, Node Front End client, .Net service, etc. }
- **Languages**: {List all languages used in this repository, e.g. Java 17, .Net 9, Javascript, go, python, etc.}
- **Frameworks/Libraries**: {Key frameworks, libraries, and versions}

## Repository Structure

{Create an ascii based directory tree of the repository structure. Be sure to add a 5 word max comment for each file/directory describing it. Ignore any files or directories which are specified via any .gitingore files.}

## Code Organization Patterns

{Describe the high-level architectural patterns and code organization used in this repository}
- **Architecture**: {e.g., "Monorepo with multiple services", "Single application", "Microservices", "Modular monolith"}
- **Project organization**: {Describe how projects/modules are organized}
- **Common patterns**: {Describe any architectural patterns used across projects - e.g., "All services use layered architecture", "Shared libraries in /packages"}
- **Naming conventions**: {Describe file/folder naming conventions}

═══════════════════════════════════════════════════════════
# PROJECT DOCUMENTATION RULES
═══════════════════════════════════════════════════════════

⛔ **READ THIS SECTION COMPLETELY BEFORE PROCEEDING TO ANY PROJECT-TYPE SECTIONS BELOW**

This section defines MANDATORY rules for documenting projects in this repository. These rules apply EQUALLY and WITHOUT EXCEPTION to ALL of the following project-type sections:
1. Services and APIs
2. User Interaction Clients
3. Libraries and Plugins
4. Databases

{If you add a 5th project type in the future, these same rules apply to it as well.}

---

## RULE #1: SEPARATE FILES ARE MANDATORY - NO INLINE DOCUMENTATION

⛔ **ABSOLUTE PROHIBITION - NO EXCEPTIONS - NO EXCUSES**

You are ABSOLUTELY FORBIDDEN from writing project details inline in this claude.md file for ANY of the four project-type sections (Services, Clients, Libraries, Databases).

**WHAT THIS MEANS:**
- If you identify a service, you MUST create a separate service.claude.md file
- If you identify a client, you MUST create a separate client.claude.md file
- If you identify a library, you MUST create a separate library.claude.md file
- If you identify a database, you MUST create a separate database.claude.md file

**WHAT IS FORBIDDEN:**
- Writing installation instructions in claude.md
- Writing API endpoint lists in claude.md
- Writing usage examples in claude.md
- Writing configuration details in claude.md
- Writing ANY project-specific details in claude.md

**ONLY PERMITTED FORMAT IN CLAUDE.MD:**
```markdown
- **Project Name**: @file ./path/to/type.claude.md
```

**WHY THIS RULE EXISTS:**
Inline documentation breaks the modular system. Future agents need to navigate directly to specific project context via @file references. If you write inline documentation, you destroy the system's ability to:
- Load only the context needed
- Update projects independently
- Maintain documentation as projects evolve separately

**VIOLATION CONSEQUENCES:**
If you write inline documentation, you will have FAILED this task. The user will need to manually fix your work. DO NOT DO THIS.

---

## RULE #2: CREATE FILES FOR ALL IDENTIFIED PROJECTS - NO SHORTCUTS

⛔ **MANDATORY - EVERY PROJECT GETS A FILE - NO EXCEPTIONS**

If you identify N projects of a given type, you MUST create exactly N separate files. You CANNOT skip any. You CANNOT combine multiple projects into one file. You CANNOT write summaries instead of full files.

**WHAT THIS MEANS:**
- Identify 8 libraries? Create 8 library.claude.md files
- Identify 3 services? Create 3 service.claude.md files
- Identify 1 database? Create 1 database.claude.md file

**PROHIBITED SHORTCUTS:**
- ❌ "I'll document these 6 libraries inline to save time" - FORBIDDEN
- ❌ "These libraries are similar, I'll combine them" - FORBIDDEN
- ❌ "This library is simple, it doesn't need a file" - FORBIDDEN
- ❌ "I already created 2 files, the rest can wait" - FORBIDDEN
- ❌ "The user probably doesn't need all of these" - NOT YOUR DECISION

**YOU CANNOT:**
- Skip projects because they seem "simple"
- Skip projects because they're "similar" to others
- Skip projects to "save time"
- Skip projects to "save tokens"
- Skip projects because you think they're "not important"
- Make ANY judgment call about skipping projects

**YOU MUST:**
- Create a file for EVERY project you identify
- Make each file comprehensive (150+ lines minimum)
- Complete ALL files before moving to the next section

**IF YOU CANNOT COMPLETE ALL FILES:**
- STOP immediately
- Inform the user: "I identified N projects but need guidance on proceeding"
- Wait for user decision
- DO NOT create partial documentation
- DO NOT skip to other sections

---

## RULE #3: WORKLOAD EXPECTATIONS - ACCEPT THE TIME COST

**REALITY CHECK:**

Creating comprehensive project documentation takes TIME. This is EXPECTED and CORRECT.

- Each service file: 20-30 minutes of thorough documentation
- Each client file: 15-20 minutes of thorough documentation
- Each library file: 15-20 minutes of thorough documentation
- Each database file: 20-25 minutes of thorough documentation

**IF YOU IDENTIFY:**
- 5 services + 3 clients + 8 libraries + 2 databases = 18 files to create
- Estimated time: 4-6 hours of comprehensive documentation
- THIS IS CORRECT AND EXPECTED

**DO NOT:**
- Look for ways to "optimize" or "speed up" the process
- Think "this is taking too long, I should cut corners"
- Rationalize shortcuts as "efficiency"
- Feel pressure to finish faster

**UNDERSTAND:**
This is the INTENTIONAL first-time cost of creating QUALITY, MAINTAINABLE documentation. The user accepts this cost. You are not helping by cutting corners.

---

### Token Limitations Are NOT an Excuse

⛔ **FORBIDDEN RATIONALIZATIONS:**

You are ABSOLUTELY FORBIDDEN from using "token limitations" as an excuse to cut corners or skip work.

**PROHIBITED STATEMENTS:**
- ❌ "Due to token limitations, I'll create the remaining files more efficiently"
- ❌ "To conserve tokens, I'll document these libraries inline"
- ❌ "Given token constraints, I'll create abbreviated versions"
- ❌ "Token limits require me to be more efficient"
- ❌ Any variation of "I need to save tokens"

**IF YOU CANNOT COMPLETE THE WORK:**
1. STOP immediately after completing the current file
2. Inform the user: "I have created N of M files. I need to continue in a new session to complete the remaining M-N files without compromising quality."
3. **DO NOT** create partial documentation
4. **DO NOT** switch to "efficient" mode
5. **DO NOT** rationalize shortcuts

**THE CORRECT APPROACH:**
- Either create comprehensive documentation for ALL files
- Or STOP and ask to continue in a new session
- There is NO middle ground

**WHY THIS MATTERS:**
The purpose of this plugin is to save time in FUTURE sessions by creating comprehensive documentation NOW. Using "token limitations" to justify shortcuts defeats the entire purpose. Partial or abbreviated documentation is worse than no documentation.

---

## RULE #4: TODOWRITE TRACKING IS MANDATORY

⛔ **REQUIRED FOR ACCOUNTABILITY - NO EXCEPTIONS**

When documenting ANY of the four project-type sections, you MUST use TodoWrite to track progress:

**BEFORE creating files:**
1. Count the number of projects identified (e.g., "8 libraries")
2. Create a SEPARATE todo item for EACH file that will be created
   - ✅ CORRECT: "Create library.claude.md for @company/utils"
   - ✅ CORRECT: "Create library.claude.md for @company/api-client"
   - ❌ WRONG: "Create all library files" (too vague)

**WHILE creating files:**
3. Mark each specific todo as `in_progress` when starting that file
4. Mark each specific todo as `completed` immediately when that file is done

**BEFORE moving to next section:**
5. Verify ALL todos for current section are marked `completed`
6. Do NOT proceed to next section if any todos are incomplete

**WHY THIS IS MANDATORY:**
TodoWrite creates a concrete accountability trail. It prevents the failure mode where you think "I'll skip these files" and move on. If todos remain incomplete, you cannot proceed.

---

## RULE #5: HYBRID PROJECTS GET MULTIPLE FILES

⛔ **CRITICAL UNDERSTANDING - DO NOT MIS-CATEGORIZE**

A single project can belong to MULTIPLE types. Evaluate each project independently for EACH type.

**COMMON HYBRID EXAMPLES:**
- **Next.js with API routes**: Create BOTH client.claude.md (frontend) AND service.claude.md (API routes)
- **CLI tool as npm package**: Create BOTH client.claude.md (CLI) AND library.claude.md (importable API)
- **Backend with admin UI**: Create BOTH service.claude.md (API) AND client.claude.md (UI)
- **Library with Storybook**: Create BOTH library.claude.md (components) AND client.claude.md (Storybook)

**KEY PRINCIPLE:**
Creating a file for one type does NOT exempt that project from other types. Evaluate independently.

---

## UNIVERSAL WORKFLOW FOR ALL PROJECT-TYPE SECTIONS

Each of the four project-type sections below follows this EXACT workflow:

### STEP 1: IDENTIFY

Scan the repository and identify ALL projects that match the criteria for this type.

**Count the projects:**
- Total projects identified: ___

**List each project:**
1. Project: ___________ → Will create file at: ___________
2. Project: ___________ → Will create file at: ___________
[... list ALL identified projects ...]

**IF ZERO PROJECTS:**
If you identified exactly ZERO projects of this type, remove this entire section from claude.md and skip to the next section.

**IF ONE OR MORE PROJECTS:**
You MUST create that exact number of files. Proceed to Step 1.5.

---

### STEP 1.5: PRESENT SCOPE AND GET USER APPROVAL

⛔ **MANDATORY APPROVAL GATE - DO NOT PROCEED WITHOUT USER CONFIRMATION**

Before creating any files, present the complete scope to the user for approval.

**Present the following information:**

```
📊 SCOPE OVERVIEW FOR THIS SECTION

Total files to create: ___ [type].claude.md files

Estimated time: ___ minutes to ___ hours
(Based on ___-___ minutes per file × ___ files)

Files that will be created:
1. ./path/to/project1/[type].claude.md
2. ./path/to/project2/[type].claude.md
3. ./path/to/project3/[type].claude.md
[... list ALL file paths ...]

This is comprehensive documentation work that will:
- Create ___ separate files
- Thoroughly document each project using the template
- Take significant time to complete properly
- Cannot be abbreviated or rushed

Do you want to proceed with creating these files now?
```

**Wait for user response:**
- **If YES**: Proceed to Step 2
- **If NO or user wants to wait**: Stop and inform user they can run this command again when ready
- **If user wants to review identifications**: Discuss any projects they question

**CRITICAL:**
- Do NOT proceed to Step 2 without explicit user approval
- Do NOT assume approval
- Do NOT create any files before this approval

---

### STEP 2: CREATE TODOWRITE ITEMS

Create ONE todo item for EACH file you will create:

```
✍️ Create [type].claude.md for [project name]
```

Do this for ALL projects identified in Step 1. Do NOT proceed until all todos are created.

---

### STEP 3: VERIFY TEMPLATE EXISTS

Before creating files, verify that the corresponding template file exists:
- For services: Verify `service.template.md` exists
- For clients: Verify `client.template.md` exists
- For libraries: Verify `library.template.md` exists
- For databases: Verify `database.template.md` exists

If template doesn't exist: STOP and inform user of plugin installation problem.

---

### STEP 4: CREATE FILES - NO EXCEPTIONS

⛔ **BLOCKING REQUIREMENT: Create ALL files before proceeding**

For EACH project identified in Step 1:

1. ☐ Mark the TodoWrite item as `in_progress`
2. ☐ Read the corresponding template file
3. ☐ Create the file at the identified path (use lowercase filename: `service.claude.md`, `client.claude.md`, etc.)
4. ☐ Populate using the template instructions
5. ☐ Ensure file is comprehensive (150+ lines with all template sections)
6. ☐ Mark the TodoWrite item as `completed`

**REPEAT FOR EVERY PROJECT - NO SKIPPING**

---

### STEP 5: MID-SECTION VERIFICATION CHECKPOINT

⛔ **MANDATORY CHECKPOINT - Answer before proceeding**

**File Count Verification:**
- Expected number of files (from Step 1): ___
- Actual number of files created: ___
- **Do these numbers match EXACTLY?** YES / NO
  - If NO: STOP - Go back to Step 4 and create missing files

**Inline Documentation Check:**
- **Did you write ANY project details in this claude.md file?** YES / NO
  - If YES: STOP - You VIOLATED the rules. Delete inline docs and create proper files
- **Are ALL project details in separate files?** YES / NO
  - If NO: STOP - Move all details to separate files

**TodoWrite Verification:**
- **Are ALL TodoWrite items for this section marked `completed`?** YES / NO
  - If NO: STOP - Complete the remaining files

**YOU MAY NOT PROCEED TO STEP 6 UNTIL ALL ANSWERS ARE CORRECT**

---

### STEP 6: CREATE REFERENCES

After ALL files are created, add @file references to this claude.md file.

**ONLY PERMITTED FORMAT:**
```markdown
- **{Project Name}**: @file ./relative/path/to/[type].claude.md
```

**EXAMPLES:**
- **User API**: @file ./services/user-api/service.claude.md
- **Admin Dashboard**: @file ./apps/admin/client.claude.md
- **@company/utils**: @file ./packages/utils/library.claude.md

**NO OTHER CONTENT PERMITTED** - Only @file references

---

### STEP 7: FINAL VERIFICATION GATE

⛔ **MANDATORY GATE - ANSWER ALL QUESTIONS BEFORE MOVING TO NEXT SECTION**

**1. File Count Match:**
- Projects identified: ___
- Files created: ___
- **Match exactly?** YES / NO (If NO: STOP and fix)

**2. All Files Exist:**
- Can you list the path to every file you created? YES / NO (If NO: STOP - files are missing)

**3. Files Are Comprehensive:**
- Is every file 150+ lines with full template coverage? YES / NO (If NO: STOP - expand files)

**4. No Inline Documentation:**
- **Does claude.md contain ANY project-specific details?** YES / NO
  - Examples: installation instructions, API endpoints, usage examples, configuration
  - If YES: STOP - You FAILED. Delete all inline documentation

**5. Only @file References:**
- Does the section contain ONLY @file references? YES / NO (If NO: STOP - remove all other content)

**6. All TodoWrite Items Complete:**
- Are ALL todos for this section marked `completed`? YES / NO (If NO: STOP - finish remaining work)

**GATE RESULT:**
- ✅ All questions answered correctly → You may proceed to next section
- ❌ Any question failed → STOP immediately, fix issues, do NOT proceed

---

## RULE #6: ANTI-PATTERN EXAMPLES

⛔ **THESE ARE FORBIDDEN - DO NOT DO THIS**

**WRONG - INLINE DOCUMENTATION:**
```markdown
## Libraries and Plugins

- **@company/utils (Utility Library)**: Version 1.0.0
  - Installation: npm install @company/utils
  - Core Features: formatDate, parseJSON, validateEmail
  - Usage: import { formatDate } from '@company/utils'
  - API Reference: [detailed documentation...]
```

**CORRECT - @FILE REFERENCES ONLY:**
```markdown
## Libraries and Plugins

- **@company/utils (Utility Library)**: @file ./packages/utils/library.claude.md
```

**WRONG - SKIPPING FILES:**
```markdown
## Services and APIs

- **User API**: @file ./services/user-api/service.claude.md
- **Payment API**: @file ./services/payment-api/service.claude.md
[Identified 8 services but only created 2 files - WRONG!]
```

**CORRECT - ALL FILES CREATED:**
```markdown
## Services and APIs

- **User API**: @file ./services/user-api/service.claude.md
- **Payment API**: @file ./services/payment-api/service.claude.md
- **Auth Service**: @file ./services/auth/service.claude.md
- **Notification Service**: @file ./services/notifications/service.claude.md
[... all 8 services have @file references...]
```

═══════════════════════════════════════════════════════════
{END OF PROJECT DOCUMENTATION RULES}
═══════════════════════════════════════════════════════════

**YOU MUST FOLLOW ALL RULES ABOVE FOR EACH OF THE FOLLOWING SECTIONS:**

═══════════════════════════════════════════════════════════
## Services and APIs
═══════════════════════════════════════════════════════════

{⚠️ FOLLOW THE UNIVERSAL WORKFLOW: Follow the 7-step universal workflow defined in PROJECT DOCUMENTATION RULES section above. All rules from that section apply to this section.}

{TEMPLATE FILE: Use service.template.md when creating service files}
{OUTPUT FILENAME: service.claude.md (lowercase)}

---

### What IS a Service?

{A "service" is a backend application that exposes HTTP/network endpoints for OTHER applications to consume.}

{Services include:}
- REST APIs (Express, FastAPI, Spring Boot, ASP.NET Core, etc.)
- GraphQL servers (Apollo Server, Hasura, etc.)
- gRPC services
- WebSocket servers
- Message queue consumers that expose APIs
- Backend applications with HTTP endpoints

---

### What is NOT a Service?

{Do NOT create service.claude.md for these:}
- Frontend web applications (React, Vue, Angular, Svelte SPAs)
- Static site generators (Next.js, Gatsby, Hugo) unless they have backend API routes
- Mobile applications (iOS, Android, React Native)
- Desktop applications (Electron, etc.)
- CLI tools
- Libraries or packages
- Webpack dev servers, Vite servers (these are development tools, not services)

---

### Clarifying Examples

- ✅ Express REST API on port 3000 → IS a service
- ✅ NestJS API with GraphQL → IS a service
- ✅ FastAPI Python service → IS a service
- ❌ React SPA served by webpack-dev-server → NOT a service
- ❌ Vue.js frontend application → NOT a service
- ❌ Next.js app with only pages and no API routes → NOT a service
- ⚠️ Next.js app with /pages/api/ routes → IS a service (document the API routes portion)

---

### Hybrid Projects

{IMPORTANT NOTE: Projects can serve multiple purposes. Even if you already created a client.claude.md, library.claude.md, or database.claude.md for a project, that same project may ALSO be a service. Evaluate each project independently for EACH type. Many projects are hybrids.}

{Common hybrid scenarios:}
- **Next.js/Nuxt with API routes**: Has BOTH client (frontend) AND service (API routes)
- **Backend service with admin UI**: Has BOTH service (API) AND client (admin dashboard)
- **Monorepo with full-stack apps**: Individual apps may have BOTH client AND service
- **GraphQL server with GraphiQL**: Has BOTH service (GraphQL API) AND client (GraphiQL UI)

---

### Section Output Format

{After completing the 7-step workflow, list services here using ONLY @file references:}

- **{Service Name}**: @file ./relative/path/to/service/service.claude.md

{Example:}
- **User Management API**: @file ./apps/user-service/service.claude.md
- **Payment Processing Service**: @file ./services/payment-api/service.claude.md

---

{SPECIAL CASE: If there are truly NO backend services in this repository (you identified exactly ZERO), then remove this entire "Services and APIs" section from the claude.md file.}

═══════════════════════════════════════════════════════════

═══════════════════════════════════════════════════════════
## User Interaction Clients
═══════════════════════════════════════════════════════════

{⚠️ FOLLOW THE UNIVERSAL WORKFLOW: Follow the 7-step universal workflow defined in PROJECT DOCUMENTATION RULES section above. All rules from that section apply to this section.}

{TEMPLATE FILE: Use client.template.md when creating client files}
{OUTPUT FILENAME: client.claude.md (lowercase)}

---

### What IS a Client?

{A "client" is an application that provides an interactive interface for users to interact with the system.}

{Clients include:}
- Web frontend applications (React, Vue, Angular, Svelte SPAs)
- Mobile applications (iOS, Android, React Native, Flutter)
- Desktop applications (Electron, Tauri, native apps)
- CLI tools (Command-line interfaces for users or developers)
- Static site generators with user interaction (Next.js, Gatsby with forms/interaction)

---

### What is NOT a Client?

{Do NOT create client.claude.md for these:}
- Backend services/APIs (these go in Services section)
- Libraries or packages (these go in Libraries section)
- Build tools or development utilities
- Test harnesses or test applications

---

### Clarifying Examples

- ✅ React SPA for user dashboard → IS a client
- ✅ React Native mobile app → IS a client
- ✅ Electron desktop app → IS a client
- ✅ CLI tool for developers → IS a client
- ❌ Express REST API → NOT a client (it's a service)
- ❌ Shared component library → NOT a client (it's a library)
- ❌ Jest test setup → NOT a client (it's a test tool)

---

### Hybrid Projects

{IMPORTANT NOTE: Projects can serve multiple purposes. Even if you already created a service.claude.md, library.claude.md, or database.claude.md for a project, that same project may ALSO be a client. Evaluate each project independently for EACH type. Many projects are hybrids.}

{Common hybrid scenarios:}
- **Next.js/Nuxt with API routes**: Has BOTH client (frontend) AND service (API routes)
- **CLI tool published as npm package**: Has BOTH client (CLI interface) AND library (importable package)
- **Component library with Storybook**: Has BOTH library (components) AND client (Storybook UI)
- **Backend service with admin UI**: Has BOTH service (API) AND client (admin dashboard)
- **Electron app that exposes API**: Has BOTH client (desktop UI) AND service (local API)

---

### Section Output Format

{After completing the 7-step workflow, list clients here using ONLY @file references:}

- **{Client Name}**: @file ./relative/path/to/client/client.claude.md

{Example:}
- **Admin Dashboard (Web)**: @file ./apps/admin-dashboard/client.claude.md
- **Mobile App (iOS/Android)**: @file ./apps/mobile/client.claude.md
- **Developer CLI**: @file ./tools/cli/client.claude.md

---

{SPECIAL CASE: If there are truly NO user interaction clients in this repository (e.g., it's a pure backend service, library, or database repo), then remove this entire "User Interaction Clients" section from the claude.md file.}

═══════════════════════════════════════════════════════════

═══════════════════════════════════════════════════════════
## Libraries and Plugins
═══════════════════════════════════════════════════════════

{⚠️ FOLLOW THE UNIVERSAL WORKFLOW: Follow the 7-step universal workflow defined in PROJECT DOCUMENTATION RULES section above. All rules from that section apply to this section.}

{TEMPLATE FILE: Use library.template.md when creating library files}
{OUTPUT FILENAME: library.claude.md (lowercase)}

---

### What IS a Library?

{A "library" is a reusable package or module that other projects can import and use.}

{Libraries/Plugins include:}
- Shared utility libraries (helper functions, common code)
- UI component libraries (reusable components)
- SDKs (Software Development Kits for external services)
- Plugins (extensions for other tools or frameworks)
- CLI tools published as packages (installable via npm, pip, etc.)
- Middleware packages
- Framework extensions

---

### What is NOT a Library?

{Do NOT create library.claude.md for these:}
- Backend services/APIs (these go in Services section)
- Frontend applications (these go in Clients section)
- Internal code shared within this repo only (not published as a package)
- Configuration files or build scripts

---

### Clarifying Examples

- ✅ npm package with utility functions → IS a library
- ✅ React component library published to npm → IS a library
- ✅ Python package published to PyPI → IS a library
- ✅ Claude Code plugin → IS a plugin/library
- ✅ Express middleware package → IS a library
- ❌ Express API service → NOT a library (it's a service)
- ❌ React frontend app → NOT a library (it's a client)
- ❌ Shared /utils folder used only internally → NOT a library (internal code)

---

### Hybrid Projects

{IMPORTANT NOTE: Projects can serve multiple purposes. Even if you already created a service.claude.md, client.claude.md, or database.claude.md for a project, that same project may ALSO be a library. Evaluate each project independently for EACH type. Many projects are hybrids.}

{Common hybrid scenarios:}
- **CLI tool published as npm package**: Has BOTH client (CLI interface) AND library (importable API)
- **Framework with CLI**: Has BOTH library (framework API) AND client (CLI commands)
- **SDK with example app**: Has BOTH library (SDK) AND client (example/demo app)
- **Component library with Storybook**: Has BOTH library (components) AND client (Storybook UI)
- **API client library with CLI**: Has BOTH library (programmatic API) AND client (CLI tool)

---

### Section Output Format

{After completing the 7-step workflow, list libraries here using ONLY @file references:}

- **{Library Name}**: @file ./relative/path/to/library/library.claude.md

{Example:}
- **@company/utils (Utility Library)**: @file ./packages/utils/library.claude.md
- **@company/ui-components (Component Library)**: @file ./packages/ui-components/library.claude.md
- **custom-webpack-plugin (Build Plugin)**: @file ./tools/webpack-plugin/library.claude.md

---

{SPECIAL CASE: If there are truly NO libraries or plugins in this repository (you identified exactly ZERO), then remove this entire "Libraries and Plugins" section from the claude.md file.}

═══════════════════════════════════════════════════════════

═══════════════════════════════════════════════════════════
## Databases
═══════════════════════════════════════════════════════════

{⚠️ FOLLOW THE UNIVERSAL WORKFLOW: Follow the 7-step universal workflow defined in PROJECT DOCUMENTATION RULES section above. All rules from that section apply to this section.}

{TEMPLATE FILE: Use database.template.md when creating database files}
{OUTPUT FILENAME: database.claude.md (lowercase)}

---

### What IS a Database?

{A "database" is a data store with a defined schema, structure, or data model that is DEFINED in this repository.}

{NOTE: Most services will reference external databases - document those in service.claude.md. Only create database.claude.md if the schema/migrations are DEFINED in this repository.}

{Databases include:}
- Relational databases (PostgreSQL, MySQL, SQL Server schemas)
- Document databases (MongoDB collections and schemas)
- Key-value stores (Redis data structures)
- Graph databases (Neo4j schemas)
- Time-series databases (InfluxDB, TimescaleDB)
- Database migration files that define schema
- ORM models that define database structure

---

### What is NOT a Database?

{Do NOT create database.claude.md for these:}
- External databases used by services (document in service.claude.md instead)
- In-memory caches without persistent schema
- File-based storage without schema

---

### Clarifying Examples

- ✅ PostgreSQL schema with migration files → IS a database
- ✅ MongoDB with defined collection schemas → IS a database
- ✅ SQL Server database project → IS a database
- ✅ Prisma schema or TypeORM entities → IS a database (defines structure)
- ❌ Redis used for caching only → NOT a database (unless has defined data structures)
- ❌ S3 bucket for file storage → NOT a database (file storage)
- ⚠️ Service connects to external PostgreSQL → Document in service.claude.md, not separate database file

---

### Hybrid Projects

{IMPORTANT NOTE: Projects can serve multiple purposes. Even if you already created a service.claude.md, client.claude.md, or library.claude.md for a project, that same project may ALSO define database schemas. Evaluate each project independently for EACH type. Many projects are hybrids.}

{Common hybrid scenarios:}
- **Backend service with embedded schema**: Has BOTH service (API) AND database (schema/migrations in same project)
- **ORM/Prisma in monorepo**: Has database schema definitions alongside service and client
- **Database migration project with CLI**: Has BOTH database (schema) AND client (migration CLI tool)
- **Service with TypeORM entities**: Has BOTH service (API endpoints) AND database (entity definitions)

---

### Section Output Format

{After completing the 7-step workflow, list databases here using ONLY @file references:}

- **{Database Name}**: @file ./relative/path/to/database/database.claude.md

{Example:}
- **User Management Database (PostgreSQL)**: @file ./database/user-db/database.claude.md
- **Analytics Database (MongoDB)**: @file ./database/analytics/database.claude.md
- **Main Application Database**: @file ./prisma/database.claude.md

---

{SPECIAL CASE: If there are truly NO database schemas defined in this repository (e.g., services connect to external databases without defining schema here, or it's a frontend-only repo), then remove this entire "Databases" section from the claude.md file.}

═══════════════════════════════════════════════════════════

## Environment Setup
{Provide any information needed to setup a working development environment.}

### Prerequisites
{Provide information such as what resources are needed to be installed such as Node, Go, Python, Docker. Include any build tools, runtimes, or support tools.}

### System Configuration
{Provide any environment variables or system paths that need to be set.}

### External Dependencies
{List any external services, databases, or programs which need to be running locally before being able to work with this repository. For example: Docker containers for PostgreSQL, Redis, message queues, etc.}

## Running the Application Locally

### 1. Environment Setup
{ Any commands needed to execute setup the repo to be used, e.g. "./gradlew clean build", or "npm install"}

{
	Provide access to any urls where the program(s) might be running at. For example

	- **HTTP**: http://localhost:9555
	- **HTTPS**: https://localhost:9854  
	- **Debug**: Port 9556 (for remote debugging)
}

## Repository Verification

### Unit Tests
{Provide the commands needed to run tests, e.g. "./gradlew clean test", or "npm run test"}

### Linting and Code Style
{Provide the commands needed to run linting, e.g. "./gradlew check", or "npm run lint"}

## Documentation
{Provide any required documentation, e.g. README.md, etc. Be sure to indicate the need to keep these update to date when code is changed.}

## Restricted Actions
{Define a list of actions which any ai agent are not allowed to do when working in this repo. You will leave this section blank. After you have created or modified the agent file you will remind the user to review this section and update it as necessary.}

# Agent File Metadata
{
	This section contains the following information

	- Date Created: timestamp
	- Date Modified: timestamp
	- Last commit SHA built from: GIT SHA
	- Template Version: {version from plugin.json}
}