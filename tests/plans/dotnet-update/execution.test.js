const path = require('path');
const fs = require('fs');
const { ClaudeData } = require('../../lib/context-data');
const {
  testClaudeFile,
  testServiceFile,
  testClientFile,
  testProjectFile,
} = require('../../lib/common-tests');

describe('dotnet-update:context', () => {
  const contextData = new ClaudeData(process.env.TEST_RUN_DIR);

  // Test CLAUDE.md
  testClaudeFile(contextData, {
    techContextFileCount: 2,
    projectContextFileCount: 2,
  });

  // Test service.claude.md
  const serviceData = contextData.getProjectContextData('./Service.Api/SERVICE.CLAUDE.md');
  testServiceFile(serviceData, 'Service.Api');

  // Test client.claude.md
  const clientData = contextData.getProjectContextData('./Service.Cli/CLIENT.CLAUDE.md');
  testClientFile(clientData, 'Service.Cli');

  // Test PROJECT.CLAUDE.md files
  const serviceProjectData = contextData.getProjectContextData('./Service.Api/PROJECT.CLAUDE.md');
  testProjectFile(serviceProjectData, 'Service.Api');

  const clientProjectData = contextData.getProjectContextData('./Service.Cli/PROJECT.CLAUDE.md');
  testProjectFile(clientProjectData, 'Service.Cli');

  // Custom tests for manual content preservation
  describe('Manual Content Preservation', () => {
    test('should preserve Team Members section in claude.md', () => {
      const content = fs.readFileSync(contextData.getContextFilePath(), 'utf8');
      expect(content).toMatch(/## Team Members/);
      expect(content).toMatch(/Alice Johnson/);
      expect(content).toMatch(/Bob Smith/);
      expect(content).toMatch(/Carol Davis/);
    });

    test('should not include Team Members section in service.claude.md', () => {
      const content = fs.readFileSync(serviceData.getContextFilePath(), 'utf8');
      expect(content).not.toMatch(/## Team Members/);
      expect(content).not.toMatch(/Alice Johnson/);
    });

    test('should NOT have Team Members section in new client.claude.md', () => {
      const content = fs.readFileSync(clientData.getContextFilePath(), 'utf8');
      expect(content).not.toMatch(/## Team Members/);
    });
  });

  // Custom tests for project changes detection
  describe('Project Changes Detection', () => {
    test('should remove library @file reference from claude.md', () => {
      const content = fs.readFileSync(contextData.getContextFilePath(), 'utf8');
      expect(content).not.toMatch(/@file.*library\.claude\.md/i);
      expect(content).not.toMatch(/Shared\.Library/);
    });

    test('should add client @file reference to claude.md', () => {
      const content = fs.readFileSync(contextData.getContextFilePath(), 'utf8');
      expect(content).toMatch(/@file.*client\.claude\.md/i);
    });

    test('should have removed library.claude.md file', () => {
      const libraryPath = path.join(process.env.TEST_RUN_DIR, 'Shared.Library', 'library.claude.md');
      expect(fs.existsSync(libraryPath)).toBe(false);
    });

    test('should have created client.claude.md file', () => {
      expect(clientData).toBeTruthy();
      expect(fs.existsSync(clientData.getContextFilePath())).toBe(true);
    });

    test('should have exactly 1 service and 1 client file', () => {
      const subcontexts = contextData.getTechnicalContextList();
      const serviceFiles = subcontexts.filter((ctx) => ctx.constructor.name === 'ServiceContextData');
      const clientFiles = subcontexts.filter((ctx) => ctx.constructor.name === 'ClientContextData');
      expect(serviceFiles.length).toBe(1);
      expect(clientFiles.length).toBe(1);
    });
  });

  // Custom tests for content updates
  describe('Content Updates', () => {
    test('should document multiply endpoint in service.claude.md', () => {
      const content = fs.readFileSync(serviceData.getContextFilePath(), 'utf8');
      expect(content).toMatch(/multiply|Multiply/);
      expect(content).toMatch(/add|Add/); // Original endpoint still there
    });

    test('should document CLI parameters in client.claude.md', () => {
      const content = fs.readFileSync(clientData.getContextFilePath(), 'utf8');
      expect(content).toMatch(/action|command/i);
      expect(content).toMatch(/value1|value2/i);
    });
  });
});
