---
name: typescript-standards
version: 1.0.0
description: TypeScript coding standards and best practices
author: Claude Context System
category: language-standards
tags: [typescript, javascript, type-safety, coding-standards]
---

# TypeScript Coding Standards and Best Practices

## Overview

This document outlines TypeScript coding standards, best practices, and common setup patterns. Follow these guidelines when writing or reviewing TypeScript code.

## TypeScript Configuration (tsconfig.json)

### Strict Mode Configuration

Always enable strict mode for maximum type safety:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true
  }
}
```

### Recommended Compiler Options

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "incremental": true,

    // Additional strictness
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,

    // Path mapping
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

### Project Structure Options

```json
{
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "build", "coverage"]
}
```

## Type Safety Principles

### Avoid `any` Type

**Bad:**
```typescript
function processData(data: any) {
  return data.value;
}
```

**Good:**
```typescript
interface DataPayload {
  value: string;
}

function processData(data: DataPayload) {
  return data.value;
}

// Or use generics for flexibility
function processData<T extends { value: string }>(data: T) {
  return data.value;
}
```

### Use `unknown` Instead of `any` for Unknown Types

**Bad:**
```typescript
function parseJson(json: string): any {
  return JSON.parse(json);
}
```

**Good:**
```typescript
function parseJson(json: string): unknown {
  return JSON.parse(json);
}

// Then narrow the type
const result = parseJson('{"name": "John"}');
if (typeof result === 'object' && result !== null && 'name' in result) {
  console.log((result as { name: string }).name);
}
```

### Prefer Interfaces for Object Shapes

**Interfaces for objects:**
```typescript
interface User {
  id: string;
  name: string;
  email: string;
}
```

**Types for unions, intersections, and aliases:**
```typescript
type Status = 'pending' | 'approved' | 'rejected';
type Result<T> = { success: true; data: T } | { success: false; error: string };
```

### Use Const Assertions for Literal Types

```typescript
// Creates readonly tuple with literal types
const routes = ['/', '/about', '/contact'] as const;
type Route = typeof routes[number]; // '/' | '/about' | '/contact'

// Creates deeply readonly object
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
} as const;
```

## Null and Undefined Handling

### Use Optional Chaining

```typescript
const userName = user?.profile?.name;
const firstItem = array?.[0];
const result = callback?.();
```

### Use Nullish Coalescing

```typescript
const displayName = user.name ?? 'Anonymous';
const port = config.port ?? 3000;
```

### Avoid Non-Null Assertions Unless Certain

**Bad (unless you're 100% certain):**
```typescript
const element = document.getElementById('my-id')!;
```

**Good:**
```typescript
const element = document.getElementById('my-id');
if (!element) {
  throw new Error('Element not found');
}
// Now element is non-null
```

## Naming Conventions

### General Rules

- **Interfaces**: PascalCase, no "I" prefix
  - Good: `User`, `ApiResponse`, `ConfigOptions`
  - Bad: `IUser`, `iUser`, `user_interface`

- **Types**: PascalCase
  - Good: `Status`, `ErrorCode`, `UserRole`

- **Enums**: PascalCase for enum name, UPPER_CASE for values
  ```typescript
  enum HttpStatus {
    OK = 200,
    NOT_FOUND = 404,
    INTERNAL_ERROR = 500,
  }
  ```

- **Classes**: PascalCase
  - Good: `UserService`, `HttpClient`, `DataProcessor`

- **Functions and Variables**: camelCase
  - Good: `getUserById`, `isAuthenticated`, `apiResponse`

- **Constants**: UPPER_SNAKE_CASE
  ```typescript
  const MAX_RETRY_ATTEMPTS = 3;
  const API_BASE_URL = 'https://api.example.com';
  ```

- **Private Class Members**: Prefix with `#` (private fields) or `_` (convention)
  ```typescript
  class User {
    #password: string;
    private _internalId: number;
  }
  ```

### File Naming

- **Components** (React, Vue, etc.): PascalCase
  - `UserProfile.tsx`, `Button.tsx`

- **Utilities, services, helpers**: camelCase or kebab-case
  - `userService.ts`, `api-client.ts`, `dateUtils.ts`

- **Types/Interfaces**: camelCase or kebab-case, typically with `.types.ts` or `.d.ts`
  - `user.types.ts`, `api-types.d.ts`

- **Test files**: Same as source file with `.test.ts` or `.spec.ts`
  - `userService.test.ts`, `Button.spec.tsx`

## Function and Method Patterns

### Use Type Annotations for Parameters

```typescript
function calculateTotal(price: number, quantity: number): number {
  return price * quantity;
}
```

### Use Return Type Annotations

Always specify return types for public APIs:

```typescript
function getUser(id: string): Promise<User> {
  return api.fetch(`/users/${id}`);
}

function isEmpty(arr: unknown[]): boolean {
  return arr.length === 0;
}
```

