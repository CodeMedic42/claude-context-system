# Service Context: Calculator API Service

## Service Overview [overview] [summary]

This is a REST API service that provides mathematical calculation endpoints. Built with ASP.NET Core 8.0, the service exposes HTTP endpoints for performing calculations by leveraging the Shared.Library for core mathematical operations. It serves as a demonstration of a simple microservice architecture with clean separation between API controllers and business logic.

## Technologies [technologies] [stack]

- **Language**: C# with .NET 8.0
- **Framework**: ASP.NET Core 8.0 Web API
- **Key Dependencies**:
  - Microsoft.AspNetCore.OpenApi - OpenAPI/Swagger support for API documentation
  - Swashbuckle.AspNetCore - Swagger UI generation
  - Shared.Library - Internal library providing mathematical operations

## API Endpoints [api] [endpoints] [routes]

### Endpoint Patterns [api] [routing] [patterns]

- **Routing pattern**: Controller-based routing with [Route] and [HttpPost] attributes on controller actions
- **Endpoint structure**: `/calculate/{operation}` where operation is the mathematical function (e.g., add, subtract)
- **Common patterns**:
  - All endpoints use POST methods with JSON request bodies
  - Request/response use strongly-typed DTOs (CalculateRequest/CalculateResponse)
  - Actions follow RESTful conventions with descriptive route names

### Available Endpoints

#### POST /calculate/add

Adds two integers together.

**Request Body:**
```json
{
  "value1": 5,
  "value2": 3
}
```

**Response:**
```json
{
  "result": 8
}
```

**Implementation:** Uses the `Calculator.Add` method from Shared.Library to perform the calculation. Logs the operation with structured logging including both input values.

## Authentication/Authorization [security] [auth] [access-control]

- **Authentication method**: None (this is a demonstration service)
- **Authorization approach**: None currently implemented
- **Implementation details**: No authentication or authorization middleware is configured. Service is open to all requests. For production use, consider adding JWT bearer authentication or API key validation.

## Error Handling Patterns [errors] [exceptions] [error-handling]

- **Error handling approach**: Default ASP.NET Core error handling pipeline
- **Error response format**: Standard ASP.NET Core problem details format (RFC 7807)
- **Error types**:
  - 400 Bad Request - Invalid or malformed request body
  - 500 Internal Server Error - Unhandled exceptions
- **Where errors are caught**: ASP.NET Core middleware handles exceptions globally. No custom error handling middleware is currently configured.

## Data Validation [validation] [input] [data-integrity]

- **Validation library/approach**: Built-in ASP.NET Core model validation using C# types
- **Where validation happens**:
  - Model binding automatically validates the CalculateRequest structure
  - Type safety enforced by C# compiler (int values required)
- **Validation patterns**:
  - Use strongly-typed request DTOs with appropriate data annotations when needed
  - [FromBody] attribute ensures request body is properly deserialized
  - Invalid JSON or type mismatches automatically return 400 Bad Request

## Middleware/Request Pipeline [middleware] [pipeline] [request-lifecycle]

The middleware pipeline is configured in Program.cs and executes in the following order:

1. **Swagger Middleware** (Development only) - Serves OpenAPI specification at `/swagger/v1/swagger.json`
2. **Swagger UI** (Development only) - Provides interactive API documentation at `/swagger`
3. **HTTPS Redirection** - Redirects HTTP requests to HTTPS
4. **Authorization** - Authorization middleware (no policies configured currently)
5. **Controller Routing** - Routes requests to appropriate controller actions

**Configuration details:**
- Swagger is only enabled in Development environment
- Controllers are registered with `AddControllers()`
- OpenAPI/Swagger generation configured with `AddEndpointsApiExplorer()` and `AddSwaggerGen()`

## Request/Response Conventions [conventions] [patterns] [api]

- **Request conventions**:
  - POST methods for all calculation operations
  - JSON request bodies using strongly-typed DTOs
  - Use [FromBody] attribute to explicitly bind request body
- **Response format**: JSON responses with strongly-typed DTO objects
  - Success: Returns 200 OK with CalculateResponse containing result
  - Error: Returns appropriate status code with problem details
- **Pagination**: Not applicable (no collection endpoints)
- **Content types**: `application/json` for both requests and responses

## Code Organization Patterns [architecture] [code-structure] [organization]

- **Architecture**: Simple MVC pattern with Controllers and Services separation
  - Controllers: Handle HTTP concerns (request/response)
  - Services: Business logic delegated to Shared.Library
- **Directory structure**:
  - `/Controllers` - API controller classes
  - Root level - Program.cs for application startup and configuration
- **Layer responsibilities**:
  - **Controllers**: Receive HTTP requests, validate input via model binding, call business logic (Shared.Library), return HTTP responses, perform logging
  - **Shared.Library**: Contains all mathematical operation implementations (business logic)
  - **DTOs**: Request/Response classes defined in the same file as the controller for simplicity
- **Patterns to follow**:
  - Keep controllers thin - delegate business logic to libraries or services
  - Use constructor injection for dependencies (e.g., ILogger)
  - Define request/response DTOs as public classes
  - Use appropriate HTTP verbs and route patterns
  - Add XML documentation comments for Swagger

## Database/Data Access Patterns [data-access] [database] [persistence]

- **Database(s)**: None - this is a stateless calculation service
- **ORM/Data access**: Not applicable
- **Data access pattern**: Not applicable
- **Transaction handling**: Not applicable
- **Migration approach**: Not applicable

## Service Dependencies [dependencies] [integrations] [external-services]

