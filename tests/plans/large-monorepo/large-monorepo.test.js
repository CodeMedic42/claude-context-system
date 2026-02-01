const path = require('path');
const fs = require('fs');
const ActionPlan = require('../../lib/action-plan');
const ProgressData = require('../../lib/progress-data');

describe('large-monorepo', () => {
  const fixtureDir = process.env.TEST_RUN_DIR;
  let actionPlan;
  let progress;

  beforeAll(() => {
    actionPlan = new ActionPlan(fixtureDir);
    progress = new ProgressData(fixtureDir);
  });

  describe('Action Plan', () => {
    test('should have 100 projects', () => {
      expect(actionPlan.projects.length).toBe(100);
    });

    test('should be valid', () => {
      expect(() => actionPlan.validate()).not.toThrow();
    });
  });

  describe('Progress', () => {
    test('should be complete', () => {
      expect(progress.isComplete()).toBe(true);
    });

    test('should have completed all 100 projects', () => {
      expect(progress.completedProjects.length).toBe(100);
    });

    test('should have created context files', () => {
      const verification = progress.verifyContextFilesExist();
      const missing = verification.filter((r) => !r.exists);
      if (missing.length > 0) {
        console.error('Missing context files:', missing.map((m) => m.file));
      }
      expect(missing.length).toBe(0);
    });
  });

  describe('CLAUDE.md', () => {
    test('should exist', () => {
      const claudeMdPath = path.join(fixtureDir, 'CLAUDE.md');
      expect(fs.existsSync(claudeMdPath)).toBe(true);
    });

    test('should have @file references for all projects', () => {
      const claudeMdPath = path.join(fixtureDir, 'CLAUDE.md');
      const content = fs.readFileSync(claudeMdPath, 'utf8');
      const fileRefs = (content.match(/@file/g) || []).length;
      expect(fileRefs).toBeGreaterThanOrEqual(100);
    });
  });
});
