const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs-extra');
const TestRunManager = require('../lib/test-run-manager');
const FixtureSelector = require('../lib/fixture-selector');
const TokenTracker = require('../lib/token-tracker');
const { runParallel } = require('../lib/parallel-cli-runner');

const FIXTURES_SOURCE_DIR = path.join(__dirname, '../../../tests/fixtures');

async function newRun() {
  console.log(chalk.bold('\n📝 Creating New Test Run\n'));

  const manager = new TestRunManager();
  const selector = new FixtureSelector();

  // Step 1: Select fixtures
  const { selectionMethod } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selectionMethod',
      message: 'How would you like to select fixtures?',
      choices: [
        { name: 'Select individual fixtures', value: 'individual' },
        { name: 'Select by type (service, client, library)', value: 'byType' },
        { name: 'Select all fixtures', value: 'all' }
      ]
    }
  ]);

  let selectedFixtures;
  if (selectionMethod === 'individual') {
    selectedFixtures = await selector.selectFixtures();
  } else if (selectionMethod === 'byType') {
    selectedFixtures = await selector.selectByGroup();
  } else {
    const allFixtures = selector.getAvailableFixtures();
    selectedFixtures = allFixtures.map(f => f.name);
  }

  if (selectedFixtures.length === 0) {
    console.log(chalk.yellow('\n⚠️  No fixtures selected. Exiting.\n'));
    return;
  }

  // Step 2: Add metadata (optional)
  const { notes, addTags } = await inquirer.prompt([
    {
      type: 'input',
      name: 'notes',
      message: 'Add notes for this run (optional):',
      default: ''
    },
    {
      type: 'confirm',
      name: 'addTags',
      message: 'Add tags to this run?',
      default: false
    }
  ]);

  let tags = [];
  if (addTags) {
    const { tagInput } = await inquirer.prompt([
      {
        type: 'input',
        name: 'tagInput',
        message: 'Enter tags (comma-separated):',
        default: ''
      }
    ]);
    tags = tagInput.split(',').map(t => t.trim()).filter(t => t);
  }

  // Step 3: Show cost estimation (improved with historical data)
  const tokenTracker = new TokenTracker();
  const estimate = tokenTracker.getImprovedEstimate(selectedFixtures.length, manager);

  console.log(chalk.cyan('\n💰 Token Usage Estimation'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(`Fixtures to generate: ${chalk.bold(selectedFixtures.length)}`);
  console.log(`Estimated tokens: ${chalk.bold(estimate.tokens.toLocaleString())}`);
  console.log(`Estimated cost: ${chalk.bold('$' + estimate.cost.toFixed(2))}`);

  if (estimate.basedOn === 'historical-actual-cost') {
    console.log(chalk.gray(`(Based on actual costs from ${estimate.historicalRuns} previous run(s))`));
  } else if (estimate.basedOn === 'historical-tokens') {
    console.log(chalk.gray(`(Based on token usage from ${estimate.historicalRuns} previous run(s) - costs may vary)`));
  } else {
    console.log(chalk.gray('(Based on default estimate - will improve with historical data)'));
  }

  console.log(chalk.gray('─'.repeat(50)));

  const { confirmGenerate } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmGenerate',
      message: 'Proceed with generation?',
      default: true
    }
  ]);

  if (!confirmGenerate) {
    console.log(chalk.yellow('\n⚠️  Operation cancelled.\n'));
    return;
  }

  // Step 4: Create test run
  const spinner = ora('Creating test run...').start();
  const run = manager.createTestRun(selectedFixtures, { notes, tags });
  spinner.succeed(`Test run ${chalk.bold('#' + run.runNumber)} created`);

  // Step 5: Copy fixtures
  console.log(chalk.cyan(`\n📋 Copying fixtures to test run directory...`));
  for (const fixtureName of selectedFixtures) {
    const sourceFixturePath = path.join(FIXTURES_SOURCE_DIR, fixtureName);
    spinner.text = `Copying ${fixtureName}...`;
    spinner.start();
    manager.copyFixture(run.runNumber, fixtureName, sourceFixturePath);
    spinner.succeed(`Copied ${chalk.bold(fixtureName)}`);
  }

  // Step 6: Generate claude.md files
  const results = [];
  const runTokenTracker = new TokenTracker();

  // Ensure templates are available in user directory
  await ensureTemplatesAvailable();

  // Initialize git for all fixtures first
  console.log(chalk.cyan(`\n📦 Initializing git repositories...`));
  for (const fixtureName of selectedFixtures) {
    const fixtureDir = manager.getFixtureDirectory(run.runNumber, fixtureName);
    await initGitIfNeeded(fixtureDir);
  }

  // Choose execution mode based on fixture count
  if (selectedFixtures.length > 1) {
    // Parallel execution with interactive UI
    console.log(chalk.cyan(`\n🚀 Running Claude CLI for ${selectedFixtures.length} fixtures in parallel...`));
    console.log(chalk.gray('Starting interactive viewer...\n'));

    // Prepare fixture data for parallel runner
    const fixtures = selectedFixtures.map(name => ({
      name,
      dir: manager.getFixtureDirectory(run.runNumber, name)
    }));

    // Run in parallel with interactive UI
    const parallelResults = await runParallel(fixtures);

    // Process results
    parallelResults.forEach(result => {
      results.push(result);
      if (result.tokens) {
        runTokenTracker.addFixtureTokens(result.fixture, result.tokens);
      }
    });

  } else {
    // Sequential execution for single fixture
    console.log(chalk.cyan(`\n🚀 Running Claude CLI...\n`));

    for (const fixtureName of selectedFixtures) {
      console.log(chalk.bold(`\n▶ Processing: ${fixtureName}`));
      console.log(chalk.gray('─'.repeat(50)));

      const fixtureDir = manager.getFixtureDirectory(run.runNumber, fixtureName);

      // Run Claude CLI and capture token usage
      const result = await runClaudeCLI(fixtureDir, fixtureName);

      results.push({
        fixture: fixtureName,
        success: result.success,
        timestamp: new Date().toISOString(),
        tokens: result.tokens,
        costUsd: result.costUsd
      });

      // Track tokens
      if (result.tokens) {
        runTokenTracker.addFixtureTokens(fixtureName, result.tokens);

        console.log(chalk.gray(
          `Tokens: ${result.tokens.total.toLocaleString()} ` +
          `(${result.tokens.input.toLocaleString()} in, ${result.tokens.output.toLocaleString()} out)`
        ));
      }

      if (result.success) {
        console.log(chalk.green(`✓ ${fixtureName} completed successfully`));
      } else {
        console.log(chalk.red(`✗ ${fixtureName} failed or was skipped`));
      }
    }
  }

  // Step 7: Update run status with token usage
  const allSuccess = results.every(r => r.success);
  const totalTokens = runTokenTracker.getTotalTokens();

  // Calculate actual total cost from results
  const totalActualCost = results.reduce((sum, r) => sum + (r.costUsd || 0), 0);

  // Add actual cost to token usage
  const tokenUsageWithCost = {
    ...totalTokens,
    actualCostUsd: totalActualCost
  };

  manager.updateTestRun(run.runNumber, {
    status: allSuccess ? 'generated' : 'partial',
    generated: true,
    generationResults: results,
    tokenUsage: tokenUsageWithCost
  });

  // Step 8: Summary with token usage
  console.log(chalk.cyan(`\n\n📊 Generation Summary`));
  console.log(chalk.gray('═'.repeat(50)));
  console.log(`Test Run: ${chalk.bold('#' + run.runNumber)}`);
  console.log(`Location: ${chalk.gray(manager.getRunDirectory(run.runNumber))}`);
  console.log(`Fixtures: ${chalk.bold(selectedFixtures.length)}`);
  console.log(`Successful: ${chalk.green(results.filter(r => r.success).length)}`);
  console.log(`Failed: ${chalk.red(results.filter(r => !r.success).length)}`);

  if (totalTokens.total > 0) {
    console.log(chalk.gray('\nToken Usage:'));
    console.log(`  Input: ${chalk.cyan(totalTokens.input.toLocaleString())}`);
    console.log(`  Output: ${chalk.cyan(totalTokens.output.toLocaleString())}`);
    console.log(`  Total: ${chalk.bold.cyan(totalTokens.total.toLocaleString())}`);

    if (totalActualCost > 0) {
      console.log(`  Actual Cost: ${chalk.green('$' + totalActualCost.toFixed(4))}`);
    }

    // Compare to estimate
    const tokenDifference = totalTokens.total - estimate.tokens;
    const percentDiff = ((tokenDifference / estimate.tokens) * 100).toFixed(1);
    if (Math.abs(tokenDifference) > 0) {
      const diffColor = tokenDifference > 0 ? chalk.yellow : chalk.green;
      console.log(`  vs Estimate: ${diffColor(tokenDifference > 0 ? '+' : '')}${diffColor(tokenDifference.toLocaleString())} tokens (${percentDiff}%)`);
    }
  }

  console.log(chalk.gray('═'.repeat(50)));

  // Step 9: Ask to run tests
  const { runTests } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'runTests',
      message: 'Would you like to run tests now?',
      default: true
    }
  ]);

  if (runTests) {
    await executeTests(run.runNumber, manager);
  } else {
    console.log(chalk.gray(`\nYou can run tests later with: ${chalk.bold(`ctx-test test-run ${run.runNumber}`)}\n`));
  }
}

