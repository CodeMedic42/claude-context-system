# Repository Agent Context

## Repository Overview [overview] [summary]

~:Brief description of what this repository contains and its purpose within the organization:~

## High-Level Repository Information [metadata] [technologies]

- **Project Types**: ~:List all project types, e.g. Node express service, Node Front End client, .Net service, etc.:~
- **Languages**: ~:List all languages used in this repository, e.g. Java 17, .Net 9, Javascript, go, python, etc.:~
- **Frameworks/Libraries**: ~:Key frameworks, libraries, and versions:~

## Repository Structure [structure] [organization]

~:Create an ascii based directory tree of the repository structure. Be sure to add a 5 word max comment for each file/directory describing it. Ignore any files or directories which are specified via any .gitignore files.:~

## Code Organization Patterns [architecture] [patterns]

~:Describe the high-level architectural patterns and code organization used in this repository:~
- **Architecture**: ~:e.g., "Monorepo with multiple services", "Single application", "Microservices", "Modular monolith":~
- **Project organization**: ~:Describe how projects/modules are organized:~
- **Common patterns**: ~:Describe any architectural patterns used across projects - e.g., "All services use layered architecture", "Shared libraries in /packages":~
- **Naming conventions**: ~:Describe file/folder naming conventions:~

## Services and APIs [services] [apis] [backend]

~:List all backend services with @file references to their context files:~

- **~:Service Name:~**: @file ./path/to/SERVICE.CLAUDE.md

~:Example::~
- **User Management API**: @file ./apps/user-service/SERVICE.CLAUDE.md
- **Payment Processing Service**: @file ./services/payment-api/SERVICE.CLAUDE.md

~:If there are no backend services in this repository, remove this entire section:~

## User Interaction Clients [clients] [frontend] [ui]

~:List all user-facing clients with @file references to their context files:~

- **~:Client Name:~**: @file ./path/to/CLIENT.CLAUDE.md

~:Example::~
- **Admin Dashboard (Web)**: @file ./apps/admin-dashboard/CLIENT.CLAUDE.md
- **Mobile App (iOS/Android)**: @file ./apps/mobile/CLIENT.CLAUDE.md
- **Developer CLI**: @file ./tools/cli/CLIENT.CLAUDE.md

~:If there are no user interaction clients in this repository, remove this entire section:~

## Libraries and Plugins [libraries] [packages] [reusable]

~:List all libraries and plugins with @file references to their context files:~

- **~:Library Name:~**: @file ./path/to/LIBRARY.CLAUDE.md

~:Example::~
- **@company/utils (Utility Library)**: @file ./packages/utils/LIBRARY.CLAUDE.md
- **@company/ui-components (Component Library)**: @file ./packages/ui-components/LIBRARY.CLAUDE.md
- **custom-webpack-plugin (Build Plugin)**: @file ./tools/webpack-plugin/LIBRARY.CLAUDE.md

~:If there are no libraries or plugins in this repository, remove this entire section:~

## Databases [databases] [data] [schema]

~:List all database schemas with @file references to their context files:~

- **~:Database Name:~**: @file ./path/to/DATABASE.CLAUDE.md

~:Example::~
- **User Management Database (PostgreSQL)**: @file ./database/user-db/DATABASE.CLAUDE.md
- **Analytics Database (MongoDB)**: @file ./database/analytics/DATABASE.CLAUDE.md
- **Main Application Database**: @file ./prisma/DATABASE.CLAUDE.md

~:If there are no database schemas defined in this repository, remove this entire section:~

## Infrastructure as Code [infrastructure] [iac] [cloud]

~:List all infrastructure as code projects with @file references to their context files:~

- **~:Infrastructure Name:~**: @file ./path/to/IAC.CLAUDE.md

~:Example::~
- **AWS Infrastructure (Terraform)**: @file ./infrastructure/aws/IAC.CLAUDE.md
- **Kubernetes Configuration**: @file ./k8s/IAC.CLAUDE.md
- **Azure Resources (ARM Templates)**: @file ./infra/azure/IAC.CLAUDE.md

~:If there is no infrastructure as code in this repository, remove this entire section:~

## Environment Setup [setup] [environment] [prerequisites]

~:Provide any information needed to setup a working development environment.:~

### Prerequisites [prerequisites] [requirements]

~:Provide information such as what resources are needed to be installed such as Node, Go, Python, Docker. Include any build tools, runtimes, or support tools.:~

### System Configuration [configuration] [environment] [setup]

~:Provide any environment variables or system paths that need to be set.:~

### External Dependencies [dependencies] [external] [services]

~:List any external services, databases, or programs which need to be running locally before being able to work with this repository. For example: Docker containers for PostgreSQL, Redis, message queues, etc.:~

## Running the Application Locally [development] [local] [setup]

### 1. Environment Setup [setup] [installation]

~:Any commands needed to execute setup the repo to be used, e.g. "./gradlew clean build", or "npm install":~

{
	Provide access to any urls where the program(s) might be running at. For example

	- **HTTP**: http://localhost:9555
	- **HTTPS**: https://localhost:9854
	- **Debug**: Port 9556 (for remote debugging)
}

## Repository Verification [testing] [verification] [quality]

### Unit Tests [testing] [unit-tests]

~:Provide the commands needed to run tests, e.g. "./gradlew clean test", or "npm run test":~

### Linting and Code Style [linting] [code-quality] [style]

~:Provide the commands needed to run linting, e.g. "./gradlew check", or "npm run lint":~

## Documentation [documentation] [reference]

~:Provide any required documentation, e.g. README.md, etc. Be sure to indicate the need to keep these update to date when code is changed.:~

## Restricted Actions [security] [restrictions] [policies]

~:Define a list of actions which any ai agent are not allowed to do when working in this repo. You will leave this section blank. After you have created or modified the agent file you will remind the user to review this section and update it as necessary.:~

# Agent File Maintenance [metadata] [maintenance]

~:Keep this section but do not modify the contents:~
No LLM/AI/Agent may make changes to this file outside of the claude-context-system commands. This is a maintained file through automatic means.

# Agent File Metadata [metadata] [tracking]

{
	This section contains the following information

	- Revision Date: timestamp
	- Last commit SHA built from: GIT SHA
	- Template Version: 2.1.0
}
