const path = require('path');
const { spawn } = require('child_process');

async function runJest({
  batch,
  testName,
  testFileName,
}) {
  return new Promise((resolve) => {
    console.log(`\n  Running context plan tests: ${batch.plan.id} - ${batch.tool.id}...`);

    const testFile = path.join(batch.plan.planDir, testFileName);

    const env = {
      ...process.env,
      TEST_RUN_DIR: batch.fixtureDir,
      TEST_TOOL: batch.tool.id,
    };

    const jestProcess = spawn('pnpm', ['exec', 'jest', testFile], {
      cwd: path.join(__dirname, '../..'), // Run from repo root
      env,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    jestProcess.stdout.on('data', (data) => {
      const text = data.toString();
      stdout += text;
      // Print to console in real-time
      process.stdout.write(text);
    });

    jestProcess.stderr.on('data', (data) => {
      const text = data.toString();
      stderr += text;
      // Print to console in real-time
      process.stderr.write(text);
    });

    jestProcess.on('close', (code) => {
      // Jest writes most output to stderr, so combine both for parsing
      const log = stdout + stderr;

      if (code === 0) {
        console.log(`  ✓ ${testName} tests passed: ${batch.plan.id} - ${batch.tool.id}...`);
      } else {
        console.error(`  ✗ ${testName} tests failed: ${batch.plan.id} - ${batch.tool.id}...`);
      }

      resolve({
        success: code === 0,
        log,
        error: null,
      });
    });
  }).catch((error) => {
    console.error(`  ✗ ${testName} tests failed: ${batch.plan.id} - ${batch.tool.id}...`);

    return {
      success: false,
      log: '',
      error: error.message ?? error,
    };
  });
}

module.exports = runJest;
