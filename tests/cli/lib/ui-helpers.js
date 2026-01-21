const inquirer = require('inquirer');
const chalk = require('chalk');

/**
 * Confirm test run configuration
 */
async function confirmTestRun(tools, plans) {
  console.log(chalk.bold('\n📋 Test Run Configuration:'));
  console.log(chalk.cyan(`   Tools: ${tools.join(', ')}`));
  console.log(chalk.cyan(`   Plans: ${plans.join(', ')}`));
  console.log();

  const { confirmed } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmed',
      message: 'Run tests with this configuration?',
      default: true,
    },
  ]);

  return confirmed;
}

/**
 * Select a batch from a list
 */
async function selectBatch(batches) {
  const choices = batches.map((batch) => ({
    name: `${batch.toolId} / ${batch.planId}`,
    value: batch,
  }));

  const { batch } = await inquirer.prompt([
    {
      type: 'list',
      name: 'batch',
      message: 'Select a batch to view:',
      choices,
      pageSize: 15,
    },
  ]);

  return batch;
}

/**
 * Show batch action menu
 */
async function showBatchMenu(batch) {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        { name: '📂 Open fixture in file explorer', value: 'open-fixture' },
        { name: '📄 View tool generation log', value: 'view-log' },
        { name: '🧪 View test results', value: 'view-tests' },
        { name: '← Back to batch list', value: 'back' },
        { name: '✕ Exit', value: 'exit' },
      ],
    },
  ]);

  return action;
}

/**
 * Select a test run from test results
 */
async function selectTestRun(testResults) {
  const choices = testResults.map((result, index) => {
    const status = result.status === 'success'
      ? chalk.green('✓ PASS')
      : result.status === 'failed'
        ? chalk.red('✗ FAIL')
        : chalk.gray('⊘ SKIP');

    const timestamp = new Date(result.ranOn).toLocaleString();

    return {
      name: `${status} - ${timestamp} (${result.passed} passed, ${result.failed} failed)`,
      value: index,
    };
  });

  const { testIndex } = await inquirer.prompt([
    {
      type: 'list',
      name: 'testIndex',
      message: 'Select a test run to view:',
      choices,
    },
  ]);

  return testResults[testIndex];
}

/**
 * Confirm cleanup action
 */
async function confirmClean(runsToDelete, runsToKeep) {
  console.log(chalk.yellow.bold('\n⚠️  Warning: This will delete test runs permanently!'));
  console.log(chalk.white(`   Keeping: ${runsToKeep} most recent run(s)`));
  console.log(chalk.white(`   Deleting: ${runsToDelete} run(s)`));
  console.log();

  const { confirmed } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmed',
      message: 'Are you sure you want to delete these runs?',
      default: false,
    },
  ]);

  return confirmed;
}

/**
 * Display batch summary
 */
function displayBatchSummary(batch) {
  console.log(chalk.bold(`\n${'='.repeat(60)}`));
  console.log(chalk.bold(`📦 Batch: ${batch.toolId} / ${batch.planId}`));
  console.log(chalk.bold(`${'='.repeat(60)}\n`));

  // Generation results
  if (batch.generationResults) {
    const { success, generatedOn, error } = batch.generationResults;
    console.log(chalk.bold('Generation:'));
    if (success) {
      console.log(chalk.green(`  ✓ Success`));
      console.log(chalk.gray(`  Generated: ${new Date(generatedOn).toLocaleString()}`));
    } else {
      console.log(chalk.red(`  ✗ Failed`));
      if (error) {
        console.log(chalk.red(`  Error: ${error}`));
      }
    }
  } else {
    console.log(chalk.gray('  No generation data'));
  }

  console.log();

  // Test results summary
  if (batch.testResults && batch.testResults.length > 0) {
    console.log(chalk.bold('Test Runs:'));
    batch.testResults.forEach((result, index) => {
      const status = result.status === 'success'
        ? chalk.green('✓ PASS')
        : result.status === 'failed'
          ? chalk.red('✗ FAIL')
          : chalk.gray('⊘ SKIP');

      const timestamp = new Date(result.ranOn).toLocaleString();
      console.log(`  ${index + 1}. ${status} - ${timestamp}`);
      console.log(chalk.gray(`     ${result.passed} passed, ${result.failed} failed`));
    });
  } else {
    console.log(chalk.gray('  No test results'));
  }

  console.log();
}

module.exports = {
  confirmTestRun,
  selectBatch,
  showBatchMenu,
  selectTestRun,
  confirmClean,
  displayBatchSummary,
};
