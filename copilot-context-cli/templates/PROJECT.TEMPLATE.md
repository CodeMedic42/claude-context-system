# Project: ~:Project Name:~

## Project Overview [overview] [summary]
~:Provide a clear description of what this project does, its primary purpose, and its role in the overall system:~

## Project Metadata [metadata] [identity]
~:Basic project identification information:~
- **Project Name**: ~:Official project name from manifest (package.json, Cargo.toml, etc.):~
- **Project Path**: ~:Relative path from repository root:~
- **Version**: ~:Current version from manifest:~
- **Status**: ~:Project status: active, stable, maintenance, deprecated, or archived:~
- **License**: ~:License from manifest (e.g., MIT, Apache-2.0, proprietary):~

## Project Types [types] [classification]
~:List the types this project implements. A project can have multiple types:~

~:For each type, provide a brief description::~
- **~:TYPE:~**: ~:Brief description of this aspect of the project:~

~:Examples::~
- **SERVICE**: Backend REST API for user authentication
- **DATABASE**: PostgreSQL schema definitions and migrations
- **CLIENT**: Web-based admin dashboard
- **LIBRARY**: Shared utility functions for date manipulation
- **IAC**: Terraform configuration for AWS infrastructure

~:Only list types that this project actually implements:~

## Technical Documentation [technical] [implementation]

~:Link to the type-specific CLAUDE files for detailed technical implementation:~

~:For SERVICE projects, include::~
- **Service Implementation**: @file ./SERVICE.CLAUDE.md

~:For CLIENT projects, include::~
- **Client Implementation**: @file ./CLIENT.CLAUDE.md

~:For LIBRARY projects, include::~
- **Library Implementation**: @file ./LIBRARY.CLAUDE.md

~:For DATABASE projects, include::~
- **Database Schema**: @file ./DATABASE.CLAUDE.md

~:For IAC projects, include::~
- **Infrastructure Configuration**: @file ./IAC.CLAUDE.md

~:Only include @file references for types this project actually implements. Remove unused lines.:~

## Documentation Links [documentation] [external] [reference]

~:Links to documentation files and resources for this project:~

### Project Documentation [documentation] [project]
~:Core project documentation::~
- **README**: ~:Path to README.md (e.g., ./README.md):~
- **Changelog**: ~:Path to CHANGELOG.md if it exists:~

### Additional Documentation [documentation] [additional]
~:Additional documentation resources if they exist. Remove this subsection if no additional docs found::~
- **Architecture Documentation**: ~:Links to architecture docs, ADRs, design documents:~
- **API Documentation**: ~:Links to OpenAPI/Swagger specs, GraphQL schemas, API docs:~
- **User Guides**: ~:Links to user-facing documentation:~
- **Developer Guides**: ~:Links to developer setup, contribution guides:~

~:Only include documentation links that can be automatically detected (README, CHANGELOG, docs/ directories, etc.). Remove lines for documentation that doesn't exist.:~

## Ownership & Team [ownership] [team] [contacts]

~:Information about who owns and maintains this project:~

### Team Information [team] [ownership]
~:Team and ownership details::~
- **Owning Team**: ~:Team name from CODEOWNERS or package.json:~
- **Primary Maintainers**: ~:Names, emails, or GitHub handles from package.json maintainers/contributors:~

### Contact Information [contact] [communication]
~:How to contact the team::~
- **Repository Issues**: ~:Link to GitHub/GitLab issues:~
- **Contact Method**: ~:Extracted from package.json homepage, bugs.url, or repository.url:~

~:Only include information that can be automatically extracted from manifest files, CODEOWNERS, or git configuration. Remove lines that cannot be auto-populated.:~

## Project Relationships [relationships] [dependencies]

~:How this project relates to other projects in the repository:~

### Internal Dependencies [dependencies] [internal]
~:Other projects in this repository that this project depends on::~
~:List project names and link to their PROJECT.CLAUDE.md files::~
- **~:Dependency Project Name:~**: @file ./path/to/PROJECT.CLAUDE.md

~:Remove this subsection if the project has no internal dependencies:~

### Used By [dependents] [consumers]
~:Other projects in this repository that depend on this project::~
~:List project names and link to their PROJECT.CLAUDE.md files::~
- **~:Consumer Project Name:~**: @file ./path/to/PROJECT.CLAUDE.md

~:Remove this subsection if no other projects depend on this one:~

### Related Projects [related] [siblings]
~:Sibling or complementary projects in this repository::~
~:List project names and link to their PROJECT.CLAUDE.md files::~
- **~:Related Project Name:~**: @file ./path/to/PROJECT.CLAUDE.md

~:Remove this subsection if there are no related projects:~

## Environments [environments] [deployment] [urls]

~:Where this project runs or can be accessed:~

### Environment URLs [urls] [endpoints]
~:Detected URLs from configuration files, README, or code::~
- **Production**: ~:Production URL if detected:~
- **Staging**: ~:Staging URL if detected:~
- **Development**: ~:Local development URL (e.g., http://localhost:3000):~

~:Only include environment URLs that can be automatically detected from config files, .env.example files, README badges, or code. Remove this entire section if no URLs are detected.:~

## Restricted Actions [security] [restrictions] [policies]

~:Define actions that AI agents should NOT perform in this project:~

~:Leave blank initially - user should review and populate based on their specific requirements:~

# Agent File Maintenance [metadata] [maintenance]

~:Keep this section but do not modify the contents:~
No LLM/AI/Agent may make changes to this file outside of the claude-context-system commands. This is a maintained file through automatic means.

# Agent File Metadata [metadata] [tracking]

{
	This section contains the following information

	- Revision Date: timestamp
	- Last commit SHA built from: GIT SHA
	- Template Version: 2.1.0
	- Project Types: Array of types this project implements
}
