const generateRepository = require('../../tools/generate-test-repo');

/**
 * Setup small monorepo test fixture
 *
 * Creates a simple 5-project monorepo
 */

function beforeFixtureSetup(fixturePath) {
  console.log('    Creating small monorepo (5 projects)...');

  generateRepository({
    projects: 5,
    filesPerProject: 15,
    output: fixturePath,
    withDependencies: true,
    seed: 12345,
    projectTypes: ['LIBRARY', 'LIBRARY', 'SERVICE', 'CLIENT', 'DATABASE'],
  });
}

module.exports = {
  testCommand: 'prepare',
  tokenLimit: 100000, // High token limit - should complete in one execution
  beforeFixtureSetup,
};
