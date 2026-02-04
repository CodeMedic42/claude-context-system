const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const fs = require('fs-extra');
const { execSync } = require('child_process');
const { forEach } = require('lodash');
const BatchStep = require('./batch-step');

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

class FixtureStep extends BatchStep {
  constructor(config) {
    super({
      id: 'fixture',
      ...config,
    });
  }

  async execute(rerun) {
    if (await super.execute(rerun)) {
      return true;
    }

    try {
      console.log(`  Setting up fixture: ${this.batch.plan.id} - ${this.batch.tool.id}...`);

      // Make sure the fixture directory exists and create it if it does not.
      await fs.ensureDir(this.batch.fixtureDir);

      if (fs.existsSync(this.batch.plan.fixtureDir)) {
        await fs.copy(this.batch.plan.fixtureDir, this.batch.fixtureDir);
      }

      const gitDir = path.join(this.batch.fixtureDir, '.git');

      if (fs.existsSync(gitDir)) {
        throw new Error('.git directory already exists');
      }

      console.log('  Running beforeFixtureSetup hook...');
      await this.batch.plan.hooks.beforeFixtureSetup(this.batch.fixtureDir);

      // Initialize git repo
      console.log('    Initializing git repository...');
      execSync('git init', { cwd: this.batch.fixtureDir, stdio: 'ignore' });

      // Add everything EXCEPT context files to base commit
      // This way the base state only includes code, not documentation
      execSync('git add .', { cwd: this.batch.fixtureDir, stdio: 'ignore' });
      execSync('git reset -- "*.claude.md" "*.CLAUDE.md" "claude.md" "CLAUDE.md"', { cwd: this.batch.fixtureDir, stdio: 'ignore' });
      execSync('git commit -m "Base code state"', { cwd: this.batch.fixtureDir, stdio: 'ignore' });

      // Now add context files with updated SHAs referencing the base code commit
      // This simulates: "documentation was last generated at base code state"
      const contextFilesExist = updateContextFileSHAs(this.batch.fixtureDir);

      if (contextFilesExist) {
        execSync('git add .', { cwd: this.batch.fixtureDir, stdio: 'ignore' });
        execSync('git commit -m "Add context documentation"', { cwd: this.batch.fixtureDir, stdio: 'ignore' });
      }

      console.log('  Running afterFixtureSetup hook...');
      await this.batch.plan.hooks.afterFixtureSetup(this.batch.fixtureDir);

      console.log('  Fixture Setup Complete');

      this.status = 'success';

      return true;
    } catch (error) {
      console.error(`  ✗ Fixture Setup failed: ${this.batch.plan.id} (${this.batch.tool.id})`);
      console.error(`    Error: ${error}`);

      this.status = 'failed';
      this.error = error.message;

      return false;
    }
  }
}

module.exports = FixtureStep;
