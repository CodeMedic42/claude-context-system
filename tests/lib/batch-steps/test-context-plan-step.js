const BatchStep = require('./batch-step');
const runJest = require('../run-jest');

class TestContextPlanStep extends BatchStep {
  constructor(config) {
    super({
      id: 'testContextPlan',
      ...config,
    });
  }

  async execute(rerun) {
    if (await super.execute(rerun)) {
      return true;
    }

    const {
      success,
      log,
      error,
    } = await runJest({
      batch: this.batch,
      testName: 'Context Plan',
      testFileName: 'context-plan.test.js',
    });

    this.status = success ? 'success' : 'failed';
    this.log = log;
    this.error = error;

    return success;
  }
}

module.exports = TestContextPlanStep;
