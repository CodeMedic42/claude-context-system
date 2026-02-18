# PROJECT.TEMPLATE.md Implementation Guide

This document outlines the implementation changes needed in `ctx-execute.md` to support the new PROJECT.TEMPLATE.md feature.

## Overview

The PROJECT.TEMPLATE.md feature adds project-level context files that sit alongside type-specific technical files (SERVICE, CLIENT, LIBRARY, DATABASE, IAC). This creates a dual navigation structure:

1. **CLAUDE.md**: References all PROJECT.CLAUDE.md files (Projects section) AND all type-specific files (Services, Clients, Libraries, etc. sections)
2. **PROJECT.CLAUDE.md**: Contains project metadata and references its own type-specific files

## Phase 1 MVP Scope

**Auto-detected fields only:**
- Project Identity & Metadata (from manifest files)
- Project Types (from existing detection logic)
- Technical Documentation (links to type-specific CLAUDE files)
- Documentation Links (README, CHANGELOG, docs/ directories)
- Ownership & Team (from CODEOWNERS, package.json)
- Project Relationships (dependency analysis)
- Environment URLs (from config files, code)

**Not in Phase 1:**
- Business context (requires manual input)
- Monitoring/observability links (requires manual input)
- Compliance/security requirements (requires manual input)

## Implementation Changes

### 1. Template Loading (Step 2.4)

**Current behavior:**
- Load CLAUDE.TEMPLATE.md upfront
- Load type-specific templates (SERVICE, CLIENT, etc.) on-demand

**New behavior:**
- Load CLAUDE.TEMPLATE.md upfront
- Load **PROJECT.TEMPLATE.md** upfront (new - needed for all projects)
- Load type-specific templates on-demand as before

**Code changes:**
```javascript
// Step 2.4: Load templates
const claudeTemplate = await loadTemplate('CLAUDE.TEMPLATE.md');
const projectTemplate = await loadTemplate('PROJECT.TEMPLATE.md'); // NEW

// Load type-specific templates on-demand
const templateCache = {};
function getTypeTemplate(type) {
  if (!templateCache[type]) {
    templateCache[type] = await loadTemplate(`${type}.TEMPLATE.md`);
  }
  return templateCache[type];
}
```

### 2. Project Processing Order (Step 2.5)

**Current behavior:**
- For each project, generate type-specific CLAUDE files (SERVICE.CLAUDE.md, etc.)

**New behavior:**
- For each project:
  1. Generate **PROJECT.CLAUDE.md** (new - always created)
  2. Generate type-specific CLAUDE files (SERVICE.CLAUDE.md, CLIENT.CLAUDE.md, etc.)

**Processing order:**
```
For each project:
  1. Extract project metadata
  2. Generate PROJECT.CLAUDE.md
  3. For each type in project.types:
       Generate {TYPE}.CLAUDE.md
```

### 3. Metadata Extraction (New Step 2.5a)

**New step: Extract project metadata before generation**

For each project, extract:

#### a) Project Identity
```javascript
function extractProjectIdentity(project) {
  // From manifest file (package.json, Cargo.toml, pom.xml, etc.)
  return {
    name: manifest.name || project.directory,
    version: manifest.version || 'unknown',
    description: manifest.description || '',
    license: manifest.license || 'unknown'
  };
}
```

#### b) Project Status
```javascript
function detectProjectStatus(project) {
  // Heuristics:
  // - Check for "deprecated" in README, package.json keywords
  // - Check commit activity (last commit > 6 months = maintenance)
  // - Check for active development (recent commits = active)
  // - Default: 'active'

  if (containsDeprecationMarkers(project)) return 'deprecated';
  if (hasRecentCommits(project, 30)) return 'active';
  if (hasRecentCommits(project, 180)) return 'stable';
  return 'maintenance';
}
```

#### c) Documentation Links
```javascript
function detectDocumentationLinks(project) {
  const docs = {};

  // Always check for README
  if (fileExists(project.path, 'README.md')) {
    docs.readme = './README.md';
  }

  // Check for CHANGELOG
  if (fileExists(project.path, 'CHANGELOG.md')) {
    docs.changelog = './CHANGELOG.md';
  }

  // Check for docs/ directory
  if (directoryExists(project.path, 'docs')) {
    docs.docsDirectory = './docs/';
  }

  // Parse README for additional links
  const readmeLinks = parseReadmeLinks(project.path);
  docs.additional = readmeLinks;

  return docs;
}
```

