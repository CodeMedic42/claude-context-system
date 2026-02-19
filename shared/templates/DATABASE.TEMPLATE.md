# Database Context: ~:Project Name:~

## Database Overview [overview] [summary]
~:Provide a clear description of what this database stores, its primary purpose, and its role in the system:~

## Database Type and Technology [metadata] [technology]
- **Database Type**: ~:e.g., "Relational (SQL)", "Document", "Key-Value", "Graph", "Time-series":~
- **Database System**: ~:e.g., "PostgreSQL", "MongoDB", "Redis", "Cassandra", "Neo4j":~

## Connection Information [connection] [access] [configuration]

### Connection Details [connection] [configuration]
~:How to connect to this database:~
- **Connection string format**: ~:Format of connection string:~
- **Default port**: ~:Default port number:~
- **Authentication method**: ~:e.g., "Username/password", "IAM", "Certificate-based":~

### Environment Variables [configuration] [environment]
~:Environment variables used for connection:~
- `~:DB_HOST:~`: ~:Database host:~
- `~:DB_PORT:~`: ~:Database port:~
- `~:DB_NAME:~`: ~:Database name:~
- `~:DB_USER:~`: ~:Database user:~
- `~:DB_PASSWORD:~`: ~:Database password (reference, not actual value):~

### Connection Pooling [connection] [pooling] [performance]
~:If applicable, describe connection pooling:~
- **Pool configuration**: ~:Pool size, timeout settings:~
- **Pool implementation**: ~:Library or mechanism used:~

## Schema Design [schema] [design] [architecture]

### Schema Overview [schema] [overview]
~:High-level overview of the database schema design:~
- **Schema organization**: ~:How schema is organized - schemas, namespaces, collections:~
- **Design patterns**: ~:e.g., "Normalized", "Denormalized", "Star schema":~
- **Key design decisions**: ~:Important architectural decisions:~

## Tables/Collections [tables] [collections] [entities]

~:For each major table or collection, document its structure:~

### ~:Table/Collection Name 1:~
~:Description of what this table/collection stores:~

**Columns/Fields:**
| Column/Field | Type | Constraints | Description |
|-------------|------|-------------|-------------|
| ~:column_name:~ | ~:data_type:~ | ~:e.g., PK, FK, NOT NULL, UNIQUE:~ | ~:Description:~ |
| ~:column_name:~ | ~:data_type:~ | ~:constraints:~ | ~:Description:~ |

**Indexes:**
- ~:index_name:~: ~:columns:~ - ~:Purpose:~

**Relationships:**
- ~:Relationship description - e.g., "Foreign key to users.id":~

---

### ~:Table/Collection Name 2:~
~:Description of what this table/collection stores:~

**Columns/Fields:**
| Column/Field | Type | Constraints | Description |
|-------------|------|-------------|-------------|
| ~:column_name:~ | ~:data_type:~ | ~:constraints:~ | ~:Description:~ |

**Indexes:**
- ~:index_name:~: ~:columns:~ - ~:Purpose:~

**Relationships:**
- ~:Relationship description:~

---

~:Repeat for each major table/collection:~

## Relationships and Constraints [relationships] [constraints] [integrity]

### Entity Relationships [relationships] [entities]
~:Describe key relationships between tables/collections:~
- **~:Entity 1:~ → ~:Entity 2:~**: ~:Relationship type and description:~
- **~:Entity 2:~ → ~:Entity 3:~**: ~:Relationship type and description:~

### Referential Integrity [integrity] [constraints]
~:Describe how referential integrity is maintained:~
- **Foreign keys**: ~:How foreign keys are used:~
- **Cascade rules**: ~:ON DELETE, ON UPDATE behavior:~
- **Constraint enforcement**: ~:How constraints are enforced:~

## Indexes and Performance [indexes] [performance] [optimization]

### Indexing Strategy [indexes] [strategy]
~:Describe the indexing approach:~
- **Primary indexes**: ~:List primary indexes:~
- **Secondary indexes**: ~:List secondary indexes and their purposes:~
- **Composite indexes**: ~:List composite indexes:~
- **Full-text indexes**: ~:If applicable:~

### Query Performance [performance] [queries] [optimization]
~:Describe performance considerations:~
- **Optimization patterns**: ~:Common optimization techniques used:~
- **Slow query monitoring**: ~:How slow queries are identified:~
- **Query patterns to avoid**: ~:Known problematic query patterns:~

## Data Access Patterns [data-access] [queries] [patterns]

### Common Queries [queries] [patterns]
~:Document common query patterns:~

**Query Pattern 1: ~:Name:~**
```sql
~:Example query:~
```
- **Purpose**: ~:What this query does:~
- **Performance**: ~:Expected performance characteristics:~
- **Usage**: ~:When/where this query is used:~

**Query Pattern 2: ~:Name:~**
```sql
~:Example query:~
```
- **Purpose**: ~:What this query does:~
- **Performance**: ~:Expected performance characteristics:~

