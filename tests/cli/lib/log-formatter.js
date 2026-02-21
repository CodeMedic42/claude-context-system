const chalk = require('chalk');
const fs = require('fs');

/**
 * Format Claude streaming JSON log to look like normal usage
 * Parses the streaming JSON format and displays text and tool uses
 */
function formatClaudeLog(logFilePath) {
  if (!fs.existsSync(logFilePath)) {
    return chalk.red('Log file not found');
  }

  const content = fs.readFileSync(logFilePath, 'utf8');
  const lines = content.split('\n').filter((line) => line.trim());

  let output = '';

  lines.forEach((line) => {
    try {
      const event = JSON.parse(line);

      // Extract text deltas (Claude's response text)
      if (event.type === 'stream_event') {
        const streamEvent = event.event;

        // Text content being streamed
        if (streamEvent.type === 'content_block_delta') {
          const { delta } = streamEvent;
          if (delta.type === 'text_delta' && delta.text) {
            output += chalk.white(delta.text);
          }
        }

        // Tool use start
        if (streamEvent.type === 'content_block_start') {
          const contentBlock = streamEvent.content_block;
          if (contentBlock.type === 'tool_use') {
            output += `\n${chalk.cyan.bold(`🔧 Using tool: ${contentBlock.name}`)}\n`;
          }
        }
      }

      // Complete assistant message with tool details
      if (event.type === 'assistant') {
        const messageContent = event.message.content || [];
        messageContent.forEach((block) => {
          if (block.type === 'tool_use') {
            if (block.name === 'Bash' && block.input.command) {
              const desc = block.input.description || '';
              if (desc) {
                output += chalk.cyan(`  → ${desc}\n`);
                output += chalk.gray(`    $ ${block.input.command}\n`);
              } else {
                output += chalk.cyan(`  → ${block.input.command}\n`);
              }
            } else if (['Read', 'Edit', 'Write'].includes(block.name)) {
              const filePath = block.input.file_path || block.input.path || '';
              if (filePath) {
                output += chalk.cyan(`  → ${block.name}: ${filePath}\n`);
              }
            } else if (block.name === 'Glob') {
              output += chalk.cyan(`  → Glob: ${block.input.pattern}\n`);
            } else if (block.name === 'Grep') {
              output += chalk.cyan(`  → Grep: ${block.input.pattern}\n`);
            }
          }
        });
      }
    } catch (err) {
      // Not valid JSON or parsing error, skip
    }
  });

  return output || chalk.gray('No output captured');
}

/**
 * Format tool log based on tool type
 */
function formatToolLog(toolId, logFilePath) {
  if (toolId === 'plugin') {
    return formatClaudeLog(logFilePath);
  }
  return chalk.red(`Unknown tool: ${toolId}`);
}

module.exports = {
  formatToolLog,
  formatClaudeLog,
};
