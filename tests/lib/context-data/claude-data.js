const fs = require('fs');
const path = require('path');
const BaseData = require('./base-data');
const ServiceClaudeData = require('./service-claude-data');
const ClientClaudeData = require('./client-claude-data');
const LibraryClaudeData = require('./library-claude-data');
const DatabaseClaudeData = require('./database-claude-data');

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
    this.subcontexts = [];
    this.subcontextsByPath = new Map();

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
        // Extract project name from path
        // (e.g., "./Service.Api/service.claude.md" -> "Service.Api")
        const pathParts = relativePath.split('/');
        const projectName = pathParts.length > 1
          ? pathParts[1]
          : path.basename(path.dirname(relativePath));

        // Create appropriate sub-context instance based on filename
        let subcontext = null;

        if (lowerPath.includes('service.claude.md')) {
          subcontext = new ServiceClaudeData(absolutePath, projectName);
        } else if (lowerPath.includes('client.claude.md')) {
          subcontext = new ClientClaudeData(absolutePath, projectName);
        } else if (lowerPath.includes('library.claude.md')) {
          subcontext = new LibraryClaudeData(absolutePath, projectName);
        } else if (lowerPath.includes('database.claude.md')) {
          subcontext = new DatabaseClaudeData(absolutePath, projectName);
        }

        if (subcontext) {
          this.subcontexts.push(subcontext);
          this.subcontextsByPath.set(relativePath, subcontext);
        }
      }
    }
  }

  /**
   * Get a sub-context by file path
   * @param {string} filePath - Relative file path
   *   (e.g., "./LIBRARY.CLAUDE.md" or "./Service.Api/service.claude.md")
   * @returns {BaseData|null} Sub-context instance or null if not found
   */
  getProjectContextData(filePath) {
    return this.subcontextsByPath.get(filePath) || null;
  }

  /**
   * Get all sub-context instances
   * @returns {BaseData[]} Array of all sub-context instances
   */
  getSubcontextList() {
    return [...this.subcontexts];
  }

  /**
   * Get required sections for a CLAUDE.md file
   * @returns {string[]}
   */
  getRequiredSections() {
    // Method accesses instance for potential future customization per fixture
    return this.fixturePath ? [
      'Repository Agent Context',
      'Repository Overview',
      'High-Level Repository Information',
      'Repository Structure',
      'Code Organization Patterns',
      'Environment Setup',
      'Agent File Metadata',
    ] : [];
  }
}

module.exports = ClaudeData;
