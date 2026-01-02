# Testing Quick Start

Simple two-step process to run the plugin tests.

## Prerequisites

- Claude CLI installed (`claude` command available)
- Plugin installed locally (`pnpm run plugin:install`)

## Step 1: Generate Test Fixtures

Generate `claude.md` files for all test fixtures:

```bash
pnpm run test:generate
```

This will:
1. Open Claude CLI for each fixture directory
2. Prompt you to run `/claude-context-updater:ctx-update`
3. Wait for the plugin to generate claude.md
4. Move to the next fixture

**Note:** This step uses Claude API tokens. You only need to run this once, or when you update the plugin.

## Step 2: Run Tests

```bash
pnpm test
```

That's it! Tests validate the generated `claude.md` files.

## Manual Generation (Single Fixture)

If you want to generate just one fixture:

```bash
cd tests/fixtures/simple-node-service

# Initialize git if needed
git init && git add . && git commit -m "Initial commit"

# Run Claude CLI
claude

# In Claude CLI, run:
/claude-context-updater:ctx-update

# Exit and run tests
cd ../../..
pnpm test simple-node-service
```

## What Gets Tested?

For each fixture, tests verify:

✅ Required sections exist (Repository Summary, Environment Setup, etc.)
✅ Correct project-type sections (Services, Clients, Libraries, Databases)
✅ Sub-files created (service.claude.md, client.claude.md, etc.)
✅ Metadata is valid (dates, commit SHA, template version)
✅ No unreplaced placeholders `{like this}`
✅ All @file references point to existing files

## Test Commands

```bash
pnpm test                    # Run all tests
pnpm test simple-node        # Run specific test
pnpm test:watch              # Watch mode (re-run on changes)
pnpm test:coverage           # With coverage report
pnpm test:verbose            # Detailed output
```

## Test Fixtures

- **simple-node-service**: Express REST API → expects `service.claude.md`
- **library-package**: TypeScript library → expects `library.claude.md`
- **react-client-only**: React app → expects `client.claude.md`

## Example Test Output

```
 PASS  tests/simple-node-service.test.js
  simple-node-service
    Required Sections
      ✓ should have Repository Agent Context section (2ms)
      ✓ should have Repository Summary section (1ms)
      ✓ should have High-Level Repository Information section
    Project Type Sections
      ✓ should have Services and APIs section (1ms)
      ✓ should NOT have User Interaction Clients section
    Sub-files
      ✓ should have created service.claude.md file (2ms)
      ✓ service.claude.md file should exist on filesystem (1ms)
    Metadata
      ✓ should have valid metadata (3ms)
      ✓ should have valid commit SHA (1ms)
    ✓ should pass all validations (4ms)

Test Suites: 1 passed, 1 total
Tests:       10 passed, 10 total
```

## Troubleshooting

**"claude.md not found" error:**
Run the generation script first:
```bash
pnpm run test:generate
```

**"Claude CLI not found":**
Install Claude CLI or check it's in your PATH:
```bash
which claude
```

**Want to regenerate fixtures:**
Delete existing files and run generation again:
```bash
rm tests/fixtures/*/claude.md
rm tests/fixtures/**/*.claude.md
pnpm run test:generate
```

## Next Steps

- See [README.md](README.md) for full testing documentation
- See [../TESTING.md](../TESTING.md) for overall testing strategy
- See `lib/ClaudeMdMetadata.js` for the validation API
