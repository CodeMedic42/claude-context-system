# Template Section Audit - Focus on LLM Productivity

## Audit Criteria

**Keep sections that help LLM:**
- ✅ Understand code organization and structure
- ✅ Know where to add/modify code
- ✅ Follow existing patterns and conventions
- ✅ Write tests correctly
- ✅ Configure and run the code
- ✅ Find relevant technical documentation
- ✅ Understand dependencies and relationships

**Remove/Reduce sections that:**
- ❌ Are primarily for human project management
- ❌ Don't influence coding decisions
- ❌ Are business/organizational metadata
- ❌ Don't help locate or modify code

---

## PROJECT.TEMPLATE.md Audit

| Section | Current Purpose | Keep/Remove/Modify | Rationale |
|---------|----------------|-------------------|-----------|
| **Project Overview** | High-level description | ✅ KEEP (LEAN) | Helps LLM understand project purpose when making changes |
| **Project Metadata** | Name, version, status, license | ⚠️ REDUCE | Keep name/path (for navigation), remove version/status/license |
| **Project Types & Technical Documentation** | Links to technical files | ✅ KEEP | Critical for finding detailed implementation docs |
| **Documentation Links** | README, CHANGELOG, docs | ✅ KEEP (LEAN) | Helps find additional context when needed |
| **Ownership & Team** | Team, maintainers, contacts | ❌ REMOVE | Doesn't help LLM write code |
| **Project Relationships** | Dependencies, used by | ✅ KEEP | Important for understanding impact of changes |
| **Environments** | URLs for prod/staging/dev | ⚠️ REDUCE | Keep dev URL only (for testing), remove prod/staging |
| **Restricted Actions** | What not to do | ✅ KEEP | Critical for safety constraints |

**Recommendation for PROJECT.TEMPLATE.md:**
- Remove "Ownership & Team" entirely
- Reduce "Project Metadata" to just name and path
- Reduce "Environments" to dev URL only (if detected)
- Keep everything else but make leaner

---

## SERVICE.TEMPLATE.md Audit

| Section | Current Purpose | Keep/Remove/Modify | Rationale |
|---------|----------------|-------------------|-----------|
| **Service Overview** | What the service does | ✅ KEEP (LEAN) | Context for changes |
| **Technologies** | Language, framework, dependencies | ✅ KEEP | Essential for knowing how to code |
| **API Endpoints** | Available routes/endpoints | ✅ KEEP | Critical for understanding API surface |
| **Endpoint Patterns** | How APIs are organized | ✅ KEEP | Shows LLM how to add new endpoints |
| **Authentication/Authorization** | How auth works | ✅ KEEP | Important for secure coding |
| **Error Handling Patterns** | How errors are handled | ✅ KEEP | Shows LLM how to handle errors correctly |
| **Data Validation** | How input is validated | ✅ KEEP | Shows LLM how to validate inputs |
| **Middleware/Request Pipeline** | Middleware order | ✅ KEEP | Important for understanding request flow |
| **Request/Response Conventions** | API patterns | ✅ KEEP | Shows LLM how to structure APIs |
| **Code Organization Patterns** | Architecture, layers | ✅ KEEP | Critical for knowing where to put code |
| **Database/Data Access Patterns** | How data is accessed | ✅ KEEP | Shows LLM how to query data |
| **Service Dependencies** | Internal services, external APIs, databases, queues | ✅ KEEP | Important for understanding integrations |
| **Service Communication** | How services talk | ✅ KEEP | Important for inter-service changes |
| **Logging Conventions** | What/how to log | ✅ KEEP | Shows LLM how to add logging |
| **Testing Patterns** | How to write tests | ✅ KEEP | Critical for adding tests |
| **Configuration/Environment Variables** | Env vars, config files | ✅ KEEP | Needed for running/configuring code |
| **Build and Deployment** | Build process, run locally, deployment | ⚠️ REDUCE | Keep build/run locally, reduce deployment details |
| **Documentation** | Links to docs | ✅ KEEP (LEAN) | Quick access to additional info |
| **Restricted Actions** | Safety constraints | ✅ KEEP | Critical for safety |