### Use Function Overloads for Multiple Signatures

```typescript
function createElement(tag: 'div'): HTMLDivElement;
function createElement(tag: 'span'): HTMLSpanElement;
function createElement(tag: string): HTMLElement {
  return document.createElement(tag);
}
```

### Prefer Arrow Functions for Callbacks

```typescript
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
const evens = numbers.filter(n => n % 2 === 0);
```

## Generics

### Basic Generic Functions

```typescript
function identity<T>(value: T): T {
  return value;
}

function first<T>(array: T[]): T | undefined {
  return array[0];
}
```

### Constrained Generics

```typescript
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

function merge<T extends object, U extends object>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 };
}
```

### Generic Interfaces

```typescript
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

interface Repository<T> {
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  save(entity: T): Promise<T>;
  delete(id: string): Promise<void>;
}
```

## Union and Intersection Types

### Discriminated Unions

```typescript
interface Success {
  type: 'success';
  data: unknown;
}

interface Error {
  type: 'error';
  message: string;
}

type Result = Success | Error;

function handleResult(result: Result) {
  if (result.type === 'success') {
    console.log(result.data); // TypeScript knows this is Success
  } else {
    console.log(result.message); // TypeScript knows this is Error
  }
}
```

### Intersection Types

```typescript
interface Timestamped {
  createdAt: Date;
  updatedAt: Date;
}

interface User {
  id: string;
  name: string;
}

type UserWithTimestamps = User & Timestamped;
```

## Utility Types

### Common Built-in Utility Types

```typescript
// Partial - makes all properties optional
type PartialUser = Partial<User>;

// Required - makes all properties required
type RequiredUser = Required<User>;

// Readonly - makes all properties readonly
type ReadonlyUser = Readonly<User>;

// Pick - select specific properties
type UserPreview = Pick<User, 'id' | 'name'>;

// Omit - exclude specific properties
type UserWithoutEmail = Omit<User, 'email'>;

// Record - create object type with specific keys
type UserRoles = Record<string, 'admin' | 'user' | 'guest'>;

// NonNullable - exclude null and undefined
type NonNullableString = NonNullable<string | null | undefined>; // string

// ReturnType - get return type of function
type Result = ReturnType<typeof getUserById>;

// Parameters - get parameters tuple of function
type Params = Parameters<typeof calculateTotal>;
```

### Custom Utility Types

```typescript
// Make specific properties optional
type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Make specific properties required
type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Deep Partial
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
```

## Async/Await Patterns

### Always Use Async/Await Over Raw Promises

**Bad:**
```typescript
function fetchUser(id: string) {
  return api.get(`/users/${id}`)
    .then(response => response.data)
    .catch(error => {
      console.error(error);
      throw error;
    });
}
```

**Good:**
```typescript
async function fetchUser(id: string): Promise<User> {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
```

### Type Error Handling

```typescript
async function fetchData(): Promise<Data> {
  try {
    const response = await api.get('/data');
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error('Unknown error:', error);
    }
    throw error;
  }
}
```

## Type Guards

### Built-in Type Guards

```typescript
// typeof
if (typeof value === 'string') {
  console.log(value.toUpperCase());
}

// instanceof
if (error instanceof Error) {
  console.log(error.message);
}

// in operator
if ('id' in user) {
  console.log(user.id);
}
```

### Custom Type Guards

```typescript
interface User {
  id: string;
  name: string;
}

function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value &&
    typeof (value as User).id === 'string' &&
    typeof (value as User).name === 'string'
  );
}

// Usage
const data: unknown = fetchData();
if (isUser(data)) {
  console.log(data.name); // TypeScript knows data is User
}
```

## Class Patterns

### Use Access Modifiers

```typescript
class User {
  public id: string;
  private password: string;
  protected createdAt: Date;
  readonly email: string;

  constructor(id: string, email: string, password: string) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.createdAt = new Date();
  }

  public authenticate(password: string): boolean {
    return this.password === password;
  }

  protected hashPassword(password: string): string {
    // Implementation
    return password;
  }
}
```

### Use Parameter Properties

```typescript
class User {
  constructor(
    public id: string,
    public name: string,
    private password: string
  ) {}
}
```

### Abstract Classes

```typescript
abstract class Repository<T> {
  abstract findById(id: string): Promise<T | null>;
  abstract save(entity: T): Promise<T>;

  async findOrThrow(id: string): Promise<T> {
    const entity = await this.findById(id);
    if (!entity) {
      throw new Error(`Entity with id ${id} not found`);
    }
    return entity;
  }
}
```

## Decorators (Experimental)

Enable in tsconfig.json:
```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

Common patterns:
```typescript
class ApiController {
  @Get('/users')
  async getUsers() {
    // Implementation
  }