/**
 * Ensure templates are available in user's home directory
 * This allows the plugin to find them when loaded via --plugin-dir
 */
async function ensureTemplatesAvailable() {
  const os = require('os');
  const userTemplateDir = path.join(os.homedir(), '.claude', 'templates');
  const pluginTemplateDir = path.join(__dirname, '../../../claude-plugin/templates');

  // Create user template directory if it doesn't exist
  if (!fs.existsSync(userTemplateDir)) {
    fs.mkdirSync(userTemplateDir, { recursive: true });
  }

  // Copy all template files
  const templateFiles = fs.readdirSync(pluginTemplateDir)
    .filter(file => file.endsWith('.template.md'));

  for (const file of templateFiles) {
    const src = path.join(pluginTemplateDir, file);
    const dest = path.join(userTemplateDir, file);

    // Only copy if doesn't exist or source is newer
    if (!fs.existsSync(dest) || fs.statSync(src).mtime > fs.statSync(dest).mtime) {
      fs.copyFileSync(src, dest);
    }
  }
}

/**
 * Initialize git repository if needed
 * @param {string} dir - Directory path
 */
async function initGitIfNeeded(dir) {
  const gitDir = path.join(dir, '.git');
  if (fs.existsSync(gitDir)) {
    return;
  }

  return new Promise((resolve) => {
    const git = spawn('git', ['init'], { cwd: dir, stdio: 'ignore' });
    git.on('close', () => {
      const add = spawn('git', ['add', '.'], { cwd: dir, stdio: 'ignore' });
      add.on('close', () => {
        const commit = spawn('git', ['commit', '-m', 'Initial commit'], { cwd: dir, stdio: 'ignore' });
        commit.on('close', () => resolve());
      });
    });
  });
}

