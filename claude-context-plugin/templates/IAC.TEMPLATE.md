# Infrastructure as Code Context: ~:Infrastructure Name:~

## Infrastructure Overview [overview] [summary]
~:Provide a clear description of what infrastructure this code defines, its purpose, and what resources it manages:~

## Infrastructure Provider [provider] [platform] [cloud]
~:Specify the infrastructure platform and tools used:~
- **Platform**: ~:e.g., AWS, Azure, GCP, On-premise, Multi-cloud:~
- **IaC Tool**: ~:e.g., Terraform, CloudFormation, Pulumi, Ansible, ARM Templates, CDK:~
- **Tool Version**: ~:Version of the IaC tool being used:~
- **Provider Version**: ~:Version of the cloud provider plugin/SDK:~

## Technologies [technologies] [stack]
~:List key technologies, frameworks, and tools used in this infrastructure code:~
- **Language**: ~:e.g., HCL, YAML, TypeScript (CDK), Python (Pulumi):~
- **Configuration Management**: ~:e.g., Terraform, Ansible, Chef, Puppet:~
- **Key Dependencies**: ~:List major modules, providers, or libraries:~

## Resource Definitions [resources] [infrastructure] [components]

### Resource Organization [organization] [structure]
~:Describe how infrastructure resources are organized:~
- **File structure**: ~:How resources are organized across files/directories:~
- **Naming conventions**: ~:Resource naming patterns and conventions:~
- **Grouping strategy**: ~:How resources are grouped - by type, by environment, by service:~

### Core Resources [resources] [core-infrastructure]
~:List and describe the main infrastructure resources defined:~
- **Compute**: ~:e.g., EC2 instances, Lambda functions, App Services, VMs:~
- **Networking**: ~:e.g., VPCs, Subnets, Security Groups, Load Balancers:~
- **Storage**: ~:e.g., S3 buckets, EBS volumes, Azure Storage, databases:~
- **Databases**: ~:e.g., RDS instances, DynamoDB tables, Cosmos DB:~
- **Other services**: ~:Any other key infrastructure components:~

### Resource Dependencies [dependencies] [resource-relationships]
~:Describe how resources depend on each other:~
- **Dependency patterns**: ~:How dependencies are expressed and managed:~
- **Order of creation**: ~:Any specific ordering requirements:~
- **Cross-stack dependencies**: ~:If using multiple stacks, how they reference each other:~

## State Management [state] [state-management] [backend]
~:Describe how infrastructure state is managed:~
- **State storage**: ~:e.g., "S3 backend", "Azure Storage", "Terraform Cloud", "Local state":~
- **State locking**: ~:How concurrent modifications are prevented:~
- **State location**: ~:Where state files are stored:~
- **State organization**: ~:Single state file vs multiple state files, workspaces:~
- **State access**: ~:Who has access to state files, how access is controlled:~

## Variables and Configuration [configuration] [variables] [parameters]

### Variable Organization [variables] [configuration]
~:Describe how variables and configuration are structured:~
- **Variable files**: ~:Where variables are defined - tfvars, parameter files, config files:~
- **Environment-specific config**: ~:How different environments are configured:~
- **Secret management**: ~:How secrets and sensitive values are handled:~
- **Variable precedence**: ~:Order of precedence for variable values:~

### Key Configuration Values [configuration] [parameters]
~:List important configuration parameters:~
- **Required variables**: ~:Variables that must be provided:~
- **Optional variables**: ~:Variables with defaults:~
- **Computed values**: ~:Values derived from other resources or data sources:~

## Modules and Reusability [modules] [reusability] [components]
~:If using modules or reusable components, describe them:~
- **Module organization**: ~:Where modules are located and how they're structured:~
- **Available modules**: ~:List key reusable modules and their purposes:~
- **Module versioning**: ~:How module versions are managed:~
- **Module sources**: ~:Where modules come from - local, registry, git:~

## Environment Management [environments] [workspaces] [stages]
~:Describe how different environments are managed:~
- **Environment strategy**: ~:e.g., "Separate workspaces", "Separate state files", "Separate directories":~
- **Environments**: ~:List environments - dev, staging, production, etc.:~
- **Environment differences**: ~:How environments differ - variable values, resource counts, sizes:~
- **Promotion process**: ~:How changes are promoted from dev to production:~

## Deployment Patterns [deployment] [provisioning] [workflow]

### Deployment Process [deployment] [process] [workflow]
~:Describe how infrastructure is deployed:~
- **Deployment workflow**: ~:Steps to deploy infrastructure changes:~
- **Planning phase**: ~:How changes are previewed before applying:~
- **Apply process**: ~:How changes are applied:~
- **Rollback strategy**: ~:How to rollback failed deployments:~

### CI/CD Integration [cicd] [automation] [pipeline]
~:If automated, describe the CI/CD pipeline:~
- **CI/CD platform**: ~:e.g., GitHub Actions, GitLab CI, Jenkins, Azure DevOps:~
- **Pipeline triggers**: ~:What triggers infrastructure deployments:~
- **Approval process**: ~:Manual approvals required for deployment:~
- **Automation level**: ~:What's automated vs manual:~

## Initialization and Setup [setup] [initialization] [prerequisites]

### Prerequisites [prerequisites] [requirements]
~:What's needed before using this infrastructure code:~
- **Tools required**: ~:CLI tools, SDKs, plugins that must be installed:~
- **Authentication**: ~:How to authenticate with cloud provider:~
- **Permissions**: ~:Required IAM permissions or roles:~
- **Initial setup**: ~:One-time setup steps:~

