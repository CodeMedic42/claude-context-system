/**
 * Test functions for PROJECT.CLAUDE.md files
 */

const { testMetadata, testContentQuality, hasSectionMatching } = require('./base-tests');

/**
 * Test PROJECT.CLAUDE.md file
 * @param {ProjectContextData} projectData - ProjectContextData instance
 * @param {string} title - Expected project title
 */
function testProjectFile(projectData, title) {
  if (!projectData) {
    throw new Error('projectData is required - file may not exist');
  }

  describe(`Project File: ${projectData.getProjectName()}`, () => {
    describe('Required Sections', () => {
      const requiredSections = projectData.getRequiredSections(title);

      requiredSections.forEach((sectionName) => {
        test(`should have "${sectionName}" section`, () => {
          expect(hasSectionMatching(projectData, sectionName)).toBe(true);
        });
      });
    });

    // Use base test functions for common validation
    testMetadata(projectData, 'PROJECT.CLAUDE.md');
    testContentQuality(projectData, 'PROJECT.CLAUDE.md');
  });
}

module.exports = testProjectFile;
