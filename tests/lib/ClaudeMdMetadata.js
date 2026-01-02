const fs = require('fs');
const path = require('path');

/**
 * ClaudeMdMetadata - Parser and validator for claude.md files
 *
 * This class loads a claude.md file and all referenced sub-files (service.claude.md,
 * client.claude.md, etc.) and provides methods to access sections and validate structure.
 */
class ClaudeMdMetadata {
  constructor(claudeMdPath) {
    this.claudeMdPath = claudeMdPath;
    this.repoRoot = path.dirname(claudeMdPath);
    this.content = '';
    this.sections = new Map();
    this.metadata = {};
    this.subFiles = {
      services: [],
      clients: [],
      libraries: [],
      databases: []
    };
    this.errors = [];

    this._load();
    this._parse();
  }

  /**
   * Load the claude.md file content
   * @private
   */
  _load() {
    if (!fs.existsSync(this.claudeMdPath)) {
      throw new Error(`claude.md not found at ${this.claudeMdPath}`);
    }
    this.content = fs.readFileSync(this.claudeMdPath, 'utf8');
  }

  /**
   * Parse the claude.md content into sections
   * @private
   */
  _parse() {
    this._parseSections();
    this._parseMetadata();
    this._parseFileReferences();
  }

  /**
   * Parse all sections from the markdown content
   * @private
   */
  _parseSections() {
    // Split by main headers (# or ##)
    const lines = this.content.split('\n');
    let currentSection = null;
    let currentContent = [];

    lines.forEach(line => {
      const headerMatch = line.match(/^(#{1,2})\s+(.+)$/);

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
  _parseMetadata() {
    const metadataSection = this.getSection('Agent File Metadata');
    if (!metadataSection) {
      this.errors.push('Missing Agent File Metadata section');
      return;
    }

    // Extract metadata fields (handle both plain and bold markdown formatting)
    const dateCreatedMatch = metadataSection.match(/\*\*Date Created\*\*:\s*(.+)|Date Created:\s*(.+)/);
    const dateModifiedMatch = metadataSection.match(/\*\*Date Modified\*\*:\s*(.+)|Date Modified:\s*(.+)/);
    const commitShaMatch = metadataSection.match(/\*\*Last commit SHA built from\*\*:\s*([a-f0-9]+)|Last commit SHA built from:\s*([a-f0-9]+)/);
    const templateVersionMatch = metadataSection.match(/\*\*Template Version\*\*:\s*([\d.]+)|Template Version:\s*([\d.]+)/);

    this.metadata = {
      dateCreated: dateCreatedMatch ? (dateCreatedMatch[1] || dateCreatedMatch[2]).trim() : null,
      dateModified: dateModifiedMatch ? (dateModifiedMatch[1] || dateModifiedMatch[2]).trim() : null,
      commitSha: commitShaMatch ? (commitShaMatch[1] || commitShaMatch[2]).trim() : null,
      templateVersion: templateVersionMatch ? (templateVersionMatch[1] || templateVersionMatch[2]).trim() : null
    };
  }

  /**
   * Parse @file references and categorize them
   * @private
   */
  _parseFileReferences() {
    const fileRefRegex = /@file\s+(\.\/[^\s)]+)/g;
    let match;

    while ((match = fileRefRegex.exec(this.content)) !== null) {
      const filePath = match[1];
      const absolutePath = path.join(this.repoRoot, filePath);

      // Categorize by filename
      if (filePath.includes('service.claude.md')) {
        this.subFiles.services.push({ path: filePath, absolutePath });
      } else if (filePath.includes('client.claude.md')) {
        this.subFiles.clients.push({ path: filePath, absolutePath });
      } else if (filePath.includes('library.claude.md')) {
        this.subFiles.libraries.push({ path: filePath, absolutePath });
      } else if (filePath.includes('database.claude.md')) {
        this.subFiles.databases.push({ path: filePath, absolutePath });
      }
    }
  }

  // ============================================================================
  // PUBLIC API - Section Access
  // ============================================================================

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

  // ============================================================================
  // PUBLIC API - Metadata Access
  // ============================================================================

  /**
   * Get metadata object
   * @returns {Object}
   */
  getMetadata() {
    return { ...this.metadata };
  }

  /**
   * Get date created
   * @returns {string|null}
   */
  getDateCreated() {
    return this.metadata.dateCreated;
  }

  /**
   * Get date modified
   * @returns {string|null}
   */
  getDateModified() {
    return this.metadata.dateModified;
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

  // ============================================================================
  // PUBLIC API - Sub-file Access
  // ============================================================================

  /**
   * Get all service files referenced
   * @returns {Array<{path: string, absolutePath: string}>}
   */
  getServiceFiles() {
    return [...this.subFiles.services];
  }

  /**
   * Get all client files referenced
   * @returns {Array<{path: string, absolutePath: string}>}
   */
  getClientFiles() {
    return [...this.subFiles.clients];
  }

  /**
   * Get all library files referenced
   * @returns {Array<{path: string, absolutePath: string}>}
   */
  getLibraryFiles() {
    return [...this.subFiles.libraries];
  }

  /**
   * Get all database files referenced
   * @returns {Array<{path: string, absolutePath: string}>}
   */
  getDatabaseFiles() {
    return [...this.subFiles.databases];
  }

  /**
   * Check if service files exist on filesystem
   * @returns {boolean}
   */
  doServiceFilesExist() {
    return this.subFiles.services.every(f => fs.existsSync(f.absolutePath));
  }

  /**
   * Check if client files exist on filesystem
   * @returns {boolean}
   */
  doClientFilesExist() {
    return this.subFiles.clients.every(f => fs.existsSync(f.absolutePath));
  }

  /**
   * Check if library files exist on filesystem
   * @returns {boolean}
   */
  doLibraryFilesExist() {
    return this.subFiles.libraries.every(f => fs.existsSync(f.absolutePath));
  }

  /**
   * Check if database files exist on filesystem
   * @returns {boolean}
   */
  doDatabaseFilesExist() {
    return this.subFiles.databases.every(f => fs.existsSync(f.absolutePath));
  }

  // ============================================================================
  // PUBLIC API - Validation
  // ============================================================================

  /**
   * Validate that required sections exist
   * @param {string[]} requiredSections - Array of section names that must exist
   * @returns {boolean}
   */
  validateRequiredSections(requiredSections) {
    return requiredSections.every(section => this.hasSection(section));
  }

  /**
   * Validate that certain sections do NOT exist
   * @param {string[]} forbiddenSections - Array of section names that must NOT exist
   * @returns {boolean}
   */
  validateForbiddenSections(forbiddenSections) {
    return forbiddenSections.every(section => !this.hasSection(section));
  }

  /**
   * Validate metadata is complete and properly formatted
   * @returns {{valid: boolean, errors: string[]}}
   */
  validateMetadata() {
    const errors = [];

    if (!this.metadata.dateCreated) {
      errors.push('Missing Date Created in metadata');
    }

    if (!this.metadata.dateModified) {
      errors.push('Missing Date Modified in metadata');
    }

    if (!this.metadata.commitSha) {
      errors.push('Missing commit SHA in metadata');
    } else if (!/^[a-f0-9]{40}$/.test(this.metadata.commitSha)) {
      errors.push('Invalid commit SHA format (must be 40-character hex)');
    }

    if (!this.metadata.templateVersion) {
      errors.push('Missing template version in metadata');
    } else if (!/^\d+\.\d+\.\d+$/.test(this.metadata.templateVersion)) {
      errors.push('Invalid template version format (must be semver X.Y.Z)');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Check for unreplaced placeholders in content
   * Looks for template placeholders in format: <{instruction text}>
   * @returns {{hasPlaceholders: boolean, placeholders: string[]}}
   */
  checkForPlaceholders() {
    // Match the new placeholder format: <{...}>
    const placeholders = this.content.match(/<\{[^}]+\}>/g) || [];

    return {
      hasPlaceholders: placeholders.length > 0,
      placeholders
    };
  }

  /**
   * Validate that all referenced sub-files exist
   * @returns {{valid: boolean, missingFiles: string[]}}
   */
  validateSubFilesExist() {
    const missingFiles = [];

    const allFiles = [
      ...this.subFiles.services,
      ...this.subFiles.clients,
      ...this.subFiles.libraries,
      ...this.subFiles.databases
    ];

    allFiles.forEach(file => {
      if (!fs.existsSync(file.absolutePath)) {
        missingFiles.push(file.path);
      }
    });

    return {
      valid: missingFiles.length === 0,
      missingFiles
    };
  }

  /**
   * Run all validations and return comprehensive results
   * @returns {{valid: boolean, errors: string[]}}
   */
  validateAll() {
    const errors = [];

    // Check for required sections
    const requiredSections = [
      'Repository Agent Context',
      'Repository Summary',
      'High-Level Repository Information',
      'Repository Structure',
      'Code Organization Patterns',
      'Environment Setup',
      'Agent File Metadata'
    ];

    requiredSections.forEach(section => {
      if (!this.hasSection(section)) {
        errors.push(`Missing required section: ${section}`);
      }
    });

    // Validate metadata
    const metadataValidation = this.validateMetadata();
    errors.push(...metadataValidation.errors);

    // Check for placeholders
    const placeholderCheck = this.checkForPlaceholders();
    if (placeholderCheck.hasPlaceholders) {
      errors.push(`Found unreplaced placeholders: ${placeholderCheck.placeholders.join(', ')}`);
    }

    // Validate sub-files exist
    const subFileValidation = this.validateSubFilesExist();
    if (!subFileValidation.valid) {
      errors.push(`Missing referenced files: ${subFileValidation.missingFiles.join(', ')}`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

module.exports = ClaudeMdMetadata;