  @Post('/users')
  @ValidateBody(UserSchema)
  async createUser(@Body() user: User) {
    // Implementation
  }
}
```

## Module Organization

### Barrel Exports (index.ts)

```typescript
// src/services/index.ts
export { UserService } from './userService';
export { AuthService } from './authService';
export type { ServiceConfig } from './types';

// Usage
import { UserService, AuthService } from '@/services';
```

### Avoid Circular Dependencies

**Bad:**
```typescript
// a.ts
import { B } from './b';
export class A extends B {}

// b.ts
import { A } from './a';
export class B extends A {} // Circular!
```

**Good:**
```typescript
// base.ts
export class Base {}

// a.ts
import { Base } from './base';
export class A extends Base {}

// b.ts
import { Base } from './base';
export class B extends Base {}
```

## Testing Patterns

### Type Test Files

Use `.test.ts` or `.spec.ts`:
```typescript
// userService.test.ts
import { UserService } from './userService';
import type { User } from './types';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    service = new UserService();
  });

  it('should fetch user by id', async () => {
    const user: User = await service.getById('123');
    expect(user.id).toBe('123');
  });
});
```

### Mock Typing

```typescript
import { vi } from 'vitest';
import type { ApiClient } from './apiClient';

const mockApiClient: ApiClient = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
};
```

## Common Library Patterns

### Zod for Runtime Validation

```typescript
import { z } from 'zod';

const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  age: z.number().min(0).optional(),
});

type User = z.infer<typeof UserSchema>;

function validateUser(data: unknown): User {
  return UserSchema.parse(data);
}
```

### React + TypeScript

```typescript
import React, { useState } from 'react';

interface Props {
  title: string;
  onSubmit: (value: string) => void;
  children?: React.ReactNode;
}

export const MyComponent: React.FC<Props> = ({ title, onSubmit, children }) => {
  const [value, setValue] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>{title}</h1>
      <input
        type="text"
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
      />
      {children}
    </form>
  );
};
```

### Express + TypeScript

```typescript
import express, { Request, Response, NextFunction } from 'express';

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

const app = express();

app.get('/users/:id', async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const user = await getUserById(id);
  res.json(user);
});

// Middleware with custom request type
function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.headers.authorization;
  // Validate token and set req.user
  req.user = { id: '123', role: 'admin' };
  next();
}
```

## ESLint + TypeScript

### Install Dependencies

```bash
npm install -D @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

### ESLint Configuration

```json
{
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking"
  ],
  "parserOptions": {
    "project": "./tsconfig.json"
  },
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }]
  }
}
```

## Build Tools

### Common Build Configurations

**Vite:**
```typescript
// vite.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    target: 'es2020',
  },
});
```

**tsup (for libraries):**
```typescript
// tsup.config.ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
});
```

## Performance Considerations

### Use Type-Only Imports/Exports

```typescript
// Only imports types, removed at runtime
import type { User } from './types';

// Mixed import
import { type User, UserService } from './user';

// Type-only export
export type { User } from './types';
```

### Avoid Large Union Types

**Bad (can be slow to compile):**
```typescript
type ManyStrings = 'a' | 'b' | 'c' | /* ... 1000 more */ | 'zzz';
```

**Good:**
```typescript
// Use enums or const assertions for large sets
const validStrings = ['a', 'b', 'c', /* ... */] as const;
type ValidString = typeof validStrings[number];
```

## Documentation Comments

### Use JSDoc for Public APIs

```typescript
/**
 * Fetches a user by their unique identifier.
 *
 * @param id - The unique user identifier
 * @returns A promise that resolves to the user object
 * @throws {NotFoundError} When user is not found
 *
 * @example
 * ```typescript
 * const user = await getUser('user-123');
 * console.log(user.name);
 * ```
 */
async function getUser(id: string): Promise<User> {
  // Implementation
}
```

## Migration from JavaScript

### Gradual Adoption

1. Rename `.js` to `.ts` (or `.jsx` to `.tsx`)
2. Start with `any` types where needed
3. Enable strict mode incrementally
4. Add type annotations gradually
5. Remove `any` types over time

### Use `// @ts-check` for JavaScript Files

```javascript
// @ts-check

/**
 * @param {string} name
 * @param {number} age
 * @returns {object}
 */
function createUser(name, age) {
  return { name, age };
}
```

## Common Pitfalls to Avoid

1. **Don't use `any`** - Use `unknown` or proper types
2. **Don't disable strict mode** - Keep it enabled
3. **Don't use `as` casts liberally** - Use type guards instead
4. **Don't ignore errors** - Fix all TypeScript errors
5. **Don't use `@ts-ignore`** - Use `@ts-expect-error` with explanation if absolutely necessary
6. **Don't create overly complex types** - Keep types simple and readable
7. **Don't forget to use const assertions** - For literal types
8. **Don't mix `null` and `undefined`** - Pick one convention (prefer `undefined`)

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [Total TypeScript](https://www.totaltypescript.com/)
- [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) - Type definitions for JavaScript libraries
