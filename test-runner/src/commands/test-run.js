const inquirer = require('inquirer');
const chalk = require('chalk');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs-extra');
const TestRunManager = require('../lib/test-run-manager');

async function testRun(runNumber) {
  const manager = new TestRunManager();

  // If no run number provided, prompt to select one
  if (!runNumber) {
    const list = manager.getTestRunList();
    const generatedRuns = list.runs.filter(r => r.generated);

    if (generatedRuns.length === 0) {
      console.log(chalk.yellow('\n⚠️  No test runs available to test.'));
      console.log(chalk.gray('Create a new run first with: ctx-test new-run\n'));
      return;
    }

    const choices = generatedRuns.map(run => ({
      name: formatRunChoice(run),
      value: run.runNumber
    }));

    const { selectedRun } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedRun',
        message: 'Select a test run to test:',
        choices
      }
    ]);

    runNumber = selectedRun;
  }

  const run = manager.getTestRun(runNumber);

  if (!run) {
    console.log(chalk.red(`\n❌ Test run #${runNumber} not found.\n`));
    return;
  }

  if (!run.generated) {
    console.log(chalk.red(`\n❌ Test run #${runNumber} has not been generated yet.\n`));
    console.log(chalk.gray('Generate it first or select a different run.\n'));
    return;
  }

  // Show run details
  console.log(chalk.cyan('\n📋 Test Run Details'));
  console.log(chalk.gray('═'.repeat(50)));
  console.log(`Run Number: ${chalk.bold('#' + run.runNumber)}`);
  console.log(`Created: ${chalk.gray(new Date(run.timestamp).toLocaleString())}`);
  console.log(`Fixtures: ${chalk.bold(run.fixtures.length)}`);
  console.log(`Status: ${getStatusBadge(run.status)}`);
  if (run.notes) {
    console.log(`Notes: ${chalk.gray(run.notes)}`);
  }
  if (run.tags && run.tags.length > 0) {
    console.log(`Tags: ${run.tags.map(t => chalk.cyan(t)).join(', ')}`);
  }
  console.log(chalk.gray('═'.repeat(50)));

  // List fixtures
  console.log(chalk.cyan('\n📦 Fixtures in this run:'));
  run.fixtures.forEach((fixture, index) => {
    const fixtureDir = manager.getFixtureDirectory(run.runNumber, fixture);
    const claudeMdExists = fs.existsSync(path.join(fixtureDir, 'claude.md'));
    const icon = claudeMdExists ? chalk.green('✓') : chalk.red('✗');
    console.log(`  ${icon} ${fixture}`);
  });

  // Confirm test execution
  const { confirmTest } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmTest',
      message: 'Run tests for this run?',
      default: true
    }
  ]);

  if (!confirmTest) {
    console.log(chalk.yellow('\n⚠️  Test execution cancelled.\n'));
    return;
  }

  // Option to select specific fixtures to test
  const { testScope } = await inquirer.prompt([
    {
      type: 'list',
      name: 'testScope',
      message: 'What would you like to test?',
      choices: [
        { name: 'All fixtures', value: 'all' },
        { name: 'Select specific fixtures', value: 'select' }
      ]
    }
  ]);

  let fixturesToTest = run.fixtures;

  if (testScope === 'select') {
    const { selected } = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'selected',
        message: 'Select fixtures to test:',
        choices: run.fixtures.map(f => ({
          name: f,
          value: f,
          checked: true
        })),
        validate: (answer) => {
          if (answer.length < 1) {
            return 'You must select at least one fixture.';
          }
          return true;
        }
      }
    ]);
    fixturesToTest = selected;
  }

  // Execute tests
  await executeTests(run.runNumber, fixturesToTest, manager);
}

/**
 * Format run choice for display
 */
function formatRunChoice(run) {
  const date = new Date(run.timestamp).toLocaleString();
  const status = getStatusBadge(run.status);
  const fixtures = chalk.gray(`(${run.fixtures.length} fixtures)`);
  const notes = run.notes ? chalk.gray(` - ${run.notes}`) : '';

  return `#${run.runNumber} - ${date} ${status} ${fixtures}${notes}`;
}

/**
 * Get status badge
 */
function getStatusBadge(status) {
  const badges = {
    pending: chalk.gray('⏸ pending'),
    generated: chalk.yellow('📝 generated'),
    completed: chalk.green('✓ completed'),
    failed: chalk.red('✗ failed'),
    partial: chalk.yellow('⚠ partial')
  };
  return badges[status] || status;
}

/**
 * Execute tests
 */
async function executeTests(runNumber, fixtures, manager) {
  console.log(chalk.cyan(`\n\n🧪 Running Tests...\n`));

  const runDir = manager.getRunDirectory(runNumber);
  const repoRoot = path.join(__dirname, '../../..');

  // Create a test pattern to only test selected fixtures
  const testPattern = fixtures.map(f => `${f}.test.js`).join('|');

  return new Promise((resolve) => {
    const jestArgs = [
      'test',
      '--',
      '--testPathPattern',
      testPattern,
      '--verbose'
    ];

    const jest = spawn('npm', jestArgs, {
      cwd: repoRoot,
      stdio: 'inherit',
      env: {
        ...process.env,
        TEST_RUN_DIR: runDir,
        TEST_RUN_NUMBER: runNumber.toString()
      }
    });

    jest.on('close', (code) => {
      const success = code === 0;
      const timestamp = new Date().toISOString();

      // Update run with test results
      manager.updateTestRun(runNumber, {
        status: success ? 'completed' : 'failed',
        tested: true,
        lastTestRun: timestamp,
        testResults: {
          success,
          timestamp,
          fixtures: fixtures,
          exitCode: code
        }
      });

      console.log(chalk.gray('\n─'.repeat(50)));
      if (success) {
        console.log(chalk.green.bold('\n✓ All tests passed!\n'));
      } else {
        console.log(chalk.red.bold('\n✗ Some tests failed.\n'));
      }

      resolve();
    });

    jest.on('error', (err) => {
      console.error(chalk.red(`\n❌ Failed to run tests: ${err.message}\n`));
      resolve();
    });
  });
}

module.exports = { testRun };
