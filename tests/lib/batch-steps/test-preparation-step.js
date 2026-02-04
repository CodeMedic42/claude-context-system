const BatchStep = require('./batch-step');
const runJest = require('../run-jest');

class TestPreparationStep extends BatchStep {
  constructor(config) {
    super({
      id: 'testPreparation',
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
      testName: 'Preparation',
      testFileName: 'preparation.test.js',
    });

    this.status = success ? 'success' : 'failed';
    this.log = log;
    this.error = error;

    return success;
  }
}

module.exports = TestPreparationStep;
