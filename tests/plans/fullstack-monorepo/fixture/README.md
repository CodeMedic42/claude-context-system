# Fullstack Monorepo

A test fixture for the claude-context-system demonstrating multi-type projects.

## Structure

This monorepo contains two packages:

### Web Application (`packages/web/`)
A Next.js full-stack application with:
- **Frontend (CLIENT)**: React pages and components for user interface
- **Backend (SERVICE)**: API routes for REST endpoints

### Database Library (`packages/database/`)
A database ORM library with:
- **Library (LIBRARY)**: Exported Prisma client and helper functions
- **Database (DATABASE)**: Prisma schema and migrations

## Expected Context Files

When running `/ctx-create`, this should generate:

```
packages/
├── web/
│   ├── SERVICE.CLAUDE.md    # Documents API routes
│   ├── CLIENT.CLAUDE.md     # Documents frontend
│   └── ...
└── database/
    ├── LIBRARY.CLAUDE.md    # Documents library API
    ├── DATABASE.CLAUDE.md   # Documents schema
    └── ...
```

## Installation

```bash
pnpm install
```

## Development

```bash
# Run web app
pnpm --filter @monorepo/web dev

# Generate Prisma client
pnpm --filter @monorepo/database db:generate
```
