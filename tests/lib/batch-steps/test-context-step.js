const BatchStep = require('./batch-step');
const runJest = require('../run-jest');

class TestContextStep extends BatchStep {
  constructor(config) {
    super({
      id: 'testContext',
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
      testName: 'Context',
      testFileName: 'context.test.js',
    });

    this.status = success ? 'success' : 'failed';
    this.log = log;
    this.error = error;

    return success;
  }
}

module.exports = TestContextStep;
