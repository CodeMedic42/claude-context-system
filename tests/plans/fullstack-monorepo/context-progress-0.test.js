const ProgressData = require('../../lib/progress-data');

describe('fullstack-monorepo:progress', () => {
  const fixtureDir = process.env.TEST_RUN_DIR;
  let progress;

  beforeAll(() => {
    progress = new ProgressData(fixtureDir);
  });

  describe('Progress', () => {
    test('next project should be database', () => {
      expect(progress.getNextProject()).toBe('database');
    });
  });
});
