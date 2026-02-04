const { isNil } = require('lodash');
const ProgressData = require('../../lib/progress-data');

describe('large-monorepo:progress', () => {
  const fixtureDir = process.env.TEST_RUN_DIR;

  // Load Test Plan

  let progress;

  beforeAll(() => {
    progress = ProgressData.load(fixtureDir);

    if (isNil(progress)) {
      throw new Error('Progress file does not exist');
    }
  });

  describe('Progress', () => {
    test('next project should be project-001', () => {
      expect(progress.getNextProject()).toBe('project-001');
    });
  });
});
