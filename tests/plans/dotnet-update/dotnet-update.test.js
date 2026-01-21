const path = require('path');
const fs = require('fs');
const ContextData = require('../../lib/context-data');

describe('dotnet-update', () => {
  // TEST_RUN_DIR points to the run's fixture directory for this test plan
  const fixturePath = process.env.TEST_RUN_DIR;
  let claudeMdPath;
  let metadata;

  beforeAll(() => {
    // Find the context file
    const claudeMdUpper = path.join(fixturePath, 'CLAUDE.md');
    const claudeMdLower = path.join(fixturePath, 'claude.md');

    if (fs.existsSync(claudeMdUpper)) {
      claudeMdPath = claudeMdUpper;
    } else if (fs.existsSync(claudeMdLower)) {
      claudeMdPath = claudeMdLower;
    } else {
      throw new Error(`No context file found in ${fixturePath}`);
    }

    // Load the metadata
    metadata = new ContextData(claudeMdPath);
  });

  describe('Required Sections', () => {
    test('should have Repository Agent Context section', () => {
      expect(metadata.hasSection('Repository Agent Context')).toBe(true);
    });

    test('should have Repository Summary section', () => {
      expect(metadata.hasSection('Repository Summary')).toBe(true);
    });

    test('should have High-Level Repository Information section', () => {
      expect(metadata.hasSection('High-Level Repository Information')).toBe(true);
    });
  });

  describe('Manual Content Preservation', () => {
    test('should preserve Team Members section in claude.md', () => {
      const content = fs.readFileSync(claudeMdPath, 'utf8');
      expect(content).toMatch(/## Team Members/);
      expect(content).toMatch(/Alice Johnson/);
      expect(content).toMatch(/Bob Smith/);
      expect(content).toMatch(/Carol Davis/);
    });

    test('should not include Team Members section in service.claude.md', () => {
      const servicePath = path.join(fixturePath, 'Service.Api', 'service.claude.md');
      const content = fs.readFileSync(servicePath, 'utf8');
      expect(content).not.toMatch(/## Team Members/);
      expect(content).not.toMatch(/Alice Johnson/);
    });

    test('should NOT have Team Members section in new client.claude.md', () => {
      const clientPath = path.join(fixturePath, 'Service.Cli', 'client.claude.md');
      if (fs.existsSync(clientPath)) {
        const content = fs.readFileSync(clientPath, 'utf8');
        expect(content).not.toMatch(/## Team Members/);
      }
    });
  });

  describe('Project Changes Detection', () => {
    test('should remove library @file reference from claude.md', () => {
      const content = fs.readFileSync(claudeMdPath, 'utf8');
      expect(content).not.toMatch(/@file.*library\.claude\.md/i);
      expect(content).not.toMatch(/Shared\.Library/);
    });

    test('should add client @file reference to claude.md', () => {
      const content = fs.readFileSync(claudeMdPath, 'utf8');
      expect(content).toMatch(/@file.*client\.claude\.md/i);
    });

    test('should have removed library.claude.md file', () => {
      const libraryPath = path.join(fixturePath, 'Shared.Library', 'library.claude.md');
      expect(fs.existsSync(libraryPath)).toBe(false);
    });

    test('should have created client.claude.md file', () => {
      const clientPath = path.join(fixturePath, 'Service.Cli', 'client.claude.md');
      expect(fs.existsSync(clientPath)).toBe(true);
    });
  });

  describe('Content Updates', () => {
    test('should document multiply endpoint in service.claude.md', () => {
      const servicePath = path.join(fixturePath, 'Service.Api', 'service.claude.md');
      const content = fs.readFileSync(servicePath, 'utf8');
      expect(content).toMatch(/multiply|Multiply/);
      expect(content).toMatch(/add|Add/); // Original endpoint still there
    });

    test('should document CLI parameters in client.claude.md', () => {
      const clientPath = path.join(fixturePath, 'Service.Cli', 'client.claude.md');
      if (fs.existsSync(clientPath)) {
        const content = fs.readFileSync(clientPath, 'utf8');
        expect(content).toMatch(/action|command/i);
        expect(content).toMatch(/value1|value2/i);
      }
    });
  });

  describe('Format Consistency', () => {
    test('should maintain Repository Structure section', () => {
      expect(metadata.hasSection('Repository Structure')).toBe(true);
    });

    test('should maintain Code Organization Patterns section', () => {
      expect(metadata.hasSection('Code Organization Patterns')).toBe(true);
    });

    test('should maintain Environment Setup section', () => {
      expect(metadata.hasSection('Environment Setup')).toBe(true);
    });

    test('should have valid metadata', () => {
      const validation = metadata.validateMetadata();
      expect(validation.valid).toBe(true);
    });
  });
});

module.exports = {};
