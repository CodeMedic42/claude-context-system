#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Sync shared files to copilot-context-cli directory
 *
 * For the CLI, placeholders are NOT replaced here - they will be
 * replaced at runtime when the CLI loads the commands.
 */

const SHARED_DIR = path.join(__dirname, '..', 'shared');
const CLI_DIR = path.join(__dirname, '..', 'copilot-context-cli');
const ROOT_DIR = path.join(__dirname, '..');

/**
 * Get version from package.json
 */
function getVersion() {
  const packageJsonPath = path.join(ROOT_DIR, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  return pkg.version;
}

/**
 * Copy commands (with placeholders intact)
 */
function syncCommands() {
  const sharedCommandsDir = path.join(SHARED_DIR, 'commands');
  const cliCommandsDir = path.join(CLI_DIR, 'commands');

  if (!fs.existsSync(cliCommandsDir)) {
    fs.mkdirSync(cliCommandsDir, { recursive: true });
  }

  const files = fs.readdirSync(sharedCommandsDir).filter((f) => f.endsWith('.md') && f !== 'README.md');

  files.forEach((file) => {
    const sourcePath = path.join(sharedCommandsDir, file);
    const destPath = path.join(cliCommandsDir, file);

    fs.copyFileSync(sourcePath, destPath);
    console.log(`✓ Synced command: ${file}`);
  });
}

/**
 * Copy templates with version replacement
 */
function syncTemplates() {
  const sharedTemplatesDir = path.join(SHARED_DIR, 'templates');
  const cliTemplatesDir = path.join(CLI_DIR, 'templates');

  if (!fs.existsSync(cliTemplatesDir)) {
    fs.mkdirSync(cliTemplatesDir, { recursive: true });
  }

  const version = getVersion();
  const files = fs.readdirSync(sharedTemplatesDir).filter((f) => f.endsWith('.md') && f !== 'README.md');

  files.forEach((file) => {
    const sourcePath = path.join(sharedTemplatesDir, file);
    const destPath = path.join(cliTemplatesDir, file);

    let content = fs.readFileSync(sourcePath, 'utf8');
    content = content.replace(/\$\{templateVersion\}/g, version);

    fs.writeFileSync(destPath, content, 'utf8');
    console.log(`✓ Synced template: ${file}`);
  });
}

function main() {
  console.log('Syncing shared files to copilot-context-cli...\n');

  const version = getVersion();

  console.log('Commands:');
  syncCommands();

  console.log('\nTemplates:');
  syncTemplates();

  console.log('\n✓ CLI sync complete!');
  console.log('\nTemplate placeholders replaced at sync time:');
  // eslint-disable-next-line no-template-curly-in-string
  console.log(`  \${templateVersion} → ${version}`);
  console.log('\nCommand placeholders will be replaced at runtime by the CLI wrapper:');
  // eslint-disable-next-line no-template-curly-in-string
  console.log('  ${TEMPLATE_PATH} → <install-dir>/templates');
  // eslint-disable-next-line no-template-curly-in-string
  console.log('  ${RULES_PATH} → <install-dir>/rules');
}

main();
