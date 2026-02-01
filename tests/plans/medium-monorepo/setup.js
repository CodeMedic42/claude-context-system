const generateRepository = require('../../tools/generate-test-repo');

/**
 * Setup medium monorepo test fixture
 *
 * Uses synthetic generator to create 25-project monorepo
 */

function beforeFixtureSetup(fixturePath) {
  console.log('    Creating medium monorepo (25 projects)...');

  generateRepository({
    projects: 25,
    filesPerProject: 15,
    output: fixturePath,
    withDependencies: true,
    seed: 12345,
  });
}

module.exports = {
  testCommand: 'create',
  tokenLimit: 100000, // Should complete in one execution
  beforeFixtureSetup,
};
