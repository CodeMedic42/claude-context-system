const path = require('path');
const fs = require('fs-extra');
const os = require('os');
const chalk = require('chalk');
const { confirmClean } = require('../lib/ui-helpers');

/**
 * Get all test runs, sorted by run number
 */
function getAllRuns(runRootDir) {
  if (!fs.existsSync(runRootDir)) {
    return [];
  }

  const entries = fs.readdirSync(runRootDir);
  const runs = [];

  entries.forEach((entry) => {
    const runDir = path.join(runRootDir, entry);
    const resultsFile = path.join(runDir, 'results.json');

    if (fs.existsSync(resultsFile)) {
      try {
        const results = JSON.parse(fs.readFileSync(resultsFile, 'utf8'));
        runs.push({
          runNumber: results.runNumber,
          runDir,
        });
      } catch (error) {
        // Skip invalid results files
      }
    }
  });

  // Sort by run number descending
  runs.sort((a, b) => b.runNumber - a.runNumber);

  return runs;
}

/**
 * Clean command handler
 */
async function cleanCommand(options) {
  try {
    const runRootDir = path.join(os.homedir(), 'claude-context-test-runs');
    const keep = parseInt(options.keep, 10);
    const force = options.force || false;

    if (isNaN(keep) || keep < 0) {
      throw new Error('Keep value must be a non-negative integer');
    }

    const runs = getAllRuns(runRootDir);

    if (runs.length === 0) {
      console.log(chalk.yellow('No test runs found.'));
      return;
    }

    if (runs.length <= keep) {
      console.log(chalk.green(`Only ${runs.length} run(s) exist. Nothing to clean.`));
      return;
    }

    const runsToKeep = runs.slice(0, keep);
    const runsToDelete = runs.slice(keep);

    // Confirm with user unless --force
    if (!force) {
      const confirmed = await confirmClean(runsToDelete.length, runsToKeep.length);
      if (!confirmed) {
        console.log('Cleanup cancelled.');
        return;
      }
    }

    // Delete runs
    console.log(chalk.yellow(`\n🗑️  Deleting ${runsToDelete.length} run(s)...`));

    let deletedCount = 0;
    runsToDelete.forEach((run) => {
      try {
        fs.removeSync(run.runDir);
        console.log(chalk.gray(`  ✓ Deleted run ${String(run.runNumber).padStart(3, '0')}`));
        deletedCount++;
      } catch (error) {
        console.error(chalk.red(`  ✗ Failed to delete run ${run.runNumber}: ${error.message}`));
      }
    });

    console.log(chalk.green(`\n✓ Deleted ${deletedCount} run(s)`));
    console.log(chalk.gray(`  Kept ${runsToKeep.length} most recent run(s)`));
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

module.exports = cleanCommand;