### Internal Services [dependencies] [internal] [services]

None - this service does not call other services.

### External APIs [dependencies] [external] [apis]

None - this service does not integrate with external APIs.

### Databases [dependencies] [databases] [data]

None - this is a stateless service.

### Message Queues/Event Systems [dependencies] [messaging] [events]

None - this service does not use message queues or event systems.

## Service Communication [communication] [inter-service] [integration]

- **Communication protocol**: REST over HTTPS
- **Client libraries**: Not applicable (this service is the provider, not a consumer)
- **Retry/Circuit breaker**: Not implemented (no outbound calls)
- **Service discovery**: Not applicable (single service, no service mesh)

## Logging Conventions [logging] [observability] [debugging]

- **Logging framework**: Built-in ASP.NET Core logging (Microsoft.Extensions.Logging)
- **Log levels used**:
  - INFO - Incoming requests and calculation operations (e.g., "Adding 5 and 3")
  - WARN - Not currently used
  - ERROR - Unhandled exceptions (logged by ASP.NET Core automatically)
  - DEBUG - Not currently used
- **Structured logging**: Yes, using structured logging with named properties
  - Example: `_logger.LogInformation("Adding {A} and {B}", request.Value1, request.Value2)`
- **What gets logged**:
  - **Calculation operations**: All calculation requests log the operation type and input values
  - **Request information**: ASP.NET Core automatically logs HTTP request details
  - **Errors**: Unhandled exceptions are automatically logged by the framework

### What Should NOT Be Logged [security] [logging] [sensitive-data]

- **Passwords and credentials**: Never log passwords, API keys, tokens, or authentication credentials
- **Personal data**: In a real application, be cautious about logging user IDs, email addresses, or other PII
- **Sensitive business data**: Financial data, proprietary calculations, or confidential business information
- **Other restricted data**: Any data subject to regulatory compliance (HIPAA, GDPR, etc.)

**Note:** This is a demonstration service with simple integer calculations. For production services handling sensitive data, review and customize logging to comply with security and privacy requirements.

## Testing Patterns [testing] [quality] [test-automation]

- **Testing frameworks**: Not currently configured (typical would be xUnit, NUnit, or MSTest)
- **Test organization**: Would typically follow the pattern:
  - Unit tests in `Service.Api.Tests` project
  - Integration tests in `Service.Api.IntegrationTests` project
- **Test types**:
  - Unit tests: Test controller actions in isolation with mocked dependencies
  - Integration tests: Test full HTTP request/response pipeline using WebApplicationFactory
- **Common patterns**:
  - Use WebApplicationFactory<Program> for integration testing
  - Mock ILogger and other dependencies for unit tests
  - Use TestServer for in-memory HTTP testing
- **Mocking approach**: Would use Moq, NSubstitute, or FakeItEasy for mocking dependencies
- **Test data**: Create test request DTOs with known inputs and expected outputs

## Configuration/Environment Variables [configuration] [environment] [settings]

### Required Environment Variables [configuration] [environment] [required]

None - service uses default configuration.

### Optional Environment Variables [configuration] [environment] [optional]

- `ASPNETCORE_ENVIRONMENT`: Determines environment (Development, Staging, Production). Affects Swagger availability and logging levels. Default: Production
- `ASPNETCORE_URLS`: Configures the URLs the service listens on. Default: `https://localhost:5001;http://localhost:5000`

### Configuration Files [configuration] [files]

- **appsettings.json**: Default configuration file (not present in this minimal example, but would contain default settings)
- **appsettings.Development.json**: Development-specific overrides (not present in this minimal example)
- **appsettings.Production.json**: Production-specific overrides (not present in this minimal example)

## Build and Deployment [build] [deployment] [ci-cd]

### Build Process [build] [compilation]

```bash
# Restore dependencies
dotnet restore

# Build the project
dotnet build

# Build for release
dotnet build -c Release
```

### Run Locally [development] [local] [setup]

```bash
# Navigate to the service directory
cd Service.Api

# Run the service
dotnet run
```

The service will start and listen on:
- **HTTPS**: https://localhost:5001
- **HTTP**: http://localhost:5000

Access Swagger UI at: https://localhost:5001/swagger (Development environment only)

### Deployment [deployment] [release] [ci-cd]

- **Build output**: Compiled assemblies in `bin/Release/net8.0/`
- **Publish**: Use `dotnet publish -c Release -o ./publish` to create deployment package
- **Deployment target**: Can be deployed to:
  - Azure App Service
  - Docker containers
  - IIS on Windows Server
  - Linux with Kestrel
- **CI/CD**: Would typically use Azure DevOps, GitHub Actions, or similar for automated builds and deployments

## Documentation [documentation] [reference]

- **README.md**: Project root contains basic API documentation with endpoint examples
- **Swagger UI**: Available at `/swagger` when running in Development mode
- **OpenAPI Specification**: Available at `/swagger/v1/swagger.json` in Development mode
- **XML Documentation**: Add XML documentation comments to controllers/actions for enhanced Swagger documentation

## Restricted Actions [security] [restrictions] [policies]

*(Leave blank initially - user should review and populate with project-specific restrictions)*

# Agent File Maintenance [metadata] [maintenance]

No LLM/AI/Agent may make changes to this file outside of the claude-context-system commands. This is a maintained file through automatic means.

# Agent File Metadata [metadata] [tracking]

- Revision Date: 2026-01-09T22:05:00Z
- Last commit SHA built from: c643e25aed1a0e80acf49197d3072448b6e101f5
- Template Version: 2.1.0
