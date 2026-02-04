const path = require('path');
const fs = require('fs');
const { forEach, isNil } = require('lodash');
const ProgressData = require('../../progress-data');

function verifyPreviousNotLost(newProgressData) {
  forEach(
    this.previousProgressData.getCompletedProjects(),
    (completedProject) => {
      const { id: projectId } = completedProject;

      const project = newProgressData.getCompletedProject(projectId);

      if (isNil(project)) {
        throw new Error(`Execution cycle #${this.cycleNumber} failed. Projects from previous cycle missing from the new one`);
      }
    },
  );
}

function verifyCompletedExist(newProgressData) {
  forEach(newProgressData.getCompletedProjects(), (completedProject) => {
    const { id: projectId } = completedProject;

    const contextFiles = newProgressData.getContextFiles(projectId);

    forEach(contextFiles, (contextFile) => {
      const { path: contextFilePath } = contextFile;

      const exists = fs.existsSync(contextFilePath);

      if (!exists) {
        throw new Error(`Execution cycle #${this.cycleNumber} failed. Project ${projectId} missing context file: "${contextFilePath}"`);
      }
    });
  });
}

function verifyAdditionalCompleted(newProgressData) {
  const previousCompletedCount = this.previousProgressData.getCompletedProjects().length;
  const newCompletedCount = newProgressData.getCompletedProjects().length;

  const pass = previousCompletedCount <= newCompletedCount;

  if (!pass) {
    throw new Error(`Execution cycle #${this.cycleNumber} failed. No new projects completed from previous execution cycle"`);
  }
}

class ExecutionCycle {
  constructor({
    batch,
    executionStep,
    status,
    log,
    error,
    cycleNumber,
    uncompletedCount,
  }) {
    this.executionStep = executionStep;
    this.batch = batch;

    this.cycleNumber = cycleNumber;
    this.status = status ?? 'pending';
    this.log = log ?? '';
    this.error = error ?? null;
    this.uncompletedCount = uncompletedCount ?? null;

    this.logFilePath = path.join(this.batch.batchDir, `execution-cycle.${this.cycleNumber}.log`);

    this.previousProgressData = ProgressData.load(this.batch.fixtureDir);
  }

  async execute(rerun) {
    if (this.status === 'success' && rerun !== `${this.executionStep.id}-${this.cycleNumber}`) {
      return true;
    }

    this.status = 'pending';
    this.uncompletedCount = null;
    this.log = '';
    this.error = null;

    try {
      console.log(`  Running execution cycle #${this.cycleNumber}: ${this.batch.plan.id} - ${this.batch.tool.id}...`);

      console.log('  Running beforeToolExecutionCycle hook...');
      await this.batch.plan.hooks.beforeToolExecutionCycle({
        fixtureDir: this.batch.fixtureDir,
        cycleNumber: this.cycleNumber,
      });

      // Execute the tool
      const {
        success,
        output,
        error,
      } = await this.batch.tool.run({
        batch: this.batch,
        command: 'execute',
        args: [],
      });

      this.log = output;
      this.error = error ?? null;

      if (!success) {
        this.status = 'failed';

        return false;
      }

      const newProgressData = ProgressData.load(this.batch.fixtureDir);

      // 1. Verify that the completed projects from
      //    previousProgressData remain completed in newProgressData.
      verifyPreviousNotLost.call(this, newProgressData);

      // 2. Verify all completed files exist.
      verifyCompletedExist.call(this, newProgressData);

      // 3. Verify that newProgressData has more completed projects than
      //    previousProgressData.
      verifyAdditionalCompleted.call(this, newProgressData);

      const completedCount = newProgressData.getCompletedProjects().length;
      const totalProjects = this.executionStep.actionPlan.getProjectsInOrder().length;

      console.log('  Running afterToolExecutionCycle hook...');
      await this.batch.plan.hooks.afterToolExecutionCycle({
        fixtureDir: this.batch.fixtureDir,
        cycleNumber: this.cycleNumber,
      });

      this.status = 'success';
      this.uncompletedCount = totalProjects - completedCount;

      console.log(`  ✓ Execution cycle #${this.cycleNumber} completed: ${this.batch.plan.id} - ${this.batch.tool.id}`);

      return true;
    } catch (error) {
      console.log(`  ✓ Execution cycle #${this.cycleNumber} failed: ${this.batch.plan.id} - ${this.batch.tool.id}`);
      console.error(`    Error: ${error}`);

      this.status = 'failed';
      this.error = error.message;

      return false;
    }
  }

  writeLog() {
    fs.writeFileSync(this.logFilePath, this.log || '');

    return this;
  }

  getData() {
    return {
      cycleNumber: this.cycleNumber,
      status: this.status,
      logFilePath: this.logFilePath,
      error: this.error,
    };
  }
}

module.exports = ExecutionCycle;
