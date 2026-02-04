const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const fs = require('fs-extra');
const {
  FixtureStep,
  PreparationStep,
  TestPreparationStep,
  ExecutionStep,
  TestExecutionStep,
} = require('./batch-steps');

function loadBatchSteps(batch) {
  // If file does not exist then initialize new results.

  let batchResults = {};

  if (fs.existsSync(batch.batchResultsFile)) {
    batchResults = JSON.parse(fs.readFileSync(batch.batchResultsFile, 'utf8'));
  }

  return {
    fixture: new FixtureStep({
      batch,
      ...(batchResults?.steps?.fixture ?? {}),
    }),
    preparation: new PreparationStep({
      batch,
      ...(batchResults?.steps?.preparation ?? {}),
    }),
    testPreparation: new TestPreparationStep({
      batch,
      ...(batchResults?.steps?.testPreparation ?? {}),
    }),
    execution: new ExecutionStep({
      batch,
      ...(batchResults?.steps?.execution ?? {}),
    }),
    testExecution: new TestExecutionStep({
      batch,
      ...(batchResults?.steps?.testExecution ?? {}),
    }),
  };
}

class Batch {
  constructor({
    run,
    plan,
    tool,
    prepareOnly = false,
  }) {
    this.run = run;
    this.plan = plan;
    this.tool = tool;
    this.prepareOnly = prepareOnly;

    this.batchDir = path.join(this.run.runDir, tool.id, plan.id);
    this.fixtureDir = path.join(this.batchDir, 'fixture');
    this.batchResultsFile = path.join(this.batchDir, 'batch-results.json');
    this.steps = loadBatchSteps(this);
  }

  async execute() {
    let result = await this.steps.fixture.execute()
        && await this.steps.preparation.execute()
        && await this.steps.testPreparation.execute();

    if (!this.prepareOnly) {
      result = result
        && await this.steps.execution.execute()
        && await this.steps.testExecution.execute();
    }

    const batchResults = {
      toolId: this.tool.id,
      planId: this.plan.id,
      steps: {
        fixture: this.steps.fixture.writeLog().getData(),
        preparation: this.steps.preparation.writeLog().getData(),
        testPreparation: this.steps.testPreparation.writeLog().getData(),
        execution: this.steps.execution.writeLog().getData(),
        testExecution: this.steps.testExecution.writeLog().getData(),
      },
    };

    fs.writeFileSync(this.batchResultsFile, JSON.stringify(batchResults, null, 2));

    return result;
  }
}

module.exports = Batch;
