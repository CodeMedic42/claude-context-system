const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const fs = require('fs-extra');
const {
  forEach, isNil, reduce,
} = require('lodash');
const Plan = require('./plan');
const { getToolById } = require('./tools');
const Batch = require('./batch');

function getTrackerFile(executionContext) {
  const { runRootDir } = executionContext;

  return path.join(runRootDir, 'run-tracker.json');
}

function getLastRunNumber(trackerFile) {
  if (!fs.existsSync(trackerFile)) {
    return null;
  }

  const { lastRunNumber } = JSON.parse(fs.readFileSync(trackerFile, 'utf8'));

  return lastRunNumber;
}

function getNewRunNumber(executionContext) {
  const trackerFile = getTrackerFile(executionContext);

  let lastRunNumber = getLastRunNumber(trackerFile);

  if (isNil(lastRunNumber)) {
    lastRunNumber = 1;
  }

  const runNumber = !isNil(lastRunNumber) ? lastRunNumber + 1 : 1;

  fs.writeFileSync(trackerFile, JSON.stringify({
    lastRunNumber: runNumber,
  }, null, 2));

  return runNumber;
}

function LoadPlans(plansDir, planIds) {
  const plans = {};

  forEach(planIds, (planId) => {
    plans[planId] = new Plan({
      planDir: path.join(plansDir, planId),
      id: planId,
    });
  });

  return plans;
}

function LoadTools(toolIds) {
  const tools = {};
  let failed = false;

  forEach(toolIds, (toolId) => {
    const Tool = getToolById(toolId);

    const tool = new Tool({});

    if (!tool.isAvailable()) {
      console.log(`${tool.getName()} is not available. Please ensure the tool is properly installed.`);

      failed = failed || true;
    } else {
      tools[toolId] = new Tool({});
    }
  });

  if (failed) {
    throw new Error('Failed to load one or more tools');
  }

  return tools;
}

function getRunDir(runRootDir, runNumber) {
  return path.join(runRootDir, String(runNumber).padStart(3, '0'));
}

function loadRun(executionContext) {
  let { repeatRun } = executionContext;

  if (repeatRun <= 0) {
    const trackerFile = getTrackerFile(executionContext);

    const lastRunNumber = getLastRunNumber(trackerFile);

    if (isNil(lastRunNumber)) {
      throw new Error('Invalid run number to re-run');
    }

    repeatRun = lastRunNumber;
  }

  const runNumber = repeatRun;

  const runDir = getRunDir(executionContext.runRootDir, runNumber);

  const resultsFile = path.join(runDir, 'results.json');

  if (!fs.existsSync(resultsFile)) {
    console.error(`Error: Run ${runNumber} not found`);
    process.exit(1);
  }

  const existingResults = JSON.parse(fs.readFileSync(resultsFile, 'utf8'));

  const {
    planIds,
    toolIds,
  } = existingResults;

  console.log(`\n🔄 Repeating tests for run ${runNumber}`);
  console.log(`   Plans: ${planIds.join(', ')}`);
  console.log(`   Tools: ${toolIds.join(', ')}\n`);

  return {
    runNumber,
    planIds,
    toolIds,
    runDir,
    generationResults: {},
    testResults: {},
    rerun: true,
  };
}

function startRun(executionContext) {
  const {
    runRootDir,
    planIds,
    toolIds,
  } = executionContext;

  const runNumber = getNewRunNumber(executionContext);

  const runDir = getRunDir(runRootDir, runNumber);

  console.log(`\n🚀 Starting test run ${runNumber}`);
  console.log(`   Plans: ${planIds.join(', ')}`);
  console.log(`   Tools: ${toolIds.join(', ')}\n`);

  return {
    runNumber,
    planIds,
    toolIds,
    runDir,
    generationResults: {},
    testResults: [],
    rerun: false,
  };
}

async function forEachAsync(list, cb) {
  const innerCb = (acc, item) => Promise.resolve(acc).then((extend) => {
    if (extend === false) {
      return extend;
    }

    return cb(item);
  });

  const finalProm = reduce(list, innerCb, true);

  return finalProm;
}

class Run {
  constructor(executionContext) {
    const {
      runNumber,
      planIds,
      toolIds,
      runDir,
      generationResults,
      testResults,
      rerun,
    } = !isNil(executionContext.repeatRun)
      ? loadRun(executionContext)
      : startRun(executionContext);

    this.runNumber = runNumber;
    this.runDir = runDir;
    this.generationResults = generationResults;
    this.testResults = testResults;
    this.rerun = rerun;
    this.executionContext = executionContext;
    this.planIds = planIds;
    this.toolIds = toolIds;

    const tools = LoadTools(toolIds);
    const plans = LoadPlans(executionContext.plansDir, planIds);

    this.plans = plans;
    this.tools = tools;

    const batches = [];
    this.batches = batches;

    forEach(tools, (tool) => {
      forEach(plans, (plan) => {
        batches.push(new Batch({
          run: this,
          plan,
          tool,
        }));
      });
    });
  }

  async start() {
    let runSuccess = true;

    await forEachAsync(this.batches, async (batch) => {
      const success = await batch.execute();

      runSuccess = runSuccess && success;
    });

    // Write simplified results.json (batch-results.json has the detailed data)
    const resultsFile = path.join(this.runDir, 'results.json');
    const resultsData = {
      runNumber: this.runNumber,
      planIds: this.planIds,
      toolIds: this.toolIds,
    };

    fs.writeFileSync(resultsFile, JSON.stringify(resultsData, null, 2));

    // Print summary
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📊 Test Run ${this.runNumber} Complete`);
    console.log(`${'='.repeat(60)}`);
    console.log(`Status: ${runSuccess ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`Results saved to: ${resultsFile}`);

    return runSuccess;
  }
}

module.exports = Run;
