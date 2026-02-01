const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const fs = require('fs-extra');
const {
  merge,
  noop,
  isEmpty,
  isInteger,
} = require('lodash');

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
    const setupModule = require(setupFile);
    const { testCommand, tokenLimit, ...planHooks } = setupModule;

    if (isEmpty(testCommand)) {
      console.log('Each plan setup file must provide a testCommand field');

      process.exit(1);
    }

    if (!isInteger(tokenLimit) || tokenLimit < 0) {
      console.log('Each plan setup file must provide a valid tokenLimit field');

      process.exit(1);
    }

    this.testCommand = testCommand;
    this.tokenLimit = tokenLimit;

    this.hooks = merge({
      beforeFixtureSetup: noop,
      afterFixtureSetup: noop,
      beforeToolPreparation: noop,
      afterToolPreparation: noop,
      beforeToolExecution: noop,
      afterToolExecution: noop,
    }, planHooks);
  }
}

module.exports = Plan;
