const BaseData = require('./base-data');

/**
 * Data class for service.claude.md files
 */
class ServiceContextData extends BaseData {
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
  getRequiredSections(title) {
    // Method accesses instance for potential future customization per project
    return this.projectName ? [
      `Service Context: ${title}`,
      'Service Overview [overview] [summary]',
      'API Endpoints [api] [endpoints] [routes]',
      'Agent File Metadata [metadata] [tracking]',
    ] : [];
  }
}

module.exports = ServiceContextData;
