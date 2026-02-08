/**
 * Test functions for client.claude.md files
 */

const { testMetadata, testContentQuality, hasSectionMatching } = require('./base-tests');

/**
 * Test client.claude.md file
 * @param {ClientClaudeData} clientData - ClientClaudeData instance
 */
function testClientFile(clientData, title) {
  if (!clientData) {
    throw new Error('clientData is required - file may not exist');
  }

  describe(`Client File: ${clientData.getProjectName()}`, () => {
    describe('Required Sections', () => {
      const requiredSections = clientData.getRequiredSections(title);

      requiredSections.forEach((sectionName) => {
        test(`should have "${sectionName}" section`, () => {
          expect(hasSectionMatching(clientData, sectionName)).toBe(true);
        });
      });
    });

    // Use base test functions for common validation
    testMetadata(clientData, 'client.claude.md');
    testContentQuality(clientData, 'client.claude.md');
  });
}

module.exports = testClientFile;
