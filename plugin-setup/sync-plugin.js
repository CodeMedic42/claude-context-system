const fs = require('fs');
const path = require('path');

/**
 * Sync shared files to plugin directory with placeholder replacement
 *
 * For the plugin, paths are resolved at sync time to relative paths
 * since the plugin is installed in a known location.
 */

const SHARED_DIR = path.join(__dirname, '..', 'shared');
const PLUGIN_DIR = path.join(__dirname, '..', 'claude-context-plugin');

/**
 * Replace placeholders in file content
 */
function replacePlaceholders(content, {
  templatePath,
}) {
  return content
    .replace(/\$\{TEMPLATE_PATH\}/g, templatePath)
    .replace(/\$\{RULES_PATH\}/g, '../rules');
}

/**
 * Copy and process commands
 */
function syncCommands(config) {
  const sharedCommandsDir = path.join(SHARED_DIR, 'commands');
  const pluginCommandsDir = path.join(PLUGIN_DIR, 'commands');

  if (!fs.existsSync(pluginCommandsDir)) {
    fs.mkdirSync(pluginCommandsDir, { recursive: true });
  }

  const files = fs.readdirSync(sharedCommandsDir).filter((f) => f.endsWith('.md') && f !== 'README.md');

  files.forEach((file) => {
    const sourcePath = path.join(sharedCommandsDir, file);
    const destPath = path.join(pluginCommandsDir, file);

    let content = fs.readFileSync(sourcePath, 'utf8');
    content = replacePlaceholders(content, config);

    fs.writeFileSync(destPath, content, 'utf8');
    console.log(`✓ Synced command: ${file}`);
  });
}

/**
 * Copy templates (no replacement needed)
 */
function syncTemplates() {
  const sharedTemplatesDir = path.join(SHARED_DIR, 'templates');
  const pluginTemplatesDir = path.join(PLUGIN_DIR, 'templates');

  if (!fs.existsSync(pluginTemplatesDir)) {
    fs.mkdirSync(pluginTemplatesDir, { recursive: true });
  }

  const files = fs.readdirSync(sharedTemplatesDir).filter((f) => f.endsWith('.md') && f !== 'README.md');

  files.forEach((file) => {
    const sourcePath = path.join(sharedTemplatesDir, file);
    const destPath = path.join(pluginTemplatesDir, file);

    fs.copyFileSync(sourcePath, destPath);
    console.log(`✓ Synced template: ${file}`);
  });
}

function main(config) {
  console.log('Syncing shared files to claude-context-plugin...\n');

  console.log('Commands:');
  syncCommands(config);

  console.log('\nTemplates:');
  syncTemplates();

  console.log('\n✓ Plugin sync complete!');
  console.log('\nPlaceholder replacements:');
  // eslint-disable-next-line no-template-curly-in-string
  console.log('  ${TEMPLATE_PATH} → ../templates');
  // eslint-disable-next-line no-template-curly-in-string
  console.log('  ${RULES_PATH} → ../rules');
}

module.exports = main;
