const path = require('path');
const fs = require('fs');
const os = require('os');
const {
  forEach,
  isEmpty,
  isNil,
} = require('lodash');

function getAllTestPlans(plansDir) {
  return fs.readdirSync(plansDir)
    .filter((name) => {
      const fullPath = path.join(plansDir, name);

      return fs.statSync(fullPath).isDirectory() && !name.startsWith('.');
    });
}

function processParams(workingDir) {
  const args = process.argv.slice(2);

  const params = {
    planIds: null, // null = all test plans
    toolIds: null, // null = both tools
    repeatRun: null, // null = new run
    prepareOnly: false, // false = run all steps
    plansDir: path.join(workingDir, 'tests', 'plans'),
  };

  forEach(args, (arg) => {
    if (arg.startsWith('plan=')) {
      const value = arg.substring('plan='.length);

      const plans = value.split(',').map((f) => f.trim());

      if (!isEmpty(plans)) {
        params.planIds = plans;
      }
    } else if (arg.startsWith('tool=')) {
      const value = arg.substring('tool='.length).trim();

      const tools = value.split(',').map((f) => f.trim());

      if (!isEmpty(tools)) {
        params.toolIds = tools;
      }
    } else if (arg.startsWith('repeat-run=')) {
      params.repeatRun = parseInt(arg.substring('repeat-run='.length), 10);
    } else if (arg.startsWith('repeat-step=')) {
      params.repeatStep = arg.substring('repeat-step='.length);
    } else if (arg.startsWith('prepare-only=')) {
      params.prepareOnly = arg.substring('prepare-only='.length) === 'true';
    }
  });

  if (!isNil(params.repeatRun)) {
    // Validation: cannot use plan/tool with repeat-run
    if (!isNil(params.planIds) || !isNil(params.toolIds)) {
      console.error('Error: Cannot use plan= or tool= with repeat-run=');
      process.exit(1);
    }
  } else {
    if (isNil(params.planIds)) {
      params.planIds = getAllTestPlans(params.plansDir);
    }

    if (isNil(params.toolIds)) {
      params.toolIds = ['plugin', 'cli'];
    }
  }

  return params;
}

class ExecutionContext {
  constructor() {
    const {
      planIds, toolIds, repeatRun, prepareOnly, plansDir,
    } = processParams(process.cwd());

    this.planIds = planIds;
    this.toolIds = toolIds;
    this.repeatRun = repeatRun;
    this.prepareOnly = prepareOnly;
    this.plansDir = plansDir;
    this.rootDir = __dirname;
    this.runRootDir = path.join(os.homedir(), 'claude-context-test-runs');

    if (!fs.existsSync(this.runRootDir)) {
      fs.mkdirSync(this.runRootDir, { recursive: true });
    }
  }
}

module.exports = ExecutionContext;
