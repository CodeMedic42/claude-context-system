# Library Context: ~:Library Name:~

## Template Usage Guidelines

**IMPORTANT: Exclude sections that contain no meaningful information.**

### When to EXCLUDE a section:
- The section would only contain placeholder text, "N/A", "None", or "Not applicable"
- The library doesn't have that feature (e.g., no HTTP endpoints, no configuration options)
- The information is obvious or adds no value (e.g., "this is written in JavaScript" for a JS-only repo)
- The section would duplicate information already stated elsewhere

### When to INCLUDE a section:
- It contains specific, actionable information
- It documents behavior that isn't immediately obvious from the code
- It would help an AI agent or developer understand how to use or extend the library
- It describes important constraints, patterns, or conventions

### How to use this template:
1. Fill in sections that have meaningful content for your library
2. DELETE entire sections (including headers) that don't apply or have no material information
3. Keep the document focused and concise - quality over completeness

---

## Library Overview
~:Provide a clear description of what this library does, its primary purpose, and what problems it solves:~

## Library Type
~:Specify the type of library - EXCLUDE this section if type is obvious from context:~
- **Type**: ~:e.g., "Shared utility library", "UI component library", "Plugin", "SDK", "CLI tool", "Middleware", "Express/Gateway Plugin":~
- **Scope**: ~:e.g., "Internal use only", "Public package", "Organization-wide":~
- **Language**: ~:Primary programming language:~

## Package Information

### Package Details
~:Information about the package distribution:~
- **Package name**: ~:e.g., "@company/utils", "my-library":~
- **Current version**: ~:Current version number:~
- **Package manager**: ~:e.g., "npm", "yarn", "pip", "Maven", "NuGet":~
- **Registry**: ~:Where the package is published - npm, private registry, etc.:~

### Installation
~:How consumers install this library:~
```
{Installation command, e.g.:
npm install @company/utils
pip install my-library
dotnet add package MyLibrary
}
```

## Core Functionality

~:DISCOVERY PROMPTS for automated generation:
- Search for route/endpoint definitions (files like *-api.js, *-routes.js, *router*, */routes/*)
- Search for exported plugin functions (files like *-plugin.js, */index.js, *middleware*)
- Look for middleware registration patterns (app.use, gateway.use, router.use)
- Check for context modifications (ctx.set, context.set, req.*, res.*)
- Identify service action registrations (broker.createService, actions: {})
- Find configuration schemas or option objects
:~

### Main Features
~:List the main features/capabilities this library provides - EXCLUDE if fewer than 2 features:~
1. ~:Feature 1:~: ~:Brief description:~
2. ~:Feature 2:~: ~:Brief description:~
3. ~:Feature 3:~: ~:Brief description:~

### Public API
~:Describe the public API surface - EXCLUDE subsections with no exports:~
- **Exported plugins**: ~:List plugins/middleware and their purposes - DELETE this line if none:~
  - `~:PluginName:~`: ~:Brief purpose:~
- **Exported functions**: ~:List key exported functions and their purposes - DELETE this line if none:~
  - `~:functionName:~`: ~:Brief purpose:~
- **Exported classes**: ~:List key classes/types - DELETE this line if none:~
  - `~:ClassName:~`: ~:Brief purpose:~
- **Exported constants**: ~:List key constants or enums - DELETE this line if none:~
  - `~:CONSTANT_NAME:~`: ~:Brief purpose:~
- **Exported types**: ~:List key TypeScript types/interfaces if applicable - DELETE this line if none:~
  - `~:TypeName:~`: ~:Brief purpose:~
- **Exported utilities**: ~:List utility objects or helper collections - DELETE this line if none:~
  - `~:UtilObject:~`: ~:Brief purpose:~

## Generated/Registered APIs
~:EXCLUDE THIS ENTIRE SECTION if the library doesn't automatically create routes, services, or APIs when initialized:~

~:If this library automatically creates routes, services, or APIs when initialized, document them here:~

### HTTP Routes
~:EXCLUDE this subsection if no HTTP routes are created:~

