const BaseData = require('./base-data');

/**
 * Data class for client.claude.md files
 */
class IACContextData extends BaseData {
  constructor(filePath, projectName) {
    super(filePath);
    this.projectName = projectName;
  }

  /**
   * Get the project name this client belongs to
   * @returns {string}
   */
  getProjectName() {
    return this.projectName;
  }

  /**
   * Get required sections for a client file
   * Sections with '*' wildcard match any text after the prefix
   * @returns {string[]}
   */
  getRequiredSections(title) {
    // Method accesses instance for potential future customization per project
    return this.projectName ? [
      `IAC Context: ${title}`,
    ] : [];
  }
}

module.exports = IACContextData;
