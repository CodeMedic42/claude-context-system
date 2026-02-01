const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const fs = require('fs-extra');
const {
  FixtureStep,
  PreparationStep,
  TestContextPlanStep,
  TestContextProgressStep,
  ExecutionStep,
  TestContextStep,
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
    testContextPlan: new TestContextPlanStep({
      batch,
      ...(batchResults?.steps?.testContextPlan ?? {}),
    }),
    testContextProgress: new TestContextProgressStep({
      batch,
      ...(batchResults?.steps?.testContextProgress ?? {}),
    }),
    execution: new ExecutionStep({
      batch,
      ...(batchResults?.steps?.execution ?? {}),
    }),
    testContext: new TestContextStep({
      batch,
      ...(batchResults?.steps?.testContext ?? {}),
    }),
  };
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

    this.batchDir = path.join(this.run.runDir, tool.id, plan.id);
    this.fixtureDir = path.join(this.batchDir, 'fixture');
    this.batchResultsFile = path.join(this.batchDir, 'batch-results.json');
    this.steps = loadBatchSteps(this);
  }

  async execute() {
    const result = await this.steps.fixture.execute()
      && await this.steps.preparation.execute()
      && await this.steps.testContextPlan.execute()
      && await this.steps.testContextProgress.execute()
      && await this.steps.execution.execute()
      && await this.steps.testContext.execute();

    const batchResults = {
      toolId: this.tool.id,
      planId: this.plan.id,
      steps: {
        fixture: this.steps.fixture.getData(),
        preparation: this.steps.preparation.getData(),
        testContextPlan: this.steps.testContextPlan.getData(),
        testContextProgress: this.steps.testContextProgress.getData(),
        execution: this.steps.execution.getData(),
        testContext: this.steps.testContext.getData(),
      },
    };

    fs.writeFileSync(this.batchResultsFile, JSON.stringify(batchResults, null, 2));

    return result;
  }
}

module.exports = Batch;
