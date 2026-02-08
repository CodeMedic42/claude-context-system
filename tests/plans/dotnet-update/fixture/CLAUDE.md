# Repository Agent Context

## Repository Overview [overview] [summary]

DotnetCalculator is a demonstration .NET solution showcasing a simple REST API architecture with a shared library. The solution consists of a calculator service that exposes HTTP endpoints for mathematical operations, leveraging a shared mathematical operations library. This serves as an example of clean separation between API controllers and reusable business logic in a .NET environment.

## Team Members

- Alice Johnson (Lead Developer)
- Bob Smith (Backend Engineer)
- Carol Davis (DevOps Engineer)

## High-Level Repository Information [metadata] [technologies]

- **Project Types**: ASP.NET Core Web API service, .NET Class Library
- **Languages**: C# (.NET 8.0)
- **Frameworks/Libraries**:
  - ASP.NET Core 8.0 - Web API framework
  - Swashbuckle.AspNetCore - Swagger/OpenAPI documentation
  - Microsoft.Extensions.Logging - Structured logging

## Repository Structure [structure] [organization]

```
dotnet-update/
├── .git/                       # Git repository data
├── DotnetCalculator.sln       # Visual Studio solution file
├── README.md                  # Project documentation with API examples
├── Service.Api/               # REST API service project
│   ├── Service.Api.csproj     # Project file (.NET 8.0 Web SDK)
│   ├── Program.cs             # Application entry point and configuration
│   ├── service.claude.md      # Service-specific context documentation
│   └── Controllers/           # API controllers
│       └── CalculateController.cs  # Calculator endpoint controller
└── Shared.Library/            # Shared mathematical operations library
    ├── Shared.Library.csproj  # Class library project file
    ├── Calculator.cs          # Static calculator class with operations
    └── library.claude.md      # Library-specific context documentation
```

## Code Organization Patterns [architecture] [patterns]

- **Architecture**: Simple solution with service and shared library pattern
- **Project organization**:
  - `Service.Api/` - ASP.NET Core Web API providing calculator endpoints
  - `Shared.Library/` - Reusable class library with mathematical operations
  - Solution file at root coordinates both projects
- **Common patterns**:
  - Controller-based routing with attribute routing (`[Route]`, `[HttpPost]`)
  - Dependency injection for framework services (ILogger)
  - Strongly-typed request/response DTOs
  - Static utility classes for stateless operations
  - Project references for internal dependencies
- **Naming conventions**:
  - PascalCase for namespaces, classes, and public members
  - camelCase for parameters and local variables
  - Project folders match project names (PascalCase with dots)
  - Controller files end with "Controller" suffix

## Services and APIs [services] [apis] [backend]

- **Calculator API Service**: @file ./Service.Api/service.claude.md

## Libraries and Plugins [libraries] [packages] [reusable]

- **Shared.Library (Mathematical Operations)**: @file ./Shared.Library/library.claude.md

## Environment Setup [setup] [environment] [prerequisites]

### Prerequisites [prerequisites] [requirements]

**Required:**
- .NET 8.0 SDK or later
- A code editor (Visual Studio 2022, Visual Studio Code, or JetBrider Rider recommended)

**Optional:**
- Git for version control
- Postman, curl, or similar tool for API testing (alternatively use Swagger UI)

### System Configuration [configuration] [environment] [setup]

No special environment variables or system paths required beyond having the .NET 8.0 SDK in your PATH.

### External Dependencies [dependencies] [external] [services]

No external services, databases, or programs need to be running. This is a self-contained stateless service.

## Running the Application Locally [development] [local] [setup]

### 1. Environment Setup [setup] [installation]

```bash
# Navigate to the repository root
cd dotnet-update

# Restore dependencies for all projects
dotnet restore

# Build the entire solution
dotnet build
```

### 2. Run the Service

```bash
# Navigate to the service directory
cd Service.Api

# Run the service
dotnet run
```

The API will be available at:
- **HTTPS**: https://localhost:5001
- **HTTP**: http://localhost:5000
- **Swagger UI**: https://localhost:5001/swagger (Development environment only)

### 3. Test the API

**Using Swagger UI:**
Navigate to https://localhost:5001/swagger and use the interactive interface.

**Using curl:**
```bash
curl -X POST https://localhost:5001/calculate/add \
  -H "Content-Type: application/json" \
  -d '{"value1": 5, "value2": 3}'
```

**Expected Response:**
```json
{
  "result": 8
}
```

## Repository Verification [testing] [verification] [quality]

### Unit Tests [testing] [unit-tests]

Currently, no test projects are configured in the solution. To add tests:

```bash
# Create a test project (from repository root)
dotnet new xunit -n Service.Api.Tests
dotnet sln add Service.Api.Tests/Service.Api.Tests.csproj
cd Service.Api.Tests
dotnet add reference ../Service.Api/Service.Api.csproj

# Run tests (once created)
dotnet test
```

Recommended test structure:
- `Service.Api.Tests/` - Unit tests for the API controllers
- `Shared.Library.Tests/` - Unit tests for mathematical operations

### Linting and Code Style [linting] [code-quality] [style]

Standard .NET analyzers are enabled by default in .NET 8.0 projects.

```bash
# Build with warnings as errors to enforce code quality
dotnet build /p:TreatWarningsAsErrors=true

# Check for code style issues
dotnet format --verify-no-changes
```

To format code automatically:
```bash
dotnet format
```

## Documentation [documentation] [reference]

**Key documentation files:**
- `README.md` - Main repository documentation with API endpoint examples
- `Service.Api/service.claude.md` - Detailed context for the Calculator API service
- `Shared.Library/library.claude.md` - Detailed context for the mathematical operations library

**When to update documentation:**
- When adding new API endpoints, update `Service.Api/service.claude.md` and `README.md`
- When adding new mathematical operations, update `Shared.Library/library.claude.md`
- When changing the solution structure, update this `claude.md` file
- When modifying build or deployment processes, update relevant context files

## Restricted Actions [security] [restrictions] [policies]

*(This section is intentionally left blank for the user to fill in with project-specific restrictions)*

# Agent File Maintenance [metadata] [maintenance]

No LLM/AI/Agent may make changes to this file outside of the claude-context-system commands. This is a maintained file through automatic means.

# Agent File Metadata [metadata] [tracking]

- Revision Date: 2026-01-09T22:05:00Z
- Last commit SHA built from: c643e25aed1a0e80acf49197d3072448b6e101f5
- Template Version: 2.1.0
