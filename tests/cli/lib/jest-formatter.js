const chalk = require('chalk');
const stripAnsi = require('strip-ansi');

/**
 * Parse and colorize Jest output
 * Extracts test results and formats them for display
 */
function formatJestOutput(rawOutput) {
  if (!rawOutput) {
    return chalk.gray('No test output available');
  }

  // Jest output is already ANSI colored, but we may need to re-parse it
  const lines = rawOutput.split('\n');
  let output = '';

  lines.forEach((line) => {
    const stripped = stripAnsi(line);

    // Test results
    if (stripped.includes('✓') || stripped.includes('PASS')) {
      output += chalk.green(line) + '\n';
    } else if (stripped.includes('✕') || stripped.includes('FAIL')) {
      output += chalk.red(line) + '\n';
    } else if (stripped.includes('Test Suites:')) {
      output += chalk.bold(line) + '\n';
    } else if (stripped.includes('Tests:')) {
      output += chalk.bold(line) + '\n';
    } else if (stripped.includes('Snapshots:')) {
      output += chalk.bold(line) + '\n';
    } else if (stripped.includes('Time:')) {
      output += chalk.dim(line) + '\n';
    } else if (stripped.trim().startsWith('●')) {
      // Error markers
      output += chalk.red(line) + '\n';
    } else if (stripped.trim().startsWith('expect(')) {
      // Expectation failures
      output += chalk.red(line) + '\n';
    } else {
      // Default: keep original color if present, otherwise use white
      output += line + '\n';
    }
  });

  return output;
}

/**
 * Extract test summary from Jest output
 */
function extractTestSummary(rawOutput) {
  if (!rawOutput) {
    return {
      passed: 0,
      failed: 0,
      total: 0,
      duration: 0,
    };
  }

  const stripped = stripAnsi(rawOutput);

  // Parse "Tests: X failed, Y passed, Z total"
  const testsMatch = stripped.match(/Tests:\s+(\d+)\s+failed,\s+(\d+)\s+passed/);
  const passedOnlyMatch = stripped.match(/Tests:\s+(\d+)\s+passed/);
  const durationMatch = stripped.match(/Time:\s+(\d+\.?\d*)\s*s/);

  let passed = 0;
  let failed = 0;

  if (testsMatch) {
    failed = parseInt(testsMatch[1], 10);
    passed = parseInt(testsMatch[2], 10);
  } else if (passedOnlyMatch) {
    passed = parseInt(passedOnlyMatch[1], 10);
  }

  const total = passed + failed;
  const duration = durationMatch ? parseFloat(durationMatch[1]) : 0;

  return {
    passed,
    failed,
    total,
    duration,
  };
}

/**
 * Format test summary for display
 */
function formatTestSummary(summary) {
  const { passed, failed, total, duration } = summary;

  let output = '';

  if (failed > 0) {
    output += chalk.red.bold(`✗ ${failed} failed`) + ', ';
  }

  if (passed > 0) {
    output += chalk.green.bold(`✓ ${passed} passed`) + ', ';
  }

  output += chalk.white(`${total} total`);
  output += chalk.gray(` (${duration}s)`);

  return output;
}

module.exports = {
  formatJestOutput,
  extractTestSummary,
  formatTestSummary,
};
