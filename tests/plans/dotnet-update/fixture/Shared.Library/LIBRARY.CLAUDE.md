# Library Context: Shared.Library

## Library Overview [overview] [summary]
Shared.Library provides basic mathematical operations for the DotNet Calculator application. It is a class library that exposes static methods for common calculator functions like addition.

## Library Type [metadata] [classification]
- **Type**: Shared utility library
- **Scope**: Internal use only (within DotNet Calculator solution)
- **Language**: C# (.NET 8.0)

## Package Information [package] [distribution] [installation]

### Package Details [package] [metadata]
- **Package name**: Shared.Library
- **Current version**: 1.0.0 (implicit from project structure)
- **Package manager**: NuGet (via .NET project reference)
- **Registry**: Local project reference

### Installation [installation] [setup]
Add as a project reference in consuming .NET projects:
```xml
<ItemGroup>
  <ProjectReference Include="..\Shared.Library\Shared.Library.csproj" />
</ItemGroup>
```

## Core Functionality [features] [api] [functionality]

### Main Features [features] [capabilities]
1. **Integer Addition**: Provides a static method to add two integer values together

### Public API [api] [exports] [interface]
- **Exported classes**:
  - `Calculator`: Static class providing mathematical operations

## API Reference [api-reference] [documentation] [reference]

### Classes [classes] [api]

#### `Calculator`
- **Purpose**: Provides basic mathematical operations as static methods
- **Methods**:
  - `Add(int a, int b)`: Adds two integers together and returns the sum
- **Example**:
```csharp
using Shared.Library;

int result = Calculator.Add(5, 3); // Returns 8
```

## Usage Examples [examples] [usage] [how-to]

### Basic Usage [examples] [basic] [getting-started]
```csharp
using Shared.Library;

// Add two numbers
int sum = Calculator.Add(10, 20);
Console.WriteLine($"Sum: {sum}"); // Output: Sum: 30
```

## Architecture and Design [architecture] [design] [patterns]

### Design Principles [design] [principles]
- **Static API**: All methods are static, no instantiation required
- **Type-safe**: Uses strongly-typed integer parameters and return values
- **Immutable**: No state, pure functions only

### Code Organization [organization] [structure]
- **Directory structure**: Flat structure with single Calculator.cs file
- **Module organization**: Single static class in Shared.Library namespace
- **Entry points**: Calculator class is the sole public API

### Dependencies [dependencies] [packages]
- **Runtime dependencies**: None (standalone library)
- **Dependency philosophy**: Zero-dependency approach for maximum compatibility

## Building and Development [build] [development] [setup]

### Development Setup [development] [setup]
```bash
# From repository root
dotnet restore
dotnet build Shared.Library/Shared.Library.csproj
```

### Build Process [build] [compilation]
- **Build command**: `dotnet build Shared.Library/Shared.Library.csproj`
- **Build output**: bin/Debug/net8.0/ or bin/Release/net8.0/
- **Build targets**: .NET 8.0 class library

## Compatibility [compatibility] [platform-support] [requirements]

### Platform Support [compatibility] [platforms]
- **Node.js versions**: N/A (not a Node.js library)
- **.NET versions**: .NET 8.0
- **Platform compatibility**: Cross-platform (Windows, macOS, Linux via .NET 8.0)

## Restricted Actions [security] [restrictions] [policies]



# Agent File Maintenance [metadata] [maintenance]

No LLM/AI/Agent may make changes to this file outside of the claude-context-system commands. This is a maintained file through automatic means.

# Agent File Metadata [metadata] [tracking]

- Revision Date: 2026-02-19T00:00:00.000Z
- Last commit SHA built from: 0d63ad91f84901483b6a233cae73d56ad576aa5c
- Template Version: 2.1.0
