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
  testCommand: 'prepare',
  maxProjects: 15, // Medium repo - should complete in one execution
  beforeFixtureSetup,
};
