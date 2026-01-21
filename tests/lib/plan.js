const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const fs = require('fs-extra');
const { merge, noop, isEmpty } = require('lodash');

class Plan {
  constructor({ planDir, id }) {
    this.planDir = planDir;
    this.fixtureDir = path.join(planDir, 'fixture');

    this.id = id;

    const setupFile = path.join(planDir, 'setup.js');

    if (!fs.existsSync(setupFile)) {
      console.log('Each plan must provide a setup file');

      process.exit(1);
    }

    // eslint-disable-next-line import/no-dynamic-require, global-require
    const { testCommand, ...planHooks } = require(setupFile);

    if (isEmpty(testCommand)) {
      console.log('Each plan setup file must provide a testCommand field');

      process.exit(1);
    }

    this.testCommand = testCommand;

    this.hooks = merge({
      beforeGitSetup: noop,
      afterGitSetup: noop,
      beforeToolExecution: noop,
      afterToolExecution: noop,
    }, planHooks);
  }
}

module.exports = Plan;
