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
const PLUGIN_SOURCE = path.join(__dirname, '..', 'claude-context-plugin');

function main() {
  console.log('Installing claude-context-updater plugin locally...\n');

  // Check if symlink already exists
  if (fs.existsSync(PLUGIN_SYMLINK)) {
    const stats = fs.lstatSync(PLUGIN_SYMLINK);
    if (stats.isSymbolicLink()) {
      const target = fs.readlinkSync(PLUGIN_SYMLINK);
      console.log('✓ Plugin symlink already exists:');
      console.log(`  Name: ${PLUGIN_NAME}`);
      console.log(`  Symlink: ${PLUGIN_SYMLINK}`);
      console.log(`  Target: ${target}`);
      console.log('\nNo action needed.');
      return;
    }
  }

  // Create marketplace plugins directory if it doesn't exist
  if (!fs.existsSync(LOCAL_MARKETPLACE_PLUGINS_DIR)) {
    fs.mkdirSync(LOCAL_MARKETPLACE_PLUGINS_DIR, { recursive: true });
  }

  // Create marketplace manifest directory
  const marketplaceManifestDir = path.join(LOCAL_MARKETPLACE_DIR, '.claude-plugin');
  if (!fs.existsSync(marketplaceManifestDir)) {
    fs.mkdirSync(marketplaceManifestDir, { recursive: true });
  }

  // Read version from plugin.json
  const pluginJsonPath = path.join(PLUGIN_SOURCE, '.claude-plugin', 'plugin.json');
  let pluginVersion;
  try {
    const pluginJson = JSON.parse(fs.readFileSync(pluginJsonPath, 'utf8'));
    pluginVersion = pluginJson.version;
    if (!pluginVersion) {
      throw new Error('Version field is missing in plugin.json');
    }
  } catch (error) {
    console.error(`\n✗ Failed to read plugin version from ${pluginJsonPath}`);
    console.error(`  Error: ${error.message}`);
    console.error('\nPlugin installation requires a valid .claude-plugin/plugin.json with a version field.');
    process.exit(1);
  }

  // Create marketplace.json
  const marketplaceJsonPath = path.join(marketplaceManifestDir, 'marketplace.json');
  const marketplaceJson = {
    $schema: 'https://anthropic.com/claude-code/marketplace.schema.json',
    name: 'local',
    description: 'Local development plugins',
    owner: {
      name: 'Local Development',
    },
    plugins: [
      {
        name: PLUGIN_NAME,
        description: 'Automated claude.md context file manager - create and update repository context documentation for AI assistants',
        version: pluginVersion,
        author: {
          name: 'Your Company',
        },
        source: `./plugins/${PLUGIN_NAME}`,
        category: 'productivity',
      },
    ],
  };
  fs.writeFileSync(marketplaceJsonPath, `${JSON.stringify(marketplaceJson, null, 2)}\n`, 'utf8');
  console.log(`✓ Created marketplace.json (version ${pluginVersion})`);

  // Create symlink
  try {
    fs.symlinkSync(PLUGIN_SOURCE, PLUGIN_SYMLINK);
    console.log('✓ Created plugin symlink');
    console.log(`  ${PLUGIN_SYMLINK} -> ${PLUGIN_SOURCE}`);
  } catch (error) {
    console.error('Error creating symlink:', error.message);
    process.exit(1);
  }

  // Register marketplace using Claude CLI
  console.log('\n✓ Registering marketplace with Claude Code...');
  try {
    execSync(`claude plugin marketplace add "${LOCAL_MARKETPLACE_DIR}"`, { stdio: 'inherit' });
  } catch (error) {
    // Marketplace might already exist, which is fine
    console.log('  (Marketplace may already be registered)');
  }

  // Install plugin using Claude CLI
  console.log('\n✓ Installing plugin...');
  try {
    execSync(`claude plugin install ${PLUGIN_NAME}@local`, { stdio: 'inherit' });
    console.log('\n✓ Plugin installed successfully!');
    console.log(`\nYou can now use: /${PLUGIN_NAME}`);
  } catch (error) {
    console.error('\n✗ Failed to install plugin. Try manually:');
    console.error(`  claude plugin install ${PLUGIN_NAME}@local`);
    process.exit(1);
  }
}

main();
