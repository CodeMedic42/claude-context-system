const fs = require('fs');
const path = require('path');

/**
 * Synthetic Repository Generator
 *
 * Creates fake monorepos for testing large repo support
 *
 * @param {Object} options - Generation options
 * @param {number} options.projects - Number of projects to generate
 * @param {number} options.filesPerProject - Files per project
 * @param {string} options.output - Output directory path
 * @param {boolean} [options.withDependencies=true] - Generate dependencies between projects
 * @param {number} [options.seed] - Random seed for reproducibility
 * @param {string[]} [options.projectTypes] - Explicit project types array (e.g., ['LIBRARY', 'SERVICE', 'CLIENT'])
 *                                            If provided, must match options.projects length
 */

function ensureDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function generatePackageJson(projectName, type, dependencies = []) {
  const pkg = {
    name: `@test-monorepo/${projectName}`,
    version: '1.0.0',
    description: `Generated ${type} project: ${projectName}`,
    main: 'src/index.js',
    scripts: {
      test: 'jest',
      lint: 'eslint .',
      build: 'tsc',
    },
    dependencies: {},
    devDependencies: {
      jest: '^29.0.0',
      eslint: '^8.0.0',
      typescript: '^5.0.0',
    },
  };

  // Add internal dependencies
  dependencies.forEach((dep) => {
    pkg.dependencies[`@test-monorepo/${dep}`] = '*';
  });

  // Add external dependencies based on type
  if (type === 'SERVICE') {
    pkg.dependencies.express = '^4.18.0';
    pkg.dependencies.cors = '^2.8.5';
  } else if (type === 'CLIENT') {
    pkg.dependencies.react = '^18.0.0';
    pkg.dependencies['react-dom'] = '^18.0.0';
  } else if (type === 'LIBRARY') {
    pkg.dependencies.lodash = '^4.17.21';
  }

  return JSON.stringify(pkg, null, 2);
}

function generateReadme(projectName, type) {
  return `# ${projectName}

**Type:** ${type}

This is a synthetically generated project for testing purposes.

## Description

${projectName} is a ${type.toLowerCase()} component of the test monorepo.

## Installation

\`\`\`bash
npm install
\`\`\`

## Usage

\`\`\`javascript
const ${projectName.replace(/-/g, '')} = require('@test-monorepo/${projectName}');
\`\`\`

## Testing

\`\`\`bash
npm test
\`\`\`

## License

MIT
`;
}

function generateSourceFile(projectName, type, fileNumber) {
  const content = [];

  content.push(`/**`);
  content.push(` * ${projectName} - Source file ${fileNumber}`);
  content.push(` * Generated for testing purposes`);
  content.push(` * Type: ${type}`);
  content.push(` */`);
  content.push('');

  if (type === 'SERVICE') {
    content.push("const express = require('express');");
    content.push('');
    content.push(`function ${projectName.replace(/-/g, '')}Handler${fileNumber}(req, res) {`);
    content.push(`  res.json({ message: 'Response from ${projectName} file ${fileNumber}' });`);
    content.push('}');
    content.push('');
    content.push(`module.exports = { ${projectName.replace(/-/g, '')}Handler${fileNumber} };`);
  } else if (type === 'CLIENT') {
    content.push("import React from 'react';");
    content.push('');
    content.push(`export function Component${fileNumber}() {`);
    content.push('  return (');
    content.push(`    <div className="${projectName}-component-${fileNumber}">`);
    content.push(`      <h1>${projectName} Component ${fileNumber}</h1>`);
    content.push('    </div>');
    content.push('  );');
    content.push('}');
  } else if (type === 'LIBRARY') {
    content.push(`function utility${fileNumber}(input) {`);
    content.push(`  // Utility function ${fileNumber} from ${projectName}`);
    content.push('  return input.toString().toUpperCase();');
    content.push('}');
    content.push('');
    content.push(`module.exports = { utility${fileNumber} };`);
  }

  return content.join('\n');
}

