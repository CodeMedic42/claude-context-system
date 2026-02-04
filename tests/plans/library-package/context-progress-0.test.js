const { isNil } = require('lodash');
const ProgressData = require('../../lib/progress-data');

describe('library-package:progress', () => {
  const fixtureDir = process.env.TEST_RUN_DIR;
  let progress;

  beforeAll(() => {
    progress = ProgressData.load(fixtureDir);

    if (isNil(progress)) {
      throw new Error('Progress file does not exist');
    }
  });

  describe('Progress', () => {
    test('next project should be utility-library', () => {
      expect(progress.getNextProject()).toBe('utility-library');
    });
  });
});
