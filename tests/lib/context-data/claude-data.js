const fs = require('fs');
const path = require('path');
const BaseData = require('./base-data');
const ProjectContextData = require('./project-context-data');
const ServiceContextData = require('./service-context-data');
const ClientContextData = require('./client-context-data');
const LibraryContextData = require('./library-context-data');
const DatabaseContextData = require('./database-context-data');
const IACContextData = require('./iac-context-data');

/**
 * Data class for CLAUDE.md files
 * Automatically discovers and parses all sub-context files
 */
class ClaudeData extends BaseData {
  constructor(fixturePath) {
    // Find CLAUDE.md or claude.md
    const claudeMdPath = ClaudeData.findClaudeFile(fixturePath);
    super(claudeMdPath);

    this.fixturePath = fixturePath;
    this.projectContexts = [];
    this.technicalContexts = [];
    this.projectContextsByPath = new Map();
    this.technicalContextsByPath = new Map();

    this.parseSubcontexts();
  }

  /**
   * Find CLAUDE.md or claude.md in the fixture path
   * @param {string} fixturePath - Path to the fixture directory
   * @returns {string} Path to the CLAUDE.md file
   * @throws {Error} If no context file is found
   * @private
   */
  static findClaudeFile(fixturePath) {
    const claudeMdUpper = path.join(fixturePath, 'CLAUDE.md');
    const claudeMdLower = path.join(fixturePath, 'claude.md');

    if (fs.existsSync(claudeMdUpper)) {
      return claudeMdUpper;
    }
    if (fs.existsSync(claudeMdLower)) {
      return claudeMdLower;
    }

    throw new Error(`No CLAUDE.md file found in ${fixturePath}`);
  }

  /**
   * Parse all @file references and create sub-context instances
   * @private
   */
  parseSubcontexts() {
    const fileRefRegex = /@file\s+(\.\/[^\s)]+)/g;
    let match;

    // eslint-disable-next-line no-cond-assign
    while ((match = fileRefRegex.exec(this.content)) !== null) {
      const relativePath = match[1];
      const absolutePath = path.join(this.fixturePath, relativePath);
      const lowerPath = relativePath.toLowerCase();

      // Only process if file exists
      if (fs.existsSync(absolutePath)) {
        // Extract project name from path (parent directory of the file)
        // (e.g., "./Service.Api/service.claude.md" -> "Service.Api")
        // (e.g., "./packages/web/PROJECT.CLAUDE.md" -> "web")
        const projectName = path.basename(path.dirname(absolutePath));

        // Create appropriate sub-context instance based on filename
        let techContext = null;

        if (lowerPath.includes('service.claude.md')) {
          techContext = new ServiceContextData(absolutePath, projectName);
        } else if (lowerPath.includes('client.claude.md')) {
          techContext = new ClientContextData(absolutePath, projectName);
        } else if (lowerPath.includes('library.claude.md')) {
          techContext = new LibraryContextData(absolutePath, projectName);
        } else if (lowerPath.includes('database.claude.md')) {
          techContext = new DatabaseContextData(absolutePath, projectName);
        } else if (lowerPath.includes('iac.claude.md')) {
          techContext = new IACContextData(absolutePath, projectName);
        } else if (lowerPath.includes('project.claude.md')) {
          const projectContext = new ProjectContextData(absolutePath, projectName);

          this.projectContexts.push(projectContext);
          this.projectContextsByPath.set(relativePath, projectContext);
        }

        if (techContext) {
          this.technicalContexts.push(techContext);
          this.technicalContextsByPath.set(relativePath, techContext);
        }
      }
    }
  }

  /**
   * Get a sub-context by file path (checks both technical and project contexts)
   * @param {string} filePath - Relative file path
   *   (e.g., "./LIBRARY.CLAUDE.md", "./Service.Api/service.claude.md", or "./PROJECT.CLAUDE.md")
   * @returns {BaseData|null} Sub-context instance or null if not found
   */
  getProjectContextData(filePath) {
    return this.technicalContextsByPath.get(filePath)
      || this.projectContextsByPath.get(filePath)
      || null;
  }

  /**
   * Get all project-context instances
   * @returns {BaseData[]} Array of all sub-context instances
   */
  getProjectContextList() {
    return [...this.projectContexts];
  }

  /**
   * Get all sub-context instances
   * @returns {BaseData[]} Array of all sub-context instances
   */
  getTechnicalContextList() {
    return [...this.technicalContexts];
  }

  /**
   * Get required sections for a CLAUDE.md file
   * @returns {string[]}
   */
  getRequiredSections() {
    // Method accesses instance for potential future customization per fixture
    return this.fixturePath ? [
      'Repository Agent Context',
      'Repository Overview [overview] [summary]',
      'High-Level Repository Information [metadata] [technologies]',
      'Repository Structure [structure] [organization]',
      'Code Organization Patterns [architecture] [patterns]',
      'Environment Setup [setup] [environment] [prerequisites]',
      'Agent File Metadata [metadata] [tracking]',
    ] : [];
  }
}

module.exports = ClaudeData;