### ORM/Query Builder [orm] [data-access]
~:If applicable, describe ORM or query builder usage:~
- **ORM/Tool**: ~:e.g., "Sequelize", "TypeORM", "Mongoose", "Dapper":~
- **Entity models**: ~:Where entity models are defined:~
- **Query conventions**: ~:Conventions for writing queries:~

## Data Migrations [migrations] [schema-changes] [versioning]

### Migration Strategy [migrations] [strategy]
~:Describe how database migrations are managed:~
- **Migration tool**: ~:e.g., "Flyway", "Liquibase", "Alembic", "Sequelize migrations":~
- **Migration location**: ~:Where migration files are stored:~
- **Migration naming**: ~:Naming convention for migrations:~

### Running Migrations [migrations] [execution]
~:How to run migrations:~
- **Apply migrations**: ~:Command to apply migrations:~
- **Rollback migrations**: ~:Command to rollback if needed:~
- **Migration status**: ~:Command to check migration status:~

### Migration Guidelines [migrations] [guidelines]
~:Guidelines for creating migrations:~
- ~:Guideline 1:~
- ~:Guideline 2:~

## Seeding and Test Data [seeding] [test-data] [fixtures]

### Data Seeding [seeding] [initialization]
~:How to seed initial data:~
- **Seed scripts**: ~:Where seed scripts are located:~
- **Seed command**: ~:Command to run seeds:~
- **Seed data**: ~:What data is seeded:~

### Test Data [testing] [fixtures] [test-data]
~:How test data is managed:~
- **Test fixtures**: ~:Where test fixtures are located:~
- **Test data generation**: ~:How test data is generated:~
- **Test database**: ~:Separate test database strategy:~

## Security and Sensitive Data [security] [data-privacy] [pii]

~:Identify sensitive data that requires special handling when writing queries or code:~
- **PII fields**: ~:List fields containing personal information (e.g., email, name, SSN):~
- **Protected data**: ~:Other sensitive data types (e.g., passwords, API keys, financial data):~
- **Encrypted columns**: ~:If specific columns are encrypted:~

~:This helps LLM avoid logging, displaying, or mishandling sensitive data in code:~

## Data Integrity and Validation [data-integrity] [validation] [constraints]

### Data Validation [validation] [integrity]
~:How data integrity is ensured:~
- **Check constraints**: ~:List important check constraints:~
- **Data types**: ~:Important data type choices and why:~
- **NOT NULL constraints**: ~:Strategy for nullable vs non-nullable:~

### Data Integrity Rules [integrity] [constraints] [rules]
~:Business rules enforced at database level:~
- ~:Rule 1:~
- ~:Rule 2:~

## Stored Procedures and Functions [stored-procedures] [functions] [triggers]

### Stored Procedures [stored-procedures] [procedures]
~:If applicable, list important stored procedures:~
- **~:Procedure Name:~**: ~:Purpose and parameters:~

### Database Functions [functions] [udf]
~:If applicable, list important functions:~
- **~:Function Name:~**: ~:Purpose and usage:~

### Triggers [triggers] [automation]
~:If applicable, list important triggers:~
- **~:Trigger Name:~**: ~:What event triggers it and what it does:~

## Troubleshooting [troubleshooting] [debugging] [queries]

~:How to debug problematic queries and common database code issues:~
- **Query logging**: ~:How to enable query logging:~
- **Explain plans**: ~:How to analyze query plans (e.g., EXPLAIN, EXPLAIN ANALYZE):~
- **Performance profiling**: ~:Tools for profiling queries:~
- **Common code errors**: ~:Common mistakes when writing queries or using ORM:~

## Documentation and Resources [documentation] [reference] [diagrams]

### Schema Documentation [documentation] [schema]
~:Links to additional schema documentation:~
- ~:Doc name:~: ~:Link or path:~

### ER Diagrams [diagrams] [schema] [visualization]
~:Where entity-relationship diagrams can be found:~
- ~:Diagram location:~

## Restricted Actions [security] [restrictions] [policies]
~:Define actions that AI agents should NOT perform on this database:~

~:Critical: Define operations that should never be automated:~
- **Never drop production tables**: Agents should never execute DROP TABLE in production
- **Never truncate without confirmation**: TRUNCATE operations must be explicitly confirmed
- **No bulk deletes without review**: Bulk DELETE operations require user review
- **Schema changes require approval**: ALTER TABLE and schema modifications need explicit approval

~:User should review and customize this section for their specific requirements:~

# Agent File Maintenance [metadata] [maintenance]
~:Keep this section but do not modify the contents:~
No LLM/AI/Agent may make changes to this file outside of the claude-context-system commands. This is a maintained file through automatic means.

# Agent File Metadata [metadata] [tracking]
{
	This section contains the following information

	- Revision Date: timestamp
	- Last commit SHA built from: GIT SHA
	- Template Version: ${templateVersion}
}
