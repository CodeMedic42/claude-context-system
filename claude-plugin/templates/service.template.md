# Service Context: {Service Name}

## Service Overview
{Provide a clear description of what this service does, its primary responsibilities, and its role in the overall system}

## Technologies
{List the key technologies, frameworks, and libraries used in this service}
- **Language**: {e.g., Node.js, .NET, Python, Java, Go}
- **Framework**: {e.g., Express, ASP.NET Core, FastAPI, Spring Boot}
- **Key Dependencies**: {List major libraries and their purposes}

## API Endpoints
{Document the available API endpoints, their methods, purposes, and any important details}

### Endpoint Patterns
{Describe how APIs are defined and organized in this service}
- **Routing pattern**: {e.g., "Routes defined in routes/ directory using Express Router", "Controllers with [Route] attributes"}
- **Endpoint structure**: {e.g., "/api/v1/{resource}/{id}", REST conventions used}
- **Common patterns**: {Describe any patterns agents should follow when adding new endpoints}

## Authentication/Authorization
{Describe how authentication and authorization work in this service}
- **Authentication method**: {e.g., JWT, OAuth, API Keys}
- **Authorization approach**: {e.g., Role-based, Claims-based, Policy-based}
- **Implementation details**: {Where/how auth is implemented, middleware used}

## Error Handling Patterns
{Describe how errors are handled in this service}
- **Error handling approach**: {e.g., Global error middleware, try-catch conventions}
- **Error response format**: {Show the standard error response structure}
- **Error types**: {List common error types and how they're categorized}
- **Where errors are caught**: {e.g., "Controller level", "Service layer", "Global handler"}

## Data Validation
{Describe how input validation is performed}
- **Validation library/approach**: {e.g., Joi, Zod, Data Annotations, built-in validators}
- **Where validation happens**: {e.g., "Request DTOs", "Middleware", "Controller actions"}
- **Validation patterns**: {Describe conventions for adding validation to new endpoints}

## Middleware/Request Pipeline
{List and describe middleware components in the order they execute}
1. {First middleware - e.g., "CORS middleware"}
2. {Second middleware - e.g., "Authentication"}
3. {Third middleware - e.g., "Request logging"}
4. {Etc.}

{Explain any important middleware behavior or configuration}

## Request/Response Conventions
{Describe standard patterns for requests and responses}
- **Request conventions**: {e.g., "Use DTOs for complex inputs", "Query params for filters"}
- **Response format**: {Show standard successful response structure}
- **Pagination**: {If applicable, describe pagination approach}
- **Content types**: {Typical content types used}

## Code Organization Patterns
{Describe the architectural patterns and code organization used in this service}
- **Architecture**: {e.g., "MVC", "Layered (Controller/Service/Repository)", "Clean Architecture", "Vertical Slice"}
- **Directory structure**: {Explain how code is organized in directories}
- **Layer responsibilities**:
  - {Layer 1}: {What it does}
  - {Layer 2}: {What it does}
  - {Layer 3}: {What it does}
- **Patterns to follow**: {Key patterns agents should follow when adding code}

## Database/Data Access Patterns
{Describe how data is accessed and manipulated}
- **Database(s)**: {List databases used - type and purpose}
- **ORM/Data access**: {e.g., "Entity Framework Core", "Sequelize", "Raw SQL", "Dapper"}
- **Data access pattern**: {e.g., "Repository pattern", "Queries in service layer", "CQRS"}
- **Transaction handling**: {Where/how transactions are managed}
- **Migration approach**: {How schema changes are managed}

## Service Dependencies
{List external dependencies this service relies on}

### Internal Services
{List other services in the system this service calls}
- {Service name}: {How it's called, what for}

### External APIs
{List external APIs or third-party services}
- {API name}: {Purpose, how integrated}

### Databases
{List databases used}
- {Database name/type}: {Purpose, connection details location}

### Message Queues/Event Systems
{If applicable, describe message queue or event system usage}
- {System name}: {Topics/queues used, patterns}

## Service Communication
{Describe how this service communicates with other services}
- **Communication protocol**: {e.g., "REST over HTTP", "gRPC", "Message Queue"}
- **Client libraries**: {Libraries used to call other services}
- **Retry/Circuit breaker**: {Resilience patterns in place}
- **Service discovery**: {How service endpoints are discovered}

## Logging Conventions
{Describe logging practices in this service}
- **Logging framework**: {e.g., "Winston", "Serilog", "Python logging"}
- **Log levels used**: {When each level is used - DEBUG, INFO, WARN, ERROR}
- **Structured logging**: {Whether structured logging is used, format}
- **What gets logged**:
  - {Category 1}: {What's logged - e.g., "All incoming requests with method, path, status"}
  - {Category 2}: {What's logged - e.g., "Database queries (in development)"}
  - {Category 3}: {What's logged}

### What Should NOT Be Logged
{Critical: Define sensitive data that must never appear in logs}
- **Passwords and credentials**: Never log passwords, API keys, tokens
- **Personal data**: {List PII that should not be logged - e.g., SSNs, credit cards, etc.}
- **Sensitive business data**: {List any business-sensitive information}
- **Other restricted data**: {Any other data types that should not be logged}

{User should review and customize this section for their specific security requirements}

## Testing Patterns
{Describe testing approach and conventions}
- **Testing frameworks**: {e.g., "Jest", "xUnit", "pytest"}
- **Test organization**: {How tests are organized - by feature, by layer, etc.}
- **Test types**: {Unit tests, integration tests, E2E tests - where each lives}
- **Common patterns**: {Patterns to follow when writing tests}
- **Mocking approach**: {How dependencies are mocked}
- **Test data**: {How test data is managed}

## Configuration/Environment Variables
{List and describe configuration and environment variables}

### Required Environment Variables
- `{VAR_NAME}`: {Description, example value (non-sensitive)}

### Optional Environment Variables
- `{VAR_NAME}`: {Description, default value}

### Configuration Files
{List configuration files and their purposes}

## Build and Deployment
{Describe how to build and deploy this service}

### Build Process
{Commands needed to build the service}

### Run Locally
{Commands and steps to run the service locally}

### Deployment
{Brief overview of deployment process, environments, CI/CD}

## Documentation
{Links to additional documentation specific to this service}
- {Doc name}: {Link or path}

## Restricted Actions
{Define actions that AI agents should NOT perform in this service}

{Leave blank initially - user should review and populate}

# Service File Metadata
{
	This section contains the following information

	- Date Created: timestamp
	- Date Modified: timestamp
	- Last commit SHA built from: GIT SHA
	- Template Version: {version from plugin.json}
}
