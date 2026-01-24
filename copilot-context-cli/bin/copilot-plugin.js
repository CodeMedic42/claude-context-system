#!/usr/bin/env node

const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Check if copilot is installed
function isCopilotInstalled() {
  try {
    execSync('copilot --version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

// Check if user is logged in to copilot
function isCopilotLoggedIn() {
  try {
    const result = execSync('copilot -p "echo test"', {
      stdio: 'pipe',
      encoding: 'utf8',
      timeout: 5000,
    });
    // If we get output without auth errors, user is logged in
    return true;
  } catch (error) {
    const output = error.stderr || error.stdout || '';
    // Check for common auth error messages
    if (output.includes('not logged in')
      || output.includes('authenticate')
      || output.includes('login')) {
      return false;
    }
    // If it's a different error, assume logged in (command might have failed for other reasons)
    return true;
  }
}

// Validate prerequisites
if (!isCopilotInstalled()) {
  console.error('Error: GitHub Copilot CLI is not installed.');
  console.error('\nPlease install it first:');
  console.error('  npm install -g @github/copilot');
  console.error('  or visit: https://docs.github.com/copilot/using-github-copilot/using-github-copilot-in-the-command-line');
  process.exit(1);
}

if (!isCopilotLoggedIn()) {
  console.error('Error: You are not logged in to GitHub Copilot.');
  console.error('\nPlease log in first:');
  console.error('  copilot');
  console.error('  Then run: /login');
  process.exit(1);
}

const command = process.argv[2];

if (!command) {
  console.error('Usage: copilot-plugin <command-name>');
  console.error('\nAvailable commands:');

  const commandsDir = path.join(__dirname, '..', 'commands');
  const files = fs.readdirSync(commandsDir);

  files
    .filter((f) => f.endsWith('.md'))
    .forEach((f) => console.error(`  - ${f.replace('.md', '')}`));

  process.exit(1);
}

const commandPath = path.join(__dirname, '..', 'commands', `${command}.md`);

if (!fs.existsSync(commandPath)) {
  console.error(`Error: Command '${command}' not found.`);
  console.error(`Expected file: ${commandPath}`);
  process.exit(1);
}

// Read the command file content and pass it as the prompt
// Note: 'execute <URL>' works with remote URLs, but not with local file paths
// So we read the content and pass it directly
let commandContent = fs.readFileSync(commandPath, 'utf8');

// Replace placeholders with absolute paths to installed templates/rules
// This ensures templates can be found regardless of where the CLI is run from
const templatesPath = path.join(__dirname, '..', 'templates');
const rulesPath = path.join(__dirname, '..', 'rules');
commandContent = commandContent
  .replace(/\$\{TEMPLATE_PATH\}/g, templatesPath)
  .replace(/\$\{RULES_PATH\}/g, rulesPath);

const copilotArgs = [
  '-p', commandContent,
  '--allow-all-tools', // Allow tools without confirmation for automated execution
  '--allow-all-paths', // Allow file access without configuration
];

const copilot = spawn('copilot', copilotArgs, {
  stdio: 'inherit',
  // Don't use shell: true as it tries to interpret markdown content as shell commands
});

copilot.on('error', (err) => {
  console.error('Error: Could not execute copilot. Is it installed?');
  console.error(err.message);
  process.exit(1);
});

copilot.on('exit', (code) => {
  process.exit(code);
});
