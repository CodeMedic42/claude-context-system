const { isNil, isNaN } = require('lodash');
const ExecutionContext = require('../../lib/execution-context');
const Run = require('../../lib/run');

/**
 * Rerun command handler
 */
async function rerunCommand(options) {
  try {
    const runNumber = !isNil(options.run) ? parseInt(options.run, 10) : -1;

    if (isNaN(runNumber)) {
      throw new Error('Run number must be a positive integer');
    }

    // Override process.argv to match ExecutionContext expectations
    const originalArgv = process.argv;
    process.argv = [
      process.argv[0], // node
      process.argv[1], // script
      `repeat-run=${runNumber}`,
      `repeat-step=${options.step}`,
    ];

    // Create execution context with repeat-run
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

module.exports = rerunCommand;
