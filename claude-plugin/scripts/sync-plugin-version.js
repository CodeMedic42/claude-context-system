#!/usr/bin/env node

/**
 * Sync version from package.json to .claude-plugin/plugin.json
 *
 * This script runs automatically after `npm version` or `lerna version`
 * via the postversion hook in package.json
 */

const fs = require('fs');
const path = require('path');

// Read version from package.json
const packageJsonPath = path.join(__dirname, '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const newVersion = packageJson.version;

// Update .claude-plugin/plugin.json
const pluginJsonPath = path.join(__dirname, '../.claude-plugin/plugin.json');
const pluginJson = JSON.parse(fs.readFileSync(pluginJsonPath, 'utf8'));

const oldVersion = pluginJson.version;
pluginJson.version = newVersion;

fs.writeFileSync(pluginJsonPath, JSON.stringify(pluginJson, null, 2) + '\n', 'utf8');

console.log(`✓ Synced plugin version: ${oldVersion} → ${newVersion}`);
console.log(`  Updated: .claude-plugin/plugin.json`);
