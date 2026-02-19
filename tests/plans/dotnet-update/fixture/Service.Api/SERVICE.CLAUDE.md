# Service Context: Service.Api

## Service Overview [overview] [summary]
Service.Api is a REST API service that provides HTTP endpoints for calculator operations. It is built with ASP.NET Core and uses the Shared.Library for performing mathematical operations. The service includes Swagger/OpenAPI documentation for API exploration.

## Technologies [technologies] [stack]
- **Language**: C# (.NET 8.0)
- **Framework**: ASP.NET Core (Minimal API with Controllers)
- **Key Dependencies**:
  - Shared.Library (internal mathematical operations)
  - Swashbuckle.AspNetCore (Swagger/OpenAPI documentation)

## API Endpoints [api] [endpoints] [routes]

### Endpoint Patterns [api] [routing] [patterns]
- **Routing pattern**: Routes defined using controller classes with [Route] and HTTP verb attributes
- **Endpoint structure**: `/calculate/{operation}` - REST-style resource-based routing
- **Common patterns**: Controllers inherit from ControllerBase, use [ApiController] attribute, accept [FromBody] DTOs for POST requests

### POST /calculate/add

Adds two integer numbers together and returns the sum.

**Request:**
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

- **Purpose**: Performs addition of two integer values
- **Request Parameters**:
  - `value1` (int): First value to add
  - `value2` (int): Second value to add
- **Response Format**: JSON object with `result` property containing the sum
- **Status Codes**: 200 OK, 400 Bad Request (if model validation fails)
- **Authentication**: Not required
- **Implementation**: Delegates to `Calculator.Add()` from Shared.Library

## Request/Response Conventions [conventions] [patterns] [api]
- **Request conventions**: DTOs (CalculateRequest) for complex inputs passed via [FromBody]
- **Response format**: JSON objects with descriptive property names
- **Content types**: application/json for both requests and responses

## Code Organization Patterns [architecture] [code-structure] [organization]
- **Architecture**: MVC pattern with Controllers handling HTTP requests
- **Directory structure**:
  - Controllers/ - API controller classes
  - Program.cs - Application startup and configuration
- **Layer responsibilities**:
  - Controllers: Handle HTTP requests, validate input, delegate to business logic
  - Shared.Library: Business logic and mathematical operations
- **Patterns to follow**:
  - Controllers use dependency injection for ILogger
  - DTOs defined in same file as controller for simple cases
  - ActionResult<T> return types for type-safe responses

## Service Dependencies [dependencies] [integrations] [external-services]

### Internal Services [dependencies] [internal] [services]
- **Shared.Library**: Referenced as a project dependency for Calculator.Add() operations

## Logging Conventions [logging] [observability] [debugging]
- **Logging framework**: Microsoft.Extensions.Logging (built-in ASP.NET Core logging)
- **Log levels used**:
  - INFO: Request operations (e.g., "Adding 5 and 3")
- **Structured logging**: Uses structured logging with named parameters (e.g., `{A}` and `{B}`)
- **What gets logged**:
  - **API operations**: All calculator operations log the input values before processing

### What Should NOT Be Logged [security] [logging] [sensitive-data]
- **Passwords and credentials**: Never log passwords, API keys, tokens
- **Personal data**: Do not log any personally identifiable information (PII)
- **Sensitive business data**: For calculator operations, all data is non-sensitive

## Configuration/Environment Variables [configuration] [environment] [settings]

### Configuration Files [configuration] [files]
- **appsettings.json**: Standard ASP.NET Core configuration file
- **appsettings.Development.json**: Development environment overrides
- **Program.cs**: Configures services and middleware pipeline

## Build and Development [build] [development] [local]

### Build Process [build] [compilation]
```bash
dotnet build Service.Api/Service.Api.csproj
```

### Run Locally [development] [local] [setup]
```bash
cd Service.Api
dotnet run
```

The API will be available at:
- HTTPS: https://localhost:5001
- HTTP: http://localhost:5000
- Swagger UI: https://localhost:5001/swagger (in Development mode)

## Restricted Actions [security] [restrictions] [policies]



# Agent File Maintenance [metadata] [maintenance]

No LLM/AI/Agent may make changes to this file outside of the claude-context-system commands. This is a maintained file through automatic means.

# Agent File Metadata [metadata] [tracking]

- Revision Date: 2026-02-19T00:00:00.000Z
- Last commit SHA built from: 0d63ad91f84901483b6a233cae73d56ad576aa5c
- Template Version: 2.1.0
