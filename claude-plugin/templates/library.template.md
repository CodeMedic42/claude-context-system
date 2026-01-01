# Library Context: {Library Name}

## Library Overview
{Provide a clear description of what this library does, its primary purpose, and what problems it solves}

## Library Type
{Specify the type of library}
- **Type**: {e.g., "Shared utility library", "UI component library", "Plugin", "SDK", "CLI tool"}
- **Scope**: {e.g., "Internal use only", "Public package", "Organization-wide"}
- **Language**: {Primary programming language}

## Package Information

### Package Details
{Information about the package distribution}
- **Package name**: {e.g., "@company/utils", "my-library"}
- **Current version**: {Current version number}
- **Package manager**: {e.g., "npm", "yarn", "pip", "Maven", "NuGet"}
- **Registry**: {Where the package is published - npm, private registry, etc.}

### Installation
{How consumers install this library}
```
{Installation command, e.g.:
npm install @company/utils
pip install my-library
dotnet add package MyLibrary
}
```

## Core Functionality

### Main Features
{List the main features/capabilities this library provides}
1. {Feature 1}: {Brief description}
2. {Feature 2}: {Brief description}
3. {Feature 3}: {Brief description}

### Public API
{Describe the public API surface}
- **Exported functions**: {List key exported functions and their purposes}
- **Exported classes**: {List key classes/types}
- **Exported constants**: {List key constants or enums}
- **Exported types**: {List key TypeScript types/interfaces if applicable}

## Usage Examples

### Basic Usage
{Provide a simple usage example}
```{language}
{Basic usage example showing how to import and use the library}
```

### Advanced Usage
{Provide more complex usage examples}
```{language}
{Advanced usage example showing more sophisticated features}
```

### Common Patterns
{Describe common patterns for using this library}
- **Pattern 1**: {Description and when to use it}
- **Pattern 2**: {Description and when to use it}

## Architecture and Design

### Design Principles
{Describe the design principles guiding this library}
- **Principle 1**: {e.g., "Immutability", "Zero dependencies", "Tree-shakeable"}
- **Principle 2**: {e.g., "Type-safe", "Backward compatible", "Framework agnostic"}
- **Principle 3**: {e.g., "Performance-focused", "Memory-efficient"}

### Code Organization
{Describe how the library code is organized}
- **Directory structure**: {Brief overview of folder organization}
- **Module organization**: {How modules/files are structured}
- **Entry points**: {Main entry points for the library}

### Dependencies
{List and describe key dependencies}
- **Runtime dependencies**: {Dependencies required at runtime}
- **Peer dependencies**: {Dependencies consumers must provide}
- **Optional dependencies**: {Dependencies that enable additional features}
- **Dependency philosophy**: {Approach to managing dependencies}

## Internal Code Patterns

### File Structure Conventions
{Describe how files are typically organized within the library}
```
{Provide a concrete example of a typical module/component file structure, e.g.:
src/
  components/
    button/
      ├── index.ts              # Re-exports the main component
      ├── Button.tsx            # Component implementation
      ├── Button.types.ts       # TypeScript type definitions
      ├── Button.styles.scss    # Component styles
      ├── Button.test.tsx       # Unit tests
      └── Button.stories.tsx    # Storybook stories (if applicable)
}
```

### Code Style Patterns
{Describe common coding patterns used within the library}
- **Import conventions**: {e.g., "Absolute imports from 'src/'", "Named exports preferred over default exports"}
- **Naming conventions**: {e.g., "PascalCase for components/classes", "camelCase for functions", "UPPER_CASE for constants"}
- **File naming**: {e.g., "kebab-case.ts", "PascalCase.tsx for components"}
- **Export patterns**: {e.g., "Export from index.ts barrel files", "Direct named exports"}

### Implementation Examples
{Provide 1-2 representative code snippets showing typical internal patterns}

**Example 1: {Typical Pattern Name}**
```{language}
{
Show a real example from the codebase demonstrating:
- Typical function/class structure
- Common prop/parameter patterns
- How internal utilities are used
- Error handling approach
}
```

**Example 2: {Another Common Pattern}**
```{language}
{
Another example showing:
- How components compose other components
- How to use shared utilities
- State management patterns
- Testing patterns
}
```

### Adding New Code
{Step-by-step guidance for adding new modules/components/features}

**To add a new {module/component/feature}:**
1. {Step 1 - e.g., "Create a new directory under src/{location}/ using {naming-convention}"}
2. {Step 2 - e.g., "Create the main implementation file: {FileName}.{ext}"}
3. {Step 3 - e.g., "Add type definitions in {FileName}.types.ts"}
4. {Step 4 - e.g., "Create unit tests in {FileName}.test.ts"}
5. {Step 5 - e.g., "Export from the module's index.ts"}
6. {Step 6 - e.g., "Update the main library index to include the new export"}
7. {Step 7 - e.g., "Add documentation/examples as needed"}

### Testing Patterns
{Describe how tests are typically structured within the library}
- **Test file location**: {e.g., "Co-located with source files", "In separate __tests__ directory"}
- **Test structure**: {e.g., "describe/it blocks", "Arrange-Act-Assert pattern"}
- **Common test utilities**: {e.g., "Custom test helpers in src/test-utils/", "Mock factories"}
- **Assertion style**: {e.g., "Jest expect assertions", "Chai should/expect"}

