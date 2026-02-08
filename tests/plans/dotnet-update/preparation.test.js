const { isNil, toLower } = require('lodash');
const ActionPlan = require('../../lib/action-plan');
const ProgressData = require('../../lib/progress-data');

describe('dotnet-update:preparation', () => {
  const fixtureDir = process.env.TEST_RUN_DIR;
  let actionPlan;
  let progress;

  beforeAll(() => {
    actionPlan = ActionPlan.load(fixtureDir);
    progress = ProgressData.load(fixtureDir);

    if (isNil(actionPlan)) {
      throw new Error('PAction plan does not exist');
    }

    if (isNil(progress)) {
      throw new Error('Progress file does not exist');
    }
  });

  describe('Action Plan', () => {
    test('Should have 2 projects', () => {
      expect(actionPlan.projects.length).toBe(2);
    });

    test('Should be valid', () => {
      expect(() => actionPlan.validate()).not.toThrow();
    });
  });

  describe('Progress', () => {
    test('Next project should be one of', () => {
      const nextProject = toLower(progress.getNextProject());

      expect(nextProject).toBeOneOf(['service.api', 'service-api', 'service.cli']);
    });

    test('Next project should be the first project', () => {
      const nextProject = toLower(progress.getNextProject());
      const firstProject = toLower(actionPlan.projects[0].id);

      expect(nextProject).toBe(firstProject);
    });
  });
});