**Recommendation for SERVICE.TEMPLATE.md:**
- Keep almost everything (it's all relevant for coding)
- Reduce "Build and Deployment" - keep build/run locally, minimal deployment info
- All other sections directly help LLM write service code correctly

---

## CLIENT.TEMPLATE.md Audit

| Section | Current Purpose | Keep/Remove/Modify | Rationale |
|---------|----------------|-------------------|-----------|
| **Client Overview** | What the client does | ✅ KEEP (LEAN) | Context for changes |
| **Client Type** | Type, platform, target users | ⚠️ REDUCE | Keep type/platform, remove target users |
| **Technologies** | Language, framework, dependencies | ✅ KEEP | Essential for knowing how to code |
| **UI Framework and Components** | Component library, styling | ✅ KEEP | Shows LLM how to build UI |
| **Navigation and Routing** | How navigation works | ✅ KEEP | Important for adding routes/screens |
| **State Management** | How state is managed | ✅ KEEP | Critical for understanding data flow |
| **API Integration** | How to call APIs | ✅ KEEP | Shows LLM how to fetch data |
| **Data Caching** | Caching strategy | ✅ KEEP | Important for performance patterns |
| **Authentication Flow** | How auth works | ✅ KEEP | Important for auth-aware features |
| **Protected Routes/Screens** | Access control | ✅ KEEP | Important for adding protected features |
| **Form Handling** | How forms work | ✅ KEEP | Shows LLM how to handle user input |
| **Input Patterns** | Validation, errors | ✅ KEEP | Shows LLM how to validate inputs |
| **Build and Development** | Dev setup, build process, env config | ✅ KEEP | Needed to run/build code |
| **Testing Patterns** | How to test | ✅ KEEP | Critical for adding tests |
| **Error Handling and Logging** | Error boundaries, logging, analytics | ⚠️ REDUCE | Keep error handling, remove analytics |
| **Asset Management** | Assets, i18n | ✅ KEEP | Shows LLM how to use assets |
| **Performance Optimization** | Performance patterns | ✅ KEEP | Important for maintaining performance |
| **Accessibility** | A11y standards | ✅ KEEP | Important for inclusive code |
| **Deployment** | Build for prod, deployment process, releases | ⚠️ REDUCE | Keep build for prod, minimal deployment info |
| **Documentation** | Links to docs | ✅ KEEP (LEAN) | Quick access to additional info |
| **Restricted Actions** | Safety constraints | ✅ KEEP | Critical for safety |

**Recommendation for CLIENT.TEMPLATE.md:**
- Reduce "Client Type" - remove target users
- Reduce "Error Handling and Logging" - remove analytics details
- Reduce "Deployment" - keep build, minimal deployment info
- Keep everything else (helps LLM build UI correctly)

---

## LIBRARY.TEMPLATE.md Audit

| Section | Current Purpose | Keep/Remove/Modify | Rationale |
|---------|----------------|-------------------|-----------|
| **Template Usage Guidelines** | How to use template | ✅ KEEP | Meta-instructions for LLM |
| **Library Overview** | What the library does | ✅ KEEP | Essential context |
| **Library Type** | Type, scope, language | ⚠️ REDUCE | Keep type, remove scope (internal/public) |
| **Package Information** | Package name, version, registry | ⚠️ REDUCE | Keep package name only |
| **Core Functionality** | Features, public API | ✅ KEEP | Critical for understanding what's available |
| **Generated/Registered APIs** | Auto-generated routes/services | ✅ KEEP | Important for understanding side effects |
| **API Reference** | Detailed function/class docs | ✅ KEEP | Shows LLM how to use the library |
| **Usage Examples** | How to use | ✅ KEEP | Critical for using library correctly |
| **Architecture and Design** | Design principles, code org, dependencies | ✅ KEEP | Shows LLM how library is structured |
| **Internal Code Patterns** | File structure, code style, implementation examples | ✅ KEEP | Shows LLM how to add to library |
| **Adding New Code** | Step-by-step guide | ✅ KEEP | Critical for contributing to library |
| **Testing Patterns** | How tests are structured | ✅ KEEP | Shows LLM how to test |
| **Configuration** | Config options, env vars | ✅ KEEP | Needed for using/configuring library |
| **Integration Points** | What it modifies/extends | ✅ KEEP | Important for understanding impact |
| **Type Safety** | TypeScript support | ✅ KEEP | Important for type-safe usage |
| **Testing** | Testing approach, running tests | ✅ KEEP | Shows LLM how to test |
| **Building and Development** | Dev setup, build process | ✅ KEEP | Needed to work with library |
| **Documentation** | API docs location | ✅ KEEP (LEAN) | Quick access to docs |
| **Compatibility** | Platform support, framework integration | ⚠️ REDUCE | Keep if affects usage patterns |
| **Performance Considerations** | Performance characteristics | ⚠️ CONDITIONAL | Keep if library is performance-critical |
| **Security** | Security considerations | ✅ KEEP | Important for secure usage |
| **Maintenance Status** | Actively maintained, deprecated, etc. | ❌ REMOVE | Doesn't help LLM code |
| **Restricted Actions** | Safety constraints | ✅ KEEP | Critical for safety |

**Recommendation for LIBRARY.TEMPLATE.md:**
- Remove "Maintenance Status"
- Reduce "Library Type" - remove scope
- Reduce "Package Information" - keep name only
- Reduce "Compatibility" - only if affects coding patterns
- Make "Performance Considerations" conditional (only for performance-critical libs)
- Keep everything else (helps LLM use and extend library)

---

## DATABASE.TEMPLATE.md Audit

| Section | Current Purpose | Keep/Remove/Modify | Rationale |
|---------|----------------|-------------------|-----------|
| **Database Overview** | What database stores | ✅ KEEP (LEAN) | Context for data-related changes |
| **Database Type and Technology** | DB type, system, version, hosting | ⚠️ REDUCE | Keep type/system, remove version/hosting |
| **Connection Information** | How to connect, env vars, pooling | ✅ KEEP | Needed to connect from code |
| **Schema Design** | Schema organization, design patterns | ✅ KEEP | Critical for understanding data structure |
| **Tables/Collections** | Table structure, columns, indexes, relationships | ✅ KEEP | Essential for querying/modifying data |
| **Relationships and Constraints** | Entity relationships, referential integrity | ✅ KEEP | Important for maintaining data integrity |
| **Indexes and Performance** | Indexing strategy, query performance | ✅ KEEP | Important when adding queries |
| **Data Access Patterns** | Common queries, ORM usage | ✅ KEEP | Shows LLM how to query correctly |
| **Data Migrations** | Migration strategy, running migrations, guidelines | ✅ KEEP | Shows LLM how to change schema |
| **Seeding and Test Data** | How to seed data, test fixtures | ✅ KEEP | Helps with testing |
| **Backup and Recovery** | Backup strategy, recovery process, PITR | ❌ REMOVE | Operational, doesn't help LLM code |
| **Security and Access Control** | Auth, authorization, encryption, sensitive data | ⚠️ REDUCE | Keep sensitive data identification, reduce operational details |
| **Data Integrity and Validation** | Constraints, validation rules | ✅ KEEP | Important for data quality |
| **Stored Procedures/Functions/Triggers** | Database logic | ✅ KEEP | Important if database has logic |
| **Monitoring and Maintenance** | Monitoring tools, metrics, regular maintenance | ❌ REMOVE | Operational, doesn't help LLM code |
| **Scaling and Performance** | Scaling strategy, performance tuning | ❌ REMOVE | Operational |
| **Data Lifecycle** | Retention, archival, purging | ❌ REMOVE | Operational/compliance |
| **Environment-Specific Configuration** | Dev/staging/prod configs | ❌ REMOVE | Operational |
| **Troubleshooting** | Common issues, debugging queries | ⚠️ REDUCE | Keep debugging query patterns, remove operational issues |
| **Documentation and Resources** | Schema docs, ER diagrams | ✅ KEEP (LEAN) | Links to additional info |
| **Restricted Actions** | Safety constraints | ✅ KEEP | Critical for safety |

**Recommendation for DATABASE.TEMPLATE.md:**
**Remove entirely:**
- Backup and Recovery (operational)
- Monitoring and Maintenance (operational)
- Scaling and Performance (operational)
- Data Lifecycle (operational/compliance)
- Environment-Specific Configuration (operational)

**Reduce significantly:**
- Database Type and Technology: Keep type/system only
- Security and Access Control: Keep sensitive data identification, remove auth/authz/encryption details
- Troubleshooting: Keep query debugging patterns only

**Keep (helps LLM work with data):**
- Connection Information
- Schema Design
- Tables/Collections (most important!)
- Relationships
- Indexes
- Data Access Patterns
- Migrations
- Seeding/Test Data
- Data Integrity/Validation
- Stored Procedures/Functions/Triggers
- Documentation links
- Restricted Actions

---

## IAC.TEMPLATE.md Audit

| Section | Current Purpose | Keep/Remove/Modify | Rationale |
|---------|----------------|-------------------|-----------|
| **Infrastructure Overview** | What infrastructure this manages | ✅ KEEP (LEAN) | Context for changes |
| **Infrastructure Provider** | Platform, tool, versions | ⚠️ REDUCE | Keep platform/tool, remove versions |
| **Technologies** | Language, tools, dependencies | ✅ KEEP | Needed to write IaC |
| **Resource Definitions** | How resources are organized | ✅ KEEP | Shows LLM where to add resources |
| **Core Resources** | What resources are defined | ✅ KEEP | Critical for understanding infrastructure |
| **Resource Dependencies** | How resources depend on each other | ✅ KEEP | Important for change impact |
| **State Management** | How state is managed | ✅ KEEP | Essential for IaC workflow |
| **Variables and Configuration** | Variable organization, config values | ✅ KEEP | Shows LLM how to configure |
| **Modules and Reusability** | Module organization, available modules | ✅ KEEP | Shows LLM how to reuse code |
| **Environment Management** | How environments are managed | ✅ KEEP | Important for multi-env setups |
| **Deployment Patterns** | Deployment process, CI/CD | ⚠️ REDUCE | Keep workflow basics, remove CI/CD details |
| **Initialization and Setup** | Prerequisites, setup commands | ✅ KEEP | Helps LLM understand how to work with code |
| **Security Patterns** | Security practices in IaC | ✅ KEEP | Shows LLM how to write secure IaC |
| **Compliance Requirements** | Compliance frameworks, policy enforcement | ❌ REMOVE | Operational/compliance |
| **Cost Management** | Cost tracking, budget alerts, optimization | ❌ REMOVE | Business/operational |
| **Monitoring and Observability** | Monitoring tools, metrics, alerting | ❌ REMOVE | Operational |
| **Disaster Recovery** | Backup, recovery, HA, RTO/RPO | ❌ REMOVE | Operational |
| **Testing and Validation** | How to test IaC, pre-deployment checks | ✅ KEEP | Shows LLM how to validate changes |
| **Documentation** | Architecture diagrams, runbooks | ✅ KEEP (LEAN) | Links to additional info |
| **Troubleshooting** | Common errors, debug commands | ⚠️ REDUCE | Keep common IaC errors only |
| **Maintenance** | Update process, lifecycle | ⚠️ REDUCE | Keep resource lifecycle basics only |
| **Restricted Actions** | Safety constraints | ✅ KEEP | Critical for safety |

**Recommendation for IAC.TEMPLATE.md:**
**Remove entirely:**
- Compliance Requirements (operational/compliance)
- Cost Management (business/operational)
- Monitoring and Observability (operational)
- Disaster Recovery (operational)

**Reduce significantly:**
- Infrastructure Provider: Keep platform/tool only
- Deployment Patterns: Keep workflow basics, remove CI/CD
- Troubleshooting: Keep common IaC code errors only
- Maintenance: Keep resource lifecycle basics only

**Keep (helps LLM work with IaC):**
- Infrastructure Overview
- Technologies
- Resource Definitions
- Resource Dependencies
- State Management
- Variables and Configuration
- Modules
- Environment Management
- Initialization and Setup
- Security Patterns
- Testing and Validation
- Documentation links
- Restricted Actions

---

## CLAUDE.TEMPLATE.md Audit

| Section | Current Purpose | Keep/Remove/Modify | Rationale |
|---------|----------------|-------------------|-----------|
| **Repository Overview** | What repo contains | ✅ KEEP | High-level context |
| **High-Level Repository Information** | Project types, languages, frameworks | ✅ KEEP | Essential tech context |
| **Repository Structure** | Directory tree | ✅ KEEP | Critical for navigation |
| **Code Organization Patterns** | Architecture, naming conventions | ✅ KEEP | Shows LLM how code is organized |
| **Projects** | List of all PROJECT.CLAUDE.md files | ✅ KEEP | Navigation to project docs |
| **Services and APIs** | List of services | ✅ KEEP | Quick access to service docs |
| **User Interaction Clients** | List of clients | ✅ KEEP | Quick access to client docs |
| **Libraries and Plugins** | List of libraries | ✅ KEEP | Quick access to library docs |
| **Databases** | List of databases | ✅ KEEP | Quick access to database docs |
| **Infrastructure as Code** | List of IAC | ✅ KEEP | Quick access to IAC docs |
| **Environment Setup** | Prerequisites, system config, external deps | ✅ KEEP | Needed to run code locally |
| **Running the Application Locally** | Setup commands, URLs | ✅ KEEP | Needed to test changes |
| **Repository Verification** | Tests, linting | ✅ KEEP | Shows LLM how to verify changes |
| **Documentation** | Links to docs | ✅ KEEP (LEAN) | Quick access to docs |
| **Restricted Actions** | Safety constraints | ✅ KEEP | Critical for safety |

**Recommendation for CLAUDE.TEMPLATE.md:**
- Keep all sections (all help LLM navigate and work in repo)
- All sections are lean and focused on helping LLM work effectively

---

## Summary of Recommended Changes

### PROJECT.TEMPLATE.md (Most Changes Needed)
**Remove:**
- ❌ Ownership & Team (entire section)
- ❌ Project Metadata: version, status, license

**Reduce:**
- ⚠️ Project Metadata: Keep only name and path
- ⚠️ Environments: Keep only dev URL (if detected), remove prod/staging

**Keep:**
- ✅ Project Overview (lean)
- ✅ Project Types & Technical Documentation
- ✅ Documentation Links (lean)
- ✅ Project Relationships
- ✅ Restricted Actions

### SERVICE.TEMPLATE.md (Minimal Changes)
**Reduce:**
- ⚠️ Build and Deployment: Keep build/run locally, minimal deployment

**Keep everything else** - all sections help LLM write service code

### CLIENT.TEMPLATE.md (Minimal Changes)
**Reduce:**
- ⚠️ Client Type: Remove "target users"
- ⚠️ Error Handling: Remove analytics details
- ⚠️ Deployment: Keep build, minimal deployment

**Keep everything else** - all sections help LLM build UI

### LIBRARY.TEMPLATE.md (Few Changes)
**Remove:**
- ❌ Maintenance Status

**Reduce:**
- ⚠️ Library Type: Remove scope
- ⚠️ Package Information: Keep name only
- ⚠️ Compatibility: Only if affects usage
- ⚠️ Performance: Make conditional

**Keep everything else** - all sections help LLM use/extend library

### DATABASE.TEMPLATE.md (Significant Changes Needed)
**Remove entirely:**
- ❌ Backup and Recovery
- ❌ Monitoring and Maintenance
- ❌ Scaling and Performance
- ❌ Data Lifecycle
- ❌ Environment-Specific Configuration

**Reduce:**
- ⚠️ Database Type: Keep type/system only
- ⚠️ Security: Keep sensitive data identification only
- ⚠️ Troubleshooting: Keep query debugging only

**Keep:** Schema, tables, relationships, indexes, queries, migrations, testing

### IAC.TEMPLATE.md (Significant Changes Needed)
**Remove entirely:**
- ❌ Compliance Requirements
- ❌ Cost Management
- ❌ Monitoring and Observability
- ❌ Disaster Recovery

**Reduce:**
- ⚠️ Provider: Keep platform/tool only
- ⚠️ Deployment: Keep workflow basics only
- ⚠️ Troubleshooting: Keep IaC code errors only
- ⚠️ Maintenance: Keep lifecycle basics only

**Keep:** Resources, state, variables, modules, environments, security patterns, testing

### CLAUDE.TEMPLATE.md (No Changes)
- ✅ Keep all sections - all are lean and focused

---

## Impact Summary

### High Impact (Most Operational Content)
1. **DATABASE.TEMPLATE.md** - Remove 5 entire sections (~100 lines)
2. **IAC.TEMPLATE.md** - Remove 4 entire sections (~80 lines)
3. **PROJECT.TEMPLATE.md** - Remove 1 section + reduce metadata

### Medium Impact
4. **LIBRARY.TEMPLATE.md** - Remove 1 section, minor reductions

### Low Impact (Already Code-Focused)
5. **SERVICE.TEMPLATE.md** - Minor reductions only
6. **CLIENT.TEMPLATE.md** - Minor reductions only

**Total estimated reduction: ~300-400 lines of operational content across all templates**

---

## Next Steps

1. ✅ Complete audit of all templates
2. Implement changes to PROJECT.TEMPLATE.md (high impact, quick win)
3. Implement changes to DATABASE.TEMPLATE.md (high impact, removes most operational content)
4. Implement changes to IAC.TEMPLATE.md (high impact, removes operational content)
5. Implement changes to LIBRARY.TEMPLATE.md (medium impact)
6. Implement minimal changes to SERVICE/CLIENT templates (low impact)
7. Update ctx-execute.md instructions to match new structure
8. Test with real repositories to validate improvements
