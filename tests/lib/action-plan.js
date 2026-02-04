const fs = require('fs');
const path = require('path');

/**
 * Parses and validates CLAUDE_CONTEXT_ACTION_PLAN.json
 */
class ActionPlan {
  constructor(data) {
    // Store all plan data
    this.version = data.version;
    this.type = data.type;
    this.created = data.created;
    this.repository = data.repository;
    this.estimatedTokensPerFile = data.estimatedTokensPerFile;
    this.actualTokensPerFile = data.actualTokensPerFile;
    this.projects = data.projects || [];
    this.estimatedTotalTokens = data.estimatedTotalTokens;
    this.estimatedExecutions = data.estimatedExecutions;
    this.contextFiles = data.contextFiles || [];

    // For update plans
    this.basedOnCommit = data.basedOnCommit;
    this.currentCommit = data.currentCommit;
  }

  static load(repoPath) {
    const planPath = path.join(repoPath, 'CLAUDE_CONTEXT_ACTION_PLAN.json');

    if (!fs.existsSync(planPath)) {
      throw new Error('Action Plan does not exist');
    }

    const content = fs.readFileSync(planPath, 'utf8');
    const data = JSON.parse(content);

    return new ActionPlan(data);
  }

  /**
   * Get a project by ID
   */
  getProject(projectId) {
    return this.projects.find((p) => p.id === projectId);
  }

  /**
   * Get all projects of a specific type
   */
  getProjectsByType(type) {
    return this.projects.filter((p) => p.type.includes(type));
  }

  /**
   * Get dependencies for a project
   */
  getDependencies(projectId) {
    const project = this.getProject(projectId);
    if (!project) return [];
    return project.dependencies;
  }

  /**
   * Get dependents for a project
   */
  getDependents(projectId) {
    const project = this.getProject(projectId);
    if (!project) return [];
    return project.dependents;
  }

  /**
   * Get projects in dependency order (how they should be processed)
   */
  getProjectsInOrder() {
    return [...this.projects]; // Already ordered in the plan
  }

  /**
   * Validate the action plan structure
   */
  validate() {
    const errors = [];

    // Check required fields
    if (!this.version) errors.push('Missing version field');
    if (!this.type) errors.push('Missing type field');
    if (!['create', 'update'].includes(this.type)) {
      errors.push(`Invalid type: ${this.type}. Must be "create" or "update"`);
    }
    if (!this.repository) errors.push('Missing repository field');
    if (!Array.isArray(this.projects)) errors.push('projects must be an array');
    if (!Array.isArray(this.contextFiles)) errors.push('contextFiles must be an array');

    // Validate each project
    this.projects.forEach((project, index) => {
      if (!project.id) errors.push(`Project ${index}: missing id`);
      if (!project.path) errors.push(`Project ${index}: missing path`);
      if (!project.type || !Array.isArray(project.type)) {
        errors.push(`Project ${index}: type must be an array`);
      }
      if (project.type && project.type.length === 0) {
        errors.push(`Project ${index}: type array cannot be empty`);
      }
      if (!project.dependencies || !Array.isArray(project.dependencies)) {
        errors.push(`Project ${index}: dependencies must be an array`);
      }
      if (!project.dependents || !Array.isArray(project.dependents)) {
        errors.push(`Project ${index}: dependents must be an array`);
      }
      if (typeof project.estimatedTokens !== 'number') {
        errors.push(`Project ${index}: estimatedTokens must be a number`);
      }
    });

    // Validate dependency ordering
    const seen = new Set();
    this.projects.forEach((project) => {
      // All dependencies should appear before this project
      project.dependencies.forEach((dep) => {
        if (!seen.has(dep)) {
          errors.push(`Project ${project.id}: dependency ${dep} appears after dependent`);
        }
      });
      seen.add(project.id);
    });

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get statistics about the plan
   */
  getStats() {
    const stats = {
      totalProjects: this.projects.length,
      projectsByType: {},
      totalEstimatedTokens: this.estimatedTotalTokens,
      estimatedExecutions: this.estimatedExecutions,
      averageTokensPerProject: Math.round(
        this.estimatedTotalTokens / this.projects.length,
      ),
    };

    // Count by type
    const types = ['SERVICE', 'CLIENT', 'LIBRARY', 'DATABASE'];
    types.forEach((type) => {
      stats.projectsByType[type] = this.getProjectsByType(type).length;
    });

    return stats;
  }

  /**
   * Find a project by path
   */
  findProjectByPath(filePath) {
    return this.projects.find((p) => filePath.startsWith(p.path));
  }
}

module.exports = ActionPlan;
