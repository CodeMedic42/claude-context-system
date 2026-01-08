---
paths: "src/api/**/*,src/services/**/*,src/controllers/**/*"
---

# Backend API Development Rules

## API Endpoint Structure

Follow RESTful conventions:
- GET /resources - List all
- GET /resources/:id - Get one
- POST /resources - Create new
- PATCH /resources/:id - Update
- DELETE /resources/:id - Delete

## Controller Pattern

Controllers should:
- Handle HTTP concerns only (request/response)
- Delegate business logic to services
- Validate input with middleware
- Return consistent response format

```typescript
export async function getUserController(req: Request, res: Response) {
  try {
    const userId = req.params.id
    const user = await userService.findById(userId)

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    return res.json({ data: user })
  } catch (error) {
    logger.error('Error fetching user:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
```

## Service Layer

Services contain business logic:
- No HTTP concerns
- Reusable across controllers
- Return plain data, not HTTP responses
- Throw errors for business rule violations

## Database Access

- Use Prisma ORM for database operations
- Always use transactions for multi-step operations
- Use select to limit returned fields
- Handle unique constraint violations gracefully

```typescript
const user = await prisma.user.create({
  data: {
    email,
    passwordHash: await hashPassword(password),
  },
  select: {
    id: true,
    email: true,
    name: true,
    // Don't return password hash
  },
})
```

## Error Handling

- Use custom error classes for business errors
- Log all errors with context
- Never expose internal errors to clients
- Return appropriate HTTP status codes

## Authentication

- Verify JWT on protected routes
- Check user permissions before operations
- Use middleware for auth logic
- Rotate tokens regularly

## Validation

- Validate all input at route level
- Use Zod for schema validation
- Sanitize input to prevent injection
- Return validation errors clearly

## Logging

- Log all API requests
- Log errors with stack traces
- Include correlation IDs for tracing
- Don't log sensitive data (passwords, tokens)
