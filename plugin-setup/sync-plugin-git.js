#!/usr/bin/env node

const sync = require('./sync-plugin');

sync({
  templatePath: 'https://raw.githubusercontent.com/CodeMedic42/claude-context-system/main/shared/templates',
});
