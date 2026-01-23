const { ClaudeData } = require('../../lib/context-data');
const {
  testClaudeFile,
  testServiceFile,
} = require('../../lib/common-tests');

describe('simple-node-service', () => {
  const contextData = new ClaudeData(process.env.TEST_RUN_DIR);

  // Test CLAUDE.md
  testClaudeFile(contextData, {
    subContextFileCount: 1,
  });

  // Test service.claude.md
  const serviceData = contextData.getProjectContextData('./SERVICE.CLAUDE.md');
  testServiceFile(serviceData);

  // Custom tests specific to this test plan
  describe('Custom Validation', () => {
    test('should have exactly 1 service file', () => {
      const subcontexts = contextData.getSubcontextList();
      const serviceFiles = subcontexts.filter((ctx) => ctx.constructor.name === 'ServiceClaudeData');
      expect(serviceFiles.length).toBe(1);
    });

    test('should NOT have any client files', () => {
      const subcontexts = contextData.getSubcontextList();
      const clientFiles = subcontexts.filter((ctx) => ctx.constructor.name === 'ClientClaudeData');
      expect(clientFiles.length).toBe(0);
    });

    test('should have Services and APIs section in CLAUDE.md', () => {
      expect(contextData.hasSection('Services and APIs')).toBe(true);
    });

    test('should NOT have User Interaction Clients section in CLAUDE.md', () => {
      expect(contextData.hasSection('User Interaction Clients')).toBe(false);
    });
  });
});
