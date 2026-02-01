const ProgressData = require('../../lib/progress-data');

describe('small-monorepo:progress', () => {
  const fixtureDir = process.env.TEST_RUN_DIR;
  let progress;

  beforeAll(() => {
    progress = new ProgressData(fixtureDir);
  });

  describe('Progress', () => {
    test('next project should be project-001', () => {
      expect(progress.getNextProject()).toBe('project-001');
    });
  });
});
