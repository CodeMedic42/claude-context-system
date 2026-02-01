const BatchStep = require('./batch-step');
const runJest = require('../run-jest');

class TestContextProgressStep extends BatchStep {
  constructor(config) {
    super({
      id: 'testContextProgress',
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
      testName: 'Context Progress',
      testFileName: 'context-progress-0.test.js',
    });

    this.status = success ? 'success' : 'failed';
    this.log = log;
    this.error = error;

    return success;
  }
}

module.exports = TestContextProgressStep;
