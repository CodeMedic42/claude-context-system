/**
 * Common test functions for validating context files
 *
 * Each function creates a describe() block with standard tests for that file type.
 * Usage:
 *   const contextData = new ClaudeData(process.env.TEST_RUN_DIR);
 *   testClaudeFile(contextData);
 *   testServiceFile(contextData.getProjectContextData('Service.Api'));
 */

const testClaudeFile = require('./claude-tests');
const testServiceFile = require('./service-tests');
const testClientFile = require('./client-tests');
const testLibraryFile = require('./library-tests');
const testDatabaseFile = require('./database-tests');
const {
  testMetadata,
  testContentQuality,
  validateMetadata,
  checkForPlaceholders,
  hasSectionMatching,
} = require('./base-tests');

module.exports = {
  testClaudeFile,
  testServiceFile,
  testClientFile,
  testLibraryFile,
  testDatabaseFile,
  // Base test functions and validators
  testMetadata,
  testContentQuality,
  validateMetadata,
  checkForPlaceholders,
  hasSectionMatching,
};
