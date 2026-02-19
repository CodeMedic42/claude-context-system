const fs = require('fs');

/**
 * Base class for all context data classes
 * Provides common parsing and validation logic
 */
class BaseData {
  constructor(filePath) {
    this.filePath = filePath;
    this.content = '';
    this.sections = new Map();
    this.metadata = {};
    this.errors = [];

    this.load();
    this.parse();
  }

  /**
   * Load the file content
   * @private
   */
  load() {
    if (!fs.existsSync(this.filePath)) {
      throw new Error(`Context file not found at ${this.filePath}`);
    }
    this.content = fs.readFileSync(this.filePath, 'utf8');
  }

  /**
   * Parse the file content
   * @private
   */
  parse() {
    this.parseSections();
    this.parseMetadata();
  }

  /**
   * Parse all sections from the markdown content
   * @private
   */
  parseSections() {
    const lines = this.content.split('\n');
    let currentSection = null;
    let currentContent = [];

    lines.forEach((line) => {
      const headerMatch = line.match(/^(#{1,3})\s+(.+)$/);

      if (headerMatch) {
        // Save previous section
        if (currentSection) {
          this.sections.set(currentSection, currentContent.join('\n').trim());
        }

        // Start new section
        currentSection = headerMatch[2].trim();
        currentContent = [];
      } else if (currentSection) {
        currentContent.push(line);
      }
    });

    // Save last section
    if (currentSection) {
      this.sections.set(currentSection, currentContent.join('\n').trim());
    }
  }

  /**
   * Parse metadata from the Agent File Metadata section
   * @private
   */
  parseMetadata() {
    const metadataSection = this.getSection('Agent File Metadata [metadata] [tracking]');
    if (!metadataSection) {
      this.errors.push('Missing Agent File Metadata section');
      return;
    }

    // Extract metadata fields with strict format matching template:
    // Format: "- Field Name: value" (dash, space, no bold, colon, space, value)
    const revisionDateMatch = metadataSection.match(
      /^-\s+Revision Date:\s+(.+)$/m,
    );
    const commitShaMatch = metadataSection.match(
      /^-\s+Last commit SHA built from:\s+([a-f0-9]{40})$/m,
    );
    const templateVersionMatch = metadataSection.match(
      /^-\s+Template Version:\s+([\d.]+)$/m,
    );
    const projectTypesMatch = metadataSection.match(
      /^-\s+Project Types:\s+(\[.+\])$/m,
    );

    this.metadata = {
      revisionDate: revisionDateMatch ? revisionDateMatch[1].trim() : null,
      commitSha: commitShaMatch ? commitShaMatch[1].trim() : null,
      templateVersion: templateVersionMatch ? templateVersionMatch[1].trim() : null,
      projectTypes: projectTypesMatch ? JSON.parse(projectTypesMatch[1]) : null,
    };
  }

  /**
   * Get the path to the context file
   * @returns {string}
   */
  getContextFilePath() {
    return this.filePath;
  }

  /**
   * Get content of a specific section
   * @param {string} sectionName - Name of the section
   * @returns {string|null} Section content or null if not found
   */
  getSection(sectionName) {
    return this.sections.get(sectionName) || null;
  }

  /**
   * Check if a section exists
   * @param {string} sectionName - Name of the section
   * @returns {boolean}
   */
  hasSection(sectionName) {
    return this.sections.has(sectionName);
  }

  /**
   * Get all section names
   * @returns {string[]}
   */
  getAllSectionNames() {
    return Array.from(this.sections.keys());
  }

  /**
   * Get metadata object
   * @returns {Object}
   */
  getMetadata() {
    return { ...this.metadata };
  }

  /**
   * Get revision date
   * @returns {string|null}
   */
  getRevisionDate() {
    return this.metadata.revisionDate;
  }

  /**
   * Get commit SHA
   * @returns {string|null}
   */
  getCommitSha() {
    return this.metadata.commitSha;
  }

  /**
   * Get template version
   * @returns {string|null}
   */
  getTemplateVersion() {
    return this.metadata.templateVersion;
  }

  /**
   * Get project types array (only present in PROJECT.CLAUDE.md files)
   * @returns {string[]|null}
   */
  getProjectTypes() {
    return this.metadata.projectTypes;
  }
}

module.exports = BaseData;
