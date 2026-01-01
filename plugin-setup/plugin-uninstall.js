#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

const PLUGIN_NAME = 'claude-context-updater';
const CLAUDE_DIR = path.join(os.homedir(), '.claude');
const PLUGINS_DIR = path.join(CLAUDE_DIR, 'plugins');
const LOCAL_MARKETPLACE_DIR = path.join(PLUGINS_DIR, 'local-marketplace');
const LOCAL_MARKETPLACE_PLUGINS_DIR = path.join(LOCAL_MARKETPLACE_DIR, 'plugins');
const PLUGIN_SYMLINK = path.join(LOCAL_MARKETPLACE_PLUGINS_DIR, PLUGIN_NAME);
const PLUGIN_SOURCE = path.join(__dirname, '..', 'claude-plugin');

function main() {
  console.log('Uninstalling claude-context-updater plugin...\n');

  // Uninstall plugin using Claude CLI
  console.log('✓ Uninstalling plugin from Claude Code...');
  try {
    execSync(`claude plugin uninstall ${PLUGIN_NAME}@local`, { stdio: 'inherit' });
  } catch (error) {
    console.log('  (Plugin may not be installed)');
  }

  // Check if symlink exists
  if (!fs.existsSync(PLUGIN_SYMLINK)) {
    console.log('\n✓ Plugin symlink does not exist.');
    console.log('\nCleanup complete.');
    return;
  }

  // Verify it's a symlink pointing to our plugin
  const stats = fs.lstatSync(PLUGIN_SYMLINK);
  if (!stats.isSymbolicLink()) {
    console.log('\n✗ Plugin path exists but is not a symlink:');
    console.log(`  Path: ${PLUGIN_SYMLINK}`);
    console.log('\nManual cleanup required.');
    return;
  }

  const target = fs.readlinkSync(PLUGIN_SYMLINK);
  if (target !== PLUGIN_SOURCE) {
    console.log('\n✗ Plugin symlink exists but points to a different location:');
    console.log(`  Symlink: ${PLUGIN_SYMLINK}`);
    console.log(`  Current target: ${target}`);
    console.log(`  Expected target: ${PLUGIN_SOURCE}`);
    console.log('\nThis script only uninstalls the local development version.');
    return;
  }

  // Remove symlink
  try {
    fs.unlinkSync(PLUGIN_SYMLINK);
    console.log('\n✓ Removed plugin symlink');
    console.log(`  ${PLUGIN_SYMLINK}`);
  } catch (error) {
    console.error('\nError removing symlink:', error.message);
    process.exit(1);
  }

  console.log('\n✓ Uninstall complete!');
}

main();
