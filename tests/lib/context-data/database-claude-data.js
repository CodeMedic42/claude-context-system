const BaseData = require('./base-data');

/**
 * Data class for database.claude.md files
 */
class DatabaseClaudeData extends BaseData {
  constructor(filePath, projectName) {
    super(filePath);
    this.projectName = projectName;
  }

  /**
   * Get the project name this database belongs to
   * @returns {string}
   */
  getProjectName() {
    return this.projectName;
  }

  /**
   * Get required sections for a database file
   * Sections with '*' wildcard match any text after the prefix
   * @returns {string[]}
   */
  getRequiredSections() {
    // Method accesses instance for potential future customization per project
    return this.projectName ? [
      'Database Context: *',
      'Database Overview',
      'Schema Design',
      'Agent File Metadata',
    ] : [];
  }
}

module.exports = DatabaseClaudeData;
