/**
 * Base test functions for validating context data files
 * These functions can be used by all specific context file test functions
 */

/**
 * Check if a section exists matching a pattern (supports wildcard *)
 * @param {BaseData} contextData - Context data instance
 * @param {string} sectionPattern - Section name or pattern (e.g., "Library Context: *")
 * @returns {boolean}
 */
function hasSectionMatching(contextData, sectionPattern) {
  // Check if pattern ends with wildcard
  if (sectionPattern.endsWith('*')) {
    const prefix = sectionPattern.slice(0, -1).trim();
    // Check if any section starts with the prefix
    const allSections = contextData.getAllSectionNames();
    return allSections.some((section) => section.startsWith(prefix));
  }

  // Exact match
  return contextData.hasSection(sectionPattern);
}

/**
 * Validate metadata is complete and properly formatted
 * @param {BaseData} contextData - Context data instance
 * @returns {{valid: boolean, errors: string[]}}
 */
function validateMetadata(contextData) {
  const errors = [];
  const metadata = contextData.getMetadata();

  if (!metadata.revisionDate) {
    errors.push('Missing Revision Date in metadata');
  }

  if (!metadata.commitSha) {
    errors.push('Missing commit SHA in metadata');
  } else if (!/^[a-f0-9]{40}$/.test(metadata.commitSha)) {
    errors.push('Invalid commit SHA format (must be 40-character hex)');
  }

  if (!metadata.templateVersion) {
    errors.push('Missing template version in metadata');
  } else if (!/^\d+\.\d+\.\d+$/.test(metadata.templateVersion)) {
    errors.push('Invalid template version format (must be semver X.Y.Z)');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Check for unreplaced placeholders in content
 * Looks for template placeholders in format: ~:instruction text:~
 * @param {BaseData} contextData - Context data instance
 * @returns {{hasPlaceholders: boolean, placeholders: string[]}}
 */
function checkForPlaceholders(contextData) {
  const placeholders = contextData.content.match(/~:[^:]+:~/g) || [];

  return {
    hasPlaceholders: placeholders.length > 0,
    placeholders,
  };
}

/**
 * Test metadata validity for a context file
 * @param {BaseData} contextData - Context data instance
 */
function testMetadata(contextData) {
  describe('Metadata', () => {
    test('should have valid metadata', () => {
      const validation = validateMetadata(contextData);
      if (!validation.valid) {
        console.error('Metadata validation errors:', validation.errors);
      }
      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    test('should have valid commit SHA', () => {
      const sha = contextData.getCommitSha();
      expect(sha).toBeTruthy();
      expect(sha).toMatch(/^[a-f0-9]{40}$/);
    });

    test('should have valid template version', () => {
      const version = contextData.getTemplateVersion();
      expect(version).toBeTruthy();
      expect(version).toMatch(/^\d+\.\d+\.\d+$/);
    });
  });
}

/**
 * Test content quality for a context file
 * @param {BaseData} contextData - Context data instance
 */
function testContentQuality(contextData) {
  describe('Content Quality', () => {
    test('should not have unreplaced placeholders', () => {
      const check = checkForPlaceholders(contextData);
      if (check.hasPlaceholders) {
        console.error('Found placeholders:', check.placeholders);
      }
      expect(check.hasPlaceholders).toBe(false);
    });
  });
}

module.exports = {
  testMetadata,
  testContentQuality,
  validateMetadata,
  checkForPlaceholders,
  hasSectionMatching,
};
