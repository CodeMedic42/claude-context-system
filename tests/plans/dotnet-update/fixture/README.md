# DotNet Calculator

A simple .NET calculator service demonstrating a REST API with a shared library.

## Projects

- **Service.Api**: REST API service providing calculator endpoints
- **Shared.Library**: Shared mathematical operations library

## Running the Service

```bash
cd Service.Api
dotnet run
```

The API will be available at `https://localhost:5001` (or `http://localhost:5000`).

## API Endpoints

### POST /calculate/add
Adds two numbers together.

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
