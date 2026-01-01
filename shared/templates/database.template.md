# Database Context: {Database Name}

## Database Overview
{Provide a clear description of what this database stores, its primary purpose, and its role in the system}

## Database Type and Technology
- **Database Type**: {e.g., "Relational (SQL)", "Document", "Key-Value", "Graph", "Time-series"}
- **Database System**: {e.g., "PostgreSQL", "MongoDB", "Redis", "Cassandra", "Neo4j"}
- **Version**: {Version number}
- **Hosting**: {e.g., "Self-hosted", "AWS RDS", "MongoDB Atlas", "Azure SQL"}

## Connection Information

### Connection Details
{How to connect to this database}
- **Connection string format**: {Format of connection string}
- **Default port**: {Default port number}
- **Authentication method**: {e.g., "Username/password", "IAM", "Certificate-based"}

### Environment Variables
{Environment variables used for connection}
- `{DB_HOST}`: {Database host}
- `{DB_PORT}`: {Database port}
- `{DB_NAME}`: {Database name}
- `{DB_USER}`: {Database user}
- `{DB_PASSWORD}`: {Database password (reference, not actual value)}

### Connection Pooling
{If applicable, describe connection pooling}
- **Pool configuration**: {Pool size, timeout settings}
- **Pool implementation**: {Library or mechanism used}

## Schema Design

### Schema Overview
{High-level overview of the database schema design}
- **Schema organization**: {How schema is organized - schemas, namespaces, collections}
- **Design patterns**: {e.g., "Normalized", "Denormalized", "Star schema"}
- **Key design decisions**: {Important architectural decisions}

## Tables/Collections

{For each major table or collection, document its structure}

### {Table/Collection Name 1}
{Description of what this table/collection stores}

**Columns/Fields:**
| Column/Field | Type | Constraints | Description |
|-------------|------|-------------|-------------|
| {column_name} | {data_type} | {e.g., PK, FK, NOT NULL, UNIQUE} | {Description} |
| {column_name} | {data_type} | {constraints} | {Description} |

**Indexes:**
- {index_name}: {columns} - {Purpose}

**Relationships:**
- {Relationship description - e.g., "Foreign key to users.id"}

---

### {Table/Collection Name 2}
{Description of what this table/collection stores}

**Columns/Fields:**
| Column/Field | Type | Constraints | Description |
|-------------|------|-------------|-------------|
| {column_name} | {data_type} | {constraints} | {Description} |

**Indexes:**
- {index_name}: {columns} - {Purpose}

**Relationships:**
- {Relationship description}

---

{Repeat for each major table/collection}

## Relationships and Constraints

### Entity Relationships
{Describe key relationships between tables/collections}
- **{Entity 1} → {Entity 2}**: {Relationship type and description}
- **{Entity 2} → {Entity 3}**: {Relationship type and description}

### Referential Integrity
{Describe how referential integrity is maintained}
- **Foreign keys**: {How foreign keys are used}
- **Cascade rules**: {ON DELETE, ON UPDATE behavior}
- **Constraint enforcement**: {How constraints are enforced}

## Indexes and Performance

### Indexing Strategy
{Describe the indexing approach}
- **Primary indexes**: {List primary indexes}
- **Secondary indexes**: {List secondary indexes and their purposes}
- **Composite indexes**: {List composite indexes}
- **Full-text indexes**: {If applicable}

### Query Performance
{Describe performance considerations}
- **Optimization patterns**: {Common optimization techniques used}
- **Slow query monitoring**: {How slow queries are identified}
- **Query patterns to avoid**: {Known problematic query patterns}

## Data Access Patterns

### Common Queries
{Document common query patterns}

**Query Pattern 1: {Name}**
```sql
{Example query}
```
- **Purpose**: {What this query does}
- **Performance**: {Expected performance characteristics}
- **Usage**: {When/where this query is used}

**Query Pattern 2: {Name}**
```sql
{Example query}
```
- **Purpose**: {What this query does}
- **Performance**: {Expected performance characteristics}

### ORM/Query Builder
{If applicable, describe ORM or query builder usage}
- **ORM/Tool**: {e.g., "Sequelize", "TypeORM", "Mongoose", "Dapper"}
- **Entity models**: {Where entity models are defined}
- **Query conventions**: {Conventions for writing queries}

## Data Migrations

### Migration Strategy
{Describe how database migrations are managed}
- **Migration tool**: {e.g., "Flyway", "Liquibase", "Alembic", "Sequelize migrations"}
- **Migration location**: {Where migration files are stored}
- **Migration naming**: {Naming convention for migrations}

### Running Migrations
{How to run migrations}
- **Apply migrations**: {Command to apply migrations}
- **Rollback migrations**: {Command to rollback if needed}
- **Migration status**: {Command to check migration status}

### Migration Guidelines
{Guidelines for creating migrations}
- {Guideline 1}
- {Guideline 2}

## Seeding and Test Data

### Data Seeding
{How to seed initial data}
- **Seed scripts**: {Where seed scripts are located}
- **Seed command**: {Command to run seeds}
- **Seed data**: {What data is seeded}

### Test Data
{How test data is managed}
- **Test fixtures**: {Where test fixtures are located}
- **Test data generation**: {How test data is generated}
- **Test database**: {Separate test database strategy}

