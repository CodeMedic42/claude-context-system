const ActionPlan = require('../../lib/action-plan');

describe('react-client-only:plan', () => {
  const fixtureDir = process.env.TEST_RUN_DIR;
  let actionPlan;

  beforeAll(() => {
    actionPlan = new ActionPlan(fixtureDir);
  });

  describe('Action Plan', () => {
    test('should have 1 projects', () => {
      expect(actionPlan.projects.length).toBe(1);
    });

    test('should be valid', () => {
      expect(() => actionPlan.validate()).not.toThrow();
    });
  });
});
