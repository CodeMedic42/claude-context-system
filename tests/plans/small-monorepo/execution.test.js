const { ClaudeData } = require('../../lib/context-data');
const {
  testClaudeFile,
} = require('../../lib/common-tests');

describe('small-monorepo:context', () => {
  const contextData = new ClaudeData(process.env.TEST_RUN_DIR);

  // Test CLAUDE.md
  testClaudeFile(contextData, {
    subContextFileCount: 5,
  });
});
