const ActionPlan = require('../../lib/action-plan');
const ProgressData = require('../../lib/progress-data');

describe('angular-components:preparation', () => {
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
      test('should have projects (verify actual count after running)', () => {
        // Angular Components has ~15 packages in /src directory
        // Actual count may vary based on what ctx-prepare detects
        expect(actionPlan.projects.length).toBeGreaterThan(5);
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
