const inquirer = require('inquirer');
const chalk = require('chalk');
const TestRunManager = require('../lib/test-run-manager');

async function cleanRuns() {
  const manager = new TestRunManager();
  const list = manager.getTestRunList();

  if (list.runs.length === 0) {
    console.log(chalk.yellow('\n⚠️  No test runs to clean.\n'));
    return;
  }

  const stats = manager.getStatistics();

  console.log(chalk.cyan('\n🗑️  Clean Old Test Runs'));
  console.log(chalk.gray('═'.repeat(70)));
  console.log(`Total runs: ${chalk.bold(stats.totalRuns)}`);
  console.log(`Disk usage: ${chalk.bold(stats.diskUsage)}`);
  console.log(chalk.gray('═'.repeat(70)));

  const { cleanAction } = await inquirer.prompt([
    {
      type: 'list',
      name: 'cleanAction',
      message: 'What would you like to clean?',
      choices: [
        { name: 'Delete runs older than X days', value: 'byAge' },
        { name: 'Delete specific runs', value: 'specific' },
        { name: 'Delete all failed runs', value: 'failed' },
        { name: 'Delete all pending runs', value: 'pending' },
        new inquirer.Separator(),
        { name: '← Back', value: 'back' }
      ]
    }
  ]);

  if (cleanAction === 'back') {
    return;
  }

  if (cleanAction === 'byAge') {
    await cleanByAge(manager);
  } else if (cleanAction === 'specific') {
    await cleanSpecific(manager, list);
  } else if (cleanAction === 'failed') {
    await cleanByStatus(manager, list, 'failed');
  } else if (cleanAction === 'pending') {
    await cleanByStatus(manager, list, 'pending');
  }
}

/**
 * Clean runs by age
 */
async function cleanByAge(manager) {
  const { days } = await inquirer.prompt([
    {
      type: 'number',
      name: 'days',
      message: 'Delete runs older than how many days?',
      default: 30,
      validate: (value) => {
        if (value < 1) {
          return 'Please enter a positive number.';
        }
        return true;
      }
    }
  ]);

  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: chalk.yellow(`This will delete all runs older than ${days} days. Continue?`),
      default: false
    }
  ]);

  if (!confirm) {
    console.log(chalk.gray('\n⚠️  Operation cancelled.\n'));
    return;
  }

  console.log(chalk.cyan('\n🗑️  Deleting old runs...'));
  const deleted = manager.deleteOldRuns(days);

  if (deleted > 0) {
    console.log(chalk.green(`\n✓ Deleted ${deleted} run(s).\n`));
  } else {
    console.log(chalk.gray('\n✓ No runs found matching criteria.\n'));
  }
}

/**
 * Clean specific runs
 */
async function cleanSpecific(manager, list) {
  const choices = list.runs
    .sort((a, b) => b.runNumber - a.runNumber)
    .map(run => ({
      name: formatRunChoice(run),
      value: run.runNumber,
      checked: false
    }));

  const { selectedRuns } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'selectedRuns',
      message: 'Select runs to delete:',
      choices,
      validate: (answer) => {
        if (answer.length < 1) {
          return 'You must select at least one run.';
        }
        return true;
      }
    }
  ]);

  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: chalk.yellow(`Delete ${selectedRuns.length} run(s)?`),
      default: false
    }
  ]);

  if (!confirm) {
    console.log(chalk.gray('\n⚠️  Operation cancelled.\n'));
    return;
  }

  console.log(chalk.cyan('\n🗑️  Deleting runs...'));
  let deleted = 0;

  for (const runNumber of selectedRuns) {
    try {
      manager.deleteTestRun(runNumber);
      console.log(chalk.gray(`  ✓ Deleted run #${runNumber}`));
      deleted++;
    } catch (err) {
      console.log(chalk.red(`  ✗ Failed to delete run #${runNumber}: ${err.message}`));
    }
  }

  console.log(chalk.green(`\n✓ Deleted ${deleted} run(s).\n`));
}

/**
 * Clean runs by status
 */
async function cleanByStatus(manager, list, status) {
  const runsToDelete = list.runs.filter(r => r.status === status);

  if (runsToDelete.length === 0) {
    console.log(chalk.gray(`\n✓ No ${status} runs found.\n`));
    return;
  }

  console.log(chalk.cyan(`\n📋 Found ${runsToDelete.length} ${status} run(s):`));
  runsToDelete.forEach(run => {
    console.log(chalk.gray(`  #${run.runNumber} - ${new Date(run.timestamp).toLocaleDateString()}`));
  });

  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: chalk.yellow(`Delete all ${runsToDelete.length} ${status} run(s)?`),
      default: false
    }
  ]);

  if (!confirm) {
    console.log(chalk.gray('\n⚠️  Operation cancelled.\n'));
    return;
  }

  console.log(chalk.cyan('\n🗑️  Deleting runs...'));
  let deleted = 0;

  for (const run of runsToDelete) {
    try {
      manager.deleteTestRun(run.runNumber);
      console.log(chalk.gray(`  ✓ Deleted run #${run.runNumber}`));
      deleted++;
    } catch (err) {
      console.log(chalk.red(`  ✗ Failed to delete run #${run.runNumber}: ${err.message}`));
    }
  }

  console.log(chalk.green(`\n✓ Deleted ${deleted} run(s).\n`));
}

/**
 * Format run choice
 */
function formatRunChoice(run) {
  const date = new Date(run.timestamp).toLocaleDateString();
  const status = getStatusBadge(run.status);
  const fixtures = chalk.gray(`(${run.fixtures.length} fixtures)`);

  return `#${run.runNumber} - ${date} ${status} ${fixtures}`;
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

module.exports = { cleanRuns };
