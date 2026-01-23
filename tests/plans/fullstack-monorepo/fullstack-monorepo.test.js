const path = require('path');
const ClaudeData = require('../../lib/context-data/claude-data');
const {
  testClaudeFile,
  testServiceFile,
  testClientFile,
  testLibraryFile,
  testDatabaseFile,
} = require('../../lib/common-tests');

describe('fullstack-monorepo', () => {
  const fixturePath = process.env.TEST_RUN_DIR;

  // Main CLAUDE.md - automatically parses and loads all subcontext files
  const claudeData = new ClaudeData(fixturePath);

  // Access the already-parsed subcontext files from claudeData
  const webServiceData = claudeData.getProjectContextData('./packages/web/SERVICE.CLAUDE.md');
  const webClientData = claudeData.getProjectContextData('./packages/web/CLIENT.CLAUDE.md');
  const databaseLibraryData = claudeData.getProjectContextData('./packages/database/LIBRARY.CLAUDE.md');
  const databaseSchemaData = claudeData.getProjectContextData('./packages/database/DATABASE.CLAUDE.md');

  // Use common test functions for standard validation
  testClaudeFile(claudeData, { subContextFileCount: 4 });
  testServiceFile(webServiceData);
  testClientFile(webClientData);
  testLibraryFile(databaseLibraryData);
  testDatabaseFile(databaseSchemaData);

  describe('Custom Validation', () => {
    test('should have exactly 1 service file', () => {
      const subcontexts = claudeData.getSubcontextList();
      const serviceFiles = subcontexts.filter((sc) => sc.filePath.includes('SERVICE.CLAUDE.md'));
      expect(serviceFiles).toHaveLength(1);
    });

    test('should have exactly 1 client file', () => {
      const subcontexts = claudeData.getSubcontextList();
      const clientFiles = subcontexts.filter((sc) => sc.filePath.includes('CLIENT.CLAUDE.md'));
      expect(clientFiles).toHaveLength(1);
    });

    test('should have exactly 1 library file', () => {
      const subcontexts = claudeData.getSubcontextList();
      const libraryFiles = subcontexts.filter((sc) => sc.filePath.includes('LIBRARY.CLAUDE.md'));
      expect(libraryFiles).toHaveLength(1);
    });

    test('should have exactly 1 database file', () => {
      const subcontexts = claudeData.getSubcontextList();
      const databaseFiles = subcontexts.filter((sc) => sc.filePath.includes('DATABASE.CLAUDE.md'));
      expect(databaseFiles).toHaveLength(1);
    });

    test('should have Services and APIs section in CLAUDE.md', () => {
      expect(claudeData.hasSection('Services and APIs')).toBe(true);
    });

    test('should have User Interaction Clients section in CLAUDE.md', () => {
      expect(claudeData.hasSection('User Interaction Clients')).toBe(true);
    });

    test('should have Libraries and Plugins section in CLAUDE.md', () => {
      expect(claudeData.hasSection('Libraries and Plugins')).toBe(true);
    });

    test('should have Databases section in CLAUDE.md', () => {
      expect(claudeData.hasSection('Databases')).toBe(true);
    });

    test('web project should have both SERVICE and CLIENT files in same directory', () => {
      const subcontexts = claudeData.getSubcontextList();
      const webService = subcontexts.find((sc) => sc.filePath.includes('packages/web') && sc.filePath.includes('SERVICE'));
      const webClient = subcontexts.find((sc) => sc.filePath.includes('packages/web') && sc.filePath.includes('CLIENT'));

      expect(webService).toBeDefined();
      expect(webClient).toBeDefined();

      // Both should be in packages/web/
      expect(path.dirname(webService.filePath)).toBe(path.dirname(webClient.filePath));
    });

    test('database project should have both LIBRARY and DATABASE files in same directory', () => {
      const subcontexts = claudeData.getSubcontextList();
      const dbLibrary = subcontexts.find((sc) => sc.filePath.includes('packages/database') && sc.filePath.includes('LIBRARY'));
      const dbSchema = subcontexts.find((sc) => sc.filePath.includes('packages/database') && sc.filePath.includes('DATABASE'));

      expect(dbLibrary).toBeDefined();
      expect(dbSchema).toBeDefined();

      // Both should be in packages/database/
      expect(path.dirname(dbLibrary.filePath)).toBe(path.dirname(dbSchema.filePath));
    });
  });
});
