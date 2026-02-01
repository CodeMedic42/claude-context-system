const path = require('path');
const fs = require('fs');
const BatchStep = require('./batch-step');

class ExecutionStep extends BatchStep {
  constructor(config) {
    super({
      id: 'execution',
      ...config,
    });
  }

  async execute(rerun) {
    if (await super.execute(rerun)) {
      return true;
    }

    try {
      console.log(`  Running execution phase: ${this.batch.plan.id} - ${this.batch.tool.id}...`);

      console.log('  Running beforeToolExecution hook...');
      this.batch.plan.hooks.beforeToolExecution(this.batch.batchDir);

      // Execute the tool
      const {
        success,
        output,
        error,
      } = await this.batch.tool.run({
        batch: this.batch,
        command: 'execute',
        args: [],
      });

      this.log = output;
      this.error = error ?? null;

      if (!success) {
        this.status = 'failed';

        return false;
      }

      // Validate that the execution actually created the expected output
      const claudeMdPath = path.join(this.batch.fixtureDir, 'CLAUDE.md');
      if (!fs.existsSync(claudeMdPath)) {
        this.status = 'failed';
        this.error = 'Execution completed with exit code 0, but CLAUDE.md was not created';

        console.error(`  ✗ Validation failed: CLAUDE.md not found at ${claudeMdPath}`);

        return false;
      }

      this.status = 'success';

      console.log('  Running afterToolExecution hook...');
      this.batch.plan.hooks.afterToolExecution(this.batch.batchDir);

      console.log('  ✓ Tool Execution complete');

      return true;
    } catch (error) {
      console.error(`  ✗ Tool Execution failed: ${this.batch.plan.id} - ${this.batch.tool.id}`);
      console.error(`    Error: ${error}`);

      this.status = 'failed';
      this.error = error.message;

      return false;
    }
  }
}

module.exports = ExecutionStep;
