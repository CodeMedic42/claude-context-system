const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const { format } = require('date-fns');

const TEST_RUNS_DIR = path.join(os.homedir(), 'claude-context-test-runs');
const TEST_RUN_LIST_FILE = path.join(TEST_RUNS_DIR, 'test-run-list.json');

class TestRunManager {
  constructor() {
    this.testRunsDir = TEST_RUNS_DIR;
    this.testRunListFile = TEST_RUN_LIST_FILE;
    this.ensureDirectoryExists();
  }

  /**
   * Ensure the test runs directory and list file exist
   */
  ensureDirectoryExists() {
    fs.ensureDirSync(this.testRunsDir);

    if (!fs.existsSync(this.testRunListFile)) {
      fs.writeJsonSync(this.testRunListFile, { runs: [], nextRunNumber: 1 }, { spaces: 2 });
    }
  }

  /**
   * Get all test runs
   * @returns {Object} - { runs: [], nextRunNumber: number }
   */
  getTestRunList() {
    return fs.readJsonSync(this.testRunListFile);
  }

  /**
   * Get a specific test run
   * @param {number} runNumber - Run number
   * @returns {Object|null} - Run object or null
   */
  getTestRun(runNumber) {
    const list = this.getTestRunList();
    return list.runs.find(r => r.runNumber === parseInt(runNumber));
  }

  /**
   * Create a new test run
   * @param {string[]} fixtures - Selected fixture names
   * @param {Object} options - Additional options
   * @returns {Object} - Created run object
   */
  createTestRun(fixtures, options = {}) {
    const list = this.getTestRunList();
    const runNumber = list.nextRunNumber;
    const timestamp = new Date().toISOString();

    const run = {
      runNumber,
      timestamp,
      fixtures,
      status: 'pending',
      generated: false,
      tested: false,
      notes: options.notes || '',
      tags: options.tags || [],
      templateVersion: options.templateVersion || '2.0.0',
      results: null
    };

    list.runs.push(run);
    list.nextRunNumber += 1;

    fs.writeJsonSync(this.testRunListFile, list, { spaces: 2 });

    // Create run directory
    const runDir = this.getRunDirectory(runNumber);
    fs.ensureDirSync(runDir);

    return run;
  }

  /**
   * Update test run
   * @param {number} runNumber - Run number
   * @param {Object} updates - Updates to apply
   */
  updateTestRun(runNumber, updates) {
    const list = this.getTestRunList();
    const runIndex = list.runs.findIndex(r => r.runNumber === parseInt(runNumber));

    if (runIndex === -1) {
      throw new Error(`Test run ${runNumber} not found`);
    }

    list.runs[runIndex] = {
      ...list.runs[runIndex],
      ...updates,
      lastModified: new Date().toISOString()
    };

    fs.writeJsonSync(this.testRunListFile, list, { spaces: 2 });

    return list.runs[runIndex];
  }

  /**
   * Get directory path for a test run
   * @param {number} runNumber - Run number
   * @returns {string} - Directory path
   */
  getRunDirectory(runNumber) {
    const paddedNumber = String(runNumber).padStart(3, '0');
    return path.join(this.testRunsDir, `test-run-${paddedNumber}`);
  }

  /**
   * Get fixture directory within a run
   * @param {number} runNumber - Run number
   * @param {string} fixtureName - Fixture name
   * @returns {string} - Fixture directory path
   */
  getFixtureDirectory(runNumber, fixtureName) {
    return path.join(this.getRunDirectory(runNumber), fixtureName);
  }

  /**
   * Copy fixture to run directory
   * @param {number} runNumber - Run number
   * @param {string} fixtureName - Fixture name
   * @param {string} sourceFixturePath - Source fixture path
   */
  copyFixture(runNumber, fixtureName, sourceFixturePath) {
    const destPath = this.getFixtureDirectory(runNumber, fixtureName);

    // Remove existing if present
    if (fs.existsSync(destPath)) {
      fs.removeSync(destPath);
    }

    // Copy fixture
    fs.copySync(sourceFixturePath, destPath, {
      filter: (src) => {
        // Exclude node_modules, .git, and generated files
        const relativePath = path.relative(sourceFixturePath, src);
        return !relativePath.includes('node_modules') &&
               !relativePath.includes('.git') &&
               !relativePath.endsWith('claude.md') &&
               !relativePath.endsWith('.claude.md');
      }
    });
  }

  /**
   * Delete a test run
   * @param {number} runNumber - Run number
   */
  deleteTestRun(runNumber) {
    const list = this.getTestRunList();
    const runIndex = list.runs.findIndex(r => r.runNumber === parseInt(runNumber));

    if (runIndex === -1) {
      throw new Error(`Test run ${runNumber} not found`);
    }

    // Remove directory
    const runDir = this.getRunDirectory(runNumber);
    if (fs.existsSync(runDir)) {
      fs.removeSync(runDir);
    }

    // Remove from list
    list.runs.splice(runIndex, 1);
    fs.writeJsonSync(this.testRunListFile, list, { spaces: 2 });
  }

  /**
   * Delete test runs older than specified days
   * @param {number} days - Number of days
   * @returns {number} - Number of runs deleted
   */
  deleteOldRuns(days) {
    const list = this.getTestRunList();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    let deleted = 0;
    const runsToKeep = list.runs.filter(run => {
      const runDate = new Date(run.timestamp);
      if (runDate < cutoffDate) {
        // Delete this run
        const runDir = this.getRunDirectory(run.runNumber);
        if (fs.existsSync(runDir)) {
          fs.removeSync(runDir);
        }
        deleted++;
        return false;
      }
      return true;
    });

    if (deleted > 0) {
      list.runs = runsToKeep;
      fs.writeJsonSync(this.testRunListFile, list, { spaces: 2 });
    }

    return deleted;
  }

  /**
   * Get summary statistics
   * @returns {Object} - Statistics
   */
  getStatistics() {
    const list = this.getTestRunList();

    return {
      totalRuns: list.runs.length,
      pendingRuns: list.runs.filter(r => r.status === 'pending').length,
      completedRuns: list.runs.filter(r => r.status === 'completed').length,
      failedRuns: list.runs.filter(r => r.status === 'failed').length,
      diskUsage: this.calculateDiskUsage()
    };
  }

  /**
   * Calculate total disk usage
   * @returns {string} - Disk usage in human-readable format
   */
  calculateDiskUsage() {
    if (!fs.existsSync(this.testRunsDir)) {
      return '0 B';
    }

    let totalBytes = 0;

    const calculateDirSize = (dirPath) => {
      const files = fs.readdirSync(dirPath);
      files.forEach(file => {
        const filePath = path.join(dirPath, file);
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
          calculateDirSize(filePath);
        } else {
          totalBytes += stats.size;
        }
      });
    };

    calculateDirSize(this.testRunsDir);

    // Convert to human-readable
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = totalBytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  }
}

module.exports = TestRunManager;
