const path = require('path');
const fs = require('fs');
const os = require('os');
const chalk = require('chalk');
const { forEach } = require('lodash');

/**
 * Get all test runs, sorted by run number
 */
function getAllRuns(runRootDir) {
  if (!fs.existsSync(runRootDir)) {
    return [];
  }

  const entries = fs.readdirSync(runRootDir);
  const runs = [];

  forEach(entries, (entry) => {
    const runDir = path.join(runRootDir, entry);
    const resultsFile = path.join(runDir, 'results.json');

    if (fs.existsSync(resultsFile)) {
      try {
        const results = JSON.parse(fs.readFileSync(resultsFile, 'utf8'));
        const stats = fs.statSync(runDir);

        runs.push({
          runNumber: results.runNumber,
          planIds: results.planIds,
          toolIds: results.toolIds,
          createdAt: stats.birthtime,
          runDir,
        });
      } catch (error) {
        // Skip invalid results files
      }
    }
  });

  // Sort by run number descending
  runs.sort((a, b) => a.runNumber - b.runNumber);

  return runs;
}

/**
 * Format run info for display
 */
function formatRunInfo(run) {
  const {
    runNumber, planIds, toolIds, createdAt,
  } = run;
  const timestamp = createdAt.toLocaleString();

  console.log(chalk.bold(`\nRun ${String(runNumber).padStart(3, '0')}:`));
  console.log(chalk.gray(`  Created: ${timestamp}`));
  console.log(chalk.cyan(`  Tools: ${toolIds.join(', ')}`));
  console.log(chalk.cyan(`  Plans: ${planIds.join(', ')}`));
}

/**
 * List command handler
 */
async function listCommand(options) {
  try {
    const runRootDir = path.join(os.homedir(), 'claude-context-test-runs');
    const limit = parseInt(options.limit, 10);

    const runs = getAllRuns(runRootDir);

    if (runs.length === 0) {
      console.log(chalk.yellow('No test runs found.'));
      console.log(chalk.gray(`Run directory: ${runRootDir}`));
      return;
    }

    console.log(chalk.bold(`\n📊 Test Runs (showing ${Math.min(limit, runs.length)} of ${runs.length}):`));

    const displayRuns = runs.slice(0, limit);
    displayRuns.forEach((run) => formatRunInfo(run));

    if (runs.length > limit) {
      console.log(chalk.gray(`\n... and ${runs.length - limit} more runs`));
      console.log(chalk.gray('Use --limit to show more'));
    }

    console.log(chalk.gray(`\nRun directory: ${runRootDir}`));
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

module.exports = listCommand;
