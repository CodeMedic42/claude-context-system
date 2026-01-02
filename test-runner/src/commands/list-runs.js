const chalk = require('chalk');
const Table = require('cli-table3');
const { format } = require('date-fns');
const TestRunManager = require('../lib/test-run-manager');

async function listRuns() {
  const manager = new TestRunManager();
  const list = manager.getTestRunList();

  if (list.runs.length === 0) {
    console.log(chalk.yellow('\n⚠️  No test runs found.'));
    console.log(chalk.gray('Create one with: ctx-test new-run\n'));
    return;
  }

  // Show statistics first
  const stats = manager.getStatistics();
  console.log(chalk.cyan('\n📊 Test Run Statistics'));
  console.log(chalk.gray('═'.repeat(70)));

  const statsTable = new Table({
    chars: { 'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': '' },
    style: { 'padding-left': 0, 'padding-right': 2 }
  });

  statsTable.push(
    ['Total Runs:', chalk.bold(stats.totalRuns)],
    ['Completed:', chalk.green(stats.completedRuns)],
    ['Failed:', chalk.red(stats.failedRuns)],
    ['Pending:', chalk.gray(stats.pendingRuns)],
    ['Disk Usage:', chalk.cyan(stats.diskUsage)]
  );

  console.log(statsTable.toString());
  console.log(chalk.gray('═'.repeat(70)));

  // Show runs table
  console.log(chalk.cyan('\n📋 Test Runs'));
  console.log(chalk.gray('═'.repeat(70)));

  const table = new Table({
    head: [
      chalk.bold('Run'),
      chalk.bold('Date'),
      chalk.bold('Fixtures'),
      chalk.bold('Status'),
      chalk.bold('Tokens'),
      chalk.bold('Tags')
    ],
    colWidths: [6, 20, 10, 14, 12, 20],
    wordWrap: true
  });

  // Sort runs by run number (newest first)
  const sortedRuns = [...list.runs].sort((a, b) => b.runNumber - a.runNumber);

  sortedRuns.forEach(run => {
    const runNum = chalk.bold(`#${run.runNumber}`);
    const date = format(new Date(run.timestamp), 'MMM dd, HH:mm');
    const fixtures = chalk.gray(run.fixtures.length);
    const status = getStatusBadge(run.status);
    const tokens = formatTokens(run.tokenUsage);
    const tags = run.tags && run.tags.length > 0
      ? run.tags.slice(0, 2).join(', ')
      : chalk.gray('-');

    table.push([runNum, date, fixtures, status, tokens, tags]);
  });

  console.log(table.toString());
  console.log(chalk.gray('═'.repeat(70)));

  // Show latest run details
  if (sortedRuns.length > 0) {
    const latest = sortedRuns[0];
    console.log(chalk.cyan('\n🔍 Latest Run Details'));
    console.log(chalk.gray('─'.repeat(70)));
    console.log(`Run: ${chalk.bold('#' + latest.runNumber)}`);
    console.log(`Created: ${chalk.gray(new Date(latest.timestamp).toLocaleString())}`);
    console.log(`Status: ${getStatusBadge(latest.status)}`);
    console.log(`Fixtures: ${chalk.bold(latest.fixtures.join(', '))}`);

    if (latest.notes) {
      console.log(`Notes: ${chalk.gray(latest.notes)}`);
    }

    if (latest.tokenUsage) {
      console.log(`\nToken Usage:`);
      console.log(`  Input: ${chalk.cyan(latest.tokenUsage.input?.toLocaleString() || 'N/A')}`);
      console.log(`  Output: ${chalk.cyan(latest.tokenUsage.output?.toLocaleString() || 'N/A')}`);
      console.log(`  Total: ${chalk.bold.cyan(latest.tokenUsage.total?.toLocaleString() || 'N/A')}`);

      if (latest.tokenUsage.estimatedCost) {
        console.log(`  Est. Cost: ${chalk.yellow('$' + latest.tokenUsage.estimatedCost.toFixed(2))}`);
      }
    }

    if (latest.testResults) {
      console.log(`\nTest Results:`);
      console.log(`  Last Run: ${chalk.gray(new Date(latest.testResults.timestamp).toLocaleString())}`);
      console.log(`  Status: ${latest.testResults.success ? chalk.green('✓ Passed') : chalk.red('✗ Failed')}`);
    }

    console.log(chalk.gray('─'.repeat(70)));
  }

  console.log();
}

/**
 * Get status badge with color
 */
function getStatusBadge(status) {
  const badges = {
    pending: chalk.gray('⏸  Pending'),
    generated: chalk.yellow('📝 Generated'),
    completed: chalk.green('✓  Completed'),
    failed: chalk.red('✗  Failed'),
    partial: chalk.yellow('⚠  Partial')
  };
  return badges[status] || status;
}

/**
 * Format token usage
 */
function formatTokens(tokenUsage) {
  if (!tokenUsage || !tokenUsage.total) {
    return chalk.gray('-');
  }

  const total = tokenUsage.total;
  if (total < 1000) {
    return chalk.cyan(total.toString());
  } else if (total < 1000000) {
    return chalk.cyan((total / 1000).toFixed(1) + 'K');
  } else {
    return chalk.cyan((total / 1000000).toFixed(2) + 'M');
  }
}

module.exports = { listRuns };
