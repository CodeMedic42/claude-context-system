const path = require('path');
const fs = require('fs');
const { forEach, map } = require('lodash');
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

    let complete = false;
    const cycleNumber = 0;

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

      if (!success) {
        break;
      }

      if (executionCycle.uncompletedCount <= 0) {
        complete = true;
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
}

module.exports = ExecutionStep;
