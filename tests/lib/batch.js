const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const fs = require('fs-extra');
const { execSync, spawn } = require('child_process');
const { forEach } = require('lodash');

function updateContextFileSHAs(repoPath) {
  // Get current HEAD SHA
  const headSHA = execSync('git rev-parse HEAD', {
    cwd: repoPath,
    encoding: 'utf8',
  }).trim();

  console.log(`    Updating context file SHAs to: ${headSHA.substring(0, 7)}...`);

  // Find all context files recursively
  const contextFiles = [];

  function findContextFiles(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    forEach(entries, (entry) => {
      const fullPath = path.join(dir, entry.name);

      // Skip .git and node_modules directories
      if (entry.isDirectory()) {
        if (entry.name !== '.git' && entry.name !== 'node_modules') {
          findContextFiles(fullPath);
        }
      } else {
        const entryName = entry.name.toLowerCase();

        if (entryName.endsWith('claude.md')) {
          // Check if it's a context file
          contextFiles.push(fullPath);
        }
      }
    });
  }

  findContextFiles(repoPath);

  if (contextFiles.length <= 0) {
    return false;
  }

  // Update each context file
  forEach(contextFiles, (filePath) => {
    let content = fs.readFileSync(filePath, 'utf8');

    // Update the SHA line in the metadata
    const shaLineRegex = /^- Last commit SHA built from: [a-f0-9]+$/m;

    if (shaLineRegex.test(content)) {
      content = content.replace(
        shaLineRegex,
        `- Last commit SHA built from: ${headSHA}`,
      );

      fs.writeFileSync(filePath, content, 'utf8');

      const relativePath = path.relative(repoPath, filePath);

      console.log(`    Updated SHA in: ${relativePath}`);
    }
  });

  console.log(`    Updated ${contextFiles.length} context file(s)`);

  return true;
}

async function setupFixture({
  plan,
  batch,
}) {
  await fs.ensureDir(batch.fixtureDir);

  await fs.copy(plan.fixtureDir, batch.fixtureDir);

  const gitDir = path.join(batch.fixtureDir, '.git');

  if (fs.existsSync(gitDir)) {
    throw new Error('.git directory already exists');
  }

  plan.hooks.beforeGitSetup(batch.fixtureDir);

  console.log('    Initializing git repository...');

  // Initialize git repo
  execSync('git init', { cwd: batch.fixtureDir, stdio: 'ignore' });

  // Add everything EXCEPT context files to base commit
  // This way the base state only includes code, not documentation
  execSync('git add .', { cwd: batch.fixtureDir, stdio: 'ignore' });
  execSync('git reset -- "*.claude.md" "*.CLAUDE.md" "claude.md" "CLAUDE.md"', { cwd: batch.fixtureDir, stdio: 'ignore' });
  execSync('git commit -m "Base code state"', { cwd: batch.fixtureDir, stdio: 'ignore' });

  // Now add context files with updated SHAs referencing the base code commit
  // This simulates: "documentation was last generated at base code state"
  const contextFilesExist = updateContextFileSHAs(batch.fixtureDir);

  if (contextFilesExist) {
    execSync('git add .', { cwd: batch.fixtureDir, stdio: 'ignore' });
    execSync('git commit -m "Add context documentation"', { cwd: batch.fixtureDir, stdio: 'ignore' });
  }

  plan.hooks.afterGitSetup(batch.fixtureDir);
}

async function executeTool(
  { tool, batch, command },
  // repoPath,
  // toolName,
  // command = 'ctx-update',
) {
  // Check if tool is available
  const isAvailable = await tool.isAvailable();
  if (!isAvailable) {
    throw new Error(
      `${tool.getName()} is not available.\n\n`
+ 'Please ensure the tool is properly installed.',
    );
  }

  // Execute the tool
  const result = await tool.run({ batch, command });

  if (!result.success) {
    throw new Error(
      `${tool.getName()} failed:\n\n`
+ `Output: ${result.output}\n\n`
+ `Error: ${result.error || 'Unknown error'}`,
    );
  }

  // Verify that context files were created
  const claudeMdUpper = path.join(batch.batchDir, 'CLAUDE.md');
  const claudeMdLower = path.join(batch.batchDir, 'claude.md');

  if (!fs.existsSync(claudeMdUpper) && !fs.existsSync(claudeMdLower)) {
    throw new Error(
      `Context file not found after running ${tool.getName()}\n\n`
+ `Expected: ${claudeMdUpper} or ${claudeMdLower}`,
    );
  }

  return true;
}

async function runTool({
  plan,
  tool,
  batch,
}) {
  console.log(`  Generating context: ${plan.id} (${tool.id})...`);

  try {
    console.log('  Running beforeToolExecution hook...');
    plan.hooks.beforeToolExecution(batch.batchDir);

    // Run the tool
    await executeTool({ tool, batch, command: plan.testCommand });

    console.log('  Running afterToolExecution hook...');
    plan.hooks.afterToolExecution(batch.batchDir);

    console.log('  ✓ Generated successfully');

    return { success: true };
  } catch (error) {
    console.error(`  ✗ Generation failed: ${plan} (${tool})`);
    console.error(`    Error: ${error}`);

    return { success: false, error: error.message };
  }
}

