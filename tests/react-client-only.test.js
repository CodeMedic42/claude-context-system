const path = require('path');
const ClaudeMdMetadata = require('./lib/ClaudeMdMetadata');
const { runPluginCommand } = require('./lib/testHelpers');

describe('react-client-only', () => {
  // Use TEST_RUN_DIR if available (for test-runner), otherwise use fixtures directory
  const baseDir = process.env.TEST_RUN_DIR || path.join(__dirname, 'fixtures');
  const fixturePath = path.join(baseDir, 'react-client-only');
  const claudeMdPath = path.join(fixturePath, 'claude.md');
  let metadata;

  beforeAll(async () => {
    // Run the plugin to generate claude.md
    await runPluginCommand(fixturePath);

    // Load the metadata
    metadata = new ClaudeMdMetadata(claudeMdPath);
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

    test('should have Repository Structure section', () => {
      expect(metadata.hasSection('Repository Structure')).toBe(true);
    });

    test('should have Code Organization Patterns section', () => {
      expect(metadata.hasSection('Code Organization Patterns')).toBe(true);
    });

    test('should have Environment Setup section', () => {
      expect(metadata.hasSection('Environment Setup')).toBe(true);
    });

    test('should have Agent File Metadata section', () => {
      expect(metadata.hasSection('Agent File Metadata')).toBe(true);
    });
  });

  describe('Project Type Sections', () => {
    test('should NOT have Services and APIs section', () => {
      // This is a frontend-only app, no backend services
      expect(metadata.hasSection('Services and APIs')).toBe(false);
    });

    test('should have User Interaction Clients section', () => {
      // This IS a client application
      expect(metadata.hasSection('User Interaction Clients')).toBe(true);
    });

    test('should NOT have Libraries and Plugins section', () => {
      // This is an application, not a library
      expect(metadata.hasSection('Libraries and Plugins')).toBe(false);
    });

    test('should NOT have Databases section', () => {
      // No database schemas defined
      expect(metadata.hasSection('Databases')).toBe(false);
    });
  });

  describe('Sub-files', () => {
    test('should have created client.claude.md file', () => {
      const clientFiles = metadata.getClientFiles();
      expect(clientFiles.length).toBe(1);
    });

    test('client.claude.md file should exist on filesystem', () => {
      expect(metadata.doClientFilesExist()).toBe(true);
    });

    test('should NOT have created any service.claude.md files', () => {
      const serviceFiles = metadata.getServiceFiles();
      expect(serviceFiles.length).toBe(0);
    });

    test('should NOT have created any library.claude.md files', () => {
      const libraryFiles = metadata.getLibraryFiles();
      expect(libraryFiles.length).toBe(0);
    });

    test('should NOT have created any database.claude.md files', () => {
      const databaseFiles = metadata.getDatabaseFiles();
      expect(databaseFiles.length).toBe(0);
    });
  });

  describe('Metadata', () => {
    test('should have valid metadata', () => {
      const validation = metadata.validateMetadata();
      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    test('should have date created', () => {
      expect(metadata.getDateCreated()).toBeTruthy();
    });

    test('should have date modified', () => {
      expect(metadata.getDateModified()).toBeTruthy();
    });

    test('should have valid commit SHA', () => {
      const sha = metadata.getCommitSha();
      expect(sha).toBeTruthy();
      expect(sha).toMatch(/^[a-f0-9]{40}$/);
    });

    test('should have valid template version', () => {
      const version = metadata.getTemplateVersion();
      expect(version).toBeTruthy();
      expect(version).toMatch(/^\d+\.\d+\.\d+$/);
    });
  });

  describe('Content Quality', () => {
    test('should not have unreplaced placeholders', () => {
      const check = metadata.checkForPlaceholders();
      expect(check.hasPlaceholders).toBe(false);
    });

    test('should have all referenced files exist', () => {
      const validation = metadata.validateSubFilesExist();
      expect(validation.valid).toBe(true);
      expect(validation.missingFiles).toHaveLength(0);
    });
  });

  describe('Overall Validation', () => {
    test('should pass all validations', () => {
      const validation = metadata.validateAll();
      if (!validation.valid) {
        console.error('Validation errors:', validation.errors);
      }
      expect(validation.valid).toBe(true);
    });
  });
});
