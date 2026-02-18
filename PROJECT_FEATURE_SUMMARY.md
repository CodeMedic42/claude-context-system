# PROJECT.TEMPLATE.md Feature - Phase 1 MVP Summary

## What Was Created

### 1. **PROJECT.TEMPLATE.md** (`shared/templates/PROJECT.TEMPLATE.md`)
New template file for project-level context that includes:

**Phase 1 MVP Sections (Auto-detected only):**
- ✅ Project Overview
- ✅ Project Metadata (name, version, status, license)
- ✅ Project Types (SERVICE, CLIENT, LIBRARY, DATABASE, IAC)
- ✅ Technical Documentation (links to type-specific CLAUDE files)
- ✅ Documentation Links (README, CHANGELOG, docs/)
- ✅ Ownership & Team (from CODEOWNERS, package.json)
- ✅ Project Relationships (depends on, used by, related)
- ✅ Environment URLs (from config files, code)
- ✅ Restricted Actions (user-fillable)

### 2. **Updated CLAUDE.TEMPLATE.md**
Added new "Projects" section after "Code Organization Patterns" that:
- Lists all PROJECT.CLAUDE.md files
- Maintains existing type-specific sections (Services, Clients, Libraries, etc.)
- Creates dual navigation: type-first AND project-first

### 3. **Implementation Guide** (`PROJECT_TEMPLATE_IMPLEMENTATION_GUIDE.md`)
Comprehensive guide for implementing in `ctx-execute.md` with:
- Template loading changes
- Metadata extraction functions
- PROJECT.CLAUDE.md generation logic
- CLAUDE.md update logic
- Multi-type project handling
- Testing checklist

## File Structure Example

```
repository/
├── CLAUDE.md
│   ├── [Projects Section]
│   │   ├── → project1/PROJECT.CLAUDE.md
│   │   ├── → project2/PROJECT.CLAUDE.md
│   │   └── → project3/PROJECT.CLAUDE.md
│   ├── [Services Section]
│   │   └── → project1/SERVICE.CLAUDE.md
│   ├── [Clients Section]
│   │   └── → project2/CLIENT.CLAUDE.md
│   └── [Libraries Section]
│       └── → project3/LIBRARY.CLAUDE.md
│
├── project1/ (SERVICE)
│   ├── PROJECT.CLAUDE.md → references SERVICE.CLAUDE.md
│   └── SERVICE.CLAUDE.md
│
├── project2/ (CLIENT + LIBRARY)
│   ├── PROJECT.CLAUDE.md → references CLIENT.CLAUDE.md + LIBRARY.CLAUDE.md
│   ├── CLIENT.CLAUDE.md
│   └── LIBRARY.CLAUDE.md
│
└── project3/ (LIBRARY)
    ├── PROJECT.CLAUDE.md → references LIBRARY.CLAUDE.md
    └── LIBRARY.CLAUDE.md
```

## Navigation Flows

### Type-First Navigation
```
"Show me all services in this repo"
→ Read CLAUDE.md
→ Go to "Services and APIs" section
→ See all SERVICE.CLAUDE.md files
```

### Project-First Navigation
```
"Tell me about the User Management project"
→ Read CLAUDE.md
→ Go to "Projects" section
→ Find User Management project
→ Read PROJECT.CLAUDE.md
→ See project metadata, docs, and links to technical files
```

### Complete Project Understanding
```
"What does the User Management project do?"
→ Read PROJECT.CLAUDE.md
→ See: overview, types, ownership, documentation, relationships
→ Drill into SERVICE.CLAUDE.md for technical details
```

## Key Decisions Documented

1. **ctx-prepare.md**: No changes needed (keep it lean)
2. **ctx-execute.md**: Implement metadata extraction and PROJECT file generation
3. **Scope**: Generate PROJECT.CLAUDE.md for ALL projects
4. **Fields**: Phase 1 MVP only (auto-detected fields)
5. **Backward Compatibility**: Not a concern (not rolled out yet)
6. **Auto vs Manual**: Everything auto-detected; if LLM can't fill accurately, don't include
7. **Update Frequency**: Update PROJECT.CLAUDE.md when project has changes
8. **Multi-Type Projects**: Same as current - create each technical file as needed

## Auto-Detection Strategy

### What Gets Auto-Detected

| Field | Source |
|-------|--------|
| Project Name | package.json, Cargo.toml, pom.xml, etc. |
| Version | Manifest files |
| Status | Git history + deprecation markers |
| License | Manifest files |
| Project Types | Existing detection logic (SERVICE, CLIENT, etc.) |
| README Link | File existence check |
| CHANGELOG Link | File existence check |
| Ownership | CODEOWNERS, package.json maintainers |
| Repository URL | package.json repository field |
| Issues URL | package.json bugs.url |
| Dependencies | Manifest files + cross-reference with other projects |
| Used By | Reverse dependency analysis |
| Environment URLs | .env.example, config files, README parsing |

### What's NOT in Phase 1 (Future Phases)

- Business purpose/context (requires manual input)
- Stakeholders (requires manual input)
- Success metrics (requires manual input)
- Monitoring dashboard links (requires manual input)
- Deployment process details (requires manual input)
- Compliance requirements (requires manual input)

## Next Steps

1. **Sync templates to packages:**
   ```bash
   pnpm run sync
   ```

2. **Implement ctx-execute.md changes:**
   - Follow implementation guide
   - Add metadata extraction functions
   - Add PROJECT.CLAUDE.md generation logic
   - Update CLAUDE.md population logic

3. **Test with sample repositories:**
   - Small monorepo (3-5 projects)
   - Medium monorepo (10-20 projects)
   - Single project repository
   - Multi-type projects

4. **Validate output:**
   - Check PROJECT.CLAUDE.md accuracy
   - Verify CLAUDE.md dual navigation
   - Test LLM comprehension with queries
   - Ensure documentation links work

5. **Iterate based on findings:**
   - Adjust auto-detection heuristics
   - Refine template sections
   - Improve metadata extraction

## Testing Queries for Validation

After implementation, test with these queries:

- "What projects are in this repository?"
- "Show me all services"
- "Tell me about the [project name] project"
- "What does [project name] depend on?"
- "Where is the documentation for [project name]?"
- "Who owns [project name]?"
- "What's the production URL for [project name]?"
- "What type of project is [project name]?"

## Benefits

### For LLMs
- Quick project discovery via Projects section
- Complete project context in one file (PROJECT.CLAUDE.md)
- Multiple navigation paths (type-first or project-first)
- Clear ownership and documentation links

### For Developers
- Single source for project metadata
- Easy onboarding (read PROJECT.CLAUDE.md first)
- Documentation hub per project
- Clear project relationships

### For Organizations
- Centralized project inventory
- Ownership tracking
- Documentation standardization
- Dependency visibility

## Files Modified/Created

- ✅ `shared/templates/PROJECT.TEMPLATE.md` (NEW)
- ✅ `shared/templates/CLAUDE.TEMPLATE.md` (UPDATED)
- ✅ `PROJECT_TEMPLATE_IMPLEMENTATION_GUIDE.md` (NEW - implementation reference)
- ✅ `PROJECT_FEATURE_SUMMARY.md` (NEW - this file)

## Ready for Implementation

All design work is complete. The implementation guide provides detailed code examples and logic for integrating into ctx-execute.md. Once implemented and synced, the system will automatically generate PROJECT.CLAUDE.md files for all detected projects.
