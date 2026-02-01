const { ClaudeData } = require('../../lib/context-data');
const {
  testClaudeFile,
  testClientFile,
} = require('../../lib/common-tests');

describe('react-client-only:context', () => {
  const contextData = new ClaudeData(process.env.TEST_RUN_DIR);

  // Test CLAUDE.md
  testClaudeFile(contextData, {
    subContextFileCount: 1,
  });

  // Test client.claude.md
  const clientData = contextData.getProjectContextData('./CLIENT.CLAUDE.md');
  testClientFile(clientData);

  // Custom tests specific to this test plan
  describe('Custom Validation', () => {
    test('should have exactly 1 client file', () => {
      const subcontexts = contextData.getSubcontextList();
      const clientFiles = subcontexts.filter((ctx) => ctx.constructor.name === 'ClientClaudeData');
      expect(clientFiles.length).toBe(1);
    });

    test('should NOT have any service files', () => {
      const subcontexts = contextData.getSubcontextList();
      const serviceFiles = subcontexts.filter((ctx) => ctx.constructor.name === 'ServiceClaudeData');
      expect(serviceFiles.length).toBe(0);
    });

    test('should NOT have any library files', () => {
      const subcontexts = contextData.getSubcontextList();
      const libraryFiles = subcontexts.filter((ctx) => ctx.constructor.name === 'LibraryClaudeData');
      expect(libraryFiles.length).toBe(0);
    });

    test('should have User Interaction Clients section in CLAUDE.md', () => {
      expect(contextData.hasSection('User Interaction Clients')).toBe(true);
    });

    test('should NOT have Services and APIs section in CLAUDE.md', () => {
      expect(contextData.hasSection('Services and APIs')).toBe(false);
    });

    test('should NOT have Libraries and Plugins section in CLAUDE.md', () => {
      expect(contextData.hasSection('Libraries and Plugins')).toBe(false);
    });
  });
});
