/**
 * Test functions for CLAUDE.md files
 */

const fs = require('fs');
const path = require('path');
const { testMetadata, testContentQuality } = require('./base-tests');

/**
 * Test CLAUDE.md file
 * @param {ClaudeData} claudeData - ClaudeData instance
 */
function testClaudeFile(claudeData, expectedConfiguration) {
  const {
    techContextFileCount,
    projectContextFileCount,
  } = expectedConfiguration;

  if (!claudeData) {
    throw new Error('claudeData is required');
  }

  describe('CLAUDE.md Validation', () => {
    describe('Required Sections', () => {
      const requiredSections = claudeData.getRequiredSections();

      requiredSections.forEach((sectionName) => {
        test(`should have "${sectionName}" section`, () => {
          expect(claudeData.hasSection(sectionName)).toBe(true);
        });
      });
    });

    // Use base test functions for common validation
    testMetadata(claudeData, 'CLAUDE.md');

    describe('Metadata', () => {
      test('should have revision date', () => {
        expect(claudeData.getRevisionDate()).toBeTruthy();
      });
    });

    // Use base test function for content quality
    testContentQuality(claudeData, 'CLAUDE.md');

    describe('Content Quality', () => {
      test('should have all referenced files exist', () => {
        const fileRefRegex = /@file\s+(\.\/[^\s)]+)/g;
        const missingFiles = [];
        const content = fs.readFileSync(claudeData.getContextFilePath(), 'utf8');
        let match;

        // eslint-disable-next-line no-cond-assign
        while ((match = fileRefRegex.exec(content)) !== null) {
          const relativePath = match[1];
          const absolutePath = path.join(
            path.dirname(claudeData.getContextFilePath()),
            relativePath,
          );

          if (!fs.existsSync(absolutePath)) {
            missingFiles.push(relativePath);
          }
        }

        if (missingFiles.length > 0) {
          console.error('Missing files:', missingFiles);
        }
        expect(missingFiles).toHaveLength(0);
      });
    });

    describe('Subcontext Files', () => {
      test(`should have exactly ${projectContextFileCount} project context file(s)`, () => {
        const projectContexts = claudeData.getProjectContextList();
        expect(projectContexts.length).toBe(projectContextFileCount);
      });

      test(`should have exactly ${techContextFileCount} technical context file(s)`, () => {
        const subcontexts = claudeData.getTechnicalContextList();
        expect(subcontexts.length).toBe(techContextFileCount);
      });
    });
  });
}

module.exports = testClaudeFile;
