const ClaudeTool = require('./claude-tool');

const TOOLS = {
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
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

module.exports = {
  ClaudeTool,
  getToolById,
  getTool,
};
