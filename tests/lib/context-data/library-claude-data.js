const BaseData = require('./base-data');

/**
 * Data class for library.claude.md files
 */
class LibraryClaudeData extends BaseData {
  constructor(filePath, projectName) {
    super(filePath);
    this.projectName = projectName;
  }

  /**
   * Get the project name this library belongs to
   * @returns {string}
   */
  getProjectName() {
    return this.projectName;
  }

  /**
   * Get required sections for a library file
   * Sections with '*' wildcard match any text after the prefix
   * @returns {string[]}
   */
  getRequiredSections() {
    // Method accesses instance for potential future customization per project
    return this.projectName ? [
      'Library Context: *',
      'Library Overview',
      'Public API',
      'Agent File Metadata',
    ] : [];
  }
}

module.exports = LibraryClaudeData;
