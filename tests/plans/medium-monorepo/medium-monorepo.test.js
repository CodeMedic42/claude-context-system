const path = require('path');
const fs = require('fs');
const ActionPlan = require('../../lib/action-plan');
const ProgressData = require('../../lib/progress-data');

describe('medium-monorepo', () => {
  const fixtureDir = process.env.TEST_RUN_DIR;
  let actionPlan;
  let progress;

  beforeAll(() => {
    actionPlan = new ActionPlan(fixtureDir);
    progress = new ProgressData(fixtureDir);
  });

  describe('Action Plan', () => {
    test('should have 25 projects', () => {
      expect(actionPlan.projects.length).toBe(25);
    });

    test('should be valid', () => {
      expect(() => actionPlan.validate()).not.toThrow();
    });
  });

  describe('Progress', () => {
    test('should be complete', () => {
      expect(progress.isComplete()).toBe(true);
    });

    test('should have completed all 25 projects', () => {
      expect(progress.completedProjects.length).toBe(25);
    });

    test('should have created context files', () => {
      const verification = progress.verifyContextFilesExist();
      const missing = verification.filter((r) => !r.exists);
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
      expect(fileRefs).toBeGreaterThanOrEqual(25);
    });
  });
});
