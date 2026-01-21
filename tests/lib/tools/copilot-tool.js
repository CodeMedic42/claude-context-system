const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
// eslint-disable-next-line import/no-extraneous-dependencies
const pc = require('picocolors');
const Tool = require('./tool');

class CopilotTool extends Tool {
  constructor() {
    super({
      id: 'cli',
      name: 'Copilot CLI',
    });

    // Path to the copilot-plugin executable relative to this file (tests/lib/tools/)
    this.cliPath = path.join(__dirname, '../../../copilot-context-cli/bin/copilot-plugin.js');
  }

  async isAvailable() {
    try {
      // Check if the CLI script exists
      return fs.existsSync(this.cliPath);
    } catch {
      return false;
    }
  }

  /**
   * Execute the Copilot CLI command
   * @param {Object} params - Parameters object
   * @param {Object} params.batch - Batch context with fixtureDir and batchDir
   * @param {string} params.command - Command to run (e.g., 'update', 'create', 'rule')
   * @returns {Promise<{success: boolean, output: string, error?: string}>}
   */
  async run({ batch, command }) {
    // Map command names to CLI command format
    const commandMap = {
      update: 'ctx-update',
      create: 'ctx-create',
      rule: 'ctx-rule',
    };

    const cliCommand = commandMap[command];
    if (!cliCommand) {
      throw new Error(`Unknown command: ${command}`);
    }

    const env = { ...process.env };
    delete env.NODE_OPTIONS;

    return new Promise((resolve, reject) => {
      const outputFile = path.join(batch.batchDir, `tool.${this.id}.log`);
      const outputStream = fs.createWriteStream(outputFile);

      // GitHub Copilot blue using 256-color ANSI code
      const blue = (text) => `\x1b[38;5;33m${text}\x1b[0m`;

      // Execute: node copilot-plugin.js <command>
      const copilotProcess = spawn('node', [
        this.cliPath,
        cliCommand,
      ], {
        cwd: batch.fixtureDir,
        stdio: ['ignore', 'pipe', 'pipe'],
        env: {
          ...env,
          // Add any necessary environment variables for Copilot
          COPILOT_AUTO_APPROVE: 'true', // Non-interactive mode
        },
      });

      let stdout = '';
      let stderr = '';

      copilotProcess.stdout.on('data', (data) => {
        const chunk = data.toString();
        stdout += chunk;
        outputStream.write(data);
        process.stdout.write(blue(chunk)); // Real-time blue output
      });

      copilotProcess.stderr.on('data', (data) => {
        const chunk = data.toString();
        stderr += chunk;
        outputStream.write(data);
        process.stderr.write(chunk);
      });

      copilotProcess.on('close', (code) => {
        outputStream.end();

        if (code === 0) {
          resolve({
            success: true,
            output: stdout,
          });
        } else {
          resolve({
            success: false,
            output: stdout,
            error: stderr || `Process exited with code ${code}`,
          });
        }
      });

      copilotProcess.on('error', (error) => {
        outputStream.end();
        reject(new Error(`Failed to execute Copilot CLI: ${error.message}`));
      });
    });
  }
}

module.exports = CopilotTool;
