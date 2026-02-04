const fs = require('fs');
const path = require('path');

/**
 * Parses and validates CLAUDE_CONTEXT_PROGRESS.json
 */
class ProgressData {
  constructor(data) {
    this.planFile = data.planFile;
    this.lastUpdated = data.lastUpdated;
    this.completedProjects = data.completedProjects || [];
    this.nextProject = data.nextProject;
    this.discoveries = data.discoveries || [];
    this.claudeMdData = data.claudeMdData || [];
  }

  /**
   * Reload the progress from disk
   */
  static load(repoPath) {
    const progressPath = path.join(repoPath, 'CLAUDE_CONTEXT_PROGRESS.json');

    if (!fs.existsSync(progressPath)) {
      return null;
    }

    const content = fs.readFileSync(progressPath, 'utf8');
    const data = JSON.parse(content);

    return new ProgressData(data);
  }

  /**
   * Get a completed projects
   */
  getCompletedProjects() {
    return this.completedProjects;
  }

  /**
   * Get a completed project by ID
   */
  getCompletedProject(projectId) {
    return this.completedProjects.find((p) => p.id === projectId);
  }

  /**
   * Get context files for a project
   */
  getContextFiles(projectId) {
    const project = this.getCompletedProject(projectId);
    if (!project) return [];
    return project.contextFiles || [];
  }

  /**
   * Get discoveries by type
   */
  getDiscoveriesByType(type) {
    return this.discoveries.filter((d) => d.type === type);
  }

  /**
   * Get notes by topic
   */
  getNotesByTopic(topic) {
    const notes = [];
    this.claudeMdData.forEach((projectData) => {
      if (projectData.notes) {
        projectData.notes.forEach((note) => {
          if (note.topic === topic) {
            notes.push({
              fromProject: projectData.fromProject,
              ...note,
            });
          }
        });
      }
    });
    return notes;
  }

  /**
   * Get all notes from a specific project
   */
  getProjectNotes(projectId) {
    const projectData = this.claudeMdData.find((p) => p.fromProject === projectId);
    return projectData ? projectData.notes || [] : [];
  }

  /**
   * Check if a project is completed
   */
  isProjectCompleted(projectId) {
    return this.completedProjects.some((p) => p.id === projectId);
  }

  /**
   * Check if all projects are completed
   */
  isComplete() {
    return this.nextProject === null;
  }

  getNextProject() {
    return this.nextProject;
  }

  /**
   * Get completion percentage (requires action plan)
   */
  getCompletionPercent(totalProjects) {
    if (totalProjects === 0) return 100;
    return Math.round((this.completedProjects.length / totalProjects) * 100);
  }

  /**
   * Validate the progress file structure
   */
  validate() {
    const errors = [];

    // Check required fields
    if (!this.planFile) errors.push('Missing planFile field');
    if (!this.lastUpdated) errors.push('Missing lastUpdated field');
    if (!Array.isArray(this.completedProjects)) {
      errors.push('completedProjects must be an array');
    }
    if (!Array.isArray(this.discoveries)) {
      errors.push('discoveries must be an array');
    }
    if (!Array.isArray(this.claudeMdData)) {
      errors.push('claudeMdData must be an array');
    }

    // Validate completed projects
    this.completedProjects.forEach((project, index) => {
      if (!project.id) errors.push(`Completed project ${index}: missing id`);
      if (!project.contextFiles || !Array.isArray(project.contextFiles)) {
        errors.push(`Completed project ${index}: contextFiles must be an array`);
      }

      if (project.contextFiles) {
        project.contextFiles.forEach((file, fileIndex) => {
          if (!file.type) {
            errors.push(`Completed project ${index}, file ${fileIndex}: missing type`);
          }
          if (!file.path) {
            errors.push(`Completed project ${index}, file ${fileIndex}: missing path`);
          }
        });
      }
    });

    // Validate discoveries
    this.discoveries.forEach((discovery, index) => {
      if (!discovery.type) errors.push(`Discovery ${index}: missing type`);
      if (!discovery.discoveredDuring) {
        errors.push(`Discovery ${index}: missing discoveredDuring`);
      }
      if (!discovery.discoveredAt) {
        errors.push(`Discovery ${index}: missing discoveredAt`);
      }
      if (!discovery.data) errors.push(`Discovery ${index}: missing data`);
    });

    // Validate claudeMdData
    this.claudeMdData.forEach((projectData, index) => {
      if (!projectData.fromProject) {
        errors.push(`claudeMdData ${index}: missing fromProject`);
      }
      if (!projectData.notes || !Array.isArray(projectData.notes)) {
        errors.push(`claudeMdData ${index}: notes must be an array`);
      }

      if (projectData.notes) {
        projectData.notes.forEach((note, noteIndex) => {
          if (!note.topic) {
            errors.push(`claudeMdData ${index}, note ${noteIndex}: missing topic`);
          }
          if (!note.note) {
            errors.push(`claudeMdData ${index}, note ${noteIndex}: missing note content`);
          }
        });
      }
    });

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get statistics about progress
   */
  getStats() {
    return {
      completedProjects: this.completedProjects.length,
      remainingProjects: this.nextProject ? 'unknown' : 0,
      totalDiscoveries: this.discoveries.length,
      discoveryTypes: this.getDiscoveryTypes(),
      totalNotes: this.getTotalNotesCount(),
      uniqueTopics: this.getUniqueTopics().length,
    };
  }

  /**
   * Get all discovery types found
   */
  getDiscoveryTypes() {
    const types = new Set();
    this.discoveries.forEach((d) => types.add(d.type));
    return Array.from(types);
  }

  /**
   * Get total count of notes
   */
  getTotalNotesCount() {
    return this.claudeMdData.reduce(
      (sum, projectData) => sum + (projectData.notes ? projectData.notes.length : 0),
      0,
    );
  }

  /**
   * Get all unique topics
   */
  getUniqueTopics() {
    const topics = new Set();
    this.claudeMdData.forEach((projectData) => {
      if (projectData.notes) {
        projectData.notes.forEach((note) => topics.add(note.topic));
      }
    });
    return Array.from(topics);
  }

  /**
   * Check if context files exist on disk
   */
  verifyContextFilesExist() {
    const results = [];
    this.completedProjects.forEach((project) => {
      project.contextFiles.forEach((file) => {
        const filePath = path.join(this.repoPath, file.path);
        results.push({
          project: project.id,
          file: file.path,
          type: file.type,
          exists: fs.existsSync(filePath),
        });
      });
    });
    return results;
  }
}

module.exports = ProgressData;
