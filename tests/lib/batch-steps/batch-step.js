const path = require('path');
const fs = require('fs-extra');

class BatchStep {
  constructor({
    batch,
    id,
    status,
    log,
    error,
  }) {
    this.batch = batch;
    this.id = id;
    this.status = status ?? 'pending';
    this.log = log ?? '';
    this.error = error ?? null;
    this.logFilePath = path.join(this.batch.batchDir, `${this.id}.log`);
  }

  async execute(rerun) {
    if (this.status === 'success' && rerun !== this.id) {
      return true;
    }

    this.status = 'pending';
    this.log = '';
    this.error = null;

    return false;
  }

  writeLog() {
    fs.writeFileSync(this.logFilePath, this.log || '');

    return this;
  }

  getData() {
    return {
      status: this.status,
      logFilePath: this.logFilePath,
      error: this.error,
    };
  }
}

module.exports = BatchStep;