/**
 * Run Claude CLI for a fixture
 * @param {string} fixtureDir - Fixture directory
 * @param {string} fixtureName - Fixture name
 * @returns {Promise<Object>} - Result with success status and token usage
 */
async function runClaudeCLI(fixtureDir, fixtureName) {
  console.log(chalk.gray(`Directory: ${fixtureDir}`));
  console.log(chalk.yellow(`\n📌 Running in automated mode (bypassing permissions and approvals)\n`));

  return new Promise((resolve) => {
    console.log(chalk.cyan('─'.repeat(50)));
    console.log(chalk.bold('Claude Output:'));
    console.log(chalk.cyan('─'.repeat(50)) + '\n');

    let output = '';
    const tokenTracker = new TokenTracker();

    // Path to the plugin directory
    const pluginDir = path.join(__dirname, '../../../claude-plugin');

    // Run Claude CLI with --print flag and plugin directory
    // Use stdin to pass the skill command
    // Use bypassPermissions mode to avoid permission prompts in automated testing
    // Add system prompt to skip approval steps
    // Use JSON output format to get detailed token usage and cost information
    const claude = spawn('claude', [
      '--print',
      '--output-format', 'json',
      '--plugin-dir', pluginDir,
      '--permission-mode', 'bypassPermissions',
      '--append-system-prompt', 'AUTOMATED TEST MODE: Skip all user approval/confirmation steps. Proceed immediately with all file creation and documentation tasks without asking for permission or presenting scopes. This is an automated test environment.'
    ], {
      cwd: fixtureDir,
      stdio: ['pipe', 'pipe', 'pipe']
    });

    // Write the skill command to stdin
    claude.stdin.write('/claude-context-updater:ctx-update\n');
    claude.stdin.end();

    // Capture and display stdout in real-time
    claude.stdout.on('data', (data) => {
      const text = data.toString();
      process.stdout.write(text);
      output += text;
    });

    // Capture and display stderr in real-time
    claude.stderr.on('data', (data) => {
      const text = data.toString();
      // Only display if it's not just debug/warning messages
      if (!text.includes('[statsig]') && !text.includes('Statsig')) {
        process.stderr.write(chalk.yellow(text));
      }
      output += text;
    });

    claude.on('close', (code) => {
      console.log(chalk.cyan('\n' + '─'.repeat(50)));
      console.log(chalk.bold('End of Claude Output'));
      console.log(chalk.cyan('─'.repeat(50) + '\n'));

      // Check if claude.md was created
      const claudeMdPath = path.join(fixtureDir, 'claude.md');
      const success = fs.existsSync(claudeMdPath);

      // Parse JSON output to get token usage and cost
      let tokens = null;
      let costUsd = null;

      try {
        const jsonOutput = JSON.parse(output);

        if (jsonOutput.usage) {
          const usage = jsonOutput.usage;
          tokens = {
            input: (usage.input_tokens || 0) + (usage.cache_read_input_tokens || 0),
            output: usage.output_tokens || 0,
            total: 0,
            cacheCreation: usage.cache_creation_input_tokens || 0,
            cacheRead: usage.cache_read_input_tokens || 0
          };
          tokens.total = tokens.input + tokens.output;
        }

        if (jsonOutput.total_cost_usd !== undefined) {
          costUsd = jsonOutput.total_cost_usd;
        }

        // Display the actual result text
        if (jsonOutput.result) {
          console.log(chalk.gray('Result summary:'));
          const resultPreview = jsonOutput.result.slice(0, 200);
          console.log(chalk.gray(`  ${resultPreview}${jsonOutput.result.length > 200 ? '...' : ''}`));
        }
      } catch (err) {
        console.log(chalk.yellow(`\n⚠️  Failed to parse JSON output: ${err.message}`));

        // Fallback to text parsing
        tokens = tokenTracker.parseFromOutput(output);
      }

      if (tokens) {
        console.log(chalk.green(`\n📊 Token Usage:`));
        console.log(chalk.gray(`   Input: ${tokens.input.toLocaleString()}${tokens.cacheRead ? ` (${tokens.cacheRead.toLocaleString()} from cache)` : ''}`));
        console.log(chalk.gray(`   Output: ${tokens.output.toLocaleString()}`));
        console.log(chalk.gray(`   Total: ${tokens.total.toLocaleString()}`));
        if (costUsd !== null) {
          console.log(chalk.gray(`   Cost: $${costUsd.toFixed(4)}`));
        }
      } else {
        console.log(chalk.yellow(`\n⚠️  No token usage information available`));
      }

      if (!success && code !== 0) {
        console.log(chalk.red(`⚠️  Process exited with code ${code}`));
      }

      resolve({
        success,
        tokens,
        costUsd
      });
    });

    claude.on('error', (err) => {
      console.error(chalk.red(`\n❌ Failed to run Claude CLI: ${err.message}`));
      resolve({
        success: false,
        tokens: null
      });
    });
  });
}