class Batch {
  constructor({
    run,
    plan,
    tool,
  }) {
    this.run = run;
    this.plan = plan;
    this.tool = tool;
    this.generationResult = null;
    this.testResults = [];

    this.batchDir = path.join(this.run.runDir, tool.id, plan.id);
    this.fixtureDir = path.join(this.batchDir, 'fixture');
    this.resultsFile = path.join(this.batchDir, 'batch-results.json');
  }

  writeBatchResults() {
    const batchResults = {
      toolId: this.tool.id,
      planId: this.plan.id,
      generationResults: this.generationResult ? {
        generatedOn: new Date().toISOString(),
        success: this.generationResult.success,
        error: this.generationResult.error?.message || this.generationResult.error || '',
      } : null,
      testResults: this.testResults,
    };

    fs.writeFileSync(this.resultsFile, JSON.stringify(batchResults, null, 2));
  }

  async generate() {
    // First check if this is rerun
    if (this.run.rerun) {
      // Load the existing result from batch-results.json
      if (fs.existsSync(this.resultsFile)) {
        const batchResults = JSON.parse(fs.readFileSync(this.resultsFile, 'utf8'));
        this.generationResult = batchResults.generationResults;
        this.testResults = batchResults.testResults || [];
        console.log(`  ⟳ Reusing existing generation results for: ${this.plan.id} (${this.tool.id})`);
      } else {
        this.generationResult = { success: false, error: 'No previous results found' };
      }

      return this.generationResult;
    }

    try {
      await setupFixture({ plan: this.plan, batch: this });

      await runTool({
        plan: this.plan,
        tool: this.tool,
        batch: this,
      });

      this.generationResult = {
        success: true,
        error: null,
      };
    } catch (error) {
      console.error(`  ✗ Generation failed: ${this.plan.id} (${this.tool.id})`);
      console.error(`    Error: ${error.message}`);

      this.generationResult = {
        success: false,
        error,
      };
    }

    // Write batch results after generation
    this.writeBatchResults();

    return this.generationResult;
  }

  async test() {
    // Skip tests if generation failed
    if (!this.generationResult || !this.generationResult.success) {
      console.error(`  ⊘ Test skipped for failed generation: ${this.plan.id} (${this.tool.id})`);
      const testResult = {
        success: false,
        passed: 0,
        failed: 0,
        duration: 0,
        skipped: true,
        error: this.generationResult?.error || 'Generation failed',
      };

      // Add to testResults array with metadata
      this.testResults.push({
        ranOn: new Date().toISOString(),
        status: 'skipped',
        passed: 0,
        failed: 0,
        log: '',
      });

      this.writeBatchResults();

      return testResult;
    }

    return new Promise((resolve) => {
      const testFile = path.join(this.plan.planDir, `${this.plan.id}.test.js`);

      // Check if test file exists
      if (!fs.existsSync(testFile)) {
        console.log(`  ⊘ No test file found: ${testFile}`);

        const testResult = {
          success: false,
          passed: 0,
          failed: 0,
          duration: 0,
          skipped: true,
          error: 'No test file found',
        };

        // Add to testResults array with metadata
        this.testResults.push({
          ranOn: new Date().toISOString(),
          status: 'skipped',
          passed: 0,
          failed: 0,
          log: `Test file not found: ${testFile}`,
        });

        this.writeBatchResults();

        resolve(testResult);
        return;
      }

      const env = {
        ...process.env,
        TEST_RUN_DIR: this.fixtureDir,
        TEST_TOOL: this.tool.id,
      };

      console.log(`\n  Running tests: ${this.plan.id} (${this.tool.id})...`);

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
        const combinedOutput = stdout + stderr;

        // Parse Jest output for results - match the "Tests:" summary line specifically
        const testsMatch = combinedOutput.match(/Tests:\s+(\d+)\s+failed,\s+(\d+)\s+passed/);
        const passedOnlyMatch = combinedOutput.match(/Tests:\s+(\d+)\s+passed/);
        const durationMatch = combinedOutput.match(/Time:\s+(\d+\.?\d*)\s*s/);

        let passed = 0;
        let failed = 0;

        if (testsMatch) {
          failed = parseInt(testsMatch[1], 10);
          passed = parseInt(testsMatch[2], 10);
        } else if (passedOnlyMatch) {
          passed = parseInt(passedOnlyMatch[1], 10);
        }

        const duration = durationMatch ? parseFloat(durationMatch[1]) : 0;

        if (code === 0) {
          console.log(`  ✓ Tests passed: ${passed} tests in ${duration}s`);
        } else {
          console.log(`  ✗ Tests failed: ${failed} failed, ${passed} passed`);
        }

        const testResult = {
          success: code === 0,
          passed,
          failed,
          duration,
          output: combinedOutput,
          error: code !== 0 ? stderr : null,
        };

        // Add to testResults array with metadata
        this.testResults.push({
          ranOn: new Date().toISOString(),
          status: code === 0 ? 'success' : 'failed',
          passed,
          failed,
          log: combinedOutput,
        });

        this.writeBatchResults();

        resolve(testResult);
      });
    });
  }
}

module.exports = Batch;
