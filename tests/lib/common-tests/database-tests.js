/**
 * Test functions for database.claude.md files
 */

const { testMetadata, testContentQuality, hasSectionMatching } = require('./base-tests');

/**
 * Test database.claude.md file
 * @param {DatabaseClaudeData} databaseData - DatabaseClaudeData instance
 */
function testDatabaseFile(databaseData) {
  if (!databaseData) {
    throw new Error('databaseData is required - file may not exist');
  }

  describe(`Database File: ${databaseData.getProjectName()}`, () => {
    describe('Required Sections', () => {
      const requiredSections = databaseData.getRequiredSections();

      requiredSections.forEach((sectionName) => {
        test(`should have "${sectionName}" section`, () => {
          expect(hasSectionMatching(databaseData, sectionName)).toBe(true);
        });
      });
    });

    // Use base test functions for common validation
    testMetadata(databaseData, 'database.claude.md');
    testContentQuality(databaseData, 'database.claude.md');
  });
}

module.exports = testDatabaseFile;
