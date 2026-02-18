/**
 * Test functions for service.claude.md files
 */

const { testMetadata, testContentQuality, hasSectionMatching } = require('./base-tests');

/**
 * Test service.claude.md file
 * @param {ServiceContextData} serviceData - ServiceContextData instance
 */
function testServiceFile(serviceData, title) {
  if (!serviceData) {
    throw new Error('serviceData is required - file may not exist');
  }

  describe(`Service File: ${serviceData.getContextFilePath()}`, () => {
    describe('Required Sections', () => {
      const requiredSections = serviceData.getRequiredSections(title);

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
