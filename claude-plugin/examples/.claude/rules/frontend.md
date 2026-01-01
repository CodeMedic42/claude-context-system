---
paths: "src/components/**/*,src/pages/**/*,src/hooks/**/*"
---

# Frontend Development Rules

## React Component Guidelines

- Use functional components with hooks (no class components)
- Keep components small and focused (single responsibility)
- Use TypeScript for all new components
- Export components as named exports, not default

## Component Structure

```typescript
// 1. Imports
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui'

// 2. Types/Interfaces
interface UserCardProps {
  userId: string
  onSelect: (id: string) => void
}

// 3. Component
export function UserCard({ userId, onSelect }: UserCardProps) {
  // Hooks at the top
  const [user, setUser] = useState(null)

  // Effects
  useEffect(() => {
    // ...
  }, [userId])

  // Event handlers
  const handleClick = () => {
    onSelect(userId)
  }

  // Render
  return (
    <div onClick={handleClick}>
      {/* JSX */}
    </div>
  )
}
```

## State Management

- Use React Context for global state
- Use `useState` for local component state
- Use `useReducer` for complex state logic
- Keep state as close to where it's used as possible

## Styling

- Use Tailwind CSS utility classes
- Keep custom CSS minimal
- Use CSS modules for component-specific styles
- Mobile-first responsive design

## Performance

- Memoize expensive computations with `useMemo`
- Memoize callbacks with `useCallback`
- Use `React.memo` for expensive re-renders
- Lazy load routes and heavy components

## Accessibility

- Use semantic HTML elements
- Include ARIA labels where needed
- Ensure keyboard navigation works
- Test with screen readers
- Maintain proper heading hierarchy
