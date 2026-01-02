const inquirer = require('inquirer');
const chalk = require('chalk');
const Table = require('cli-table3');
const diff = require('diff');
const fs = require('fs-extra');
const path = require('path');
const TestRunManager = require('../lib/test-run-manager');

async function compareRuns() {
  const manager = new TestRunManager();
  const list = manager.getTestRunList();

  if (list.runs.length < 2) {
    console.log(chalk.yellow('\n⚠️  Need at least 2 test runs to compare.'));
    console.log(chalk.gray('Create more runs with: ctx-test new-run\n'));
    return;
  }

  // Select two runs to compare
  const choices = list.runs
    .sort((a, b) => b.runNumber - a.runNumber)
    .map(run => ({
      name: formatRunChoice(run),
      value: run.runNumber
    }));

  const { run1Number, run2Number } = await inquirer.prompt([
    {
      type: 'list',
      name: 'run1Number',
      message: 'Select first run:',
      choices
    },
    {
      type: 'list',
      name: 'run2Number',
      message: 'Select second run:',
      choices: choices.filter(c => c.value !== null),
      validate: (answer, answers) => {
        if (answer === answers.run1Number) {
          return 'Please select a different run.';
        }
        return true;
      }
    }
  ]);

  const run1 = manager.getTestRun(run1Number);
  const run2 = manager.getTestRun(run2Number);

  // Show comparison
  console.log(chalk.cyan('\n🔄 Comparing Test Runs'));
  console.log(chalk.gray('═'.repeat(70)));

  // Metadata comparison
  const metaTable = new Table({
    head: ['', chalk.bold(`Run #${run1.runNumber}`), chalk.bold(`Run #${run2.runNumber}`)],
    colWidths: [20, 25, 25]
  });

  metaTable.push(
    ['Date', formatDate(run1.timestamp), formatDate(run2.timestamp)],
    ['Status', getStatusBadge(run1.status), getStatusBadge(run2.status)],
    ['Fixtures', run1.fixtures.length.toString(), run2.fixtures.length.toString()],
    ['Generated', run1.generated ? chalk.green('✓') : chalk.gray('✗'),
                  run2.generated ? chalk.green('✓') : chalk.gray('✗')],
    ['Tested', run1.tested ? chalk.green('✓') : chalk.gray('✗'),
               run2.tested ? chalk.green('✓') : chalk.gray('✗')]
  );

  console.log(metaTable.toString());

  // Token usage comparison
  if (run1.tokenUsage && run2.tokenUsage) {
    console.log(chalk.cyan('\n💰 Token Usage Comparison'));
    console.log(chalk.gray('─'.repeat(70)));

    const tokenTable = new Table({
      head: ['', chalk.bold(`Run #${run1.runNumber}`), chalk.bold(`Run #${run2.runNumber}`), chalk.bold('Difference')],
      colWidths: [15, 18, 18, 18]
    });

    const inputDiff = (run2.tokenUsage.input || 0) - (run1.tokenUsage.input || 0);
    const outputDiff = (run2.tokenUsage.output || 0) - (run1.tokenUsage.output || 0);
    const totalDiff = (run2.tokenUsage.total || 0) - (run1.tokenUsage.total || 0);

    tokenTable.push(
      ['Input Tokens',
       (run1.tokenUsage.input || 0).toLocaleString(),
       (run2.tokenUsage.input || 0).toLocaleString(),
       formatDiff(inputDiff)],
      ['Output Tokens',
       (run1.tokenUsage.output || 0).toLocaleString(),
       (run2.tokenUsage.output || 0).toLocaleString(),
       formatDiff(outputDiff)],
      ['Total Tokens',
       (run1.tokenUsage.total || 0).toLocaleString(),
       (run2.tokenUsage.total || 0).toLocaleString(),
       formatDiff(totalDiff)]
    );

    console.log(tokenTable.toString());
  }

  // Fixture comparison
  const commonFixtures = run1.fixtures.filter(f => run2.fixtures.includes(f));
  const onlyInRun1 = run1.fixtures.filter(f => !run2.fixtures.includes(f));
  const onlyInRun2 = run2.fixtures.filter(f => !run1.fixtures.includes(f));

  console.log(chalk.cyan('\n📦 Fixture Comparison'));
  console.log(chalk.gray('─'.repeat(70)));
  console.log(`Common fixtures: ${chalk.bold(commonFixtures.length)}`);
  console.log(`  ${commonFixtures.join(', ') || chalk.gray('none')}`);

  if (onlyInRun1.length > 0) {
    console.log(`\nOnly in Run #${run1.runNumber}: ${chalk.yellow(onlyInRun1.length)}`);
    console.log(`  ${onlyInRun1.join(', ')}`);
  }

  if (onlyInRun2.length > 0) {
    console.log(`\nOnly in Run #${run2.runNumber}: ${chalk.yellow(onlyInRun2.length)}`);
    console.log(`  ${onlyInRun2.join(', ')}`);
  }

  // Test results comparison
  if (run1.testResults && run2.testResults) {
    console.log(chalk.cyan('\n🧪 Test Results Comparison'));
    console.log(chalk.gray('─'.repeat(70)));

    const testTable = new Table({
      head: ['', chalk.bold(`Run #${run1.runNumber}`), chalk.bold(`Run #${run2.runNumber}`)],
      colWidths: [20, 25, 25]
    });

    testTable.push(
      ['Success',
       run1.testResults.success ? chalk.green('✓ Passed') : chalk.red('✗ Failed'),
       run2.testResults.success ? chalk.green('✓ Passed') : chalk.red('✗ Failed')],
      ['Exit Code',
       run1.testResults.exitCode?.toString() || 'N/A',
       run2.testResults.exitCode?.toString() || 'N/A']
    );

    console.log(testTable.toString());
  }

  // Option to compare file contents
  if (commonFixtures.length > 0) {
    const { compareFiles } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'compareFiles',
        message: 'Would you like to compare generated files?',
        default: false
      }
    ]);

    if (compareFiles) {
      await compareFixtureFiles(run1, run2, commonFixtures, manager);
    }
  }

  console.log();
}

