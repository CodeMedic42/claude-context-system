const ProgressData = require('../../lib/progress-data');

describe('dotnet-update:progress', () => {
  const fixtureDir = process.env.TEST_RUN_DIR;
  let progress;

  beforeAll(() => {
    progress = new ProgressData(fixtureDir);
  });

  describe('Progress', () => {
    test('next project should be service-api', () => {
      expect(progress.getNextProject()).toBe('service-api');
    });
  });
});
