const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Initialize a git repository in the given directory
 * @param {string} repoPath - Path to repository
 */
function initGitRepo(repoPath) {
  execSync('git init', { cwd: repoPath, stdio: 'ignore' });
  execSync('git add .', { cwd: repoPath, stdio: 'ignore' });
  execSync('git commit -m "Initial commit"', { cwd: repoPath, stdio: 'ignore' });
}

/**
 * Get the current git HEAD commit SHA
 * @param {string} repoPath - Path to repository
 * @returns {string} - Commit SHA
 */
function getCommitSha(repoPath) {
  return execSync('git rev-parse HEAD', { cwd: repoPath, encoding: 'utf8' }).trim();
}

/**
 * Verify that claude.md exists in the repository
 *
 * Tests assume claude.md has already been generated using:
 *   ./tests/scripts/generate-fixtures.sh
 *
 * @param {string} repoPath - Path to repository
 * @returns {Promise<boolean>} - Success status
 */
async function runPluginCommand(repoPath) {
  const claudeMdPath = path.join(repoPath, 'claude.md');

  if (!fs.existsSync(claudeMdPath)) {
    throw new Error(
      `claude.md not found at ${claudeMdPath}\n\n` +
      `Please generate test fixtures first:\n` +
      `  cd ${path.dirname(repoPath)}\n` +
      `  ./scripts/generate-fixtures.sh\n\n` +
      `Or generate manually for this fixture:\n` +
      `  cd ${repoPath}\n` +
      `  claude\n` +
      `  # Then run: /claude-context-updater:ctx-update`
    );
  }

  return true;
}

/**
 * Clean up generated files in a repository
 * @param {string} repoPath - Path to repository
 */
function cleanupGeneratedFiles(repoPath) {
  const claudeMdPath = path.join(repoPath, 'claude.md');
  if (fs.existsSync(claudeMdPath)) {
    fs.unlinkSync(claudeMdPath);
  }

  // Clean up any *.claude.md files
  const files = fs.readdirSync(repoPath, { recursive: true, withFileTypes: true });
  files.forEach(file => {
    if (file.isFile() && file.name.endsWith('.claude.md')) {
      const filePath = path.join(file.path || repoPath, file.name);
      fs.unlinkSync(filePath);
    }
  });
}

/**
 * Create a fixture repository with basic structure
 * @param {string} fixturePath - Path where fixture should be created
 * @param {Object} structure - Object describing the file structure
 */
function createFixtureRepo(fixturePath, structure) {
  // Create directory
  if (!fs.existsSync(fixturePath)) {
    fs.mkdirSync(fixturePath, { recursive: true });
  }

  // Create files and directories based on structure
  function createStructure(basePath, struct) {
    Object.entries(struct).forEach(([name, content]) => {
      const itemPath = path.join(basePath, name);

      if (typeof content === 'object' && !Array.isArray(content)) {
        // It's a directory
        fs.mkdirSync(itemPath, { recursive: true });
        createStructure(itemPath, content);
      } else {
        // It's a file
        fs.writeFileSync(itemPath, content, 'utf8');
      }
    });
  }

  createStructure(fixturePath, structure);
}

module.exports = {
  initGitRepo,
  getCommitSha,
  runPluginCommand,
  cleanupGeneratedFiles,
  createFixtureRepo
};
