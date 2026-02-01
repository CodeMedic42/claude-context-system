const BatchStep = require('./batch-step');

class PreparationStep extends BatchStep {
  constructor(config) {
    super({
      id: 'preparation',
      ...config,
    });
  }

  async execute(rerun) {
    if (await super.execute(rerun)) {
      return true;
    }

    try {
      console.log(`  Running planning phase: ${this.batch.plan.id} - ${this.batch.tool.id}...`);

      console.log('  Running beforeToolPreparation hook...');
      this.batch.plan.hooks.beforeToolPreparation(this.batch.batchDir);

      // Execute the tool
      const {
        success,
        output,
        error,
      } = await this.batch.tool.run({
        batch: this.batch,
        command: this.batch.plan.testCommand,
        args: [],
      });

      this.log = output;
      this.error = error ?? null;

      if (!success) {
        this.status = 'failed';

        return false;
      }

      this.status = 'success';

      console.log('  Running afterToolPreparation hook...');
      this.batch.plan.hooks.afterToolPreparation(this.batch.batchDir);

      console.log('  ✓ Tool Preparation complete');

      return true;
    } catch (error) {
      console.error(`  ✗ Tool Preparation failed: ${this.batch.plan.id} - ${this.batch.tool.id}`);
      console.error(`    Error: ${error}`);

      this.status = 'failed';
      this.error = error.message;

      return false;
    }
  }
}

module.exports = PreparationStep;
