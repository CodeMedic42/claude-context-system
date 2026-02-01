const ProgressData = require('../../lib/progress-data');

describe('react-client-only:progress', () => {
  const fixtureDir = process.env.TEST_RUN_DIR;
  let progress;

  beforeAll(() => {
    progress = new ProgressData(fixtureDir);
  });

  describe('Progress', () => {
    test('next project should be react-client-only', () => {
      expect(progress.getNextProject()).toBe('react-client-only');
    });
  });
});