#### d) Ownership Information
```javascript
function extractOwnership(project) {
  const ownership = {};

  // Check CODEOWNERS file
  const codeowners = parseCodeowners(repoRoot, project.path);
  if (codeowners) {
    ownership.team = codeowners.team;
    ownership.maintainers = codeowners.owners;
  }

  // Check package.json maintainers/contributors
  if (manifest.maintainers) {
    ownership.maintainers = manifest.maintainers;
  }

  // Check for contact info
  if (manifest.bugs?.url) {
    ownership.issuesUrl = manifest.bugs.url;
  }
  if (manifest.repository?.url) {
    ownership.repositoryUrl = manifest.repository.url;
  }

  return ownership;
}
```

#### e) Project Relationships
```javascript
function analyzeProjectRelationships(project, allProjects) {
  const relationships = {
    dependsOn: [],
    usedBy: [],
    related: []
  };

  // Analyze dependencies in manifest
  const deps = getDependencies(project.manifest);

  // Match dependencies to other projects in repo
  for (const dep of deps) {
    const matchingProject = allProjects.find(p => p.name === dep);
    if (matchingProject) {
      relationships.dependsOn.push(matchingProject);
    }
  }

  // Find projects that depend on this one
  for (const otherProject of allProjects) {
    if (otherProject === project) continue;
    const otherDeps = getDependencies(otherProject.manifest);
    if (otherDeps.includes(project.name)) {
      relationships.usedBy.push(otherProject);
    }
  }

  // Detect related projects (same parent directory, similar naming)
  relationships.related = detectRelatedProjects(project, allProjects);

  return relationships;
}
```

#### f) Environment URLs
```javascript
function detectEnvironmentUrls(project) {
  const urls = {};

  // Check for .env.example, .env.sample
  const envFiles = findFiles(project.path, ['.env.example', '.env.sample']);
  for (const envFile of envFiles) {
    const parsed = parseEnvFile(envFile);
    if (parsed.PORT) {
      urls.development = `http://localhost:${parsed.PORT}`;
    }
  }

  // Parse config files (config.js, config.json, etc.)
  const configFiles = findFiles(project.path, ['config/*.js', 'config/*.json']);
  for (const configFile of configFiles) {
    const config = parseConfigFile(configFile);
    if (config.production?.url) urls.production = config.production.url;
    if (config.staging?.url) urls.staging = config.staging.url;
  }

  // Parse README for badge URLs or deployment links
  const readmeUrls = parseReadmeUrls(project.path);
  urls = { ...urls, ...readmeUrls };

  return urls;
}
```

### 4. PROJECT.CLAUDE.md Generation

```javascript
async function generateProjectFile(project, metadata, template) {
  let content = template;

  // Replace project identity placeholders
  content = replacePlaceholder(content, 'Project Name', metadata.name);
  content = replacePlaceholder(content, 'Project Path', metadata.path);
  content = replacePlaceholder(content, 'Version', metadata.version);
  content = replacePlaceholder(content, 'Status', metadata.status);
  content = replacePlaceholder(content, 'License', metadata.license);

  // Replace project types section
  const typesSection = generateTypesSection(project.types);
  content = replacePlaceholder(content, 'Project Types', typesSection);

  // Add technical documentation links
  const techDocsSection = generateTechnicalDocsSection(project.types, project.path);
  content = replaceSection(content, '## Technical Documentation', techDocsSection);

  // Add documentation links
  const docsSection = generateDocsLinksSection(metadata.documentation);
  content = replaceSection(content, '## Documentation Links', docsSection);

  // Add ownership section
  const ownershipSection = generateOwnershipSection(metadata.ownership);
  content = replaceSection(content, '## Ownership & Team', ownershipSection);

  // Add project relationships
  const relationshipsSection = generateRelationshipsSection(metadata.relationships);
  content = replaceSection(content, '## Project Relationships', relationshipsSection);

  // Add environment URLs (if any detected)
  if (Object.keys(metadata.urls).length > 0) {
    const urlsSection = generateUrlsSection(metadata.urls);
    content = replaceSection(content, '## Environments', urlsSection);
  } else {
    // Remove environments section if no URLs detected
    content = removeSection(content, '## Environments');
  }

  // Write to file
  const filePath = path.join(project.path, 'PROJECT.CLAUDE.md');
  await writeFile(filePath, content);

  return filePath;
}

function generateTechnicalDocsSection(types, projectPath) {
  const links = [];

  for (const type of types) {
    const label = TYPE_LABELS[type]; // e.g., 'Service Implementation', 'Client Implementation'
    links.push(`- **${label}**: @file ./${type}.CLAUDE.md`);
  }

  return links.join('\n');
}

