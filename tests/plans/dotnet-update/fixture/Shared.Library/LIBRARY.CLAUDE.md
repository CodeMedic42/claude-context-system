# Library Context: Shared.Library

## Library Overview

Shared.Library is a .NET class library that provides basic mathematical operations. It serves as a shared computational layer that can be consumed by multiple services or applications within the solution. The library follows a simple, static API design pattern for stateless mathematical functions, making it easy to use without instantiation overhead.

## Library Type

- **Type**: Shared utility library
- **Scope**: Internal use within the DotnetCalculator solution
- **Language**: C# (.NET 8.0)

## Package Information

### Package Details

- **Package name**: Shared.Library
- **Current version**: Not versioned (internal project reference)
- **Package manager**: NuGet (via project reference)
- **Registry**: Not published - consumed as internal project reference within the solution

### Installation

This library is consumed via project reference within the solution:

```xml
<ItemGroup>
  <ProjectReference Include="..\Shared.Library\Shared.Library.csproj" />
</ItemGroup>
```

For consumers within the solution, the library is automatically built and referenced through the .NET build system.

## Core Functionality

### Main Features

1. **Addition Operations**: Provides integer addition functionality through a static API
2. **Extensible Design**: Structured to easily add more mathematical operations following the same pattern
3. **Zero-Dependency**: Pure .NET library with no external dependencies

### Public API

- **Exported functions**:
  - `Calculator.Add(int a, int b)` - Adds two integers and returns the sum
- **Exported classes**:
  - `Calculator` - Static class providing mathematical operations
- **Exported constants**: None
- **Exported types**: None (uses primitive types)

## Usage Examples

### Basic Usage

```csharp
using Shared.Library;

// Simple addition
int result = Calculator.Add(5, 3);
Console.WriteLine(result); // Output: 8

// Using with variables
int x = 10;
int y = 20;
int sum = Calculator.Add(x, y);
Console.WriteLine(sum); // Output: 30
```

### Advanced Usage

```csharp
using Shared.Library;

// Chaining operations (when more operations are added)
int step1 = Calculator.Add(5, 3);   // 8
int step2 = Calculator.Add(step1, 2); // 10

// Using in LINQ expressions
var numbers = new[] { 1, 2, 3, 4, 5 };
int total = numbers.Aggregate((a, b) => Calculator.Add(a, b));
Console.WriteLine(total); // Output: 15

// Using in conditional logic
int a = 10;
int b = 20;
int sum = Calculator.Add(a, b);
if (sum > 25)
{
    Console.WriteLine($"Sum {sum} exceeds threshold");
}
```

### Common Patterns

- **Direct static calls**: Call methods directly without instantiation (`Calculator.Add(...)`)
- **Dependency injection**: While the current implementation uses static methods, this library could be refactored to use interfaces for testability in larger applications
- **Pure functions**: All methods are pure functions with no side effects, making them safe for concurrent use

## Architecture and Design

### Design Principles

- **Simplicity**: Static methods for stateless operations, no unnecessary abstraction
- **Zero dependencies**: No external package dependencies, only .NET 8.0 runtime
- **Type-safe**: Strongly typed parameters and return values
- **Pure functions**: Methods have no side effects and return deterministic results
- **XML documentation**: All public methods include XML documentation for IntelliSense support

### Code Organization

- **Directory structure**: Flat structure with classes at the root level
- **Module organization**: One class per mathematical domain (currently only `Calculator.cs`)
- **Entry points**: The `Calculator` class serves as the main entry point

### Dependencies

- **Runtime dependencies**: None (only .NET 8.0 runtime)
- **Peer dependencies**: None
- **Optional dependencies**: None
- **Dependency philosophy**: Keep the library dependency-free to maximize portability and minimize version conflicts

## Internal Code Patterns

### File Structure Conventions

```
Shared.Library/
├── Shared.Library.csproj    # Project file with .NET 8.0 target
└── Calculator.cs            # Calculator static class with operations
```

For future expansion, the structure would follow this pattern:

```
Shared.Library/
├── Shared.Library.csproj
├── Calculator.cs            # Basic arithmetic operations
├── TrigonometryHelper.cs    # Trigonometric functions (future)
└── StatisticsHelper.cs      # Statistical operations (future)
```

### Code Style Patterns

- **Import conventions**: Namespace matches assembly name (`namespace Shared.Library`)
- **Naming conventions**:
  - PascalCase for class names (e.g., `Calculator`)
  - PascalCase for public method names (e.g., `Add`)
  - camelCase for parameters (e.g., `a`, `b`)
- **File naming**: PascalCase matching the primary class name (e.g., `Calculator.cs`)
- **Export patterns**: All public members are automatically available when namespace is imported

### Implementation Examples

**Example 1: Static Method Pattern**

