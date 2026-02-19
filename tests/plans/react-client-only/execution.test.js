const { ClaudeData } = require('../../lib/context-data');
const {
  testClaudeFile,
  testClientFile,
  testProjectFile,
} = require('../../lib/common-tests');

describe('react-client-only:context', () => {
  const contextData = new ClaudeData(process.env.TEST_RUN_DIR);

  // Test CLAUDE.md
  testClaudeFile(contextData, {
    techContextFileCount: 1,
    projectContextFileCount: 1,
  });

  // Test client.claude.md
  const clientData = contextData.getProjectContextData('./CLIENT.CLAUDE.md');
  testClientFile(clientData, 'React Client Only');

  // Test PROJECT.CLAUDE.md
  const projectData = contextData.getProjectContextData('./PROJECT.CLAUDE.md');
  testProjectFile(projectData, 'React Client Only');

  // Custom tests specific to this test plan
  describe('Custom Validation', () => {
    test('should have exactly 1 client file', () => {
      const subcontexts = contextData.getTechnicalContextList();
      const clientFiles = subcontexts.filter((ctx) => ctx.constructor.name === 'ClientContextData');
      expect(clientFiles.length).toBe(1);
    });

    test('should NOT have any service files', () => {
      const subcontexts = contextData.getTechnicalContextList();
      const serviceFiles = subcontexts.filter((ctx) => ctx.constructor.name === 'ServiceContextData');
      expect(serviceFiles.length).toBe(0);
    });

    test('should NOT have any library files', () => {
      const subcontexts = contextData.getTechnicalContextList();
      const libraryFiles = subcontexts.filter((ctx) => ctx.constructor.name === 'LibraryContextData');
      expect(libraryFiles.length).toBe(0);
    });

    test('should have User Interaction Clients section in CLAUDE.md', () => {
      expect(contextData.hasSection('User Interaction Clients [clients] [frontend] [ui]')).toBe(true);
    });

    test('should NOT have Services and APIs section in CLAUDE.md', () => {
      expect(contextData.hasSection('Services and APIs')).toBe(false);
    });

    test('should NOT have Libraries and Plugins section in CLAUDE.md', () => {
      expect(contextData.hasSection('Libraries and Plugins')).toBe(false);
    });

    test('should have exactly 1 project file', () => {
      const projectContexts = contextData.getProjectContextList();
      expect(projectContexts).toHaveLength(1);
    });

    test('project should reference CLIENT type', () => {
      const types = projectData.getProjectTypes();
      expect(types).toContain('CLIENT');
      expect(types).toHaveLength(1);
    });

    test('project @file reference should point to CLIENT.CLAUDE.md', () => {
      const refs = projectData.getTypeFileReferences();
      expect(refs).toContain('./CLIENT.CLAUDE.md');
    });
  });
});
