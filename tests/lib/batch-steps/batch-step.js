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

  getData() {
    return {
      status: this.status,
      log: this.log,
      error: this.error,
    };
  }
}

module.exports = BatchStep;
