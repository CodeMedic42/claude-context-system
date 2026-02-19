const {
  testActionPlan,
  testUpdateActionPlan,
} = require('./action-plan-tests');

const {
  testProgressFile,
  testProgressAfterExecution,
  testProgressAdvancement,
  testCompletion,
} = require('./progress-tests');

const testClaudeFile = require('./claude-tests');
const testServiceFile = require('./service-tests');
const testClientFile = require('./client-tests');
const testLibraryFile = require('./library-tests');
const testDatabaseFile = require('./database-tests');
const testProjectFile = require('./project-tests');
const {
  testMetadata,
  testContentQuality,
  validateMetadata,
  checkForPlaceholders,
  hasSectionMatching,
} = require('./base-tests');

module.exports = {
  // Action plan tests
  testActionPlan,
  testUpdateActionPlan,

  // Progress tests
  testProgressFile,
  testProgressAfterExecution,
  testProgressAdvancement,
  testCompletion,

  testClaudeFile,
  testServiceFile,
  testClientFile,
  testLibraryFile,
  testDatabaseFile,
  testProjectFile,

  // Base test functions and validators
  testMetadata,
  testContentQuality,
  validateMetadata,
  checkForPlaceholders,
  hasSectionMatching,
};