~:List all HTTP routes this library creates - include ALL endpoints with full details:~

| Method | Path | Purpose | Response Type | Auth Required | Audit Logged |
|--------|------|---------|---------------|---------------|--------------|
| ~:GET:~ | ~:/full/path:~ | ~:What it does:~ | ~:JSON/void/etc:~ | ~:Yes/No:~ | ~:Yes/No:~ |

~:For each endpoint, provide additional details:~

#### ~:Method:~ `~:/endpoint/path:~`
- **Purpose**: ~:Detailed description:~
- **Request Parameters**: ~:Query params, path params, body schema:~
- **Response Format**: ~:Describe response structure or note if void:~
- **Status Codes**: ~:200, 404, 500, etc.:~
- **Authentication**: ~:Required level or not required:~
- **Special Configuration**: ~:Any settings that affect this endpoint:~

### Service Actions
~:EXCLUDE this subsection if not using a service broker pattern:~

~:If using a service broker pattern (like @pcc-prompt/services), list actions registered:~
- `~:action.name:~`: ~:Description and purpose:~
- `~:action.name:~`: ~:Description and purpose:~

### Event Listeners
~:EXCLUDE this subsection if no event listeners are registered:~

~:If this registers event listeners or subscribers:~
- **~:Event name:~**: ~:What it does when triggered:~

### Context Additions
~:EXCLUDE this subsection if nothing is added to context/request:~

~:What this plugin/library adds to the application context or request object:~
- `~:context.key:~` (~:type:~): ~:Description and when it's available:~

## API Reference
~:EXCLUDE THIS ENTIRE SECTION if the library has simple/self-explanatory exports covered in Public API section:~

~:For libraries with complex APIs, document key functions/methods/classes in detail:~

### Functions
~:EXCLUDE this subsection if no functions need detailed documentation:~

#### `~:functionName(param1, param2):~`
- **Purpose**: ~:What it does:~
- **Parameters**:
  - `param1` (~:type:~): ~:Description:~
  - `param2` (~:type:~): ~:Description:~
- **Returns**: ~:Return type and description:~
- **Throws**: ~:What errors it might throw - EXCLUDE if none:~
- **Example**:
```~:language:~
~:Usage example:~
```

### Classes
~:EXCLUDE this subsection if no classes need detailed documentation:~

#### `~:ClassName:~`
- **Purpose**: ~:What this class does:~
- **Constructor**: `new ClassName(~:params:~)`
- **Methods**:
  - `~:methodName():~`: ~:Description:~
- **Example**:
```~:language:~
~:Usage example:~
```

## Usage Examples

### Basic Usage
~:Provide a simple usage example showing the most common use case:~
```~:language:~
~:Basic usage example showing how to import and use the library:~
```

### Plugin/Middleware Usage
~:EXCLUDE this subsection if not a plugin/middleware library:~

~:Show how to register and use this plugin/middleware:~
```~:language:~
const { PluginName } = require('@package/name');

// Registration
gateway.use(PluginName);
// OR
app.use(PluginName);

// What this enables:
// - Feature 1: Description
// - Feature 2: Description
// - Endpoints created: List them
```

### Advanced Usage
~:EXCLUDE this subsection if basic usage covers all common scenarios:~

~:Provide more complex usage examples:~
```~:language:~
~:Advanced usage example showing more sophisticated features:~
```

### Common Patterns
~:EXCLUDE this subsection if there are no notable patterns:~

~:Describe common patterns for using this library:~
- **Pattern 1**: ~:Description and when to use it:~
- **Pattern 2**: ~:Description and when to use it:~

## Architecture and Design

### Design Principles
~:EXCLUDE this subsection if principles are standard/unremarkable:~

~:Describe the design principles guiding this library:~
- **Principle 1**: ~:e.g., "Immutability", "Zero dependencies", "Tree-shakeable":~
- **Principle 2**: ~:e.g., "Type-safe", "Backward compatible", "Framework agnostic":~
- **Principle 3**: ~:e.g., "Performance-focused", "Memory-efficient":~

