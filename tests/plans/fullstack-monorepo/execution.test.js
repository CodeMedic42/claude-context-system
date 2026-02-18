const path = require('path');
const ClaudeData = require('../../lib/context-data/claude-data');
const {
  testClaudeFile,
  testServiceFile,
  testClientFile,
  testLibraryFile,
  testDatabaseFile,
} = require('../../lib/common-tests');

describe('fullstack-monorepo:context', () => {
  const contextData = new ClaudeData(process.env.TEST_RUN_DIR);

  // Access the already-parsed subcontext files from contextData
  const webServiceData = contextData.getProjectContextData('./packages/web/SERVICE.CLAUDE.md');
  const webClientData = contextData.getProjectContextData('./packages/web/CLIENT.CLAUDE.md');
  const databaseLibraryData = contextData.getProjectContextData('./packages/database/LIBRARY.CLAUDE.md');
  const databaseSchemaData = contextData.getProjectContextData('./packages/database/DATABASE.CLAUDE.md');

  // Use common test functions for standard validation
  testClaudeFile(contextData, { techContextFileCount: 4, projectContextFileCount: 2 });
  testServiceFile(webServiceData, '@monorepo/web API');
  testClientFile(webClientData, '@monorepo/web Frontend');
  testLibraryFile(databaseLibraryData, '@monorepo/database');
  testDatabaseFile(databaseSchemaData, '@monorepo/database');

  describe('Custom Validation', () => {
    test('should have exactly 1 service file', () => {
      const subcontexts = contextData.getTechnicalContextList();
      const serviceFiles = subcontexts.filter((sc) => sc.filePath.includes('SERVICE.CLAUDE.md'));
      expect(serviceFiles).toHaveLength(1);
    });

    test('should have exactly 1 client file', () => {
      const subcontexts = contextData.getTechnicalContextList();
      const clientFiles = subcontexts.filter((sc) => sc.filePath.includes('CLIENT.CLAUDE.md'));
      expect(clientFiles).toHaveLength(1);
    });

    test('should have exactly 1 library file', () => {
      const subcontexts = contextData.getTechnicalContextList();
      const libraryFiles = subcontexts.filter((sc) => sc.filePath.includes('LIBRARY.CLAUDE.md'));
      expect(libraryFiles).toHaveLength(1);
    });

    test('should have exactly 1 database file', () => {
      const subcontexts = contextData.getTechnicalContextList();
      const databaseFiles = subcontexts.filter((sc) => sc.filePath.includes('DATABASE.CLAUDE.md'));
      expect(databaseFiles).toHaveLength(1);
    });

    test('should have Services and APIs section in CLAUDE.md', () => {
      expect(contextData.hasSection('Services and APIs [services] [apis] [backend]')).toBe(true);
    });

    test('should have User Interaction Clients section in CLAUDE.md', () => {
      expect(contextData.hasSection('User Interaction Clients [clients] [frontend] [ui]')).toBe(true);
    });

    test('should have Libraries and Plugins section in CLAUDE.md', () => {
      expect(contextData.hasSection('Libraries and Plugins [libraries] [packages] [reusable]')).toBe(true);
    });

    test('should have Databases section in CLAUDE.md', () => {
      expect(contextData.hasSection('Databases [databases] [data] [schema]')).toBe(true);
    });

    test('web project should have both SERVICE and CLIENT files in same directory', () => {
      const subcontexts = contextData.getTechnicalContextList();
      const webService = subcontexts.find((sc) => sc.filePath.includes('packages/web') && sc.filePath.includes('SERVICE'));
      const webClient = subcontexts.find((sc) => sc.filePath.includes('packages/web') && sc.filePath.includes('CLIENT'));

      expect(webService).toBeDefined();
      expect(webClient).toBeDefined();

      // Both should be in packages/web/
      expect(path.dirname(webService.filePath)).toBe(path.dirname(webClient.filePath));
    });

    test('database project should have both LIBRARY and DATABASE files in same directory', () => {
      const subcontexts = contextData.getTechnicalContextList();
      const dbLibrary = subcontexts.find((sc) => sc.filePath.includes('packages/database') && sc.filePath.includes('LIBRARY'));
      const dbSchema = subcontexts.find((sc) => sc.filePath.includes('packages/database') && sc.filePath.includes('DATABASE'));

      expect(dbLibrary).toBeDefined();
      expect(dbSchema).toBeDefined();

      // Both should be in packages/database/
      expect(path.dirname(dbLibrary.filePath)).toBe(path.dirname(dbSchema.filePath));
    });
  });
});
