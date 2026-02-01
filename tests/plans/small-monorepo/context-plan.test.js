const ActionPlan = require('../../lib/action-plan');

describe('small-monorepo:plan', () => {
  const fixtureDir = process.env.TEST_RUN_DIR;
  let actionPlan;

  beforeAll(() => {
    actionPlan = new ActionPlan(fixtureDir);
  });

  describe('Action Plan', () => {
    test('should have 5 projects', () => {
      expect(actionPlan.projects.length).toBe(5);
    });

    test('should be valid', () => {
      expect(() => actionPlan.validate()).not.toThrow();
    });
  });
});