### Code Organization
~:Describe how the library code is organized:~
- **Directory structure**: ~:Brief overview of folder organization:~
- **Module organization**: ~:How modules/files are structured:~
- **Entry points**: ~:Main entry points for the library:~

### Dependencies
~:List and describe key dependencies - EXCLUDE subsections with no dependencies:~
- **Runtime dependencies**: ~:Dependencies required at runtime - DELETE this line if none:~
- **Peer dependencies**: ~:Dependencies consumers must provide - DELETE this line if none:~
- **Optional dependencies**: ~:Dependencies that enable additional features - DELETE this line if none:~
- **Dev dependencies**: ~:Key development dependencies - DELETE this line if not material:~
- **Dependency philosophy**: ~:Approach to managing dependencies:~

## Internal Code Patterns
~:EXCLUDE THIS ENTIRE SECTION if library is small/simple with obvious patterns:~

### File Structure Conventions
~:Describe how files are typically organized within the library:~
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
~:EXCLUDE this subsection if using standard conventions:~

~:Describe common coding patterns used within the library:~
- **Import conventions**: ~:e.g., "Absolute imports from 'src/'", "Named exports preferred over default exports":~
- **Naming conventions**: ~:e.g., "PascalCase for components/classes", "camelCase for functions", "UPPER_CASE for constants":~
- **File naming**: ~:e.g., "kebab-case.ts", "PascalCase.tsx for components":~
- **Export patterns**: ~:e.g., "Export from index.ts barrel files", "Direct named exports":~

### Implementation Examples
~:EXCLUDE this subsection if patterns are standard or obvious:~

~:Provide 1-2 representative code snippets showing typical internal patterns:~

**Example 1: ~:Typical Pattern Name:~**
```~:language:~
{
Show a real example from the codebase demonstrating:
- Typical function/class structure
- Common prop/parameter patterns
- How internal utilities are used
- Error handling approach
}
```

**Example 2: ~:Another Common Pattern:~**
~:EXCLUDE this if one example is sufficient:~
```~:language:~
{
Another example showing:
- How components compose other components
- How to use shared utilities
- State management patterns
- Testing patterns
}
```

### Adding New Code
~:EXCLUDE this subsection if process is standard or obvious:~

~:Step-by-step guidance for adding new modules/components/features:~

**To add a new ~:module/component/feature:~:**
1. ~:Step 1 - e.g., "Create a new directory under src/{location}/ using {naming-convention}":~
2. ~:Step 2 - e.g., "Create the main implementation file: {FileName}.{ext}":~
3. ~:Step 3 - e.g., "Add type definitions in {FileName}.types.ts":~
4. ~:Step 4 - e.g., "Create unit tests in {FileName}.test.ts":~
5. ~:Step 5 - e.g., "Export from the module's index.ts":~
6. ~:Step 6 - e.g., "Update the main library index to include the new export":~
7. ~:Step 7 - e.g., "Add documentation/examples as needed":~

### Testing Patterns
~:EXCLUDE this subsection if test patterns are standard:~

~:Describe how tests are typically structured within the library:~
- **Test file location**: ~:e.g., "Co-located with source files", "In separate __tests__ directory":~
- **Test structure**: ~:e.g., "describe/it blocks", "Arrange-Act-Assert pattern":~
- **Common test utilities**: ~:e.g., "Custom test helpers in src/test-utils/", "Mock factories":~
- **Assertion style**: ~:e.g., "Jest expect assertions", "Chai should/expect":~

### Documentation Requirements
~:EXCLUDE this subsection if documentation requirements are standard:~

~:What documentation should accompany new code:~
- **Code comments**: ~:e.g., "JSDoc/TSDoc for public APIs", "Inline comments for complex logic":~
- **README updates**: ~:When to update README:~
- **Example code**: ~:When examples are required:~
- **Type documentation**: ~:How to document complex types:~

## Configuration
~:EXCLUDE THIS ENTIRE SECTION if the library has no configuration options:~

### Configuration Options
~:If the library accepts configuration, describe options:~
- **Configuration method**: ~:How configuration is provided - constructor args, config file, env vars:~
- **Configuration schema**: ~:If available, link to JSON schema or type definition - DELETE this line if none:~
- **Available options**:

#### `~:optionName:~`
- **Type**: ~:Data type:~
- **Default**: ~:Default value:~
- **Required**: ~:Yes/No:~
- **Description**: ~:What this option does:~
- **Example**: `~:example value:~`

~:Repeat for each major configuration option:~

### Environment Variables
~:EXCLUDE this subsection if no environment variables are used:~

~:If applicable, list environment variables:~
- `~:VAR_NAME:~`: ~:Description, default value, and when it's required:~

## Integration Points
~:EXCLUDE THIS ENTIRE SECTION if library is standalone with no integrations:~

### What This Library Modifies/Extends
~:Describe what the library hooks into or modifies:~
- **Application startup**: ~:What happens during initialization - DELETE this line if nothing:~
- **Request lifecycle**: ~:If it intercepts requests, where in the lifecycle - DELETE this line if not applicable:~
- **Response lifecycle**: ~:If it modifies responses - DELETE this line if not applicable:~
- **Application context**: ~:What it adds to shared context - DELETE this line if nothing:~
- **Database/External services**: ~:What external connections it creates - DELETE this line if none:~

### Dependencies on Other Libraries
~:EXCLUDE this subsection if library is standalone:~

~:If this library requires or works with specific other libraries:~
- **Required libraries**: ~:Must be used with - DELETE this line if none:~
- **Optional integrations**: ~:Can enhance these libraries - DELETE this line if none:~
- **Conflicts**: ~:Known conflicts or incompatibilities - DELETE this line if none:~

## Type Safety
~:EXCLUDE THIS ENTIRE SECTION if not using TypeScript or not providing type definitions:~

### TypeScript Support
~:If applicable, describe TypeScript support:~
- **Type definitions**: ~:Where type definitions are located:~
- **Type coverage**: ~:Level of type coverage:~
- **Generic types**: ~:Key generic types provided - DELETE this line if none:~
- **Type utilities**: ~:Helper types or type utilities included - DELETE this line if none:~

### Type Exports
~:EXCLUDE this subsection if no notable types are exported:~

~:List important exported types:~
```typescript
~:Example of key type exports:~
```

## Testing

### Testing Approach
~:Describe how the library is tested:~
- **Testing framework**: ~:e.g., "Jest", "Vitest", "Mocha", "pytest", "xUnit":~
- **Test coverage**: ~:Target or current coverage percentage - DELETE this line if unknown/not tracked:~
- **Test types**: ~:Unit, integration, E2E, etc.:~

### Running Tests
~:Commands to run tests:~
- **Run all tests**: `~:Command:~`
- **Run specific tests**: `~:Command:~` ~:DELETE this line if not applicable:~
- **Coverage report**: `~:Command:~` ~:DELETE this line if not configured:~
- **Watch mode**: `~:Command:~` ~:DELETE this line if not available:~

### Testing for Consumers
~:EXCLUDE this subsection if library doesn't need special mocking/test utilities:~

~:Guidance for consumers who want to test code using this library:~
- **Mocking**: ~:How to mock this library in tests:~
- **Test utilities**: ~:Any test utilities or helpers provided - DELETE this line if none:~

## Building and Development

### Development Setup
~:Steps to set up the library for development:~
```bash
~:Commands to install dependencies and set up dev environment:~
```

### Build Process
~:EXCLUDE this subsection if no build step required:~

~:How to build the library:~
- **Build command**: `~:Command to build the library:~`
- **Build output**: ~:Where build artifacts are created:~
- **Build targets**: ~:Different build formats - ESM, CJS, UMD, etc.:~

### Development Scripts
~:Key npm/package scripts for development:~
- `~:script-name:~`: ~:What it does:~
- `~:script-name:~`: ~:What it does:~

### Changelog
~:EXCLUDE this subsection if no changelog is maintained:~

~:Where changelog is maintained:~
- **Changelog location**: ~:e.g., "CHANGELOG.md in repository root":~
- **Changelog format**: ~:e.g., "Keep a Changelog format":~