```csharp
namespace Shared.Library;

/// <summary>
/// Provides basic mathematical operations
/// </summary>
public static class Calculator
{
    /// <summary>
    /// Adds two integers together
    /// </summary>
    /// <param name="a">First value</param>
    /// <param name="b">Second value</param>
    /// <returns>The sum of a and b</returns>
    public static int Add(int a, int b)
    {
        return a + b;
    }
}
```

This pattern demonstrates:
- Static class design for stateless operations
- XML documentation comments for all public members
- Simple, clear parameter names
- Single responsibility per method

**Example 2: Future Extension Pattern**

When adding new operations, follow this pattern:

```csharp
/// <summary>
/// Subtracts one integer from another
/// </summary>
/// <param name="a">The minuend</param>
/// <param name="b">The subtrahend</param>
/// <returns>The difference of a and b</returns>
public static int Subtract(int a, int b)
{
    return a - b;
}

/// <summary>
/// Multiplies two integers together
/// </summary>
/// <param name="a">First factor</param>
/// <param name="b">Second factor</param>
/// <returns>The product of a and b</returns>
public static int Multiply(int a, int b)
{
    return a * b;
}
```

This demonstrates:
- Consistent method signature pattern
- Descriptive XML comments with proper terminology
- Pure function implementations
- Type-safe integer operations

### Adding New Code

**To add a new mathematical operation:**

1. Open the `Calculator.cs` file in the `Shared.Library` project
2. Add a new public static method following the existing pattern
3. Include XML documentation with `<summary>`, `<param>`, and `<returns>` tags
4. Use clear, descriptive parameter names
5. Implement the operation as a pure function (no side effects)
6. Consider edge cases (overflow, division by zero, etc.)
7. Build the solution to verify compilation

**To add a new mathematical domain (e.g., trigonometry):**

1. Create a new file in `Shared.Library/` (e.g., `TrigonometryHelper.cs`)
2. Add the namespace `namespace Shared.Library;` at the top
3. Create a public static class (e.g., `public static class TrigonometryHelper`)
4. Add XML documentation to the class
5. Implement methods following the same pattern as Calculator
6. Add a project reference in any consuming project if needed

### Testing Patterns

- **Test file location**: Would typically be in a separate `Shared.Library.Tests` project
- **Test structure**: xUnit with fact/theory patterns, or NUnit with Test attributes
- **Common test utilities**: No special test utilities needed - operations are pure functions
- **Assertion style**: Standard xUnit `Assert.Equal` or NUnit `Assert.AreEqual`

**Example test structure:**

```csharp
public class CalculatorTests
{
    [Fact]
    public void Add_TwoPositiveNumbers_ReturnsSum()
    {
        // Arrange
        int a = 5;
        int b = 3;

        // Act
        int result = Calculator.Add(a, b);

        // Assert
        Assert.Equal(8, result);
    }

    [Theory]
    [InlineData(0, 0, 0)]
    [InlineData(5, 3, 8)]
    [InlineData(-5, 3, -2)]
    [InlineData(int.MaxValue, 0, int.MaxValue)]
    public void Add_VariousInputs_ReturnsExpectedSum(int a, int b, int expected)
    {
        // Act
        int result = Calculator.Add(a, b);

        // Assert
        Assert.Equal(expected, result);
    }
}
```

### Documentation Requirements

- **Code comments**: XML documentation required for all public types and members
- **README updates**: Not required for internal project reference
- **Example code**: Add usage examples to service/application that consumes the library
- **Type documentation**: XML docs with `<summary>`, `<param>`, `<returns>`, and `<exception>` tags as appropriate

## Configuration

### Configuration Options

Not applicable - this library contains pure functions with no configuration.

### Environment Variables

Not applicable - no environment-specific behavior.

## Type Safety

### TypeScript Support

Not applicable - this is a C# library.

### Type Exports

All methods use built-in .NET types:
- Parameters: `int` (System.Int32)
- Return values: `int` (System.Int32)

For future expansion with generics:

```csharp
public static T Add<T>(T a, T b) where T : INumber<T>
{
    return a + b;
}
```

## Testing

### Testing Approach

- **Testing framework**: Recommended xUnit, NUnit, or MSTest for .NET unit testing
- **Test coverage**: Should target 100% coverage for pure mathematical functions
- **Test types**: Unit tests (no integration or E2E tests needed for pure functions)

### Running Tests

Once tests are added:

```bash
# Run all tests
dotnet test

# Run with detailed output
dotnet test --verbosity normal

# Generate coverage report
dotnet test /p:CollectCoverage=true /p:CoverletOutputFormat=cobertura
```

### Testing for Consumers

- **Mocking**: Not needed - methods are pure functions that can be called directly in tests
- **Test utilities**: No special test utilities provided or needed

## Building and Development

### Development Setup

