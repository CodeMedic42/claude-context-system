const path = require('path');
const fs = require('fs');
const { confirmTestRun } = require('../lib/ui-helpers');
const ExecutionContext = require('../../lib/execution-context');
const Run = require('../../lib/run');

/**
 * Get all available test plans
 */
function getAllTestPlans(plansDir) {
  return fs.readdirSync(plansDir)
    .filter((name) => {
      const fullPath = path.join(plansDir, name);
      return fs.statSync(fullPath).isDirectory() && !name.startsWith('.');
    });
}

/**
 * Parse comma-separated values or return default
 */
function parseList(value, allValues) {
  if (!value) {
    return allValues;
  }
  return value.split(',').map((v) => v.trim()).filter((v) => v);
}

/**
 * Validate that plans exist
 */
function validatePlans(plans, allPlans) {
  const invalid = plans.filter((p) => !allPlans.includes(p));
  if (invalid.length > 0) {
    throw new Error(`Invalid plan(s): ${invalid.join(', ')}\nAvailable: ${allPlans.join(', ')}`);
  }
}

/**
 * Validate that tools are valid
 */
function validateTools(tools) {
  const validTools = ['plugin'];
  const invalid = tools.filter((t) => !validTools.includes(t));
  if (invalid.length > 0) {
    throw new Error(`Invalid tool(s): ${invalid.join(', ')}\nAvailable: ${validTools.join(', ')}`);
  }
}

/**
 * Test command handler
 */
async function testCommand(options) {
  try {
    const plansDir = path.join(process.cwd(), 'tests', 'plans');

    // Get all available plans
    const allPlans = getAllTestPlans(plansDir);

    // Parse options
    const tools = parseList(options.tools, ['plugin']);
    const plans = parseList(options.plans, allPlans);

    // Validate
    validateTools(tools);
    validatePlans(plans, allPlans);

    // Confirm with user
    const confirmed = await confirmTestRun(tools, plans);
    if (!confirmed) {
      console.log('Test run cancelled.');
      process.exit(0);
    }

    // Override process.argv to match ExecutionContext expectations
    // ExecutionContext reads from process.argv
    const originalArgv = process.argv;
    const argv = [
      process.argv[0], // node
      process.argv[1], // script
      `tool=${tools.join(',')}`,
      `plan=${plans.join(',')}`,
    ];

    if (options.prepareOnly) {
      argv.push('prepare-only=true');
    }

    process.argv = argv;

    // Create execution context and run
    const executionContext = new ExecutionContext();
    const run = new Run(executionContext);
    const success = await run.start();

    // Restore argv
    process.argv = originalArgv;

    process.exit(success ? 0 : 1);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

module.exports = testCommand;
