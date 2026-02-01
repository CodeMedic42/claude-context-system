const ActionPlan = require('../action-plan');

/**
 * Common tests for validating action plans
 */

function testActionPlan(actionPlan, options = {}) {
  describe('Action Plan Validation', () => {
    test('should have valid version', () => {
      expect(actionPlan.version).toBe('1.0');
    });

    test('should have valid type', () => {
      expect(['create', 'update']).toContain(actionPlan.type);
      if (options.expectedType) {
        expect(actionPlan.type).toBe(options.expectedType);
      }
    });

    test('should have repository metadata', () => {
      expect(actionPlan.repository).toBeDefined();
      expect(actionPlan.repository.root).toBeDefined();
      expect(typeof actionPlan.repository.totalFiles).toBe('number');
    });

    test('should have projects array', () => {
      expect(Array.isArray(actionPlan.projects)).toBe(true);
      if (options.expectedProjects) {
        expect(actionPlan.projects.length).toBe(options.expectedProjects);
      }
      if (options.minProjects) {
        expect(actionPlan.projects.length).toBeGreaterThanOrEqual(options.minProjects);
      }
    });

    test('should have valid project structure', () => {
      expect(actionPlan.projects.length).toBeGreaterThan(0);

      actionPlan.projects.forEach((project) => {
        expect(project).toHaveProperty('id');
        expect(project).toHaveProperty('path');
        expect(project).toHaveProperty('type');
        expect(project).toHaveProperty('priority');
        expect(project).toHaveProperty('estimatedTokens');
        expect(project).toHaveProperty('dependencies');
        expect(project).toHaveProperty('dependents');

        // Type must be array
        expect(Array.isArray(project.type)).toBe(true);
        expect(project.type.length).toBeGreaterThan(0);

        // Valid types only
        const validTypes = ['SERVICE', 'CLIENT', 'LIBRARY', 'DATABASE'];
        project.type.forEach((type) => {
          expect(validTypes).toContain(type);
        });

        // Arrays must be arrays
        expect(Array.isArray(project.dependencies)).toBe(true);
        expect(Array.isArray(project.dependents)).toBe(true);

        // Tokens must be number
        expect(typeof project.estimatedTokens).toBe('number');
        expect(project.estimatedTokens).toBeGreaterThan(0);
      });
    });

    test('should have valid dependency ordering', () => {
      const seen = new Set();
      actionPlan.projects.forEach((project) => {
        // All dependencies should appear before this project
        project.dependencies.forEach((dep) => {
          expect(seen.has(dep)).toBe(true);
        });
        seen.add(project.id);
      });
    });

    test('should have token estimates', () => {
      expect(typeof actionPlan.estimatedTotalTokens).toBe('number');
      expect(actionPlan.estimatedTotalTokens).toBeGreaterThan(0);
      expect(typeof actionPlan.estimatedExecutions).toBe('number');
      expect(actionPlan.estimatedExecutions).toBeGreaterThan(0);
    });

    test('should have context files list', () => {
      expect(Array.isArray(actionPlan.contextFiles)).toBe(true);
      expect(actionPlan.contextFiles.length).toBeGreaterThan(0);

      // Should include main CLAUDE.md
      const claudeMd = actionPlan.contextFiles.find((f) => f.file === 'CLAUDE.md');
      expect(claudeMd).toBeDefined();

      // Should have project context files
      const projectFiles = actionPlan.contextFiles.filter((f) => f.project);
      expect(projectFiles.length).toBeGreaterThan(0);
    });

    test('should pass validation', () => {
      const result = actionPlan.validate();
      if (!result.valid) {
        console.error('Validation errors:', result.errors);
      }
      expect(result.valid).toBe(true);
      expect(result.errors.length).toBe(0);
    });

    if (options.expectedProjectTypes) {
      test('should have expected project types', () => {
        Object.entries(options.expectedProjectTypes).forEach(([type, count]) => {
          const projects = actionPlan.getProjectsByType(type);
          expect(projects.length).toBe(count);
        });
      });
    }
  });
}

/**
 * Test for update-specific action plan fields
 */
function testUpdateActionPlan(actionPlan) {
  describe('Update Action Plan Validation', () => {
    test('should be an update plan', () => {
      expect(actionPlan.type).toBe('update');
    });

    test('should have commit information', () => {
      expect(actionPlan.basedOnCommit).toBeDefined();
      expect(actionPlan.currentCommit).toBeDefined();
      expect(actionPlan.basedOnCommit.length).toBe(40); // Full SHA
      expect(actionPlan.currentCommit.length).toBe(40);
    });

    test('should have changed files information', () => {
      actionPlan.projects.forEach((project) => {
        expect(project).toHaveProperty('changeCommits');
        expect(project).toHaveProperty('changedFiles');
        expect(Array.isArray(project.changeCommits)).toBe(true);
        expect(Array.isArray(project.changedFiles)).toBe(true);
        expect(project.changedFiles.length).toBeGreaterThan(0);
      });
    });
  });
}

module.exports = {
  testActionPlan,
  testUpdateActionPlan,
};