function generateTypesSection(types) {
  const descriptions = {
    SERVICE: 'Backend API service',
    CLIENT: 'User-facing client application',
    LIBRARY: 'Shared library or reusable package',
    DATABASE: 'Database schema definitions and migrations',
    IAC: 'Infrastructure as Code configuration'
  };

  const lines = [];
  for (const type of types) {
    lines.push(`- **${type}**: ${descriptions[type]}`);
  }

  return lines.join('\n');
}
```

### 5. CLAUDE.md Updates (Step 2.6)

**Current behavior:**
- Add projects to type-specific sections (Services, Clients, Libraries, etc.)

**New behavior:**
- Add projects to **Projects section** (link to PROJECT.CLAUDE.md)
- Add projects to type-specific sections (link to SERVICE.CLAUDE.md, etc.)

```javascript
async function updateClaudeMd(claudeMdPath, projects) {
  let content = await readFile(claudeMdPath);

  // 1. Update Projects section (NEW)
  const projectsSection = generateProjectsSection(projects);
  content = updateSection(content, '## Projects', projectsSection);

  // 2. Update type-specific sections (EXISTING)
  const serviceProjects = projects.filter(p => p.types.includes('SERVICE'));
  if (serviceProjects.length > 0) {
    const servicesSection = generateServicesSection(serviceProjects);
    content = updateSection(content, '## Services and APIs', servicesSection);
  } else {
    content = removeSection(content, '## Services and APIs');
  }

  // Repeat for CLIENT, LIBRARY, DATABASE, IAC
  // ...

  await writeFile(claudeMdPath, content);
}

function generateProjectsSection(projects) {
  const lines = [];

  for (const project of projects) {
    const relativePath = getRelativePath(project.path, 'PROJECT.CLAUDE.md');
    lines.push(`- **${project.name}**: @file ${relativePath}`);
  }

  return lines.join('\n');
}

function generateServicesSection(projects) {
  const lines = [];

  for (const project of projects) {
    const relativePath = getRelativePath(project.path, 'SERVICE.CLAUDE.md');
    lines.push(`- **${project.name}**: @file ${relativePath}`);
  }

  return lines.join('\n');
}
```

### 6. Update Frequency Logic

**Rule:** Update PROJECT.CLAUDE.md whenever the project has changes

**Implementation:**
```javascript
function shouldUpdateProjectFile(project, lastGeneratedCommit) {
  // Check if project directory has changes since last generation
  const projectHasChanges = gitDiff(lastGeneratedCommit, 'HEAD', project.path);

  // Also check if manifest file changed (version bump, metadata update)
  const manifestChanged = gitDiff(lastGeneratedCommit, 'HEAD', project.manifestPath);

  return projectHasChanges || manifestChanged;
}
```

### 7. Multi-Type Project Handling

**Current behavior:** Already supported - project can have multiple types

**New behavior:** Same - generate PROJECT.CLAUDE.md once, then generate each type file

**Example:**
```
Project: "API Gateway"
Types: ["SERVICE", "LIBRARY"]

Generated files:
- ./api-gateway/PROJECT.CLAUDE.md
- ./api-gateway/SERVICE.CLAUDE.md
- ./api-gateway/LIBRARY.CLAUDE.md

PROJECT.CLAUDE.md references:
- **Service Implementation**: @file ./SERVICE.CLAUDE.md
- **Library Implementation**: @file ./LIBRARY.CLAUDE.md

CLAUDE.md includes:
- Projects section: "API Gateway" → ./api-gateway/PROJECT.CLAUDE.md
- Services section: "API Gateway" → ./api-gateway/SERVICE.CLAUDE.md
- Libraries section: "API Gateway" → ./api-gateway/LIBRARY.CLAUDE.md
```

## Testing Checklist

- [ ] PROJECT.TEMPLATE.md loads successfully
- [ ] PROJECT.CLAUDE.md generated for each project
- [ ] Project metadata extracted from manifest files
- [ ] Project types listed correctly
- [ ] Technical documentation links point to correct type files
- [ ] Documentation links detected (README, CHANGELOG)
- [ ] Ownership information extracted (CODEOWNERS, package.json)
- [ ] Project relationships analyzed correctly
- [ ] Environment URLs detected from config files
- [ ] CLAUDE.md Projects section populated
- [ ] CLAUDE.md type sections still populated (Services, Clients, etc.)
- [ ] Multi-type projects handled correctly
- [ ] Update frequency works (only regenerate when project changes)
- [ ] Sections with no data removed appropriately

## Backward Compatibility

No backward compatibility concerns - project not rolled out yet.

## Future Enhancements (Phase 2+)

- Business context (manual input or AI-assisted)
- Observability links (manual input)
- Compliance requirements (manual input)
- Auto-detect CI/CD status
- Parse architecture docs for more context
- Integration with issue trackers
- Team/ownership from git commits analysis

## Success Metrics

- PROJECT.CLAUDE.md provides enough context to understand project purpose
- LLM can navigate efficiently via both type-first and project-first paths
- Auto-detected fields are accurate (>90% accuracy)
- Documentation links are correct and reachable
- Project relationships are accurate