/**
 * Compare files between two runs
 */
async function compareFixtureFiles(run1, run2, fixtures, manager) {
  const { selectedFixture } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selectedFixture',
      message: 'Select fixture to compare:',
      choices: fixtures
    }
  ]);

  const file1 = path.join(manager.getFixtureDirectory(run1.runNumber, selectedFixture), 'claude.md');
  const file2 = path.join(manager.getFixtureDirectory(run2.runNumber, selectedFixture), 'claude.md');

  if (!fs.existsSync(file1) || !fs.existsSync(file2)) {
    console.log(chalk.red('\n❌ claude.md not found in one or both runs.\n'));
    return;
  }

  const content1 = fs.readFileSync(file1, 'utf8');
  const content2 = fs.readFileSync(file2, 'utf8');

  console.log(chalk.cyan(`\n📄 Comparing claude.md for: ${selectedFixture}`));
  console.log(chalk.gray('═'.repeat(70)));

  const differences = diff.diffLines(content1, content2);
  let hasChanges = false;

  differences.forEach(part => {
    if (part.added) {
      hasChanges = true;
      console.log(chalk.green('+ ' + part.value.trim()));
    } else if (part.removed) {
      hasChanges = true;
      console.log(chalk.red('- ' + part.value.trim()));
    }
  });

  if (!hasChanges) {
    console.log(chalk.gray('No differences found.'));
  }

  console.log(chalk.gray('═'.repeat(70)));
}

/**
 * Format run choice
 */
function formatRunChoice(run) {
  const date = new Date(run.timestamp).toLocaleDateString();
  const status = getStatusBadge(run.status);
  return `#${run.runNumber} - ${date} ${status} (${run.fixtures.length} fixtures)`;
}

/**
 * Format date
 */
function formatDate(timestamp) {
  return new Date(timestamp).toLocaleString();
}

/**
 * Get status badge
 */
function getStatusBadge(status) {
  const badges = {
    pending: chalk.gray('⏸'),
    generated: chalk.yellow('📝'),
    completed: chalk.green('✓'),
    failed: chalk.red('✗'),
    partial: chalk.yellow('⚠')
  };
  return badges[status] || status;
}

/**
 * Format difference with color
 */
function formatDiff(value) {
  if (value === 0) {
    return chalk.gray('0');
  } else if (value > 0) {
    return chalk.red('+' + value.toLocaleString());
  } else {
    return chalk.green(value.toLocaleString());
  }
}

module.exports = { compareRuns };
