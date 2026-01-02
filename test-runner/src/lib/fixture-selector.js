const fs = require('fs-extra');
const path = require('path');
const inquirer = require('inquirer');
const chalk = require('chalk');

const FIXTURES_DIR = path.join(__dirname, '../../../tests/fixtures');

class FixtureSelector {
  /**
   * Get all available fixtures
   * @returns {Array} - Array of fixture objects
   */
  getAvailableFixtures() {
    if (!fs.existsSync(FIXTURES_DIR)) {
      return [];
    }

    const entries = fs.readdirSync(FIXTURES_DIR, { withFileTypes: true });
    const fixtures = entries
      .filter(entry => entry.isDirectory())
      .map(entry => {
        const fixturePath = path.join(FIXTURES_DIR, entry.name);
        const metadata = this.getFixtureMetadata(fixturePath);

        return {
          name: entry.name,
          path: fixturePath,
          ...metadata
        };
      });

    return fixtures;
  }

  /**
   * Get metadata for a fixture
   * @param {string} fixturePath - Path to fixture
   * @returns {Object} - Metadata
   */
  getFixtureMetadata(fixturePath) {
    const metadata = {
      description: '',
      type: 'unknown',
      language: 'unknown',
      hasPackageJson: false
    };

    // Check for package.json
    const packageJsonPath = path.join(fixturePath, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      metadata.hasPackageJson = true;
      try {
        const pkg = fs.readJsonSync(packageJsonPath);
        metadata.description = pkg.description || '';
        metadata.language = 'JavaScript';

        // Determine type
        if (pkg.dependencies?.express || pkg.name?.includes('service')) {
          metadata.type = 'service';
        } else if (pkg.dependencies?.react || pkg.name?.includes('client')) {
          metadata.type = 'client';
        } else if (pkg.main || pkg.module) {
          metadata.type = 'library';
        }

        // Check for TypeScript
        if (pkg.devDependencies?.typescript || pkg.dependencies?.typescript) {
          metadata.language = 'TypeScript';
        }
      } catch (err) {
        // Ignore parse errors
      }
    }

    return metadata;
  }

  /**
   * Prompt user to select fixtures
   * @param {Object} options - Selection options
   * @returns {Promise<Array>} - Selected fixture names
   */
  async selectFixtures(options = {}) {
    const fixtures = this.getAvailableFixtures();

    if (fixtures.length === 0) {
      console.log(chalk.yellow('\n⚠️  No fixtures found in'), FIXTURES_DIR);
      console.log(chalk.gray('Please add fixtures to test first.\n'));
      return [];
    }

    const choices = [
      {
        name: chalk.bold.cyan('Select All'),
        value: '__ALL__',
        checked: options.selectAll || false
      },
      new inquirer.Separator(),
      ...fixtures.map(fixture => ({
        name: this.formatFixtureChoice(fixture),
        value: fixture.name,
        checked: options.preselected?.includes(fixture.name) || false
      }))
    ];

    const { selected } = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'selected',
        message: 'Select fixtures to test:',
        choices,
        validate: (answer) => {
          if (answer.length < 1) {
            return 'You must choose at least one fixture.';
          }
          return true;
        }
      }
    ]);

    // Handle "Select All"
    if (selected.includes('__ALL__')) {
      return fixtures.map(f => f.name);
    }

    return selected;
  }

  /**
   * Format fixture choice for display
   * @param {Object} fixture - Fixture object
   * @returns {string} - Formatted string
   */
  formatFixtureChoice(fixture) {
    const icon = this.getTypeIcon(fixture.type);
    const name = chalk.bold(fixture.name);
    const lang = chalk.gray(`[${fixture.language}]`);
    const desc = fixture.description ? chalk.gray(` - ${fixture.description}`) : '';

    return `${icon}  ${name} ${lang}${desc}`;
  }

  /**
   * Get icon for fixture type
   * @param {string} type - Fixture type
   * @returns {string} - Icon
   */
  getTypeIcon(type) {
    const icons = {
      service: '🚀',
      client: '💻',
      library: '📦',
      database: '🗄️',
      unknown: '📁'
    };
    return icons[type] || icons.unknown;
  }

  /**
   * Group fixtures by type
   * @returns {Object} - Grouped fixtures
   */
  groupFixturesByType() {
    const fixtures = this.getAvailableFixtures();
    const grouped = {};

    fixtures.forEach(fixture => {
      if (!grouped[fixture.type]) {
        grouped[fixture.type] = [];
      }
      grouped[fixture.type].push(fixture);
    });

    return grouped;
  }

  /**
   * Prompt for fixture groups to test
   * @returns {Promise<Array>} - Selected fixture names
   */
  async selectByGroup() {
    const grouped = this.groupFixturesByType();
    const types = Object.keys(grouped);

    if (types.length === 0) {
      return [];
    }

    const { selectedTypes } = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'selectedTypes',
        message: 'Select fixture types to test:',
        choices: types.map(type => ({
          name: `${this.getTypeIcon(type)} ${type} (${grouped[type].length} fixtures)`,
          value: type,
          checked: false
        })),
        validate: (answer) => {
          if (answer.length < 1) {
            return 'You must choose at least one type.';
          }
          return true;
        }
      }
    ]);

    // Collect all fixtures from selected types
    const selected = [];
    selectedTypes.forEach(type => {
      grouped[type].forEach(fixture => {
        selected.push(fixture.name);
      });
    });

    return selected;
  }
}

module.exports = FixtureSelector;
