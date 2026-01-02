# Test Runner

Interactive CLI for managing and running plugin tests with token tracking.

## Features

✅ **Interactive test run creation** - Select fixtures with beautiful UI
✅ **Token usage tracking** - Track actual token usage from Claude CLI
✅ **Historical estimates** - Improved cost estimates based on past runs
✅ **Run management** - List, compare, and clean test runs
✅ **Isolated test environments** - Each run in separate directory
✅ **Test without regeneration** - Run tests on existing runs to save tokens
✅ **Disk management** - Track and clean old runs

## Installation

From repository root:

```bash
pnpm install
```

## Usage

### From Repository Root

```bash
# Start interactive mode
pnpm run start:test:run

# Or use directly
cd test-runner
npm start
```

### Direct Commands

```bash
# Create new test run
npm start new-run

# Run tests on existing run
npm start test-run

# List all runs
npm start list

# Compare two runs
npm start compare

# Clean old runs
npm start clean
```

## Workflow

### 1. Create New Test Run

```bash
pnpm run start:test:run
```

This will:
1. **Select fixtures** - Choose which fixtures to test
2. **Add metadata** - Optional notes and tags
3. **Show cost estimate** - See estimated tokens/cost (improves with history)
4. **Copy fixtures** - Copy to `~/claude-context-test-runs/test-run-###/`
5. **Run Claude CLI** - Generate claude.md for each fixture
6. **Track tokens** - Capture actual token usage
7. **Option to test** - Run tests immediately or later

### 2. Run Tests on Existing Run

Save tokens by testing existing runs without regenerating:

```bash
npm start test-run
```

Select a run and choose:
- Test all fixtures
- Test specific fixtures only

### 3. List All Runs

```bash
npm start list
```

Shows:
- Statistics (total runs, disk usage)
- All runs with status and tokens
- Latest run details

### 4. Compare Runs

```bash
npm start compare
```

Compare two runs:
- Metadata comparison
- Token usage differences
- Fixture differences
- Test results
- Optional file content diff

### 5. Clean Old Runs

```bash
npm start clean
```

Delete runs by:
- Age (older than X days)
- Specific selection
- Status (failed/pending)

## Token Tracking

### How It Works

1. **Capture** - Parses Claude CLI output for token usage
2. **Store** - Saves per-fixture and total tokens in run metadata
3. **Display** - Shows tokens during generation and in summaries
4. **Improve** - Uses historical data for better future estimates

### Token Patterns Detected

The system recognizes these formats in Claude CLI output:

```
Token usage: 45,231 input, 23,456 output (68,687 total)
Input tokens: 45231 | Output tokens: 23456 | Total: 68687
"input_tokens": 45231 ... "output_tokens": 23456
```

### Historical Estimates

After your first run, estimates improve automatically:

```
💰 Token Usage Estimation
──────────────────────────────────────────────────
Fixtures to generate: 3
Estimated tokens: 210,000
Estimated cost: $3.15
(Based on 5 previous run(s))
```

### Actual vs Estimated

After generation, see how accurate the estimate was:

```
Token Usage:
  Input: 145,234
  Output: 67,890
  Total: 213,124
  Estimated Cost: $3.20
  vs Estimate: +3,124 (1.5%)
```

## Test Run Storage

Location: `~/claude-context-test-runs/`

Structure:
```
~/claude-context-test-runs/
├── test-run-list.json          # All runs metadata
├── test-run-001/               # Run #1
│   ├── simple-node-service/
│   │   ├── claude.md
│   │   ├── service.claude.md
│   │   └── ...
│   └── library-package/
├── test-run-002/               # Run #2
└── test-run-003/               # Run #3
```

### test-run-list.json Structure

```json
{
  "runs": [
    {
      "runNumber": 1,
      "timestamp": "2026-01-02T10:30:00.000Z",
      "fixtures": ["simple-node-service", "library-package"],
      "status": "completed",
      "generated": true,
      "tested": true,
      "notes": "Testing new template changes",
      "tags": ["template-v2", "baseline"],
      "templateVersion": "2.0.0",
      "tokenUsage": {
        "input": 145234,
        "output": 67890,
        "total": 213124,
        "estimatedCost": 3.20,
        "perFixture": {
          "simple-node-service": { "input": 72000, "output": 34000, "total": 106000 },
          "library-package": { "input": 73234, "output": 33890, "total": 107124 }
        }
      },
      "testResults": {
        "success": true,
        "timestamp": "2026-01-02T10:45:00.000Z",
        "exitCode": 0
      }
    }
  ],
  "nextRunNumber": 2
}
```

## Example Session

```bash
$ pnpm run start:test:run

╔════════════════════════════════════════════════════════════╗
║  Claude Context System - Test Runner                      ║
╚════════════════════════════════════════════════════════════╝

📝 Creating New Test Run

? How would you like to select fixtures? Select individual fixtures
? Select fixtures to test:
  ◉ 🚀  simple-node-service [JavaScript] - A simple Node.js REST API service
  ◯ 📦  library-package [TypeScript] - A utility library
  ◯ 💻  react-client-only [JavaScript] - A React frontend application

? Add notes for this run (optional): Testing template v2.1 changes
? Add tags to this run? Yes
? Enter tags (comma-separated): template-v2.1, baseline-test

💰 Token Usage Estimation
──────────────────────────────────────────────────
Fixtures to generate: 1
Estimated tokens: 68,500
Estimated cost: $1.03
(Based on 3 previous run(s))
──────────────────────────────────────────────────

? Proceed with generation? Yes

✔ Test run #4 created

📋 Copying fixtures to test run directory...
✔ Copied simple-node-service

🚀 Running Claude CLI for each fixture...

▶ Processing: simple-node-service
──────────────────────────────────────────────────
Directory: ~/claude-context-test-runs/test-run-004/simple-node-service

📌 Run this command in Claude CLI:
   /claude-context-updater:ctx-update

Opening Claude CLI... (Press Ctrl+D or type "exit" when done)

[... Claude CLI output ...]

Tokens: 69,234 (45,123 in, 24,111 out)
✓ simple-node-service completed successfully


📊 Generation Summary
══════════════════════════════════════════════════
Test Run: #4
Location: ~/claude-context-test-runs/test-run-004
Fixtures: 1
Successful: 1
Failed: 0

Token Usage:
  Input: 45,123
  Output: 24,111
  Total: 69,234
  Estimated Cost: $1.04
  vs Estimate: +734 (1.1%)
══════════════════════════════════════════════════

? Would you like to run tests now? Yes

🧪 Running Tests...

[... Jest output ...]

✓ All tests passed!
```

## Tips

- **Save tokens**: Test existing runs instead of regenerating
- **Use tags**: Organize runs by purpose (baseline, template-test, etc.)
- **Compare runs**: See how changes affect output
- **Clean regularly**: Delete old runs to free disk space
- **Historical data**: More runs = better estimates

## Troubleshooting

**"Claude CLI not found":**
- Install Claude CLI first
- Check it's in your PATH: `which claude`

**Token usage not captured:**
- This is normal if Claude CLI output format changes
- Estimates will still work from historical data
- You can manually note tokens in run notes

**Tests fail:**
- Run tests individually to identify issues
- Check generated claude.md files exist
- Verify ClaudeMdMetadata can parse them

## See Also

- [../tests/README.md](../tests/README.md) - Testing infrastructure
- [../TESTING.md](../TESTING.md) - Testing strategy
