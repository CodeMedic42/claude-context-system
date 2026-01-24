#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Sync version from root package.json to CLAUDE.TEMPLATE.md
 *
 * This ensures the template version matches the monorepo version
 * and is run before syncing to plugin and CLI.
 */

const ROOT_DIR = path.join(__dirname, '..');
const PACKAGE_JSON = path.join(ROOT_DIR, 'package.json');
const TEMPLATE_FILE = path.join(ROOT_DIR, 'shared', 'templates', 'CLAUDE.TEMPLATE.md');

function main() {
  console.log('Syncing version from package.json to CLAUDE.TEMPLATE.md...\n');

  // Read version from package.json
  const pkg = JSON.parse(fs.readFileSync(PACKAGE_JSON, 'utf8'));
  const { version } = pkg;

  if (!version) {
    console.error('Error: Could not read version from package.json');
    process.exit(1);
  }

  console.log(`Package version: ${version}`);

  // Read template file
  const templateContent = fs.readFileSync(TEMPLATE_FILE, 'utf8');

  // Replace the Template Version line in the Agent File Metadata section
  // Match pattern: "\t- Template Version: X.Y.Z" (with tab prefix)
  const versionLineRegex = /^(\t- Template Version: )[\d.]+$/m;

  if (!versionLineRegex.test(templateContent)) {
    console.error('Error: Could not find "Template Version:" line in CLAUDE.TEMPLATE.md');
    console.error('Expected format: "\\t- Template Version: X.Y.Z"');
    process.exit(1);
  }

  // Replace the version
  const updatedContent = templateContent.replace(
    versionLineRegex,
    `$1${version}`,
  );

  // Write back to file
  fs.writeFileSync(TEMPLATE_FILE, updatedContent, 'utf8');

  console.log(`✓ Updated CLAUDE.TEMPLATE.md to version ${version}\n`);
}

main();