/**
 * Execute tests for a run
 * @param {number} runNumber - Run number
 * @param {TestRunManager} manager - Test run manager
 */
async function executeTests(runNumber, manager) {
  console.log(chalk.cyan(`\n\n🧪 Running Tests...\n`));

  const runDir = manager.getRunDirectory(runNumber);
  const repoRoot = path.join(__dirname, '../../..');

  // Get the list of fixtures that were generated for this run
  const run = manager.getTestRun(runNumber);
  const fixtures = run.fixtures || [];

  // Create a test pattern to only test fixtures that were generated
  const testPattern = fixtures.map(f => `${f}.test.js`).join('|');

  return new Promise((resolve) => {
    // Run Jest tests from repository root, passing test run directory as env var
    const jestArgs = ['test', '--', '--testPathPattern', testPattern, '--verbose'];

    const jest = spawn('npm', jestArgs, {
      cwd: repoRoot,
      stdio: 'inherit',
      env: { ...process.env, TEST_RUN_DIR: runDir }
    });

    jest.on('close', (code) => {
      const success = code === 0;

      // Update run with test results
      manager.updateTestRun(runNumber, {
        status: success ? 'completed' : 'failed',
        tested: true,
        testResults: {
          success,
          timestamp: new Date().toISOString()
        }
      });

      if (success) {
        console.log(chalk.green(`\n✓ All tests passed!`));
      } else {
        console.log(chalk.red(`\n✗ Some tests failed.`));
      }

      resolve();
    });
  });
}

module.exports = { newRun };