function generateTestFile(projectName, fileNumber) {
  return `/**
 * Test file ${fileNumber} for ${projectName}
 */

describe('${projectName} - Test Suite ${fileNumber}', () => {
  test('should pass test ${fileNumber}', () => {
    expect(true).toBe(true);
  });

  test('should have correct project name', () => {
    expect('${projectName}').toBeTruthy();
  });
});
`;
}

function generateEslintConfig() {
  return JSON.stringify({
    env: {
      node: true,
      es2021: true,
      jest: true,
    },
    extends: ['eslint:recommended'],
    parserOptions: {
      ecmaVersion: 12,
      sourceType: 'module',
    },
    rules: {
      indent: ['error', 2],
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
    },
  }, null, 2);
}

function assignProjectTypes(projectCount) {
  const types = [];
  const typeOptions = ['SERVICE', 'CLIENT', 'LIBRARY', 'DATABASE'];

  // Ensure we have some of each type
  const minOfEach = Math.floor(projectCount * 0.15);

  for (let i = 0; i < minOfEach; i++) {
    types.push('LIBRARY'); // Libraries first
  }

  for (let i = 0; i < minOfEach; i++) {
    types.push('SERVICE');
  }

  for (let i = 0; i < minOfEach; i++) {
    types.push('CLIENT');
  }

  // Fill remaining with random types
  while (types.length < projectCount) {
    const randomType = typeOptions[Math.floor(Math.random() * typeOptions.length)];
    types.push(randomType);
  }

  return types;
}

function buildDependencyGraph(projectNames, types) {
  const graph = {};

  projectNames.forEach((name, index) => {
    graph[name] = {
      type: types[index],
      dependencies: [],
    };
  });

  // Libraries have no dependencies
  // Services depend on libraries
  // Clients depend on libraries and sometimes services

  const libraries = projectNames.filter((name, i) => types[i] === 'LIBRARY');

  projectNames.forEach((name, index) => {
    const type = types[index];

    if (type === 'SERVICE') {
      // Depend on 1-3 random libraries
      const depCount = Math.min(1 + Math.floor(Math.random() * 3), libraries.length);
      const deps = [];
      for (let i = 0; i < depCount; i++) {
        const randomLib = libraries[Math.floor(Math.random() * libraries.length)];
        if (!deps.includes(randomLib) && randomLib !== name) {
          deps.push(randomLib);
        }
      }
      graph[name].dependencies = deps;
    } else if (type === 'CLIENT') {
      // Depend on 2-4 random libraries
      const depCount = Math.min(2 + Math.floor(Math.random() * 3), libraries.length);
      const deps = [];
      for (let i = 0; i < depCount; i++) {
        const randomLib = libraries[Math.floor(Math.random() * libraries.length)];
        if (!deps.includes(randomLib) && randomLib !== name) {
          deps.push(randomLib);
        }
      }
      graph[name].dependencies = deps;
    }
  });

  return graph;
}

