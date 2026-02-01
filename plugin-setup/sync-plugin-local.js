#!/usr/bin/env node

const path = require('path');
const sync = require('./sync-plugin');

const templatePath = path.join(__dirname, '..', 'claude-context-plugin/templates');

sync({
  templatePath,
});
