const ProgressData = require('../../lib/progress-data');

describe('library-package:progress', () => {
  const fixtureDir = process.env.TEST_RUN_DIR;
  let progress;

  beforeAll(() => {
    progress = new ProgressData(fixtureDir);
  });

  describe('Progress', () => {
    test('next project should be utility-library', () => {
      expect(progress.getNextProject()).toBe('utility-library');
    });
  });
});