function generateRepository(options) {
  // Default options
  const opts = {
    withDependencies: true,
    seed: Date.now(),
    ...options,
  };

  // Validate projectTypes if provided
  if (opts.projectTypes) {
    if (!Array.isArray(opts.projectTypes)) {
      throw new Error('projectTypes must be an array');
    }
    if (opts.projectTypes.length !== opts.projects) {
      throw new Error(`projectTypes length (${opts.projectTypes.length}) must match projects count (${opts.projects})`);
    }
    const validTypes = ['SERVICE', 'CLIENT', 'LIBRARY', 'DATABASE'];
    opts.projectTypes.forEach((type) => {
      if (!validTypes.includes(type)) {
        throw new Error(`Invalid project type: ${type}. Must be one of: ${validTypes.join(', ')}`);
      }
    });
  }

  // Seed random for reproducibility
  Math.random = () => {
    opts.seed = (opts.seed * 9301 + 49297) % 233280;
    return opts.seed / 233280;
  };

  const repoPath = path.resolve(opts.output);
  ensureDirectory(repoPath);

  // Generate project names and types
  const projectNames = [];
  for (let i = 0; i < opts.projects; i++) {
    projectNames.push(`project-${String(i + 1).padStart(3, '0')}`);
  }

  // Use explicit types if provided, otherwise generate randomly
  const types = opts.projectTypes || assignProjectTypes(opts.projects);
  const dependencyGraph = opts.withDependencies
    ? buildDependencyGraph(projectNames, types)
    : {};

  // Create packages directory
  const packagesPath = path.join(repoPath, 'packages');
  ensureDirectory(packagesPath);

  // Generate each project
  projectNames.forEach((projectName, index) => {
    const projectPath = path.join(packagesPath, projectName);
    ensureDirectory(projectPath);

    const type = types[index];
    const dependencies = opts.withDependencies
      ? dependencyGraph[projectName].dependencies
      : [];

    // package.json
    fs.writeFileSync(
      path.join(projectPath, 'package.json'),
      generatePackageJson(projectName, type, dependencies),
    );

    // README.md
    fs.writeFileSync(
      path.join(projectPath, 'README.md'),
      generateReadme(projectName, type),
    );

    // .eslintrc.json
    fs.writeFileSync(
      path.join(projectPath, '.eslintrc.json'),
      generateEslintConfig(),
    );

    // src/ directory with source files
    const srcPath = path.join(projectPath, 'src');
    ensureDirectory(srcPath);

    for (let i = 1; i <= options.filesPerProject; i++) {
      const fileName = `file-${String(i).padStart(3, '0')}.js`;
      fs.writeFileSync(
        path.join(srcPath, fileName),
        generateSourceFile(projectName, type, i),
      );
    }

    // __tests__/ directory with test files
    const testsPath = path.join(projectPath, '__tests__');
    ensureDirectory(testsPath);

    const testCount = Math.max(1, Math.floor(options.filesPerProject / 5));
    for (let i = 1; i <= testCount; i++) {
      const fileName = `test-${String(i).padStart(3, '0')}.test.js`;
      fs.writeFileSync(
        path.join(testsPath, fileName),
        generateTestFile(projectName, i),
      );
    }
  });

  // Root package.json (monorepo root)
  const rootPkg = {
    name: 'test-monorepo',
    version: '1.0.0',
    private: true,
    description: 'Synthetically generated monorepo for testing',
    workspaces: ['packages/*'],
    scripts: {
      test: 'lerna run test',
      lint: 'lerna run lint',
      build: 'lerna run build',
    },
    devDependencies: {
      lerna: '^8.0.0',
    },
  };

  fs.writeFileSync(
    path.join(repoPath, 'package.json'),
    JSON.stringify(rootPkg, null, 2),
  );

  // lerna.json
  const lernaConfig = {
    version: 'independent',
    npmClient: 'npm',
    packages: ['packages/*'],
  };

  fs.writeFileSync(
    path.join(repoPath, 'lerna.json'),
    JSON.stringify(lernaConfig, null, 2),
  );

  // Root README
  const rootReadme = `# Test Monorepo

Synthetically generated monorepo for testing large repository support.

## Statistics

- **Projects:** ${options.projects}
- **Files per project:** ${options.filesPerProject}
- **Total files:** ${options.projects * (options.filesPerProject + 4)} (approx)
- **With dependencies:** ${options.withDependencies}
- **Generated:** ${new Date().toISOString()}

## Project Types

${types.reduce((acc, type) => {
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {})}

## Structure

\`\`\`
test-monorepo/
├── packages/
${projectNames.slice(0, 5).map((name) => `│   ├── ${name}/`).join('\n')}
│   └── ... (${options.projects} total)
├── package.json
└── lerna.json
\`\`\`

## Usage

This repository is for testing purposes only.
`;

  fs.writeFileSync(path.join(repoPath, 'README.md'), rootReadme);

  // .gitignore
  const gitignore = `node_modules/
dist/
build/
*.log
.DS_Store
`;

  fs.writeFileSync(path.join(repoPath, '.gitignore'), gitignore);

  console.log(`    ✓ Generated ${opts.projects} projects with ${opts.projects * opts.filesPerProject} files`);
}

module.exports = generateRepository;
