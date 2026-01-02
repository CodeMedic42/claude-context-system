#!/usr/bin/env node

const inquirer = require('inquirer');
const chalk = require('chalk');
const { newRun } = require('./commands/new-run');
const { testRun } = require('./commands/test-run');
const { listRuns } = require('./commands/list-runs');
const { compareRuns } = require('./commands/compare-runs');
const { cleanRuns } = require('./commands/clean-runs');

const BANNER = `
${chalk.blue('╔════════════════════════════════════════════════════════════╗')}
${chalk.blue('║')}  ${chalk.bold('Claude Context System - Test Runner')}                 ${chalk.blue('║')}
${chalk.blue('╚════════════════════════════════════════════════════════════╝')}
`;

async function main() {
  console.clear();
  console.log(BANNER);

  const command = process.argv[2];

  // Direct commands
  if (command === 'new-run') {
    await newRun();
    return;
  }

  if (command === 'test-run') {
    const runNumber = process.argv[3];
    await testRun(runNumber);
    return;
  }

  if (command === 'list') {
    await listRuns();
    return;
  }

  if (command === 'compare') {
    await compareRuns();
    return;
  }

  if (command === 'clean') {
    await cleanRuns();
    return;
  }

  // Interactive menu
  await showMainMenu();
}

async function showMainMenu() {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        { name: '🆕  Create new test run', value: 'new' },
        { name: '🧪  Run tests on existing run', value: 'test' },
        { name: '📋  List all test runs', value: 'list' },
        { name: '🔄  Compare test runs', value: 'compare' },
        { name: '🗑️   Clean old test runs', value: 'clean' },
        new inquirer.Separator(),
        { name: '❌  Exit', value: 'exit' }
      ]
    }
  ]);

  switch (action) {
    case 'new':
      await newRun();
      break;
    case 'test':
      await testRun();
      break;
    case 'list':
      await listRuns();
      await showMainMenu(); // Return to menu
      break;
    case 'compare':
      await compareRuns();
      await showMainMenu();
      break;
    case 'clean':
      await cleanRuns();
      await showMainMenu();
      break;
    case 'exit':
      console.log(chalk.green('\n👋 Goodbye!\n'));
      process.exit(0);
  }
}

// Handle errors gracefully
process.on('uncaughtException', (err) => {
  console.error(chalk.red('\n❌ Error:'), err.message);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error(chalk.red('\n❌ Error:'), err.message);
  process.exit(1);
});

// Run
if (require.main === module) {
  main().catch(err => {
    console.error(chalk.red('\n❌ Fatal error:'), err);
    process.exit(1);
  });
}

module.exports = { main };
