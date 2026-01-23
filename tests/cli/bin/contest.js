#!/usr/bin/env node

const { Command } = require('commander');
const testCommand = require('../commands/test');
const rerunCommand = require('../commands/rerun');
const openCommand = require('../commands/open');
const listCommand = require('../commands/list');
const cleanCommand = require('../commands/clean');

const program = new Command();

program
  .name('contest')
  .description('Claude Context System Test Runner')
  .version('1.0.0');

// Test command
program
  .command('test')
  .description('Run tests against tools and plans')
  .option('-t, --tools <tools>', 'Comma-separated list of tools (plugin,cli). Default: all tools')
  .option('-p, --plans <plans>', 'Comma-separated list of plans. Default: all plans')
  .action(testCommand);

// Rerun command
program
  .command('rerun')
  .description('Rerun tests from a previous run')
  .requiredOption('-r, --run <number>', 'Run number to repeat')
  .action(rerunCommand);

// Open command
program
  .command('open')
  .description('Interactively explore results from a test run')
  .option('-r, --run <number>', 'Run number to open (if not provided, shows interactive list)')
  .action(openCommand);

// List command
program
  .command('list')
  .description('List all test runs')
  .option('-n, --limit <number>', 'Number of recent runs to show', '10')
  .action(listCommand);

// Clean command
program
  .command('clean')
  .description('Delete old test runs')
  .option('-k, --keep <number>', 'Number of recent runs to keep', '5')
  .option('-f, --force', 'Skip confirmation prompt')
  .action(cleanCommand);

program.parse();