### Documentation Requirements
{What documentation should accompany new code}
- **Code comments**: {e.g., "JSDoc/TSDoc for public APIs", "Inline comments for complex logic"}
- **README updates**: {When to update README}
- **Example code**: {When examples are required}
- **Type documentation**: {How to document complex types}

## Configuration

### Configuration Options
{If the library accepts configuration, describe options}
- **Configuration method**: {How configuration is provided - constructor args, config file, env vars}
- **Available options**: {List configuration options and their purposes}
- **Default values**: {What defaults are used if not configured}

### Environment Variables
{If applicable, list environment variables}
- `{VAR_NAME}`: {Description and default value}

## Type Safety

### TypeScript Support
{If applicable, describe TypeScript support}
- **Type definitions**: {Where type definitions are located}
- **Type coverage**: {Level of type coverage}
- **Generic types**: {Key generic types provided}
- **Type utilities**: {Helper types or type utilities included}

### Type Exports
{List important exported types}
```typescript
{Example of key type exports}
```

## Testing

### Testing Approach
{Describe how the library is tested}
- **Testing framework**: {e.g., "Jest", "Vitest", "pytest", "xUnit"}
- **Test coverage**: {Target or current coverage percentage}
- **Test types**: {Unit, integration, etc.}

### Running Tests
{Commands to run tests}
- **Run all tests**: {Command}
- **Run specific tests**: {Command}
- **Coverage report**: {Command}

### Testing for Consumers
{Guidance for consumers who want to test code using this library}
- **Mocking**: {How to mock this library in tests}
- **Test utilities**: {Any test utilities or helpers provided}

## Building and Development

### Development Setup
{Steps to set up the library for development}
```bash
{Commands to install dependencies and set up dev environment}
```

### Build Process
{How to build the library}
- **Build command**: {Command to build the library}
- **Build output**: {Where build artifacts are created}
- **Build targets**: {Different build formats - ESM, CJS, UMD, etc.}

### Development Scripts
{Key npm/package scripts for development}
- `{script-name}`: {What it does}

## Versioning and Releases

### Versioning Strategy
{Describe versioning approach}
- **Versioning scheme**: {e.g., "Semantic Versioning (semver)"}
- **Breaking changes**: {How breaking changes are handled}
- **Deprecation policy**: {How deprecations are communicated}

### Release Process
{Steps to release a new version}
1. {Step 1}
2. {Step 2}
3. {Step 3}

### Changelog
{Where changelog is maintained}
- **Changelog location**: {e.g., "CHANGELOG.md in repository root"}
- **Changelog format**: {e.g., "Keep a Changelog format"}

## Documentation

### API Documentation
{Where API documentation lives}
- **Documentation location**: {e.g., "Generated docs at /docs", "README.md", "External doc site"}
- **Documentation format**: {e.g., "JSDoc", "TSDoc", "Sphinx", "Docusaurus"}
- **Documentation generation**: {Command to generate docs if applicable}

### Examples and Guides
{Location of examples and guides}
- **Examples directory**: {Path to examples}
- **Guide topics**: {List of key guides or tutorials}

## Compatibility

### Platform Support
{Describe platform compatibility}
- **Node.js versions**: {Supported Node versions}
- **Browser support**: {If applicable, supported browsers}
- **Platform compatibility**: {Other platform requirements}

### Framework Integration
{If applicable, describe framework integrations}
- **React**: {React-specific usage or components}
- **Vue**: {Vue-specific usage}
- **Other frameworks**: {Other framework integrations}

## Performance Considerations

### Performance Characteristics
{Describe performance aspects}
- **Performance goals**: {e.g., "Sub-millisecond operations", "Zero-copy where possible"}
- **Bundle size**: {Approximate bundle size impact}
- **Tree-shaking**: {Whether library is tree-shakeable}
- **Performance benchmarks**: {Where benchmarks can be found}

### Optimization Tips
{Tips for optimal usage}
- {Tip 1}
- {Tip 2}

## Security

### Security Considerations
{Security aspects consumers should know}
- **Input validation**: {How inputs are validated}
- **Security audits**: {Whether/how library is audited}
- **Vulnerability reporting**: {How to report security issues}

### Safe Usage Patterns
{Patterns to ensure safe usage}
- {Pattern 1}
- {Pattern 2}

## Migration and Upgrade Guides

### Upgrading
{Guidance for upgrading between versions}
- **Breaking changes**: {Where to find breaking change documentation}
- **Migration guides**: {Links to migration guides for major versions}
- **Codemod tools**: {If available, tools to help with upgrades}

## Contributing

### How to Contribute
{If applicable, guidelines for contributing}
- **Contribution process**: {Brief overview}
- **Code style**: {Code style guidelines}
- **Pull request process**: {How PRs are reviewed}

### Development Guidelines
{Guidelines for developers working on this library}
- {Guideline 1}
- {Guideline 2}

## Support and Maintenance

### Support Channels
{Where users can get help}
- **Issues**: {Link to issue tracker}
- **Discussions**: {Link to discussions/forum}
- **Chat**: {If applicable, Slack/Discord}

### Maintenance Status
{Current maintenance status}
- **Status**: {e.g., "Actively maintained", "Maintenance mode", "Stable"}
- **Maintainers**: {Who maintains this library}

## Restricted Actions
{Define actions that AI agents should NOT perform when working with this library}

{Leave blank initially - user should review and populate}

# Library File Metadata
{
	This section contains the following information

	- Date Created: timestamp
	- Date Modified: timestamp
	- Last commit SHA built from: GIT SHA
	- Template Version: {version from plugin.json}
}
