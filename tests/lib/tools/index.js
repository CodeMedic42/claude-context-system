const ClaudeTool = require('./claude-tool');
const CopilotTool = require('./copilot-tool');

const TOOLS = {
  cli: CopilotTool,
  plugin: ClaudeTool,
};

function getToolById(toolId) {
  return TOOLS[toolId];
}

function getTool(name) {
  switch (name) {
    case 'plugin':
    case 'claude':
      return new ClaudeTool();
    case 'cli':
    case 'copilot':
      return new CopilotTool();
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

module.exports = {
  ClaudeTool,
  CopilotTool,
  getToolById,
  getTool,
};