### Initialization Commands [setup] [commands]
~:Commands to initialize the infrastructure environment:~
```bash
~:Commands to initialize - e.g., terraform init, pulumi login:~
```

## Security and Compliance [security] [compliance] [access-control]

### Security Patterns [security] [patterns] [best-practices]
~:Describe security practices in the infrastructure code:~
- **Least privilege**: ~:How principle of least privilege is applied:~
- **Network security**: ~:Security groups, NACLs, firewalls configuration:~
- **Encryption**: ~:Encryption at rest and in transit:~
- **Secret management**: ~:How secrets are stored and accessed:~
- **IAM patterns**: ~:Role and policy patterns used:~

### Compliance Requirements [compliance] [governance] [policies]
~:If applicable, describe compliance considerations:~
- **Compliance frameworks**: ~:e.g., SOC2, HIPAA, PCI-DSS, GDPR requirements:~
- **Policy enforcement**: ~:Tools like Sentinel, OPA, Cloud Custodian:~
- **Audit logging**: ~:How infrastructure changes are logged:~
- **Tagging strategy**: ~:Required tags for compliance and cost tracking:~

## Cost Management [cost] [budget] [optimization]
~:Describe cost considerations and optimization:~
- **Cost tracking**: ~:Tags or labels used for cost allocation:~
- **Budget alerts**: ~:Budget monitoring and alerts:~
- **Cost optimization**: ~:Patterns for optimizing costs:~
- **Right-sizing**: ~:How resource sizes are determined:~

## Monitoring and Observability [monitoring] [observability] [alerting]
~:Describe monitoring setup for the infrastructure:~
- **Monitoring tools**: ~:e.g., CloudWatch, Azure Monitor, Datadog, Prometheus:~
- **Metrics collected**: ~:Key infrastructure metrics monitored:~
- **Alerting**: ~:Alert definitions and notification channels:~
- **Logging**: ~:Infrastructure and application log aggregation:~
- **Dashboards**: ~:Monitoring dashboards defined:~

## Disaster Recovery [disaster-recovery] [backup] [high-availability]
~:Describe disaster recovery and high availability setup:~
- **Backup strategy**: ~:What's backed up and how often:~
- **Recovery procedures**: ~:Steps to recover from failures:~
- **High availability**: ~:Multi-AZ, multi-region setup:~
- **RTO/RPO targets**: ~:Recovery time and point objectives:~

## Testing and Validation [testing] [validation] [quality]

### Infrastructure Testing [testing] [validation]
~:Describe how infrastructure code is tested:~
- **Testing approach**: ~:e.g., "Terraform validate", "Terratest", "Kitchen-Terraform", "Pulumi testing":~
- **Test types**: ~:Unit tests, integration tests, compliance tests:~
- **Validation commands**: ~:Commands to validate infrastructure code:~

### Pre-deployment Checks [validation] [checks] [pre-deployment]
~:Describe validation performed before deployment:~
- **Plan review**: ~:How plans are reviewed:~
- **Cost estimation**: ~:Cost impact analysis:~
- **Security scanning**: ~:Security scanning tools used:~
- **Policy checks**: ~:Policy compliance validation:~

## Documentation [documentation] [reference]

### Infrastructure Documentation [documentation] [diagrams]
~:Links to additional documentation:~
- **Architecture diagrams**: ~:Location of infrastructure diagrams:~
- **Runbooks**: ~:Operational runbooks location:~
- **Change log**: ~:Where infrastructure changes are documented:~

### Resource Documentation [documentation] [resources]
~:How resources are documented:~
- **Inline comments**: ~:Documentation in code:~
- **README files**: ~:Documentation files in repository:~
- **External docs**: ~:Links to external documentation:~

## Troubleshooting [troubleshooting] [debugging] [issues]
~:Common issues and how to resolve them:~
- **Common errors**: ~:Frequent errors and their solutions:~
- **Debug commands**: ~:Commands to diagnose issues:~
- **State issues**: ~:How to handle state file problems:~
- **Resource conflicts**: ~:How to resolve resource conflicts:~

## Maintenance [maintenance] [updates] [lifecycle]
~:Describe maintenance procedures:~
- **Update process**: ~:How to update provider/tool versions:~
- **Dependency updates**: ~:How to update module dependencies:~
- **Resource lifecycle**: ~:How resources are created, updated, destroyed:~
- **Deprecation handling**: ~:How deprecated resources are managed:~

## Restricted Actions [security] [restrictions] [policies]
~:Define actions that AI agents should NOT perform when working with this infrastructure:~

~:This section should be reviewed and populated by repository maintainers. Examples:~
~:- Do not apply infrastructure changes without approval:~
~:- Do not modify production state files directly:~
~:- Do not create resources in production without following change management:~
~:- Do not disable security features without security team approval:~
~:- Do not remove backup or disaster recovery resources:~

~:Leave blank initially - user should review and populate based on their specific requirements:~

# Agent File Maintenance [metadata] [maintenance]
~:Keep this section but do not modify the contents:~
No LLM/AI/Agent may make changes to this file outside of the claude-context-system commands. This is a maintained file through automatic means.

# Agent File Metadata [metadata] [tracking]
{
	This section contains the following information

	- Revision Date: timestamp
	- Last commit SHA built from: GIT SHA
	- Template Version: 2.1.0
}
