const ActionPlan = require('../../lib/action-plan');

describe('dotnet-update:plan', () => {
  const fixtureDir = process.env.TEST_RUN_DIR;
  let actionPlan;

  beforeAll(() => {
    actionPlan = new ActionPlan(fixtureDir);
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
