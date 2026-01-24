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
 * Copy templates
 */
function syncTemplates() {
  const sharedTemplatesDir = path.join(SHARED_DIR, 'templates');
  const cliTemplatesDir = path.join(CLI_DIR, 'templates');

  if (!fs.existsSync(cliTemplatesDir)) {
    fs.mkdirSync(cliTemplatesDir, { recursive: true });
  }

  const files = fs.readdirSync(sharedTemplatesDir).filter((f) => f.endsWith('.md') && f !== 'README.md');

  files.forEach((file) => {
    const sourcePath = path.join(sharedTemplatesDir, file);
    const destPath = path.join(cliTemplatesDir, file);

    fs.copyFileSync(sourcePath, destPath);
    console.log(`✓ Synced template: ${file}`);
  });
}

function main() {
  console.log('Syncing shared files to copilot-context-cli...\n');

  console.log('Commands:');
  syncCommands();

  console.log('\nTemplates:');
  syncTemplates();

  console.log('\n✓ CLI sync complete!');
  console.log('\nNote: Placeholders will be replaced at runtime by the CLI wrapper:');
  // eslint-disable-next-line no-template-curly-in-string
  console.log('  ${TEMPLATE_PATH} → <install-dir>/templates');
  // eslint-disable-next-line no-template-curly-in-string
  console.log('  ${RULES_PATH} → <install-dir>/rules');
}

main();
