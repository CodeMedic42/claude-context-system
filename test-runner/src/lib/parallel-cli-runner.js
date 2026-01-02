const blessed = require('blessed');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs-extra');
const TokenTracker = require('./token-tracker');

/**
 * Run multiple Claude CLI processes in parallel with interactive output switching
 * @param {Array} fixtures - Array of {name, dir} objects
 * @returns {Promise<Array>} - Array of results
 */
async function runParallel(fixtures) {
  return new Promise((resolve) => {
    // State management
    const state = {
      processes: new Map(),
      outputs: new Map(),
      statuses: new Map(),
      tokenTrackers: new Map(),
      currentIndex: 0,
      completed: 0
    };

    // Initialize state for each fixture
    fixtures.forEach((fixture, index) => {
      state.outputs.set(fixture.name, []);
      state.statuses.set(fixture.name, 'running');
      state.tokenTrackers.set(fixture.name, new TokenTracker());
    });

    // Create blessed screen
    const screen = blessed.screen({
      smartCSR: true,
      title: 'Claude CLI - Parallel Execution'
    });

    // Header box with fixture tabs
    const header = blessed.box({
      top: 0,
      left: 0,
      width: '100%',
      height: 3,
      tags: true,
      border: {
        type: 'line'
      },
      style: {
        border: {
          fg: 'cyan'
        }
      }
    });

    // Output box
    const output = blessed.box({
      top: 3,
      left: 0,
      width: '100%',
      height: '100%-6',
      tags: true,
      scrollable: true,
      alwaysScroll: true,
      scrollbar: {
        ch: '█',
        style: {
          fg: 'cyan'
        }
      },
      keys: true,
      vi: true,
      mouse: true,
      style: {
        fg: 'white',
        bg: 'black'
      }
    });

    // Footer with instructions
    const footer = blessed.box({
      bottom: 0,
      left: 0,
      width: '100%',
      height: 3,
      tags: true,
      border: {
        type: 'line'
      },
      style: {
        border: {
          fg: 'cyan'
        }
      },
      content: '{center}{cyan-fg}← → or 1-9: Switch fixtures  |  ↑ ↓: Scroll  |  q or Ctrl+C: Quit when done{/cyan-fg}{/center}'
    });

    screen.append(header);
    screen.append(output);
    screen.append(footer);

    // Update header with fixture tabs
    function updateHeader() {
      const tabs = fixtures.map((fixture, index) => {
        const status = state.statuses.get(fixture.name);
        const isActive = index === state.currentIndex;
        const num = index + 1;

        let icon;
        let color;

        if (status === 'running') {
          icon = '⟳';
          color = isActive ? 'yellow' : 'gray';
        } else if (status === 'success') {
          icon = '✓';
          color = isActive ? 'green' : 'gray';
        } else {
          icon = '✗';
          color = isActive ? 'red' : 'gray';
        }

        const tabText = `${num}:${icon} ${fixture.name}`;

        if (isActive) {
          return `{inverse}{${color}-fg}${tabText}{/${color}-fg}{/inverse}`;
        } else {
          return `{${color}-fg}${tabText}{/${color}-fg}`;
        }
      }).join('  ');

      header.setContent(`{center}${tabs}{/center}\n{center}{gray-fg}Completed: ${state.completed}/${fixtures.length}{/gray-fg}{/center}`);
      screen.render();
    }

    // Update output display
    function updateOutput() {
      const currentFixture = fixtures[state.currentIndex];
      const lines = state.outputs.get(currentFixture.name) || [];
      const status = state.statuses.get(currentFixture.name);

      let content = `{bold}{cyan-fg}Output for: ${currentFixture.name}{/cyan-fg}{/bold}\n`;
      content += `{gray-fg}${'─'.repeat(60)}{/gray-fg}\n\n`;
      content += lines.join('');

      if (status !== 'running') {
        content += `\n{gray-fg}${'─'.repeat(60)}{/gray-fg}\n`;
        if (status === 'success') {
          content += `{green-fg}{bold}✓ Completed successfully{/bold}{/green-fg}`;
        } else {
          content += `{red-fg}{bold}✗ Failed or incomplete{/bold}{/red-fg}`;
        }
      }

      output.setContent(content);
      output.setScrollPerc(100); // Auto-scroll to bottom
      screen.render();
    }

    // Switch to fixture by index
    function switchToFixture(index) {
      if (index >= 0 && index < fixtures.length) {
        state.currentIndex = index;
        updateHeader();
        updateOutput();
      }
    }

    // Keyboard controls
    screen.key(['left', 'h'], () => {
      switchToFixture((state.currentIndex - 1 + fixtures.length) % fixtures.length);
    });

    screen.key(['right', 'l'], () => {
      switchToFixture((state.currentIndex + 1) % fixtures.length);
    });

    // Number keys 1-9 for direct switching
    for (let i = 1; i <= 9; i++) {
      screen.key([i.toString()], () => {
        if (i - 1 < fixtures.length) {
          switchToFixture(i - 1);
        }
      });
    }

    // Scroll controls
    screen.key(['up', 'k'], () => {
      output.scroll(-1);
      screen.render();
    });

    screen.key(['down', 'j'], () => {
      output.scroll(1);
      screen.render();
    });

    screen.key(['pageup'], () => {
      output.scroll(-output.height);
      screen.render();
    });

    screen.key(['pagedown'], () => {
      output.scroll(output.height);
      screen.render();
    });

    // Quit handler
    let canQuit = false;
    screen.key(['q', 'C-c'], () => {
      if (canQuit || state.completed === fixtures.length) {
        // Cleanup
        state.processes.forEach(proc => {
          if (proc && !proc.killed) {
            proc.kill();
          }
        });
        screen.destroy();

        // Collect results
        const results = fixtures.map(fixture => {
          const status = state.statuses.get(fixture.name);
          const output = state.outputs.get(fixture.name).join('');

          // Parse JSON output for token usage
          let tokens = null;
          let costUsd = null;

          try {
            const jsonOutput = JSON.parse(output);

            if (jsonOutput.usage) {
              const usage = jsonOutput.usage;
              tokens = {
                input: (usage.input_tokens || 0) + (usage.cache_read_input_tokens || 0),
                output: usage.output_tokens || 0,
                total: 0,
                cacheCreation: usage.cache_creation_input_tokens || 0,
                cacheRead: usage.cache_read_input_tokens || 0
              };
              tokens.total = tokens.input + tokens.output;
            }

            if (jsonOutput.total_cost_usd !== undefined) {
              costUsd = jsonOutput.total_cost_usd;
            }
          } catch (err) {
            // Fallback to text parsing if JSON parse fails
            const tokenTracker = state.tokenTrackers.get(fixture.name);
            tokens = tokenTracker.parseFromOutput(output);
          }

          return {
            fixture: fixture.name,
            success: status === 'success',
            timestamp: new Date().toISOString(),
            tokens,
            costUsd
          };
        });

        resolve(results);
      } else {
        footer.setContent('{center}{yellow-fg}Processes still running. Press q again to force quit.{/yellow-fg}{/center}');
        screen.render();
        canQuit = true;
        setTimeout(() => { canQuit = false; updateFooter(); }, 3000);
      }
    });

    function updateFooter() {
      footer.setContent('{center}{cyan-fg}← → or 1-9: Switch fixtures  |  ↑ ↓: Scroll  |  q or Ctrl+C: Quit when done{/cyan-fg}{/center}');
      screen.render();
    }

    // Path to the plugin directory
    const pluginDir = path.join(__dirname, '../../claude-plugin');

    // Start all Claude CLI processes
    fixtures.forEach((fixture, index) => {
      const claude = spawn('claude', [
        '--print',
        '--output-format', 'json',
        '--plugin-dir', pluginDir,
        '--permission-mode', 'bypassPermissions',
        '--append-system-prompt', 'AUTOMATED TEST MODE: Skip all user approval/confirmation steps. Proceed immediately with all file creation and documentation tasks without asking for permission or presenting scopes. This is an automated test environment.'
      ], {
        cwd: fixture.dir,
        stdio: ['pipe', 'pipe', 'pipe']
      });

      // Write the skill command to stdin
      claude.stdin.write('/claude-context-updater:ctx-update\n');
      claude.stdin.end();

      state.processes.set(fixture.name, claude);

      // Capture stdout
      claude.stdout.on('data', (data) => {
        const text = data.toString();
        const lines = state.outputs.get(fixture.name);
        lines.push(text);

        // Update display if this is the current fixture
        if (state.currentIndex === index) {
          updateOutput();
        }
      });

      // Capture stderr
      claude.stderr.on('data', (data) => {
        const text = data.toString();
        // Filter out statsig messages
        if (!text.includes('[statsig]') && !text.includes('Statsig')) {
          const lines = state.outputs.get(fixture.name);
          lines.push(`{yellow-fg}${text}{/yellow-fg}`);

          if (state.currentIndex === index) {
            updateOutput();
          }
        }
      });

      // Handle completion
      claude.on('close', (code) => {
        const claudeMdPath = path.join(fixture.dir, 'claude.md');
        const success = fs.existsSync(claudeMdPath) && code === 0;

        state.statuses.set(fixture.name, success ? 'success' : 'failed');
        state.completed++;

        updateHeader();
        if (state.currentIndex === index) {
          updateOutput();
        }

        // Auto-resolve when all complete
        if (state.completed === fixtures.length) {
          setTimeout(() => {
            footer.setContent('{center}{green-fg}{bold}All fixtures complete! Press q to exit.{/bold}{/green-fg}{/center}');
            screen.render();
          }, 500);
        }
      });

      claude.on('error', (err) => {
        const lines = state.outputs.get(fixture.name);
        lines.push(`{red-fg}Error: ${err.message}{/red-fg}\n`);
        state.statuses.set(fixture.name, 'failed');
        state.completed++;

        updateHeader();
        if (state.currentIndex === index) {
          updateOutput();
        }
      });
    });

    // Initial render
    updateHeader();
    updateOutput();
    screen.render();

    // Focus the output box for scrolling
    output.focus();
  });
}

module.exports = { runParallel };
