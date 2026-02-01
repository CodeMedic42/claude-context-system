const path = require('path');
const fs = require('fs');

/**
 * Common tests for validating progress files
 */

function testProgressFile(progress, options = {}) {
  describe('Progress File Validation', () => {
    test('should reference action plan', () => {
      expect(progress.planFile).toBe('CLAUDE_CONTEXT_ACTION_PLAN.json');
    });

    test('should have valid structure', () => {
      expect(Array.isArray(progress.completedProjects)).toBe(true);
      expect(Array.isArray(progress.discoveries)).toBe(true);
      expect(Array.isArray(progress.claudeMdData)).toBe(true);
      expect(progress.lastUpdated).toBeDefined();
    });

    test('should have expected completion count', () => {
      if (options.expectedCompleted !== undefined) {
        expect(progress.completedProjects.length).toBe(options.expectedCompleted);
      }
      if (options.minCompleted !== undefined) {
        expect(progress.completedProjects.length).toBeGreaterThanOrEqual(
          options.minCompleted,
        );
      }
    });

    test('should have valid nextProject', () => {
      if (options.expectedNextProject !== undefined) {
        expect(progress.nextProject).toBe(options.expectedNextProject);
      }
      if (options.expectComplete) {
        expect(progress.nextProject).toBeNull();
      }
    });

    test('should have valid completed projects structure', () => {
      progress.completedProjects.forEach((project) => {
        expect(project).toHaveProperty('id');
        expect(project).toHaveProperty('contextFiles');
        expect(Array.isArray(project.contextFiles)).toBe(true);

        project.contextFiles.forEach((file) => {
          expect(file).toHaveProperty('type');
          expect(file).toHaveProperty('path');
          expect(['SERVICE', 'CLIENT', 'LIBRARY', 'DATABASE']).toContain(file.type);
        });
      });
    });

    test('should pass validation', () => {
      const result = progress.validate();
      if (!result.valid) {
        console.error('Validation errors:', result.errors);
      }
      expect(result.valid).toBe(true);
      expect(result.errors.length).toBe(0);
    });
  });
}

/**
 * Test progress after execution
 */
function testProgressAfterExecution(progress, options = {}) {
  describe('Progress After Execution', () => {
    test('should have completed projects', () => {
      expect(progress.completedProjects.length).toBeGreaterThan(0);
    });

    test('should have context files on disk', () => {
      const verification = progress.verifyContextFilesExist();
      verification.forEach((result) => {
        expect(result.exists).toBe(true);
      });
    });

    if (options.expectDiscoveries) {
      test('should have discoveries', () => {
        expect(progress.discoveries.length).toBeGreaterThan(0);
      });
    }

    if (options.expectNotes) {
      test('should have claudeMdData notes', () => {
        expect(progress.claudeMdData.length).toBeGreaterThan(0);
        const totalNotes = progress.getTotalNotesCount();
        expect(totalNotes).toBeGreaterThan(0);
      });
    }
  });
}

/**
 * Test that progress advances correctly
 */
function testProgressAdvancement(progressBefore, progressAfter) {
  describe('Progress Advancement', () => {
    test('should have more completed projects', () => {
      expect(progressAfter.completedProjects.length).toBeGreaterThan(
        progressBefore.completedProjects.length,
      );
    });

    test('should have updated timestamp', () => {
      expect(new Date(progressAfter.lastUpdated).getTime()).toBeGreaterThan(
        new Date(progressBefore.lastUpdated).getTime(),
      );
    });

    test('should have advanced nextProject', () => {
      if (progressAfter.nextProject) {
        expect(progressAfter.nextProject).not.toBe(progressBefore.nextProject);
      }
    });
  });
}

/**
 * Test completion
 */
function testCompletion(progress, repoPath) {
  describe('Completion Validation', () => {
    test('should have nextProject as null', () => {
      expect(progress.nextProject).toBeNull();
    });

    test('should have CLAUDE.md created', () => {
      const claudeMdPath = path.join(repoPath, 'CLAUDE.md');
      expect(fs.existsSync(claudeMdPath)).toBe(true);
    });

    test('should have all context files created', () => {
      const verification = progress.verifyContextFilesExist();
      const allExist = verification.every((r) => r.exists);
      expect(allExist).toBe(true);
    });
  });
}

module.exports = {
  testProgressFile,
  testProgressAfterExecution,
  testProgressAdvancement,
  testCompletion,
};
