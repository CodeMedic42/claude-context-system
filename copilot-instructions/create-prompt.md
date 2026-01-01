# Create New claude.md - Copilot Prompt

## Instructions

1. Copy the prompt below and paste it into GitHub Copilot Chat in VS Code
2. Copilot will ask you for the template
3. Open `../shared/templates/claude.template.md` in this repository
4. Copy the entire template file
5. Paste it back to Copilot when requested
6. Copilot will analyze your repository and generate the claude.md

---

You are tasked with creating a claude.md file for this repository. This file provides context about the repository for AI assistants like Claude Code and GitHub Copilot.

## Step 1: Request Template

First, ask the user: "Please provide the claude.md template file. Open `shared/templates/claude.template.md` from the claude-context-updater repository and paste its contents here."

Wait for the user to provide the template.

## Step 2: Analyze the Repository

First, analyze the repository to gather the following information:

1. **Project Type**: What kind of project is this? (Node.js service, Python application, Java backend, React frontend, etc.)
2. **Languages**: What programming languages are used? Check file extensions and list them with versions if available.
3. **Frameworks and Libraries**: What frameworks and major libraries are used? Check package managers (package.json, pom.xml, requirements.txt, go.mod, Cargo.toml, etc.)
4. **Repository Structure**: Examine the directory tree. What are the main directories and what do they contain?
5. **Services and APIs**: Are there API endpoints defined? Look for route definitions, controllers, or API specifications.
6. **Databases**: Are there database schemas, migrations, or ORM models? What database is used?
7. **Environment Setup**: What prerequisites are needed? (Node version, Python version, Docker, etc.)
8. **Configuration**: What environment variables or configuration is needed? Check .env.example files.
9. **Local Services**: Are there docker-compose files or other services that need to run?
10. **Running Locally**: What commands are used to install dependencies and start the application?
11. **Testing**: What commands run tests? Check package.json scripts, Makefile, or CI configs.
12. **Linting**: What linting tools are used and how to run them?
13. **Documentation**: What documentation files exist? (README.md, docs/, etc.)

## Step 2: Get Git Information

Get the current git commit SHA using: `git rev-parse HEAD`

## Step 3: Generate claude.md

Once you receive the template from the user, use it to create the claude.md file:

1. **Use the template structure** - The template defines all sections and their order
2. **Follow the instructions** - Text in curly brackets `{...}` are instructions for what to include in each section
3. **Fill in with real data** - Replace all `{...}` placeholders with actual information from the repository analysis
4. **Remove optional sections** - If the template says "remove this section if not applicable" and it doesn't apply, remove it
5. **Add metadata** - In the "Agent File Metadata" section at the end, replace placeholders with:
   - Date Created: Current date and time in ISO 8601 format
   - Date Modified: Current date and time in ISO 8601 format
   - Last Commit SHA: Get from `git rev-parse HEAD`
   - Template Version: Use the version specified in the template (if placeholder, use "2.0.0")

## Important Instructions

1. **Be thorough**: Examine the actual files in the repository, don't guess.
2. **Be specific**: Use actual file names, actual dependencies, actual commands.
3. **Remove empty sections**: If there are no services, databases, or libraries, remove those sections entirely.
4. **Use real data**: Don't use placeholder text - fill in actual information from the repository.
5. **Keep it concise**: Each section should be informative but not overwhelming.
6. **Current timestamp**: Use the actual current date/time for metadata.

Generate the complete claude.md file content now.