```bash
# Navigate to the library directory
cd Shared.Library

# Restore dependencies (minimal, only .NET SDK)
dotnet restore

# Build the library
dotnet build
```

### Build Process

- **Build command**: `dotnet build`
- **Build output**: `bin/Debug/net8.0/Shared.Library.dll` (or Release)
- **Build targets**: Single target framework: net8.0

### Development Scripts

This library uses standard .NET CLI commands:

- `dotnet build` - Builds the library
- `dotnet clean` - Cleans build artifacts
- `dotnet restore` - Restores dependencies (none currently)

## Versioning and Releases

### Versioning Strategy

- **Versioning scheme**: Not currently versioned (internal library)
- **Breaking changes**: If this becomes a published package, follow Semantic Versioning
- **Deprecation policy**: Mark methods as `[Obsolete]` for at least one major version before removal

### Release Process

Not applicable - consumed as internal project reference.

If published as a NuGet package:
1. Update version in .csproj file
2. Build in Release configuration
3. Run `dotnet pack` to create .nupkg file
4. Publish to internal or public NuGet feed
5. Update CHANGELOG.md with changes

### Changelog

- **Changelog location**: Would be maintained in `CHANGELOG.md` if published
- **Changelog format**: Keep a Changelog format recommended

## Documentation

### API Documentation

- **Documentation location**: XML documentation comments in source code
- **Documentation format**: Standard C# XML documentation
- **Documentation generation**: Can generate API docs using DocFX or similar tools

### Examples and Guides

- **Examples directory**: Usage examples provided in this file and in consuming services (Service.Api)
- **Guide topics**:
  - Basic usage of mathematical operations
  - Adding new operations
  - Extension patterns for new mathematical domains

## Compatibility

### Platform Support

- **Node.js versions**: Not applicable (.NET library)
- **.NET versions**: Requires .NET 8.0 or later
- **Platform compatibility**:
  - Windows (x64, x86, ARM64)
  - Linux (x64, ARM64)
  - macOS (x64, ARM64)

### Framework Integration

- **ASP.NET Core**: Fully compatible - used by Service.Api
- **Blazor**: Compatible for use in Blazor Server or WebAssembly
- **Console applications**: Compatible
- **Desktop applications**: Compatible (WPF, WinForms, MAUI)

## Performance Considerations

### Performance Characteristics

- **Performance goals**: Sub-microsecond execution for basic operations
- **Assembly size**: Minimal - approximately 4-6 KB compiled
- **JIT optimization**: Methods are small enough for aggressive JIT inlining
- **Performance benchmarks**: Not formally benchmarked (operations are trivial)

### Optimization Tips

- Static methods avoid allocation overhead
- Integer operations are processor-native and extremely fast
- Methods are pure functions, safe for concurrent access without locks
- Consider using `[MethodImpl(MethodImplOptions.AggressiveInlining)]` for performance-critical paths

## Security

### Security Considerations

- **Input validation**: No validation needed - type system enforces integer inputs
- **Security audits**: No special security concerns for pure mathematical functions
- **Vulnerability reporting**: Not applicable for internal library

### Safe Usage Patterns

- **Overflow handling**: Be aware that `int.MaxValue + 1` will overflow. Consider using `checked` arithmetic:
  ```csharp
  checked
  {
      int result = Calculator.Add(int.MaxValue, 1); // Throws OverflowException
  }
  ```
- **Unchecked arithmetic**: By default, C# uses unchecked arithmetic which wraps on overflow

## Migration and Upgrade Guides

### Upgrading

Not applicable - internal library with no published versions.

If this becomes a versioned package:
- **Breaking changes**: Document in CHANGELOG.md and migration guide
- **Migration guides**: Create separate documentation for major version migrations
- **Codemod tools**: Not applicable for simple API

## Contributing

### How to Contribute

For internal development:
- **Contribution process**: Follow standard team code review process
- **Code style**: Follow C# coding conventions and existing patterns in the library
- **Pull request process**: Create feature branch, implement changes, submit PR for review

### Development Guidelines

- Maintain pure function implementations (no side effects)
- Add XML documentation for all public members
- Use descriptive method and parameter names
- Consider edge cases (overflow, boundary conditions)
- Keep methods simple and single-purpose

## Support and Maintenance

### Support Channels

Internal library - contact development team through standard channels.

### Maintenance Status

- **Status**: Actively maintained as part of the DotnetCalculator solution
- **Maintainers**: Development team maintaining the DotnetCalculator solution

## Restricted Actions

*(Leave blank initially - user should review and populate with project-specific restrictions)*

# Agent File Metadata

- Date Created: 2026-01-09T22:05:00Z
- Date Modified: 2026-01-09T22:05:00Z
- Last commit SHA built from: c643e25aed1a0e80acf49197d3072448b6e101f5
- Template Version: 2.1.0
