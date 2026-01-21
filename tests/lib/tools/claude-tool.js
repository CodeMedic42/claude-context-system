const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
// eslint-disable-next-line import/no-extraneous-dependencies
const pc = require('picocolors');
const Tool = require('./tool');

class ClaudeTool extends Tool {
  constructor() {
    super({
      id: 'plugin',
      name: 'Claude Code Plugin',
    });
  }

  // eslint-disable-next-line class-methods-use-this
  async isAvailable() {
    try {
      execSync('which claude', { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Execute the Claude Code plugin command
   * @param {string} repoPath - Path to the repository
   * @param {string} command - Command to run (e.g., 'ctx-update')
   * @returns {Promise<{success: boolean, output: string, error?: string}>}
   */
  // eslint-disable-next-line class-methods-use-this
  async run({ batch, command }) {
    // Map command names to plugin command format
    const commandMap = {
      update: '/claude-context-updater:ctx-update',
      create: '/claude-context-updater:ctx-create',
      rule: '/claude-context-updater:ctx-rule',
    };

    const pluginCommand = commandMap[command];
    if (!pluginCommand) {
      throw new Error(`Unknown command: ${command}`);
    }

    const env = { ...process.env };
    delete env.NODE_OPTIONS;

    return new Promise((resolve, reject) => {
      const outputFile = path.join(batch.batchDir, `tool.${this.id}.log`);
      const outputStream = fs.createWriteStream(outputFile);

      // Run Claude CLI with streaming JSON output
      const claudeProcess = spawn('claude', [
        '--print',
        '--verbose',
        '--output-format', 'stream-json',
        '--include-partial-messages',
        '--permission-mode', 'bypassPermissions',
        pluginCommand,
      ], {
        cwd: batch.fixtureDir,
        stdio: ['ignore', 'pipe', 'pipe'],
        env,
      });

      let stdoutBuffer = '';
      let rawOutput = '';

      // Anthropic orange using 256-color ANSI code (picocolors doesn't support 256-color palette)
      const orange = (text) => `\x1b[38;5;208m${text}\x1b[0m`;

      // Parse and display JSON stream in real-time
      claudeProcess.stdout.on('data', (data) => {
        const chunk = data.toString();
        rawOutput += chunk;
        outputStream.write(data);

        stdoutBuffer += chunk;
        const lines = stdoutBuffer.split('\n');
        stdoutBuffer = lines.pop(); // Keep incomplete line in buffer

        lines.forEach((line) => {
          if (!line.trim()) return;

          try {
            const event = JSON.parse(line);

            // Extract text deltas (Claude's response text)
            if (event.type === 'stream_event') {
              const streamEvent = event.event;

              // Text content being streamed
              if (streamEvent.type === 'content_block_delta') {
                const { delta } = streamEvent;
                if (delta.type === 'text_delta' && delta.text) {
                  process.stdout.write(orange(delta.text));
                }
              }

              // Tool use information
              if (streamEvent.type === 'content_block_start') {
                const contentBlock = streamEvent.content_block;
                if (contentBlock.type === 'tool_use') {
                  console.log(`\n${orange(pc.bold(`🔧 Using tool: ${contentBlock.name}`))}`);
                }
              }
            }

            // Complete assistant message with tool details
            if (event.type === 'assistant') {
              const content = event.message.content || [];
              content.forEach((block) => {
                if (block.type === 'tool_use') {
                  if (block.name === 'Bash' && block.input.command) {
                    const desc = block.input.description || '';
                    if (desc) {
                      console.log(orange(`  → ${desc}: ${block.input.command}`));
                    } else {
                      console.log(orange(`  → ${block.input.command}`));
                    }
                  } else if (['Read', 'Edit', 'Write', 'Glob', 'Grep'].includes(block.name)) {
                    console.log(orange(`  → ${block.name}: ${JSON.stringify(block.input, null, 2)}`));
                  }
                }
              });
            }
          } catch (err) {
            // Not valid JSON or parsing error, ignore
          }
        });
      });

      claudeProcess.stderr.on('data', (data) => {
        rawOutput += data.toString();
        outputStream.write(data);
        process.stderr.write(data);
      });

      claudeProcess.on('close', (code) => {
        outputStream.end();

        if (code === 0) {
          resolve({
            success: true,
            output: rawOutput,
          });
        } else {
          resolve({
            success: false,
            output: rawOutput,
            error: `Process exited with code ${code}`,
          });
        }
      });

      claudeProcess.on('error', (error) => {
        outputStream.end();
        reject(new Error(`Failed to execute Claude CLI: ${error.message}`));
      });
    });
  }
}

module.exports = ClaudeTool;