## Backup and Recovery

### Backup Strategy
{Describe backup approach}
- **Backup frequency**: {How often backups occur}
- **Backup method**: {e.g., "Automated snapshots", "pg_dump", "mongodump"}
- **Backup location**: {Where backups are stored}
- **Retention policy**: {How long backups are kept}

### Recovery Process
{Steps to recover from backup}
1. {Step 1}
2. {Step 2}
3. {Step 3}

### Point-in-Time Recovery
{If applicable, describe PITR capabilities}
- **PITR availability**: {Whether PITR is available}
- **Recovery granularity**: {How precise recovery can be}

## Security and Access Control

### Authentication
{How users authenticate to the database}
- **Authentication method**: {e.g., "Password", "Certificate", "IAM"}
- **User management**: {How database users are managed}

### Authorization
{How permissions are managed}
- **Role-based access**: {If roles are used}
- **Permissions model**: {How permissions are structured}
- **Least privilege**: {How least privilege is enforced}

### Data Encryption
{Describe encryption approach}
- **Encryption at rest**: {Whether/how data is encrypted at rest}
- **Encryption in transit**: {SSL/TLS configuration}
- **Encrypted columns**: {If specific columns are encrypted}

### Sensitive Data
{Define sensitive data in this database}
- **PII fields**: {List fields containing personal information}
- **Protected data**: {Other sensitive data types}
- **Data masking**: {Whether/how sensitive data is masked}

## Data Integrity and Validation

### Data Validation
{How data integrity is ensured}
- **Check constraints**: {List important check constraints}
- **Data types**: {Important data type choices and why}
- **NOT NULL constraints**: {Strategy for nullable vs non-nullable}

### Data Integrity Rules
{Business rules enforced at database level}
- {Rule 1}
- {Rule 2}

## Stored Procedures and Functions

### Stored Procedures
{If applicable, list important stored procedures}
- **{Procedure Name}**: {Purpose and parameters}

### Database Functions
{If applicable, list important functions}
- **{Function Name}**: {Purpose and usage}

### Triggers
{If applicable, list important triggers}
- **{Trigger Name}**: {What event triggers it and what it does}

## Monitoring and Maintenance

### Monitoring
{How database health is monitored}
- **Monitoring tools**: {e.g., "CloudWatch", "Datadog", "pgAdmin"}
- **Key metrics**: {Important metrics to watch}
- **Alerting**: {What alerts are configured}

### Regular Maintenance
{Routine maintenance tasks}
- **Vacuum/Optimize**: {If applicable, optimization schedule}
- **Index maintenance**: {Index rebuilding or optimization}
- **Statistics updates**: {Keeping query planner statistics current}

## Scaling and Performance

### Scaling Strategy
{Describe scaling approach}
- **Vertical scaling**: {Instance size considerations}
- **Horizontal scaling**: {Read replicas, sharding, etc.}
- **Caching**: {Database-level caching strategies}

### Performance Tuning
{Performance tuning considerations}
- **Configuration**: {Important configuration parameters}
- **Query optimization**: {Ongoing optimization approach}
- **Resource limits**: {Connection limits, memory limits, etc.}

## Data Lifecycle

### Data Retention
{Describe data retention policies}
- **Retention periods**: {How long different data types are kept}
- **Archival strategy**: {How old data is archived}
- **Data deletion**: {How data is permanently deleted when required}

### Data Purging
{If applicable, describe data purging}
- **Purge strategy**: {How old data is purged}
- **Purge schedule**: {When purging occurs}
- **Purge scripts**: {Where purge scripts are located}

## Environment-Specific Configuration

### Development Environment
{Development database configuration}
- **Database location**: {Where dev database runs}
- **Seed data**: {What seed data is available}
- **Access**: {How developers access dev database}

### Staging Environment
{Staging database configuration}
- **Database location**: {Where staging database runs}
- **Data sync**: {How staging data is kept current}

### Production Environment
{Production database configuration}
- **Database location**: {Where production database runs}
- **High availability**: {HA configuration}
- **Disaster recovery**: {DR setup}

## Troubleshooting

### Common Issues
{Document common issues and solutions}
- **Issue 1**: {Description and solution}
- **Issue 2**: {Description and solution}

### Debugging Queries
{How to debug problematic queries}
- **Query logging**: {How to enable query logging}
- **Explain plans**: {How to analyze query plans}
- **Performance profiling**: {Tools for profiling queries}

## Documentation and Resources

### Schema Documentation
{Links to additional schema documentation}
- {Doc name}: {Link or path}

### ER Diagrams
{Where entity-relationship diagrams can be found}
- {Diagram location}

## Restricted Actions
{Define actions that AI agents should NOT perform on this database}

{Critical: Define operations that should never be automated}
- **Never drop production tables**: Agents should never execute DROP TABLE in production
- **Never truncate without confirmation**: TRUNCATE operations must be explicitly confirmed
- **No bulk deletes without review**: Bulk DELETE operations require user review
- **Schema changes require approval**: ALTER TABLE and schema modifications need explicit approval

{User should review and customize this section for their specific requirements}

# Database File Metadata
{
	This section contains the following information

	- Date Created: timestamp
	- Date Modified: timestamp
	- Last commit SHA built from: GIT SHA
	- Template Version: {version from plugin.json}
}
