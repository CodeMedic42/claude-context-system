const fs = require('fs-extra');
const path = require('path');
const os = require('os');

/**
 * Token Tracker - Tracks actual token usage from Claude CLI runs
 */
class TokenTracker {
  constructor() {
    this.tokens = {
      input: 0,
      output: 0,
      total: 0,
      perFixture: {}
    };
  }

  /**
   * Parse Claude CLI output for token usage
   * Claude CLI typically shows token usage at the end like:
   * "Token usage: 45,231 input, 23,456 output (68,687 total)"
   *
   * @param {string} output - CLI output
   * @returns {Object|null} - Parsed tokens or null
   */
  parseFromOutput(output) {
    // Pattern 1: "Token usage: X input, Y output (Z total)"
    const pattern1 = /Token usage:\s*([\d,]+)\s*input,\s*([\d,]+)\s*output\s*\(([\d,]+)\s*total\)/i;
    const match1 = output.match(pattern1);

    if (match1) {
      return {
        input: parseInt(match1[1].replace(/,/g, '')),
        output: parseInt(match1[2].replace(/,/g, '')),
        total: parseInt(match1[3].replace(/,/g, ''))
      };
    }

    // Pattern 2: "Input tokens: X | Output tokens: Y | Total: Z"
    const pattern2 = /Input tokens:\s*([\d,]+).*Output tokens:\s*([\d,]+).*Total:\s*([\d,]+)/is;
    const match2 = output.match(pattern2);

    if (match2) {
      return {
        input: parseInt(match2[1].replace(/,/g, '')),
        output: parseInt(match2[2].replace(/,/g, '')),
        total: parseInt(match2[3].replace(/,/g, ''))
      };
    }

    // Pattern 3: Just look for "input_tokens" and "output_tokens" (API response format)
    const inputMatch = output.match(/"input_tokens":\s*(\d+)/);
    const outputMatch = output.match(/"output_tokens":\s*(\d+)/);

    if (inputMatch && outputMatch) {
      const input = parseInt(inputMatch[1]);
      const output = parseInt(outputMatch[1]);
      return {
        input,
        output,
        total: input + output
      };
    }

    return null;
  }

  /**
   * Add tokens for a fixture
   * @param {string} fixtureName - Fixture name
   * @param {Object} tokens - Token counts
   */
  addFixtureTokens(fixtureName, tokens) {
    if (!tokens) return;

    this.tokens.perFixture[fixtureName] = tokens;
    this.tokens.input += tokens.input || 0;
    this.tokens.output += tokens.output || 0;
    this.tokens.total += tokens.total || 0;
  }

  /**
   * Get total tokens
   * @returns {Object} - Total token usage
   */
  getTotalTokens() {
    return {
      input: this.tokens.input,
      output: this.tokens.output,
      total: this.tokens.total,
      estimatedCost: this.calculateCost(this.tokens.total)
    };
  }

  /**
   * Get tokens for a specific fixture
   * @param {string} fixtureName - Fixture name
   * @returns {Object|null} - Token usage or null
   */
  getFixtureTokens(fixtureName) {
    return this.tokens.perFixture[fixtureName] || null;
  }

  /**
   * Calculate estimated cost based on tokens
   * Using Claude Sonnet pricing as baseline
   * @param {number} totalTokens - Total tokens
   * @returns {number} - Estimated cost in USD
   */
  calculateCost(totalTokens) {
    // Approximate pricing (adjust based on actual rates)
    const INPUT_COST_PER_1M = 3; // $3 per 1M input tokens
    const OUTPUT_COST_PER_1M = 15; // $15 per 1M output tokens

    // Assume 70% input, 30% output for estimation
    const estimatedInput = totalTokens * 0.7;
    const estimatedOutput = totalTokens * 0.3;

    const inputCost = (estimatedInput / 1000000) * INPUT_COST_PER_1M;
    const outputCost = (estimatedOutput / 1000000) * OUTPUT_COST_PER_1M;

    return inputCost + outputCost;
  }

  /**
   * Load historical token usage from past runs
   * @param {TestRunManager} manager - Test run manager
   * @returns {Object} - Statistics
   */
  getHistoricalStats(manager) {
    const list = manager.getTestRunList();
    const runsWithTokens = list.runs.filter(r => r.tokenUsage && r.tokenUsage.total);

    if (runsWithTokens.length === 0) {
      return {
        averagePerFixture: 70000, // Default estimate
        averagePerRun: 0,
        totalRuns: 0,
        averageCostPerFixture: null,
        hasActualCostData: false
      };
    }

    let totalTokens = 0;
    let totalFixtures = 0;
    let totalCost = 0;
    let runsWithCost = 0;

    runsWithTokens.forEach(run => {
      totalTokens += run.tokenUsage.total;
      totalFixtures += run.fixtures.length;

      // Track actual costs if available
      if (run.tokenUsage.actualCostUsd !== undefined) {
        totalCost += run.tokenUsage.actualCostUsd;
        runsWithCost++;
      }
    });

    const hasActualCostData = runsWithCost > 0;
    const averageCostPerFixture = hasActualCostData
      ? totalCost / totalFixtures
      : null;

    return {
      averagePerFixture: Math.round(totalTokens / totalFixtures),
      averagePerRun: Math.round(totalTokens / runsWithTokens.length),
      totalRuns: runsWithTokens.length,
      totalTokensUsed: totalTokens,
      averageCostPerFixture,
      hasActualCostData,
      totalCost
    };
  }

  /**
   * Get improved estimate based on historical data
   * @param {number} fixtureCount - Number of fixtures
   * @param {TestRunManager} manager - Test run manager
   * @returns {Object} - Estimation
   */
  getImprovedEstimate(fixtureCount, manager) {
    const stats = this.getHistoricalStats(manager);

    const estimatedTokens = stats.averagePerFixture * fixtureCount;

    // Use actual historical cost data if available, otherwise fall back to calculation
    let estimatedCost;
    let basedOn;

    if (stats.hasActualCostData && stats.averageCostPerFixture !== null) {
      // Use actual historical cost data (accounts for cache usage)
      estimatedCost = stats.averageCostPerFixture * fixtureCount;
      basedOn = 'historical-actual-cost';
    } else if (stats.totalRuns > 0) {
      // Fall back to token-based calculation
      estimatedCost = this.calculateCost(estimatedTokens);
      basedOn = 'historical-tokens';
    } else {
      // No historical data at all
      estimatedCost = this.calculateCost(estimatedTokens);
      basedOn = 'default';
    }

    return {
      tokens: estimatedTokens,
      cost: estimatedCost,
      basedOn,
      historicalRuns: stats.totalRuns
    };
  }
}

module.exports = TokenTracker;
