const path = require('path');
const fs = require('fs-extra');
const { forEach, map } = require('lodash');
const { execSync } = require('child_process');
const BatchStep = require('../batch-step');
const ExecutionCycle = require('./execution-cycle');
const ActionPlan = require('../../action-plan');

class ExecutionStep extends BatchStep {
  constructor(config) {
    super({
      id: 'execution',
      ...config,
    });

    this.previousCycles = config.cycles ?? [];
    this.cycles = [];
  }

  // eslint-disable-next-line no-unused-vars
  async execute(rerun) {
    this.actionPlan = ActionPlan.load(this.batch.fixtureDir);

    // Check if we need to clean up a failed cycle
    let cycleNumber = 0;
    if (this.previousCycles.length > 0) {
      const lastCycle = this.previousCycles[this.previousCycles.length - 1];

      if (lastCycle.status === 'failed') {
        console.log(`  Detected failed cycle ${lastCycle.cycleNumber}, cleaning up...`);
        await this.cleanupFailedCycle(lastCycle);

        // Set cycleNumber to retry the failed cycle
        cycleNumber = lastCycle.cycleNumber;

        // Remove the failed cycle from previousCycles
        this.previousCycles.pop();
      }
    }

    let complete = false;

    while (!complete) {
      const previousCycleData = this.previousCycles[cycleNumber] ?? {};

      const executionCycle = new ExecutionCycle({
        ...previousCycleData,
        cycleNumber,
        executionStep: this,
        batch: this.batch,
      });

      this.cycles.push(executionCycle);

      // eslint-disable-next-line no-await-in-loop
      const success = await executionCycle.execute(`${rerun}-${cycleNumber}`);

      // Write log file immediately after cycle completes
      executionCycle.writeLog();

      // Update batch-results.json incrementally
      this.writeBatchResults();

      if (!success) {
        break;
      }

      if (executionCycle.uncompletedCount <= 0) {
        complete = true;
      } else {
        cycleNumber += 1;
      }
    }

    // If completed verify that CLAUDE.md exists.
    const claudeMdPath = path.join(this.batch.fixtureDir, 'CLAUDE.md');

    if (!fs.existsSync(claudeMdPath)) {
      this.status = 'failed';
      this.error = 'Execution completed with exit code 0, but CLAUDE.md was not created';

      console.error(`  ✗ Validation failed: CLAUDE.md not found at ${claudeMdPath}`);

      return false;
    }

    return complete;
  }

  writeLog() {
    forEach(this.cycles, (cycle) => {
      cycle.writeLog();
    });

    return this;
  }

  getData() {
    const cycles = map(this.cycles, (cycle) => cycle.getData());

    return {
      cycles,
    };
  }

  writeBatchResults() {
    // Read current batch results
    let batchResults = {};
    if (fs.existsSync(this.batch.batchResultsFile)) {
      batchResults = JSON.parse(fs.readFileSync(this.batch.batchResultsFile, 'utf8'));
    }

    // Update execution step data
    if (!batchResults.steps) {
      batchResults.steps = {};
    }
    batchResults.steps.execution = this.getData();

    // Write back to file
    fs.writeFileSync(
      this.batch.batchResultsFile,
      JSON.stringify(batchResults, null, 2),
    );
  }

  async cleanupFailedCycle(failedCycleData) {
    const { cycleNumber } = failedCycleData;

    // 1. Load the snapshot
    const snapshotPath = path.join(
      this.batch.batchDir,
      `progress-snapshot-cycle-${cycleNumber}.json`,
    );

    if (!fs.existsSync(snapshotPath)) {
      console.error(`  ✗ Snapshot not found: ${snapshotPath}`);
      throw new Error(`Cannot clean up cycle ${cycleNumber}: snapshot not found`);
    }

    const snapshotContent = fs.readFileSync(snapshotPath, 'utf8');
    const snapshotProgress = JSON.parse(snapshotContent);

    // 2. Get the list of projects to clean up
    const { nextProject } = snapshotProgress;
    const { maxProjects } = this.batch.plan;
    const allProjects = this.actionPlan.getProjectsInOrder();

    // Find the starting index
    const startIndex = allProjects.findIndex((p) => p.id === nextProject);
    if (startIndex === -1) {
      console.error(`  ✗ Could not find nextProject "${nextProject}" in action plan`);
      throw new Error(`Cannot clean up cycle ${cycleNumber}: nextProject not found`);
    }

    // Get the projects to clean (maxProjects count starting from startIndex)
    const projectsToClean = allProjects.slice(startIndex, startIndex + maxProjects);

    console.log(`  Cleaning up ${projectsToClean.length} project(s)...`);

    // 3. Clean up context files for each project
    forEach(projectsToClean, (project) => {
      const projectPath = path.join(this.batch.fixtureDir, project.path);

      // All possible context file types
      const contextFileTypes = [
        'PROJECT.CLAUDE.md',
        'LIBRARY.CLAUDE.md',
        'CLIENT.CLAUDE.md',
        'SERVICE.CLAUDE.md',
        'DATABASE.CLAUDE.md',
        'IAC.CLAUDE.md',
      ];

      forEach(contextFileTypes, (fileType) => {
        const filePath = path.join(projectPath, fileType);
        this.restoreOrDeleteFile(filePath);
      });
    });

    // 4. Clean up root CLAUDE.md
    const rootClaudeMd = path.join(this.batch.fixtureDir, 'CLAUDE.md');
    this.restoreOrDeleteFile(rootClaudeMd, execSync);

    // 5. Restore progress file from snapshot
    const progressFilePath = path.join(
      this.batch.fixtureDir,
      'CLAUDE_CONTEXT_PROGRESS.json',
    );
    fs.writeFileSync(progressFilePath, snapshotContent);
    console.log('  ✓ Restored progress file from snapshot');

    // 6. Delete the failed cycle's log file
    const logFilePath = path.join(
      this.batch.batchDir,
      `execution-cycle.${cycleNumber}.log`,
    );
    if (fs.existsSync(logFilePath)) {
      fs.unlinkSync(logFilePath);
      console.log(`  ✓ Deleted log file: execution-cycle.${cycleNumber}.log`);
    }

    console.log(`  ✓ Cleanup complete for cycle ${cycleNumber}`);
  }

  restoreOrDeleteFile(filePath) {
    if (!fs.existsSync(filePath)) {
      return; // File doesn't exist, nothing to clean up
    }

    try {
      // Try to restore from git HEAD (works for tracked files)
      execSync(`git checkout HEAD -- "${filePath}"`, {
        cwd: this.batch.fixtureDir,
        stdio: 'ignore',
      });
      console.log(`  ✓ Restored: ${path.basename(filePath)}`);
    } catch (error) {
      // File is untracked (newly created) - delete it
      try {
        fs.unlinkSync(filePath);
        console.log(`  ✓ Deleted: ${path.basename(filePath)}`);
      } catch (deleteError) {
        console.error(`  ✗ Failed to delete: ${path.basename(filePath)}`);
      }
    }
  }
}

module.exports = ExecutionStep;
