snyk-broker-config
=================

Small utility to help with Universal Broker configuration and management


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/snyk-broker-config.svg)](https://npmjs.org/package/snyk-broker-config)
[![Downloads/week](https://img.shields.io/npm/dw/snyk-broker-config.svg)](https://npmjs.org/package/snyk-broker-config)


<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g snyk-broker-config
$ snyk-broker-config COMMAND
running command...
$ snyk-broker-config (--version)
snyk-broker-config/1.17.3 linux-x64 node-v20.18.0
$ snyk-broker-config --help [COMMAND]
USAGE
  $ snyk-broker-config COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`snyk-broker-config autocomplete [SHELL]`](#snyk-broker-config-autocomplete-shell)
* [`snyk-broker-config commands`](#snyk-broker-config-commands)
* [`snyk-broker-config connections create DEPLOYMENTID [APIURL] [APIVERSION]`](#snyk-broker-config-connections-create-deploymentid-apiurl-apiversion)
* [`snyk-broker-config connections delete DEPLOYMENTID CONNECTIONID [APIURL] [APIVERSION]`](#snyk-broker-config-connections-delete-deploymentid-connectionid-apiurl-apiversion)
* [`snyk-broker-config connections list DEPLOYMENTID [APIURL] [APIVERSION]`](#snyk-broker-config-connections-list-deploymentid-apiurl-apiversion)
* [`snyk-broker-config connections update DEPLOYMENTID CONNECTIONID [APIURL] [APIVERSION]`](#snyk-broker-config-connections-update-deploymentid-connectionid-apiurl-apiversion)
* [`snyk-broker-config credentials create DEPLOYMENTID [APIURL] [APIVERSION]`](#snyk-broker-config-credentials-create-deploymentid-apiurl-apiversion)
* [`snyk-broker-config credentials delete DEPLOYMENTID [APIURL] [APIVERSION]`](#snyk-broker-config-credentials-delete-deploymentid-apiurl-apiversion)
* [`snyk-broker-config credentials list DEPLOYMENTID [APIURL] [APIVERSION]`](#snyk-broker-config-credentials-list-deploymentid-apiurl-apiversion)
* [`snyk-broker-config credentials update DEPLOYMENTID [APIURL] [APIVERSION]`](#snyk-broker-config-credentials-update-deploymentid-apiurl-apiversion)
* [`snyk-broker-config deployments create APPINSTALLEDINORGID [APIURL] [APIVERSION]`](#snyk-broker-config-deployments-create-appinstalledinorgid-apiurl-apiversion)
* [`snyk-broker-config deployments delete DEPLOYMENTID`](#snyk-broker-config-deployments-delete-deploymentid)
* [`snyk-broker-config deployments list [APIURL] [APIVERSION]`](#snyk-broker-config-deployments-list-apiurl-apiversion)
* [`snyk-broker-config deployments update DEPLOYMENTID`](#snyk-broker-config-deployments-update-deploymentid)
* [`snyk-broker-config help [COMMAND]`](#snyk-broker-config-help-command)
* [`snyk-broker-config integrations create CONNECTIONID ORGID INTEGRATIONID TYPE [APIURL] [APIVERSION]`](#snyk-broker-config-integrations-create-connectionid-orgid-integrationid-type-apiurl-apiversion)
* [`snyk-broker-config integrations delete CONNECTIONID ORGID INTEGRATIONID [APIURL] [APIVERSION]`](#snyk-broker-config-integrations-delete-connectionid-orgid-integrationid-apiurl-apiversion)
* [`snyk-broker-config integrations list CONNECTIONID [APIURL] [APIVERSION]`](#snyk-broker-config-integrations-list-connectionid-apiurl-apiversion)
* [`snyk-broker-config introduction`](#snyk-broker-config-introduction)
* [`snyk-broker-config plugins`](#snyk-broker-config-plugins)
* [`snyk-broker-config plugins add PLUGIN`](#snyk-broker-config-plugins-add-plugin)
* [`snyk-broker-config plugins:inspect PLUGIN...`](#snyk-broker-config-pluginsinspect-plugin)
* [`snyk-broker-config plugins install PLUGIN`](#snyk-broker-config-plugins-install-plugin)
* [`snyk-broker-config plugins link PATH`](#snyk-broker-config-plugins-link-path)
* [`snyk-broker-config plugins remove [PLUGIN]`](#snyk-broker-config-plugins-remove-plugin)
* [`snyk-broker-config plugins reset`](#snyk-broker-config-plugins-reset)
* [`snyk-broker-config plugins uninstall [PLUGIN]`](#snyk-broker-config-plugins-uninstall-plugin)
* [`snyk-broker-config plugins unlink [PLUGIN]`](#snyk-broker-config-plugins-unlink-plugin)
* [`snyk-broker-config plugins update`](#snyk-broker-config-plugins-update)
* [`snyk-broker-config version`](#snyk-broker-config-version)
* [`snyk-broker-config workflows connections create [APIURL] [APIVERSION]`](#snyk-broker-config-workflows-connections-create-apiurl-apiversion)
* [`snyk-broker-config workflows connections delete [APIURL] [APIVERSION]`](#snyk-broker-config-workflows-connections-delete-apiurl-apiversion)
* [`snyk-broker-config workflows connections disconnect [APIURL] [APIVERSION]`](#snyk-broker-config-workflows-connections-disconnect-apiurl-apiversion)
* [`snyk-broker-config workflows connections get [APIURL] [APIVERSION]`](#snyk-broker-config-workflows-connections-get-apiurl-apiversion)
* [`snyk-broker-config workflows connections integrate [APIURL] [APIVERSION]`](#snyk-broker-config-workflows-connections-integrate-apiurl-apiversion)
* [`snyk-broker-config workflows connections migrate [APIURL] [APIVERSION]`](#snyk-broker-config-workflows-connections-migrate-apiurl-apiversion)
* [`snyk-broker-config workflows contexts apply [APIURL] [APIVERSION]`](#snyk-broker-config-workflows-contexts-apply-apiurl-apiversion)
* [`snyk-broker-config workflows contexts create [APIURL] [APIVERSION]`](#snyk-broker-config-workflows-contexts-create-apiurl-apiversion)
* [`snyk-broker-config workflows contexts delete [APIURL] [APIVERSION]`](#snyk-broker-config-workflows-contexts-delete-apiurl-apiversion)
* [`snyk-broker-config workflows contexts get [APIURL] [APIVERSION]`](#snyk-broker-config-workflows-contexts-get-apiurl-apiversion)
* [`snyk-broker-config workflows contexts list [APIURL] [APIVERSION]`](#snyk-broker-config-workflows-contexts-list-apiurl-apiversion)
* [`snyk-broker-config workflows contexts usage [APIURL] [APIVERSION]`](#snyk-broker-config-workflows-contexts-usage-apiurl-apiversion)
* [`snyk-broker-config workflows contexts withdraw [APIURL] [APIVERSION]`](#snyk-broker-config-workflows-contexts-withdraw-apiurl-apiversion)
* [`snyk-broker-config workflows credentials create [APIURL] [APIVERSION]`](#snyk-broker-config-workflows-credentials-create-apiurl-apiversion)
* [`snyk-broker-config workflows credentials delete [APIURL] [APIVERSION]`](#snyk-broker-config-workflows-credentials-delete-apiurl-apiversion)
* [`snyk-broker-config workflows credentials get [APIURL] [APIVERSION]`](#snyk-broker-config-workflows-credentials-get-apiurl-apiversion)
* [`snyk-broker-config workflows deployments create [APIURL] [APIVERSION]`](#snyk-broker-config-workflows-deployments-create-apiurl-apiversion)
* [`snyk-broker-config workflows deployments delete [APIURL] [APIVERSION]`](#snyk-broker-config-workflows-deployments-delete-apiurl-apiversion)
* [`snyk-broker-config workflows deployments get [APIURL] [APIVERSION]`](#snyk-broker-config-workflows-deployments-get-apiurl-apiversion)
* [`snyk-broker-config workflows deployments update [APIURL] [APIVERSION]`](#snyk-broker-config-workflows-deployments-update-apiurl-apiversion)
* [`snyk-broker-config workflows integrations get [APIURL] [APIVERSION]`](#snyk-broker-config-workflows-integrations-get-apiurl-apiversion)

## `snyk-broker-config autocomplete [SHELL]`

Display autocomplete installation instructions.

```
USAGE
  $ snyk-broker-config autocomplete [SHELL] [-r]

ARGUMENTS
  SHELL  (zsh|bash|powershell) Shell type

FLAGS
  -r, --refresh-cache  Refresh cache (ignores displaying instructions)

DESCRIPTION
  Display autocomplete installation instructions.

EXAMPLES
  $ snyk-broker-config autocomplete

  $ snyk-broker-config autocomplete bash

  $ snyk-broker-config autocomplete zsh

  $ snyk-broker-config autocomplete powershell

  $ snyk-broker-config autocomplete --refresh-cache
```

_See code: [@oclif/plugin-autocomplete](https://github.com/oclif/plugin-autocomplete/blob/v3.2.14/src/commands/autocomplete/index.ts)_

## `snyk-broker-config commands`

List all snyk-broker-config commands.

```
USAGE
  $ snyk-broker-config commands [--json] [-c id|plugin|summary|type... |
    --tree] [--deprecated] [-x | ] [--hidden] [--no-truncate | ] [--sort id|plugin|summary|type | ]

FLAGS
  -c, --columns=<option>...  Only show provided columns (comma-separated).
                             <options: id|plugin|summary|type>
  -x, --extended             Show extra columns.
      --deprecated           Show deprecated commands.
      --hidden               Show hidden commands.
      --no-truncate          Do not truncate output.
      --sort=<option>        [default: id] Property to sort by.
                             <options: id|plugin|summary|type>
      --tree                 Show tree of commands.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List all snyk-broker-config commands.
```

_See code: [@oclif/plugin-commands](https://github.com/oclif/plugin-commands/blob/v4.1.14/src/commands/commands.ts)_

## `snyk-broker-config connections create DEPLOYMENTID [APIURL] [APIVERSION]`

Universal Broker Connections - Create operation

```
USAGE
  $ snyk-broker-config connections create DEPLOYMENTID [APIURL] [APIVERSION] -t
    <value> -n <value> [--checkmarx <value>] [--checkmarx_password <value>] [--checkmarx_username <value>]
    [--sonar_qube_host_url <value>] [--sonar_qube_api_token <value>] [--artifactory_url <value>] [--jira_hostname
    <value>] [--jira_username <value>] [--jira_password <value>] [--jira_pat <value>] [--base_nexus_url <value>]
    [--broker_client_url <value>] [--azure_repos_host <value>] [--azure_repos_token <value>] [--azure_repos_org <value>]
    [--bitbucket <value>] [--bitbucket_username <value>] [--bitbucket_password <value>] [--bitbucket_pat <value>]
    [--github_token <value>] [--github <value>] [--github_api <value>] [--github_app_client_id <value>] [--github_app_id
    <value>] [--github_app_installation_id <value>] [--github_app_private_pem_path <value>] [--gitlab <value>]
    [--gitlab_token <value>] [--cr_agent_url <value>] [--cr_base <value>] [--cr_username <value>] [--cr_password
    <value>] [--cr_token <value>] [--cr_role_arn <value>] [--cr_region <value>] [--cr_external_id <value>]

ARGUMENTS
  DEPLOYMENTID  Deployment ID
  APIURL        [default: https://api.dev.snyk.io] API URL
  APIVERSION    [default: 2024-02-08~experimental] API Version

FLAGS
  -n, --name=<value>                         (required) Connection name
  -t, --type=<value>                         (required) Connection type
      --artifactory_url=<value>              Artifactory URL (Credentials Reference UUID as it may contain sensitive
                                             values)
      --azure_repos_host=<value>             Azure Repos Hostname
      --azure_repos_org=<value>              Azure Repos Org Name
      --azure_repos_token=<value>            Azure Repos Token Credentials Reference UUID
      --base_nexus_url=<value>               Nexus URL (Credentials Reference UUID as it may contain sensitive values)
      --bitbucket=<value>                    Bitbucket Hostname
      --bitbucket_password=<value>           Bitbucket Password Credentials Reference UUID (leave empty if using PAT)
      --bitbucket_pat=<value>                Bitbucket Pat Credentials Reference UUID (leave empty if using user/pass)
      --bitbucket_username=<value>           Bitbucket Username (leave empty if using PAT)
      --broker_client_url=<value>            Broker Client URL
      --checkmarx=<value>                    Checkmarx Hostname (leave empty if not using Checkmarx)
      --checkmarx_password=<value>           Checkmarx Password Credentials Reference UUID (leave empty if not using
                                             Checkmarx)
      --checkmarx_username=<value>           Checkmarx Username (leave empty if not using Checkmarx)
      --cr_agent_url=<value>                 Container Registry Agent URL
      --cr_base=<value>                      Container Registry Base URL (The hostname of your CR) 
      --cr_external_id=<value>               Container Registry External ID
      --cr_password=<value>                  Container Registry Password Credentials Reference UUID
      --cr_region=<value>                    Container Registry Region
      --cr_role_arn=<value>                  Container Registry Role Arn
      --cr_token=<value>                     Container Registry Token Credentials Reference UUID
      --cr_username=<value>                  Container Registry Username
      --github=<value>                       Github URL
      --github_api=<value>                   Github Api URL
      --github_app_client_id=<value>         Github App Client ID Credentials Refs
      --github_app_id=<value>                Github App ID
      --github_app_installation_id=<value>   Github App Installation ID
      --github_app_private_pem_path=<value>  Github Private Pem cert path
      --github_token=<value>                 Github Token Credentials Reference UUID
      --gitlab=<value>                       Gitlab Hostname
      --gitlab_token=<value>                 Gitlab Token Credentials Reference UUID
      --jira_hostname=<value>                Jira Hostname
      --jira_password=<value>                Jira Password Credentials Reference UUID (leave empty if using PAT)
      --jira_pat=<value>                     JIRA Pat Reference (leave empty if using user/pass)
      --jira_username=<value>                Jira Username (leave empty if using PAT)
      --sonar_qube_api_token=<value>         Sonarqube Api token (leave empty if not using Sonarqube)
      --sonar_qube_host_url=<value>          Sonarqube Hostname (leave empty if not using Sonarqube)

DESCRIPTION
  Universal Broker Connections - Create operation

EXAMPLES
  [with exported TENANT_ID, INSTALL_ID]

  $ snyk-broker-config connections create DEPLOYMENT_ID --type github

  [inline TENANT_ID,INSTALL_ID]

  $ snyk-broker-config connections create TENANT_ID INSTALL_ID DEPLOYMENT_ID --type github
```

_See code: [src/commands/connections/create.ts](https://github.com/snyk/snyk-broker-config/blob/v1.17.3/src/commands/connections/create.ts)_

## `snyk-broker-config connections delete DEPLOYMENTID CONNECTIONID [APIURL] [APIVERSION]`

Universal Broker Connections - Delete operation

```
USAGE
  $ snyk-broker-config connections delete DEPLOYMENTID CONNECTIONID [APIURL]
    [APIVERSION] [--json] [--log-level debug|warn|error|info|trace]

ARGUMENTS
  DEPLOYMENTID  Deployment ID
  CONNECTIONID  Connection ID
  APIURL        [default: https://api.dev.snyk.io] API URL
  APIVERSION    [default: 2024-02-08~experimental] API Version

GLOBAL FLAGS
  --json                Format output as json.
  --log-level=<option>  [default: info] Specify level for logging.
                        <options: debug|warn|error|info|trace>

DESCRIPTION
  Universal Broker Connections - Delete operation

EXAMPLES
  [with exported TENANT_ID, INSTALL_ID]

  $ snyk-broker-config connections delete DEPLOYMENT_ID CONNECTION_ID

  [inline TENANT_ID,INSTALL_ID]

  $ snyk-broker-config connections delete TENANT_ID INSTALL_ID DEPLOYMENT_ID CONNECTION_ID
```

_See code: [src/commands/connections/delete.ts](https://github.com/snyk/snyk-broker-config/blob/v1.17.3/src/commands/connections/delete.ts)_

## `snyk-broker-config connections list DEPLOYMENTID [APIURL] [APIVERSION]`

Universal Broker Connections - List operation

```
USAGE
  $ snyk-broker-config connections list DEPLOYMENTID [APIURL] [APIVERSION] [--json]
    [--log-level debug|warn|error|info|trace]

ARGUMENTS
  DEPLOYMENTID  Deployment ID
  APIURL        [default: https://api.dev.snyk.io] API URL
  APIVERSION    [default: 2024-02-08~experimental] API Version

GLOBAL FLAGS
  --json                Format output as json.
  --log-level=<option>  [default: info] Specify level for logging.
                        <options: debug|warn|error|info|trace>

DESCRIPTION
  Universal Broker Connections - List operation

EXAMPLES
  [with exported TENANT_ID, INSTALL_ID]

  $ snyk-broker-config connections list DEPLOYMENT_ID

  [inline TENANT_ID,INSTALL_ID]

  $ snyk-broker-config connections list TENANT_ID INSTALL_ID DEPLOYMENT_ID
```

_See code: [src/commands/connections/list.ts](https://github.com/snyk/snyk-broker-config/blob/v1.17.3/src/commands/connections/list.ts)_

## `snyk-broker-config connections update DEPLOYMENTID CONNECTIONID [APIURL] [APIVERSION]`

Universal Broker Connections - Update operation

```
USAGE
  $ snyk-broker-config connections update DEPLOYMENTID CONNECTIONID [APIURL]
    [APIVERSION] -t <value> -n <value> [--checkmarx <value>] [--checkmarx_password <value>] [--checkmarx_username
    <value>] [--sonar_qube_host_url <value>] [--sonar_qube_api_token <value>] [--artifactory_url <value>]
    [--jira_hostname <value>] [--jira_username <value>] [--jira_password <value>] [--jira_pat <value>] [--base_nexus_url
    <value>] [--broker_client_url <value>] [--azure_repos_host <value>] [--azure_repos_token <value>] [--azure_repos_org
    <value>] [--bitbucket <value>] [--bitbucket_username <value>] [--bitbucket_password <value>] [--bitbucket_pat
    <value>] [--github_token <value>] [--github <value>] [--github_api <value>] [--github_app_client_id <value>]
    [--github_app_id <value>] [--github_app_installation_id <value>] [--github_app_private_pem_path <value>] [--gitlab
    <value>] [--gitlab_token <value>] [--cr_agent_url <value>] [--cr_base <value>] [--cr_username <value>]
    [--cr_password <value>] [--cr_token <value>] [--cr_role_arn <value>] [--cr_region <value>] [--cr_external_id
    <value>]

ARGUMENTS
  DEPLOYMENTID  Deployment ID
  CONNECTIONID  Connection ID
  APIURL        [default: https://api.dev.snyk.io] API URL
  APIVERSION    [default: 2024-02-08~experimental] API Version

FLAGS
  -n, --name=<value>                         (required) Connection name
  -t, --type=<value>                         (required) Connection type
      --artifactory_url=<value>              Artifactory URL (Credentials Reference UUID as it may contain sensitive
                                             values)
      --azure_repos_host=<value>             Azure Repos Hostname
      --azure_repos_org=<value>              Azure Repos Org Name
      --azure_repos_token=<value>            Azure Repos Token Credentials Reference UUID
      --base_nexus_url=<value>               Nexus URL (Credentials Reference UUID as it may contain sensitive values)
      --bitbucket=<value>                    Bitbucket Hostname
      --bitbucket_password=<value>           Bitbucket Password Credentials Reference UUID (leave empty if using PAT)
      --bitbucket_pat=<value>                Bitbucket Pat Credentials Reference UUID (leave empty if using user/pass)
      --bitbucket_username=<value>           Bitbucket Username (leave empty if using PAT)
      --broker_client_url=<value>            Broker Client URL
      --checkmarx=<value>                    Checkmarx Hostname (leave empty if not using Checkmarx)
      --checkmarx_password=<value>           Checkmarx Password Credentials Reference UUID (leave empty if not using
                                             Checkmarx)
      --checkmarx_username=<value>           Checkmarx Username (leave empty if not using Checkmarx)
      --cr_agent_url=<value>                 CR Agent URL
      --cr_base=<value>                      CR Base URL
      --cr_external_id=<value>               CR External ID
      --cr_password=<value>                  CR Password Credentials Reference UUID
      --cr_region=<value>                    CR Region
      --cr_role_arn=<value>                  CR Role Arn
      --cr_token=<value>                     CR Token Credentials Reference UUID
      --cr_username=<value>                  CR Username
      --github=<value>                       Github URL
      --github_api=<value>                   Github Api URL
      --github_app_client_id=<value>         Github App Client ID Credentials Refs
      --github_app_id=<value>                Github App ID
      --github_app_installation_id=<value>   Github App Installation ID
      --github_app_private_pem_path=<value>  Github Private Pem cert path
      --github_token=<value>                 Github Token Credentials Reference UUID
      --gitlab=<value>                       Gitlab Hostname
      --gitlab_token=<value>                 Gitlab Token Credentials Reference UUID
      --jira_hostname=<value>                Jira Hostname
      --jira_password=<value>                Jira Password Credentials Reference UUID (leave empty if using PAT)
      --jira_pat=<value>                     JIRA Pat Reference (leave empty if using user/pass)
      --jira_username=<value>                Jira Username (leave empty if using PAT)
      --sonar_qube_api_token=<value>         Sonarqube Api token (leave empty if not using Sonarqube)
      --sonar_qube_host_url=<value>          Sonarqube Hostname (leave empty if not using Sonarqube)

DESCRIPTION
  Universal Broker Connections - Update operation

EXAMPLES
  [with exported TENANT_ID, INSTALL_ID]

  $ snyk-broker-config connections update DEPLOYMENT_ID CONNECTION_ID --type github

  [inline TENANT_ID,INSTALL_ID]

  $ snyk-broker-config connections update TENANT_ID INSTALL_ID DEPLOYMENT_ID CONNECTION_ID --type github
```

_See code: [src/commands/connections/update.ts](https://github.com/snyk/snyk-broker-config/blob/v1.17.3/src/commands/connections/update.ts)_

## `snyk-broker-config credentials create DEPLOYMENTID [APIURL] [APIVERSION]`

Universal Broker Credentials - Create operation

```
USAGE
  $ snyk-broker-config credentials create DEPLOYMENTID [APIURL] [APIVERSION] -c
    <value> -n <value> -t <value> [--json] [--log-level debug|warn|error|info|trace]

ARGUMENTS
  DEPLOYMENTID  Deployment ID
  APIURL        [default: https://api.dev.snyk.io] API URL
  APIVERSION    [default: 2024-02-08~experimental] API Version

FLAGS
  -c, --comment=<value>       (required) Comment about credentials reference(s).
  -n, --env_var_name=<value>  (required) Env var name(s) of the credentials reference(s). Comma separated to specify
                              more than one at a time.
  -t, --type=<value>          (required) Connection type

GLOBAL FLAGS
  --json                Format output as json.
  --log-level=<option>  [default: info] Specify level for logging.
                        <options: debug|warn|error|info|trace>

DESCRIPTION
  Universal Broker Credentials - Create operation

EXAMPLES
  [with exported TENANT_ID, INSTALL_ID]

  $ snyk-broker-config credentials create DEPLOYMENT_ID --comment "mycomment" --env_var_name MY_GITHUB_TOKEN --type github

  [inline TENANT_ID,INSTALL_ID]

  $ snyk-broker-config credentials create TENANT_ID INSTALL_ID DEPLOYMENT_ID --comment "mycomment" --env_var_name MY_GITHUB_TOKEN --type github
```

_See code: [src/commands/credentials/create.ts](https://github.com/snyk/snyk-broker-config/blob/v1.17.3/src/commands/credentials/create.ts)_

## `snyk-broker-config credentials delete DEPLOYMENTID [APIURL] [APIVERSION]`

Universal Broker Deployment Credentials - Delete operation

```
USAGE
  $ snyk-broker-config credentials delete DEPLOYMENTID [APIURL] [APIVERSION] -c
    <value> [--json] [--log-level debug|warn|error|info|trace]

ARGUMENTS
  DEPLOYMENTID  Deployment ID
  APIURL        [default: https://api.dev.snyk.io] API URL
  APIVERSION    [default: 2024-02-08~experimental] API Version

FLAGS
  -c, --credentialsIds=<value>  (required) Credentials reference(s) ID(s).

GLOBAL FLAGS
  --json                Format output as json.
  --log-level=<option>  [default: info] Specify level for logging.
                        <options: debug|warn|error|info|trace>

DESCRIPTION
  Universal Broker Deployment Credentials - Delete operation

EXAMPLES
  [with exported TENANT_ID, INSTALL_ID]

  $ snyk-broker-config credentials delete DEPLOYMENT_ID -c CREDENTIALS_ID

  [inline TENANT_ID,INSTALL_ID]

  $ snyk-broker-config credentials delete TENANT_ID INSTALL_ID DEPLOYMENT_ID -c CREDENTIALS_ID
```

_See code: [src/commands/credentials/delete.ts](https://github.com/snyk/snyk-broker-config/blob/v1.17.3/src/commands/credentials/delete.ts)_

## `snyk-broker-config credentials list DEPLOYMENTID [APIURL] [APIVERSION]`

Universal Broker Deployments - List operation

```
USAGE
  $ snyk-broker-config credentials list DEPLOYMENTID [APIURL] [APIVERSION] [--json]
    [--log-level debug|warn|error|info|trace]

ARGUMENTS
  DEPLOYMENTID  Deployment ID
  APIURL        [default: https://api.dev.snyk.io] API URL
  APIVERSION    [default: 2024-02-08~experimental] API Version

GLOBAL FLAGS
  --json                Format output as json.
  --log-level=<option>  [default: info] Specify level for logging.
                        <options: debug|warn|error|info|trace>

DESCRIPTION
  Universal Broker Deployments - List operation

EXAMPLES
  [with exported TENANT_ID, INSTALL_ID]

  $ snyk-broker-config credentials list DEPLOYMENT_ID

  [inline TENANT_ID,INSTALL_ID]

  $ snyk-broker-config credentials list TENANT_ID INSTALL_ID DEPLOYMENT_ID
```

_See code: [src/commands/credentials/list.ts](https://github.com/snyk/snyk-broker-config/blob/v1.17.3/src/commands/credentials/list.ts)_

## `snyk-broker-config credentials update DEPLOYMENTID [APIURL] [APIVERSION]`

Universal Broker Credentials - Update operation

```
USAGE
  $ snyk-broker-config credentials update DEPLOYMENTID [APIURL] [APIVERSION] -i
    <value> -c <value> -n <value> -t <value> [--json] [--log-level debug|warn|error|info|trace]

ARGUMENTS
  DEPLOYMENTID  Deployment ID
  APIURL        [default: https://api.dev.snyk.io] API URL
  APIVERSION    [default: 2024-02-08~experimental] API Version

FLAGS
  -c, --comment=<value>        (required) Comment about credentials reference(s).
  -i, --credentialsId=<value>  (required) Credentials reference ID.
  -n, --env_var_name=<value>   (required) Env var name(s) of the credentials reference(s). Comma separated to specify
                               more than one at a time.
  -t, --type=<value>           (required) Connection type

GLOBAL FLAGS
  --json                Format output as json.
  --log-level=<option>  [default: info] Specify level for logging.
                        <options: debug|warn|error|info|trace>

DESCRIPTION
  Universal Broker Credentials - Update operation

EXAMPLES
  [with exported TENANT_ID, INSTALL_ID]

  $ snyk-broker-config credentials update DEPLOYMENT_ID --credentialsId CREDENTIALID--comment "mycomment" --env_var_name MY_GITHUB_TOKEN --type github

  [inline TENANT_ID,INSTALL_ID]

  $ snyk-broker-config credentials update TENANT_ID INSTALL_ID DEPLOYMENT_ID --credentialsId CREDENTIALID --comment "mycomment" --env_var_name MY_GITHUB_TOKEN --type github
```

_See code: [src/commands/credentials/update.ts](https://github.com/snyk/snyk-broker-config/blob/v1.17.3/src/commands/credentials/update.ts)_

## `snyk-broker-config deployments create APPINSTALLEDINORGID [APIURL] [APIVERSION]`

Universal Broker Deployments - Create operation

```
USAGE
  $ snyk-broker-config deployments create APPINSTALLEDINORGID [APIURL] [APIVERSION]
    -d <value> [--json] [--log-level debug|warn|error|info|trace] [-o]

ARGUMENTS
  APPINSTALLEDINORGID  Broker App Installed in Org ID
  APIURL               [default: https://api.dev.snyk.io] API URL
  APIVERSION           [default: 2024-02-08~experimental] API Version

FLAGS
  -d, --data=<value>  (required) A series of key/value pairs comma separated. Ex:
                      cluster=my_cluster,deployment_name=test
  -o, --overwrite     Overwrite metadata. Use to delete keys from metadata instead of additive metadata keys by default.

GLOBAL FLAGS
  --json                Format output as json.
  --log-level=<option>  [default: info] Specify level for logging.
                        <options: debug|warn|error|info|trace>

DESCRIPTION
  Universal Broker Deployments - Create operation

EXAMPLES
  [with exported TENANT_ID, INSTALL_ID]

  $ snyk-broker-config deployments create APP_INSTALLED_ORG_ID --data mykey=myvalue,mykey2=myvalue2

  [inline TENANT_ID,INSTALL_ID]

  $ snyk-broker-config deployments create TENANT_ID INSTALL_ID APP_INSTALLED_ORG_ID --data mykey=myvalue,mykey2=myvalue2
```

_See code: [src/commands/deployments/create.ts](https://github.com/snyk/snyk-broker-config/blob/v1.17.3/src/commands/deployments/create.ts)_

## `snyk-broker-config deployments delete DEPLOYMENTID`

Universal Broker Deployments - Delete operation

```
USAGE
  $ snyk-broker-config deployments delete DEPLOYMENTID [--json] [--log-level
    debug|warn|error|info|trace]

ARGUMENTS
  DEPLOYMENTID  Deployment ID

GLOBAL FLAGS
  --json                Format output as json.
  --log-level=<option>  [default: info] Specify level for logging.
                        <options: debug|warn|error|info|trace>

DESCRIPTION
  Universal Broker Deployments - Delete operation

EXAMPLES
  [with exported TENANT_ID, INSTALL_ID]

  $ snyk-broker-config deployments delete DEPLOYMENT_ID

  [inline TENANT_ID,INSTALL_ID]

  $ snyk-broker-config deployments delete TENANT_ID INSTALL_ID DEPLOYMENT_ID
```

_See code: [src/commands/deployments/delete.ts](https://github.com/snyk/snyk-broker-config/blob/v1.17.3/src/commands/deployments/delete.ts)_

## `snyk-broker-config deployments list [APIURL] [APIVERSION]`

Universal Broker Deployments - List operation

```
USAGE
  $ snyk-broker-config deployments list [APIURL] [APIVERSION] [--json] [--log-level
    debug|warn|error|info|trace]

ARGUMENTS
  APIURL      [default: https://api.dev.snyk.io] API URL
  APIVERSION  [default: 2024-02-08~experimental] API Version

GLOBAL FLAGS
  --json                Format output as json.
  --log-level=<option>  [default: info] Specify level for logging.
                        <options: debug|warn|error|info|trace>

DESCRIPTION
  Universal Broker Deployments - List operation

EXAMPLES
  [with exported TENANT_ID, INSTALL_ID]

  $ snyk-broker-config deployments list

  [inline TENANT_ID,INSTALL_ID]

  $ snyk-broker-config deployments list TENANT_ID INSTALL_ID
```

_See code: [src/commands/deployments/list.ts](https://github.com/snyk/snyk-broker-config/blob/v1.17.3/src/commands/deployments/list.ts)_

## `snyk-broker-config deployments update DEPLOYMENTID`

Universal Broker Deployments - Update operation

```
USAGE
  $ snyk-broker-config deployments update DEPLOYMENTID -d <value> [--json]
    [--log-level debug|warn|error|info|trace] [-o]

ARGUMENTS
  DEPLOYMENTID  Deployment ID

FLAGS
  -d, --data=<value>  (required) A series of key/value pairs comma separated. Ex:
                      cluster=my_cluster,deployment_name=test
  -o, --overwrite     Overwrite metadata. Use to delete keys from metadata instead of additive metadata keys by default.

GLOBAL FLAGS
  --json                Format output as json.
  --log-level=<option>  [default: info] Specify level for logging.
                        <options: debug|warn|error|info|trace>

DESCRIPTION
  Universal Broker Deployments - Update operation

EXAMPLES
  [with exported TENANT_ID, INSTALL_ID]

  $ snyk-broker-config deployments update DEPLOYMENT_ID --data mykey=myvalue,mykey2=myvalue2

  [inline TENANT_ID,INSTALL_ID]

  $ snyk-broker-config deployments update TENANT_ID INSTALL_ID DEPLOYMENT_ID --data mykey=myvalue,mykey2=myvalue2
```

_See code: [src/commands/deployments/update.ts](https://github.com/snyk/snyk-broker-config/blob/v1.17.3/src/commands/deployments/update.ts)_

## `snyk-broker-config help [COMMAND]`

Display help for snyk-broker-config.

```
USAGE
  $ snyk-broker-config help [COMMAND...] [-n]

ARGUMENTS
  COMMAND...  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for snyk-broker-config.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.2.19/src/commands/help.ts)_

## `snyk-broker-config integrations create CONNECTIONID ORGID INTEGRATIONID TYPE [APIURL] [APIVERSION]`

Universal Broker Connections Integrations - Create operation

```
USAGE
  $ snyk-broker-config integrations create CONNECTIONID ORGID INTEGRATIONID TYPE
    [APIURL] [APIVERSION] [--json] [--log-level debug|warn|error|info|trace]

ARGUMENTS
  CONNECTIONID   Connection ID
  ORGID          Org ID
  INTEGRATIONID  Integration ID
  TYPE           type
  APIURL         [default: https://api.dev.snyk.io] API URL
  APIVERSION     [default: 2024-02-08~experimental] API Version

GLOBAL FLAGS
  --json                Format output as json.
  --log-level=<option>  [default: info] Specify level for logging.
                        <options: debug|warn|error|info|trace>

DESCRIPTION
  Universal Broker Connections Integrations - Create operation

EXAMPLES
  [with exported TENANT_ID, INSTALL_ID]

  $ snyk-broker-config integrations create CONNECTION_ID ORG_ID INTEGRATION_ID

  [inline TENANT_ID,INSTALL_ID]

  $ snyk-broker-config integrations create TENANT_ID INSTALL_ID CONNECTION_ID ORG_ID INTEGRATION_ID
```

_See code: [src/commands/integrations/create.ts](https://github.com/snyk/snyk-broker-config/blob/v1.17.3/src/commands/integrations/create.ts)_

## `snyk-broker-config integrations delete CONNECTIONID ORGID INTEGRATIONID [APIURL] [APIVERSION]`

Universal Broker Connections Integrations - Delete operation

```
USAGE
  $ snyk-broker-config integrations delete CONNECTIONID ORGID INTEGRATIONID [APIURL]
    [APIVERSION] [--json] [--log-level debug|warn|error|info|trace]

ARGUMENTS
  CONNECTIONID   Connection ID
  ORGID          Org ID
  INTEGRATIONID  Integration ID
  APIURL         [default: https://api.dev.snyk.io] API URL
  APIVERSION     [default: 2024-02-08~experimental] API Version

GLOBAL FLAGS
  --json                Format output as json.
  --log-level=<option>  [default: info] Specify level for logging.
                        <options: debug|warn|error|info|trace>

DESCRIPTION
  Universal Broker Connections Integrations - Delete operation

EXAMPLES
  [with exported TENANT_ID, INSTALL_ID]

  $ snyk-broker-config integrations delete CONNECTION_ID ORG_ID INTEGRATION_ID

  [inline TENANT_ID,INSTALL_ID]

  $ snyk-broker-config integrations delete TENANT_ID INSTALL_ID CONNECTION_ID ORG_ID INTEGRATION_ID
```

_See code: [src/commands/integrations/delete.ts](https://github.com/snyk/snyk-broker-config/blob/v1.17.3/src/commands/integrations/delete.ts)_

## `snyk-broker-config integrations list CONNECTIONID [APIURL] [APIVERSION]`

Universal Broker Connections Integrations - List operation

```
USAGE
  $ snyk-broker-config integrations list CONNECTIONID [APIURL] [APIVERSION] [--json]
    [--log-level debug|warn|error|info|trace]

ARGUMENTS
  CONNECTIONID  Connection ID
  APIURL        [default: https://api.dev.snyk.io] API URL
  APIVERSION    [default: 2024-02-08~experimental] API Version

GLOBAL FLAGS
  --json                Format output as json.
  --log-level=<option>  [default: info] Specify level for logging.
                        <options: debug|warn|error|info|trace>

DESCRIPTION
  Universal Broker Connections Integrations - List operation

EXAMPLES
  [with exported TENANT_ID, INSTALL_ID]

  $ snyk-broker-config integrations list CONNECTION_ID

  [inline TENANT_ID,INSTALL_ID]

  $ snyk-broker-config integrations list TENANT_ID INSTALL_ID CONNECTION_ID
```

_See code: [src/commands/integrations/list.ts](https://github.com/snyk/snyk-broker-config/blob/v1.17.3/src/commands/integrations/list.ts)_

## `snyk-broker-config introduction`

Universal Broker - Introduction

```
USAGE
  $ snyk-broker-config introduction [--json] [--log-level
    debug|warn|error|info|trace]

GLOBAL FLAGS
  --json                Format output as json.
  --log-level=<option>  [default: info] Specify level for logging.
                        <options: debug|warn|error|info|trace>

DESCRIPTION
  Universal Broker - Introduction

EXAMPLES
  $ snyk-broker-config introduction
```

_See code: [src/commands/introduction/index.ts](https://github.com/snyk/snyk-broker-config/blob/v1.17.3/src/commands/introduction/index.ts)_

## `snyk-broker-config plugins`

List installed plugins.

```
USAGE
  $ snyk-broker-config plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ snyk-broker-config plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.22/src/commands/plugins/index.ts)_

## `snyk-broker-config plugins add PLUGIN`

Installs a plugin into snyk-broker-config.

```
USAGE
  $ snyk-broker-config plugins add PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into snyk-broker-config.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the SNYK_BROKER_CONFIG_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the SNYK_BROKER_CONFIG_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ snyk-broker-config plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ snyk-broker-config plugins add myplugin

  Install a plugin from a github url.

    $ snyk-broker-config plugins add https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ snyk-broker-config plugins add someuser/someplugin
```

## `snyk-broker-config plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ snyk-broker-config plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN...  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ snyk-broker-config plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.22/src/commands/plugins/inspect.ts)_

## `snyk-broker-config plugins install PLUGIN`

Installs a plugin into snyk-broker-config.

```
USAGE
  $ snyk-broker-config plugins install PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into snyk-broker-config.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the SNYK_BROKER_CONFIG_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the SNYK_BROKER_CONFIG_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ snyk-broker-config plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ snyk-broker-config plugins install myplugin

  Install a plugin from a github url.

    $ snyk-broker-config plugins install https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ snyk-broker-config plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.22/src/commands/plugins/install.ts)_

## `snyk-broker-config plugins link PATH`

Links a plugin into the CLI for development.

```
USAGE
  $ snyk-broker-config plugins link PATH [-h] [--install] [-v]

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ snyk-broker-config plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.22/src/commands/plugins/link.ts)_

## `snyk-broker-config plugins remove [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ snyk-broker-config plugins remove [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ snyk-broker-config plugins unlink
  $ snyk-broker-config plugins remove

EXAMPLES
  $ snyk-broker-config plugins remove myplugin
```

## `snyk-broker-config plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ snyk-broker-config plugins reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.22/src/commands/plugins/reset.ts)_

## `snyk-broker-config plugins uninstall [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ snyk-broker-config plugins uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ snyk-broker-config plugins unlink
  $ snyk-broker-config plugins remove

EXAMPLES
  $ snyk-broker-config plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.22/src/commands/plugins/uninstall.ts)_

## `snyk-broker-config plugins unlink [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ snyk-broker-config plugins unlink [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ snyk-broker-config plugins unlink
  $ snyk-broker-config plugins remove

EXAMPLES
  $ snyk-broker-config plugins unlink myplugin
```

## `snyk-broker-config plugins update`

Update installed plugins.

```
USAGE
  $ snyk-broker-config plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.22/src/commands/plugins/update.ts)_

## `snyk-broker-config version`

```
USAGE
  $ snyk-broker-config version [--json] [--verbose]

FLAGS
  --verbose  Show additional information about the CLI.

GLOBAL FLAGS
  --json  Format output as json.

FLAG DESCRIPTIONS
  --verbose  Show additional information about the CLI.

    Additionally shows the architecture, node version, operating system, and versions of plugins that the CLI is using.
```

_See code: [@oclif/plugin-version](https://github.com/oclif/plugin-version/blob/v2.2.18/src/commands/version.ts)_

## `snyk-broker-config workflows connections create [APIURL] [APIVERSION]`

Universal Broker - Create Connection Workflow

```
USAGE
  $ snyk-broker-config workflows connections create [APIURL] [APIVERSION] [--json] [--log-level
    debug|warn|error|info|trace]

ARGUMENTS
  APIURL      [default: https://api.dev.snyk.io] API URL
  APIVERSION  [default: 2024-02-08~experimental] API Version

GLOBAL FLAGS
  --json                Format output as json.
  --log-level=<option>  [default: info] Specify level for logging.
                        <options: debug|warn|error|info|trace>

DESCRIPTION
  Universal Broker - Create Connection Workflow

EXAMPLES
  $ snyk-broker-config workflows connections create
```

_See code: [src/commands/workflows/connections/create.ts](https://github.com/snyk/snyk-broker-config/blob/v1.17.3/src/commands/workflows/connections/create.ts)_

## `snyk-broker-config workflows connections delete [APIURL] [APIVERSION]`

Universal Broker - Delete Connection Workflow

```
USAGE
  $ snyk-broker-config workflows connections delete [APIURL] [APIVERSION] [--json] [--log-level
    debug|warn|error|info|trace]

ARGUMENTS
  APIURL      [default: https://api.dev.snyk.io] API URL
  APIVERSION  [default: 2024-02-08~experimental] API Version

GLOBAL FLAGS
  --json                Format output as json.
  --log-level=<option>  [default: info] Specify level for logging.
                        <options: debug|warn|error|info|trace>

DESCRIPTION
  Universal Broker - Delete Connection Workflow

EXAMPLES
  $ snyk-broker-config workflows connections delete
```

_See code: [src/commands/workflows/connections/delete.ts](https://github.com/snyk/snyk-broker-config/blob/v1.17.3/src/commands/workflows/connections/delete.ts)_

## `snyk-broker-config workflows connections disconnect [APIURL] [APIVERSION]`

Universal Broker - Connection Disconnect Integration(s) Workflow

```
USAGE
  $ snyk-broker-config workflows connections disconnect [APIURL] [APIVERSION] [--json] [--log-level
    debug|warn|error|info|trace]

ARGUMENTS
  APIURL      [default: https://api.dev.snyk.io] API URL
  APIVERSION  [default: 2024-02-08~experimental] API Version

GLOBAL FLAGS
  --json                Format output as json.
  --log-level=<option>  [default: info] Specify level for logging.
                        <options: debug|warn|error|info|trace>

DESCRIPTION
  Universal Broker - Connection Disconnect Integration(s) Workflow

EXAMPLES
  $ snyk-broker-config workflows connections disconnect
```

_See code: [src/commands/workflows/connections/disconnect.ts](https://github.com/snyk/snyk-broker-config/blob/v1.17.3/src/commands/workflows/connections/disconnect.ts)_

## `snyk-broker-config workflows connections get [APIURL] [APIVERSION]`

Universal Broker - Get Connection Workflow

```
USAGE
  $ snyk-broker-config workflows connections get [APIURL] [APIVERSION] [--json] [--log-level
    debug|warn|error|info|trace]

ARGUMENTS
  APIURL      [default: https://api.dev.snyk.io] API URL
  APIVERSION  [default: 2024-02-08~experimental] API Version

GLOBAL FLAGS
  --json                Format output as json.
  --log-level=<option>  [default: info] Specify level for logging.
                        <options: debug|warn|error|info|trace>

DESCRIPTION
  Universal Broker - Get Connection Workflow

EXAMPLES
  $ snyk-broker-config workflows connections get
```

_See code: [src/commands/workflows/connections/get.ts](https://github.com/snyk/snyk-broker-config/blob/v1.17.3/src/commands/workflows/connections/get.ts)_

## `snyk-broker-config workflows connections integrate [APIURL] [APIVERSION]`

Universal Broker - Connection Create Integration(s) Workflow

```
USAGE
  $ snyk-broker-config workflows connections integrate [APIURL] [APIVERSION] [--json] [--log-level
    debug|warn|error|info|trace]

ARGUMENTS
  APIURL      [default: https://api.dev.snyk.io] API URL
  APIVERSION  [default: 2024-02-08~experimental] API Version

GLOBAL FLAGS
  --json                Format output as json.
  --log-level=<option>  [default: info] Specify level for logging.
                        <options: debug|warn|error|info|trace>

DESCRIPTION
  Universal Broker - Connection Create Integration(s) Workflow

EXAMPLES
  $ snyk-broker-config workflows connections integrate
```

_See code: [src/commands/workflows/connections/integrate.ts](https://github.com/snyk/snyk-broker-config/blob/v1.17.3/src/commands/workflows/connections/integrate.ts)_

## `snyk-broker-config workflows connections migrate [APIURL] [APIVERSION]`

Universal Broker - Existing Connection Migration Workflow

```
USAGE
  $ snyk-broker-config workflows connections migrate [APIURL] [APIVERSION] [--json] [--log-level
    debug|warn|error|info|trace]

ARGUMENTS
  APIURL      [default: https://api.dev.snyk.io] API URL
  APIVERSION  [default: 2024-02-08~experimental] API Version

GLOBAL FLAGS
  --json                Format output as json.
  --log-level=<option>  [default: info] Specify level for logging.
                        <options: debug|warn|error|info|trace>

DESCRIPTION
  Universal Broker - Existing Connection Migration Workflow

EXAMPLES
  $ snyk-broker-config workflows connections migrate
```

_See code: [src/commands/workflows/connections/migrate.ts](https://github.com/snyk/snyk-broker-config/blob/v1.17.3/src/commands/workflows/connections/migrate.ts)_

## `snyk-broker-config workflows contexts apply [APIURL] [APIVERSION]`

Universal Broker - Apply Contexts Workflow

```
USAGE
  $ snyk-broker-config workflows contexts apply [APIURL] [APIVERSION] [--json] [--log-level
    debug|warn|error|info|trace]

ARGUMENTS
  APIURL      [default: https://api.dev.snyk.io] API URL
  APIVERSION  [default: 2024-02-08~experimental] API Version

GLOBAL FLAGS
  --json                Format output as json.
  --log-level=<option>  [default: info] Specify level for logging.
                        <options: debug|warn|error|info|trace>

DESCRIPTION
  Universal Broker - Apply Contexts Workflow

EXAMPLES
  $ snyk-broker-config workflows contexts apply
```

_See code: [src/commands/workflows/contexts/apply.ts](https://github.com/snyk/snyk-broker-config/blob/v1.17.3/src/commands/workflows/contexts/apply.ts)_

## `snyk-broker-config workflows contexts create [APIURL] [APIVERSION]`

Universal Broker - Create Context Workflow

```
USAGE
  $ snyk-broker-config workflows contexts create [APIURL] [APIVERSION] [--json] [--log-level
    debug|warn|error|info|trace]

ARGUMENTS
  APIURL      [default: https://api.dev.snyk.io] API URL
  APIVERSION  [default: 2024-02-08~experimental] API Version

GLOBAL FLAGS
  --json                Format output as json.
  --log-level=<option>  [default: info] Specify level for logging.
                        <options: debug|warn|error|info|trace>

DESCRIPTION
  Universal Broker - Create Context Workflow

EXAMPLES
  $ snyk-broker-config workflows contexts create
```

_See code: [src/commands/workflows/contexts/create.ts](https://github.com/snyk/snyk-broker-config/blob/v1.17.3/src/commands/workflows/contexts/create.ts)_

## `snyk-broker-config workflows contexts delete [APIURL] [APIVERSION]`

Universal Broker -  Delete Contexts Workflow

```
USAGE
  $ snyk-broker-config workflows contexts delete [APIURL] [APIVERSION] [--json] [--log-level
    debug|warn|error|info|trace]

ARGUMENTS
  APIURL      [default: https://api.dev.snyk.io] API URL
  APIVERSION  [default: 2024-02-08~experimental] API Version

GLOBAL FLAGS
  --json                Format output as json.
  --log-level=<option>  [default: info] Specify level for logging.
                        <options: debug|warn|error|info|trace>

DESCRIPTION
  Universal Broker -  Delete Contexts Workflow

EXAMPLES
  $ snyk-broker-config workflows contexts delete
```

_See code: [src/commands/workflows/contexts/delete.ts](https://github.com/snyk/snyk-broker-config/blob/v1.17.3/src/commands/workflows/contexts/delete.ts)_

## `snyk-broker-config workflows contexts get [APIURL] [APIVERSION]`

Universal Broker - Get Contexts Workflow

```
USAGE
  $ snyk-broker-config workflows contexts get [APIURL] [APIVERSION] [--json] [--log-level
    debug|warn|error|info|trace]

ARGUMENTS
  APIURL      [default: https://api.dev.snyk.io] API URL
  APIVERSION  [default: 2024-02-08~experimental] API Version

GLOBAL FLAGS
  --json                Format output as json.
  --log-level=<option>  [default: info] Specify level for logging.
                        <options: debug|warn|error|info|trace>

DESCRIPTION
  Universal Broker - Get Contexts Workflow

EXAMPLES
  $ snyk-broker-config workflows contexts get
```

_See code: [src/commands/workflows/contexts/get.ts](https://github.com/snyk/snyk-broker-config/blob/v1.17.3/src/commands/workflows/contexts/get.ts)_

## `snyk-broker-config workflows contexts list [APIURL] [APIVERSION]`

Universal Broker - List Contexts Workflow

```
USAGE
  $ snyk-broker-config workflows contexts list [APIURL] [APIVERSION] [--json] [--log-level
    debug|warn|error|info|trace]

ARGUMENTS
  APIURL      [default: https://api.dev.snyk.io] API URL
  APIVERSION  [default: 2024-02-08~experimental] API Version

GLOBAL FLAGS
  --json                Format output as json.
  --log-level=<option>  [default: info] Specify level for logging.
                        <options: debug|warn|error|info|trace>

DESCRIPTION
  Universal Broker - List Contexts Workflow

EXAMPLES
  $ snyk-broker-config workflows contexts list
```

_See code: [src/commands/workflows/contexts/list.ts](https://github.com/snyk/snyk-broker-config/blob/v1.17.3/src/commands/workflows/contexts/list.ts)_

## `snyk-broker-config workflows contexts usage [APIURL] [APIVERSION]`

Universal Broker - Contexts Usage Workflow

```
USAGE
  $ snyk-broker-config workflows contexts usage [APIURL] [APIVERSION] [--json] [--log-level
    debug|warn|error|info|trace]

ARGUMENTS
  APIURL      [default: https://api.dev.snyk.io] API URL
  APIVERSION  [default: 2024-02-08~experimental] API Version

GLOBAL FLAGS
  --json                Format output as json.
  --log-level=<option>  [default: info] Specify level for logging.
                        <options: debug|warn|error|info|trace>

DESCRIPTION
  Universal Broker - Contexts Usage Workflow

EXAMPLES
  $ snyk-broker-config workflows contexts usage
```

_See code: [src/commands/workflows/contexts/usage.ts](https://github.com/snyk/snyk-broker-config/blob/v1.17.3/src/commands/workflows/contexts/usage.ts)_

## `snyk-broker-config workflows contexts withdraw [APIURL] [APIVERSION]`

Universal Broker -  Withdraw Contexts Workflow

```
USAGE
  $ snyk-broker-config workflows contexts withdraw [APIURL] [APIVERSION] [--json] [--log-level
    debug|warn|error|info|trace]

ARGUMENTS
  APIURL      [default: https://api.dev.snyk.io] API URL
  APIVERSION  [default: 2024-02-08~experimental] API Version

GLOBAL FLAGS
  --json                Format output as json.
  --log-level=<option>  [default: info] Specify level for logging.
                        <options: debug|warn|error|info|trace>

DESCRIPTION
  Universal Broker -  Withdraw Contexts Workflow

EXAMPLES
  $ snyk-broker-config workflows contexts withdraw
```

_See code: [src/commands/workflows/contexts/withdraw.ts](https://github.com/snyk/snyk-broker-config/blob/v1.17.3/src/commands/workflows/contexts/withdraw.ts)_

## `snyk-broker-config workflows credentials create [APIURL] [APIVERSION]`

Universal Broker - Create Credentials Workflow

```
USAGE
  $ snyk-broker-config workflows credentials create [APIURL] [APIVERSION] [--json] [--log-level
    debug|warn|error|info|trace]

ARGUMENTS
  APIURL      [default: https://api.dev.snyk.io] API URL
  APIVERSION  [default: 2024-02-08~experimental] API Version

GLOBAL FLAGS
  --json                Format output as json.
  --log-level=<option>  [default: info] Specify level for logging.
                        <options: debug|warn|error|info|trace>

DESCRIPTION
  Universal Broker - Create Credentials Workflow

EXAMPLES
  $ snyk-broker-config workflows credentials create
```

_See code: [src/commands/workflows/credentials/create.ts](https://github.com/snyk/snyk-broker-config/blob/v1.17.3/src/commands/workflows/credentials/create.ts)_

## `snyk-broker-config workflows credentials delete [APIURL] [APIVERSION]`

Universal Broker -  Credentials Deletion Workflow

```
USAGE
  $ snyk-broker-config workflows credentials delete [APIURL] [APIVERSION] [--json] [--log-level
    debug|warn|error|info|trace]

ARGUMENTS
  APIURL      [default: https://api.dev.snyk.io] API URL
  APIVERSION  [default: 2024-02-08~experimental] API Version

GLOBAL FLAGS
  --json                Format output as json.
  --log-level=<option>  [default: info] Specify level for logging.
                        <options: debug|warn|error|info|trace>

DESCRIPTION
  Universal Broker -  Credentials Deletion Workflow

EXAMPLES
  [with exported TENANT_ID, INSTALL_ID]

  $ snyk-broker-config workflows credentials delete

  [inline TENANT_ID,INSTALL_ID]

  $ snyk-broker-config workflows credentials delete TENANT_ID INSTALL_ID
```

_See code: [src/commands/workflows/credentials/delete.ts](https://github.com/snyk/snyk-broker-config/blob/v1.17.3/src/commands/workflows/credentials/delete.ts)_

## `snyk-broker-config workflows credentials get [APIURL] [APIVERSION]`

Universal Broker - Get Credentials Workflow

```
USAGE
  $ snyk-broker-config workflows credentials get [APIURL] [APIVERSION] [--json] [--log-level
    debug|warn|error|info|trace]

ARGUMENTS
  APIURL      [default: https://api.dev.snyk.io] API URL
  APIVERSION  [default: 2024-02-08~experimental] API Version

GLOBAL FLAGS
  --json                Format output as json.
  --log-level=<option>  [default: info] Specify level for logging.
                        <options: debug|warn|error|info|trace>

DESCRIPTION
  Universal Broker - Get Credentials Workflow

EXAMPLES
  $ snyk-broker-config workflows credentials get
```

_See code: [src/commands/workflows/credentials/get.ts](https://github.com/snyk/snyk-broker-config/blob/v1.17.3/src/commands/workflows/credentials/get.ts)_

## `snyk-broker-config workflows deployments create [APIURL] [APIVERSION]`

Universal Broker - Create Deployment Workflow

```
USAGE
  $ snyk-broker-config workflows deployments create [APIURL] [APIVERSION] [--json] [--log-level
    debug|warn|error|info|trace]

ARGUMENTS
  APIURL      [default: https://api.dev.snyk.io] API URL
  APIVERSION  [default: 2024-02-08~experimental] API Version

GLOBAL FLAGS
  --json                Format output as json.
  --log-level=<option>  [default: info] Specify level for logging.
                        <options: debug|warn|error|info|trace>

DESCRIPTION
  Universal Broker - Create Deployment Workflow

EXAMPLES
  $ snyk-broker-config workflows deployments create
```

_See code: [src/commands/workflows/deployments/create.ts](https://github.com/snyk/snyk-broker-config/blob/v1.17.3/src/commands/workflows/deployments/create.ts)_

## `snyk-broker-config workflows deployments delete [APIURL] [APIVERSION]`

Universal Broker -  Delete Deployment workflow

```
USAGE
  $ snyk-broker-config workflows deployments delete [APIURL] [APIVERSION] [--json] [--log-level
    debug|warn|error|info|trace]

ARGUMENTS
  APIURL      [default: https://api.dev.snyk.io] API URL
  APIVERSION  [default: 2024-02-08~experimental] API Version

GLOBAL FLAGS
  --json                Format output as json.
  --log-level=<option>  [default: info] Specify level for logging.
                        <options: debug|warn|error|info|trace>

DESCRIPTION
  Universal Broker - Delete Deployment workflow

EXAMPLES
  $ snyk-broker-config workflows deployments delete
```

_See code: [src/commands/workflows/deployments/delete.ts](https://github.com/snyk/snyk-broker-config/blob/v1.17.3/src/commands/workflows/deployments/delete.ts)_

## `snyk-broker-config workflows deployments get [APIURL] [APIVERSION]`

Universal Broker - Get Deployments Workflow

```
USAGE
  $ snyk-broker-config workflows deployments get [APIURL] [APIVERSION] [--json] [--log-level
    debug|warn|error|info|trace]

ARGUMENTS
  APIURL      [default: https://api.dev.snyk.io] API URL
  APIVERSION  [default: 2024-02-08~experimental] API Version

GLOBAL FLAGS
  --json                Format output as json.
  --log-level=<option>  [default: info] Specify level for logging.
                        <options: debug|warn|error|info|trace>

DESCRIPTION
  Universal Broker - Get Deployments Workflow

EXAMPLES
  $ snyk-broker-config workflows deployments get
```

_See code: [src/commands/workflows/deployments/get.ts](https://github.com/snyk/snyk-broker-config/blob/v1.17.3/src/commands/workflows/deployments/get.ts)_

## `snyk-broker-config workflows deployments update [APIURL] [APIVERSION]`

Universal Broker - Update Deployment Workflow

```
USAGE
  $ snyk-broker-config workflows deployments update [APIURL] [APIVERSION] [--json] [--log-level
    debug|warn|error|info|trace]

ARGUMENTS
  APIURL      [default: https://api.dev.snyk.io] API URL
  APIVERSION  [default: 2024-02-08~experimental] API Version

GLOBAL FLAGS
  --json                Format output as json.
  --log-level=<option>  [default: info] Specify level for logging.
                        <options: debug|warn|error|info|trace>

DESCRIPTION
  Universal Broker - Update Deployment Workflow

EXAMPLES
  $ snyk-broker-config workflows deployments update
```

_See code: [src/commands/workflows/deployments/update.ts](https://github.com/snyk/snyk-broker-config/blob/v1.17.3/src/commands/workflows/deployments/update.ts)_

## `snyk-broker-config workflows integrations get [APIURL] [APIVERSION]`

Universal Broker - Get Connection Integration Workflow

```
USAGE
  $ snyk-broker-config workflows integrations get [APIURL] [APIVERSION] [--json] [--log-level
    debug|warn|error|info|trace]

ARGUMENTS
  APIURL      [default: https://api.dev.snyk.io] API URL
  APIVERSION  [default: 2024-02-08~experimental] API Version

GLOBAL FLAGS
  --json                Format output as json.
  --log-level=<option>  [default: info] Specify level for logging.
                        <options: debug|warn|error|info|trace>

DESCRIPTION
  Universal Broker - Get Connection Integration Workflow

EXAMPLES
  $ snyk-broker-config workflows integrations get
```

_See code: [src/commands/workflows/integrations/get.ts](https://github.com/snyk/snyk-broker-config/blob/v1.17.3/src/commands/workflows/integrations/get.ts)_
<!-- commandsstop -->
