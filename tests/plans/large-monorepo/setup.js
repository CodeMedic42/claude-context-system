const generateRepository = require('../../tools/generate-test-repo');

/**
 * Setup large monorepo test fixture
 *
 * Uses synthetic generator to create 100-project monorepo
 * This tests extreme scaling
 */

function beforeFixtureSetup(fixturePath) {
  console.log('    Creating large monorepo (100 projects)...');

  generateRepository({
    projects: 100,
    filesPerProject: 10,
    output: fixturePath,
    withDependencies: true,
    seed: 54321,
  });
}

module.exports = {
  testCommand: 'create',
  tokenLimit: 100000, // Will require multiple executions
  beforeFixtureSetup,
};
