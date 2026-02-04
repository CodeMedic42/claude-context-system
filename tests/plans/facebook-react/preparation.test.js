const ActionPlan = require('../../lib/action-plan');
const ProgressData = require('../../lib/progress-data');

describe('small-monorepo:preparation', () => {
  const fixtureDir = process.env.TEST_RUN_DIR;
  let actionPlan;
  let progress;

  beforeAll(() => {
    actionPlan = ActionPlan.load(fixtureDir);
    progress = ProgressData.load(fixtureDir);
  });

  describe('plan', () => {
    beforeAll(() => {
      actionPlan = ActionPlan.load(fixtureDir);
    });

    describe('Action Plan', () => {
      test('should have 86 projects', () => {
        expect(actionPlan.projects.length).toBe(86);
      });

      test('should be valid', () => {
        expect(() => actionPlan.validate()).not.toThrow();
      });
    });
  });

  describe('progress', () => {
    describe('Progress', () => {
      test('next project should be first in action plan', () => {
        const firstProject = actionPlan.getProjectsInOrder()[0];

        expect(progress.getNextProject()).toBe(firstProject.id);
      });
    });
  });
});
