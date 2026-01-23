const BaseData = require('./base-data');

/**
 * Data class for service.claude.md files
 */
class ServiceClaudeData extends BaseData {
  constructor(filePath, projectName) {
    super(filePath);
    this.projectName = projectName;
  }

  /**
   * Get the project name this service belongs to
   * @returns {string}
   */
  getProjectName() {
    return this.projectName;
  }

  /**
   * Get required sections for a service file
   * Sections with '*' wildcard match any text after the prefix
   * @returns {string[]}
   */
  getRequiredSections() {
    // Method accesses instance for potential future customization per project
    return this.projectName ? [
      'Service Context: *',
      'Service Overview',
      'API Endpoints',
      'Agent File Metadata',
    ] : [];
  }
}

module.exports = ServiceClaudeData;
