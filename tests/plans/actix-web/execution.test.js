const { ClaudeData } = require('../../lib/context-data');
const {
  testClaudeFile,
} = require('../../lib/common-tests');

describe('actix-web:context', () => {
  const contextData = new ClaudeData(process.env.TEST_RUN_DIR);

  // Test CLAUDE.md
  testClaudeFile(contextData, {
    subContextFileCount: 3, // Only 3 projects are identified by ctx-prepare
  });
});
