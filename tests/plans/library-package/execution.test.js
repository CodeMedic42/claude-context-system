const { ClaudeData } = require('../../lib/context-data');
const {
  testClaudeFile,
  testLibraryFile,
  testProjectFile,
} = require('../../lib/common-tests');

describe('library-package:context', () => {
  const contextData = new ClaudeData(process.env.TEST_RUN_DIR);

  // Test CLAUDE.md
  testClaudeFile(contextData, {
    techContextFileCount: 1,
    projectContextFileCount: 1,
  });

  // Test library.claude.md
  const libraryData = contextData.getProjectContextData('./LIBRARY.CLAUDE.md');
  testLibraryFile(libraryData, '@test/utility-library');

  // Test PROJECT.CLAUDE.md
  const projectData = contextData.getProjectContextData('./PROJECT.CLAUDE.md');
  testProjectFile(projectData, '@test/utility-library');

  // Custom tests specific to this test plan
  describe('Custom Validation', () => {
    test('should have exactly 1 library file', () => {
      const subcontexts = contextData.getTechnicalContextList();
      const libraryFiles = subcontexts.filter((ctx) => ctx.constructor.name === 'LibraryContextData');
      expect(libraryFiles.length).toBe(1);
    });

    test('should NOT have any service files', () => {
      const subcontexts = contextData.getTechnicalContextList();
      const serviceFiles = subcontexts.filter((ctx) => ctx.constructor.name === 'ServiceContextData');
      expect(serviceFiles.length).toBe(0);
    });

    test('should NOT have any client files', () => {
      const subcontexts = contextData.getTechnicalContextList();
      const clientFiles = subcontexts.filter((ctx) => ctx.constructor.name === 'ClientContextData');
      expect(clientFiles.length).toBe(0);
    });

    test('should have Libraries and Plugins section in CLAUDE.md', () => {
      expect(contextData.hasSection('Libraries and Plugins [libraries] [packages] [reusable]')).toBe(true);
    });

    test('should NOT have Services and APIs section in CLAUDE.md', () => {
      expect(contextData.hasSection('Services and APIs')).toBe(false);
    });

    test('should NOT have User Interaction Clients section in CLAUDE.md', () => {
      expect(contextData.hasSection('User Interaction Clients')).toBe(false);
    });

    test('should have exactly 1 project file', () => {
      const projectContexts = contextData.getProjectContextList();
      expect(projectContexts).toHaveLength(1);
    });

    test('project should reference LIBRARY type', () => {
      const types = projectData.getProjectTypes();
      expect(types).toContain('LIBRARY');
      expect(types).toHaveLength(1);
    });

    test('project @file reference should point to LIBRARY.CLAUDE.md', () => {
      const refs = projectData.getTypeFileReferences();
      expect(refs).toContain('./LIBRARY.CLAUDE.md');
    });
  });
});
