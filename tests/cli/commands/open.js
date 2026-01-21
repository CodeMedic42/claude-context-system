const path = require('path');
const fs = require('fs');
const os = require('os');
const chalk = require('chalk');
const openApp = require('open');
const {
  selectBatch,
  showBatchMenu,
  selectTestRun,
  displayBatchSummary,
} = require('../lib/ui-helpers');
const { formatToolLog } = require('../lib/log-formatter');
const { formatJestOutput, extractTestSummary, formatTestSummary } = require('../lib/jest-formatter');

/**
 * Get run directory path
 */
function getRunDir(runNumber) {
  const runRootDir = path.join(os.homedir(), 'claude-context-test-runs');
  return path.join(runRootDir, String(runNumber).padStart(3, '0'));
}

/**
 * Load all batches for a run
 */
function loadBatches(runDir) {
  const batches = [];

  // Iterate through tool directories
  const toolDirs = fs.readdirSync(runDir).filter((name) => {
    const fullPath = path.join(runDir, name);
    return fs.statSync(fullPath).isDirectory();
  });

  toolDirs.forEach((toolId) => {
    const toolDir = path.join(runDir, toolId);

    // Iterate through plan directories
    const planDirs = fs.readdirSync(toolDir).filter((name) => {
      const fullPath = path.join(toolDir, name);
      return fs.statSync(fullPath).isDirectory();
    });

    planDirs.forEach((planId) => {
      const batchDir = path.join(toolDir, planId);
      const resultsFile = path.join(batchDir, 'batch-results.json');

      if (fs.existsSync(resultsFile)) {
        try {
          const batchResults = JSON.parse(fs.readFileSync(resultsFile, 'utf8'));
          batches.push({
            ...batchResults,
            batchDir,
            fixtureDir: path.join(batchDir, 'fixture'),
            logFile: path.join(batchDir, `tool.${toolId}.log`),
          });
        } catch (error) {
          console.error(chalk.red(`Failed to load batch: ${batchDir}`));
        }
      }
    });
  });

  return batches;
}

/**
 * Handle batch menu actions
 */
async function handleBatchActions(batch) {
  let action = null;

  while (action !== 'back' && action !== 'exit') {
    // Display batch summary
    displayBatchSummary(batch);

    // Show menu
    action = await showBatchMenu(batch);

    if (action === 'open-fixture') {
      console.log(chalk.cyan(`\n📂 Opening: ${batch.fixtureDir}`));
      await openApp(batch.fixtureDir);
    } else if (action === 'view-log') {
      console.log(chalk.bold(`\n${'='.repeat(60)}`));
      console.log(chalk.bold('📄 Tool Generation Log'));
      console.log(chalk.bold(`${'='.repeat(60)}\n`));

      const formattedLog = formatToolLog(batch.toolId, batch.logFile);
      console.log(formattedLog);

      console.log(chalk.bold(`\n${'='.repeat(60)}\n`));

      // Wait for user to press enter
      const inquirer = require('inquirer');
      await inquirer.prompt([
        {
          type: 'input',
          name: 'continue',
          message: 'Press Enter to continue...',
        },
      ]);
    } else if (action === 'view-tests') {
      if (!batch.testResults || batch.testResults.length === 0) {
        console.log(chalk.yellow('\n⚠️  No test results available for this batch.'));
        const inquirer = require('inquirer');
        await inquirer.prompt([
          {
            type: 'input',
            name: 'continue',
            message: 'Press Enter to continue...',
          },
        ]);
        continue;
      }

      // Let user select a test run
      const testRun = await selectTestRun(batch.testResults);

      console.log(chalk.bold(`\n${'='.repeat(60)}`));
      console.log(chalk.bold('🧪 Test Results'));
      console.log(chalk.bold(`${'='.repeat(60)}\n`));

      const summary = extractTestSummary(testRun.log);
      console.log(chalk.bold('Summary: ') + formatTestSummary(summary));
      console.log(chalk.gray(`Ran on: ${new Date(testRun.ranOn).toLocaleString()}\n`));

      console.log(chalk.bold('Output:'));
      console.log(chalk.bold('-'.repeat(60)));
      const formattedOutput = formatJestOutput(testRun.log);
      console.log(formattedOutput);
      console.log(chalk.bold('-'.repeat(60)));

      console.log();

      // Wait for user to press enter
      const inquirer = require('inquirer');
      await inquirer.prompt([
        {
          type: 'input',
          name: 'continue',
          message: 'Press Enter to continue...',
        },
      ]);
    }
  }

  return action === 'exit';
}

/**
 * Open command handler
 */
async function openCommand(options) {
  try {
    const runNumber = parseInt(options.run, 10);

    if (isNaN(runNumber) || runNumber < 1) {
      throw new Error('Run number must be a positive integer');
    }

    const runDir = getRunDir(runNumber);
    const resultsFile = path.join(runDir, 'results.json');

    if (!fs.existsSync(resultsFile)) {
      throw new Error(`Run ${runNumber} not found`);
    }

    // Load run results
    const results = JSON.parse(fs.readFileSync(resultsFile, 'utf8'));

    console.log(chalk.bold(`\n${'='.repeat(60)}`));
    console.log(chalk.bold(`📊 Test Run ${runNumber}`));
    console.log(chalk.bold(`${'='.repeat(60)}\n`));
    console.log(chalk.cyan(`Tools: ${results.toolIds.join(', ')}`));
    console.log(chalk.cyan(`Plans: ${results.planIds.join(', ')}`));
    console.log();

    // Load all batches
    const batches = loadBatches(runDir);

    if (batches.length === 0) {
      console.log(chalk.yellow('No batches found in this run.'));
      return;
    }

    // Interactive loop
    let shouldExit = false;
    while (!shouldExit) {
      // Let user select a batch
      const batch = await selectBatch(batches);

      // Handle batch actions
      shouldExit = await handleBatchActions(batch);
    }

    console.log(chalk.green('\n👋 Goodbye!'));
  } catch (error) {
    console.error(chalk.red(`Error: ${error.message}`));
    process.exit(1);
  }
}

module.exports = openCommand;
