const ClaudeTool = require('./claude-tool');
const CopilotTool = require('./copilot-tool');

const TOOLS = {
  cli: CopilotTool,
  plugin: ClaudeTool,
};

function getToolById(toolId) {
  return TOOLS[toolId];
}

module.exports = {
  ClaudeTool,
  CopilotTool,
  getToolById,
};
