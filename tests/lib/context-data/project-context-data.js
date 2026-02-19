const BaseData = require('./base-data');

/**
 * Data class for PROJECT.CLAUDE.md files
 */
class ProjectContextData extends BaseData {
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
   * Get required sections for a PROJECT file
   * @param {string} title - Project title for validation
   * @returns {string[]}
   */
  getRequiredSections(title) {
    // Method accesses instance for potential future customization per project
    return this.projectName ? [
      `Project: ${title}`,
      'Project Overview [overview] [summary]',
      'Project Metadata [metadata] [identity]',
      'Project Types & Technical Documentation [types] [technical] [documentation]',
      'Restricted Actions [security] [restrictions] [policies]',
      'Agent File Maintenance [metadata] [maintenance]',
      'Agent File Metadata [metadata] [tracking]',
    ] : [];
  }

  /**
   * Get @file references from Project Types section
   * Strict format: "@file ./TYPE.CLAUDE.md"
   * @returns {string[]}
   */
  getTypeFileReferences() {
    const typesSection = this.content.match(/## Project Types & Technical Documentation \[types\] \[technical\] \[documentation\][^#]*/);
    if (!typesSection) return [];

    const fileRefs = [];
    // Strict pattern: @file followed by space and path ending in .CLAUDE.md
    const refMatches = Array.from(typesSection[0].matchAll(/@file\s+(\.\/[A-Z]+\.CLAUDE\.md)/g));
    refMatches.forEach((match) => {
      fileRefs.push(match[1]);
    });
    return fileRefs;
  }
}

module.exports = ProjectContextData;
