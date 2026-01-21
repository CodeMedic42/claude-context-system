class Tool {
  constructor({
    id,
    name,
  }) {
    this.name = name;
    this.id = id;
  }

  /**
   * Execute the tool to generate context files
   * @param {string} repoPath - Path to the repository
   * @param {string} command - Command to run (e.g., 'ctx-update')
   * @returns {Promise<{success: boolean, output: string, error?: string}>}
   */
  async run(repoPath, command) {
    throw new Error('ToolRunner.run() must be implemented by subclass');
  }

  /**
   * Get the name of this tool for logging/debugging
   * @returns {string}
   */
  getName() {
    return this.name;
  }

  /**
   * Check if the tool is available on the system
   * @returns {Promise<boolean>}
   */
  async isAvailable() {
    throw new Error('ToolRunner.isAvailable() must be implemented by subclass');
  }
}

module.exports = Tool;
