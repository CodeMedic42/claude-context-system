/**
 * Test functions for library.claude.md files
 */

const { testMetadata, testContentQuality, hasSectionMatching } = require('./base-tests');

/**
 * Test library.claude.md file
 * @param {LibraryClaudeData} libraryData - LibraryClaudeData instance
 */
function testLibraryFile(libraryData) {
  if (!libraryData) {
    throw new Error('libraryData is required - file may not exist');
  }

  describe(`Library File: ${libraryData.getProjectName()}`, () => {
    describe('Required Sections', () => {
      const requiredSections = libraryData.getRequiredSections();

      requiredSections.forEach((sectionName) => {
        test(`should have "${sectionName}" section`, () => {
          expect(hasSectionMatching(libraryData, sectionName)).toBe(true);
        });
      });
    });

    // Use base test functions for common validation
    testMetadata(libraryData, 'library.claude.md');
    testContentQuality(libraryData, 'library.claude.md');
  });
}

module.exports = testLibraryFile;
