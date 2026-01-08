---
name: javascript-standards
version: 1.0.0
description: JavaScript coding standards
author: Example Team
category: code-quality
---

# JavaScript Standards

## Strict Mode
Always use strict mode in JavaScript files:

```javascript
'use strict';
```

## Variable Declarations
- Use `const` by default
- Use `let` when reassignment is needed
- Never use `var`

## Function Style
- Prefer arrow functions for callbacks
- Use async/await over raw promises
- Always handle errors in async functions

## Naming Conventions
- camelCase for variables and functions
- PascalCase for classes and constructors
- UPPER_SNAKE_CASE for constants

## Code Quality
- No unused variables
- No console.log in production code
- Maximum function length: 50 lines
- Maximum file length: 300 lines
