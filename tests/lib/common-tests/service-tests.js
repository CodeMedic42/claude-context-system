/**
 * Test functions for service.claude.md files
 */

const { testMetadata, testContentQuality, hasSectionMatching } = require('./base-tests');

/**
 * Test service.claude.md file
 * @param {ServiceClaudeData} serviceData - ServiceClaudeData instance
 */
function testServiceFile(serviceData) {
  if (!serviceData) {
    throw new Error('serviceData is required - file may not exist');
  }

  describe(`Service File: ${serviceData.getProjectName()}`, () => {
    describe('Required Sections', () => {
      const requiredSections = serviceData.getRequiredSections();

      requiredSections.forEach((sectionName) => {
        test(`should have "${sectionName}" section`, () => {
          expect(hasSectionMatching(serviceData, sectionName)).toBe(true);
        });
      });
    });

    // Use base test functions for common validation
    testMetadata(serviceData, 'service.claude.md');
    testContentQuality(serviceData, 'service.claude.md');
  });
}

module.exports = testServiceFile;
