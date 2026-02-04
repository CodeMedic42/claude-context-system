const { isNil } = require('lodash');
const ActionPlan = require('../../lib/action-plan');
const ProgressData = require('../../lib/progress-data');

describe('fullstack-monorepo:preparation', () => {
  describe('plan', () => {
    const fixtureDir = process.env.TEST_RUN_DIR;
    let actionPlan;

    beforeAll(() => {
      actionPlan = ActionPlan.load(fixtureDir);
    });

    describe('Action Plan', () => {
      test('should have 2 projects', () => {
        expect(actionPlan.projects.length).toBe(2);
      });

      test('should be valid', () => {
        expect(() => actionPlan.validate()).not.toThrow();
      });
    });
  });

  describe('progress', () => {
    const fixtureDir = process.env.TEST_RUN_DIR;
    let progress;

    beforeAll(() => {
      progress = ProgressData.load(fixtureDir);

      if (isNil(progress)) {
        throw new Error('Progress file does not exist');
      }
    });

    describe('Progress', () => {
      test('next project should be database', () => {
        expect(progress.getNextProject()).toBe('database');
      });
    });
  });
});