## Documentation

### API Documentation
~:Where API documentation lives:~
- **Documentation location**: ~:e.g., "Generated docs at /docs", "README.md", "External doc site":~
- **Documentation format**: ~:e.g., "JSDoc", "TSDoc", "Sphinx", "Docusaurus":~
- **Documentation generation**: ~:Command to generate docs if applicable - DELETE this line if not applicable:~

### Examples and Guides
~:EXCLUDE this subsection if no separate examples/guides exist:~

~:Location of examples and guides:~
- **Examples directory**: ~:Path to examples:~
- **Guide topics**: ~:List of key guides or tutorials:~

## Compatibility

### Platform Support
~:Describe platform compatibility:~
- **Node.js versions**: ~:Supported Node versions:~
- **Browser support**: ~:If applicable, supported browsers - DELETE this line if not applicable:~
- **Platform compatibility**: ~:Other platform requirements - DELETE this line if none:~

### Framework Integration
~:EXCLUDE this subsection if library is framework-agnostic or only works with one framework:~

~:If applicable, describe framework integrations:~
- **React**: ~:React-specific usage or components - DELETE this line if not applicable:~
- **Vue**: ~:Vue-specific usage - DELETE this line if not applicable:~
- **Angular**: ~:Angular-specific usage - DELETE this line if not applicable:~
- **Express**: ~:Express-specific usage - DELETE this line if not applicable:~
- **Other frameworks**: ~:Other framework integrations - DELETE this line if not applicable:~

## Performance Considerations
~:EXCLUDE THIS ENTIRE SECTION if performance is not a significant concern or is standard:~

### Performance Characteristics
~:Describe performance aspects:~
- **Performance goals**: ~:e.g., "Sub-millisecond operations", "Zero-copy where possible":~
- **Bundle size**: ~:Approximate bundle size impact - DELETE this line if not applicable (backend libraries):~
- **Tree-shaking**: ~:Whether library is tree-shakeable - DELETE this line if not applicable:~
- **Performance benchmarks**: ~:Where benchmarks can be found - DELETE this line if none exist:~

### Optimization Tips
~:EXCLUDE this subsection if no specific optimizations are needed:~

~:Tips for optimal usage:~
- ~:Tip 1:~
- ~:Tip 2:~

## Security
~:EXCLUDE THIS ENTIRE SECTION if library has no special security considerations:~

### Security Considerations
~:Security aspects consumers should know:~
- **Input validation**: ~:How inputs are validated - DELETE this line if not applicable:~
- **Security audits**: ~:Whether/how library is audited - DELETE this line if not audited:~
- **Vulnerability reporting**: ~:How to report security issues:~
- **Known limitations**: ~:Security limitations users should be aware of - DELETE this line if none:~

### Safe Usage Patterns
~:EXCLUDE this subsection if no special security patterns are needed:~

~:Patterns to ensure safe usage:~
- ~:Pattern 1:~
- ~:Pattern 2:~

## Maintenance Status
~:Current maintenance status:~
- **Status**: ~:e.g., "Actively maintained", "Maintenance mode", "Stable", "Deprecated":~
- **Maintainers**: ~:Who maintains this library - DELETE this line if not public information:~

## Restricted Actions
~:Define actions that AI agents should NOT perform when working with this library:~

~:This section should be reviewed and populated by repository maintainers. Examples:~
~:- Do not modify core API contracts without team approval:~
~:- Do not change configuration schemas without migration guide:~
~:- Do not add new dependencies without security review:~
~:- Do not publish packages without proper version bumps:~
~:- Do not modify breaking endpoints without coordinating with consuming services:~

~:Leave blank initially - user should review and populate based on their specific requirements:~

# Agent File Maintenance
~:Keep this section but do not modify the contents:~
No LLM/AI/Agent may make changes to this file outside of the claude-context-system commands. This is a maintained file through automatic means.

# Agent File Metadata
{
	This section contains the following information

	- Revision Date: timestamp
	- Last commit SHA built from: GIT SHA
	- Template Version: ~:version from plugin.json:~
}
