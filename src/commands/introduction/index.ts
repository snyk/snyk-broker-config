import {select} from '@inquirer/prompts'
import {ux} from '@oclif/core'
//  @ts-expect-error VSCode complain about types otherwise
import * as treeify from 'object-treeify'
import {wrapText} from '../../utils/display.js'
import {BaseCommand} from '../../base-command.js'

export default class Intro extends BaseCommand<typeof Intro> {
  static description = 'Universal Broker - Introduction'

  static examples = [`<%= config.bin %> <%= command.id %>`]

  async run(): Promise<void> {
    this.log('\n' + ux.colorize('red', Intro.description))

    const connectionsGraphModelBasic = treeify.default(
      {
        tenant: {
          deployment: {
            credentials_reference: {MY_GL_LOCAL_ENV_VAR: {type: 'gitlab'}},
            connections: {
              'my gitlab conn': {
                type: 'gitlab',
                settings: {GITLAB: 'https://mygitlab.company.com', GITLAB_TOKEN: 'MY_GL_LOCAL_ENV_VAR'},
              },
            },
          },
        },
      },
      {
        /* options */
      },
    )

    // const connectionsGraphModelSharingCreds = treeify.default(
    //   {
    //     tenant: {
    //       deployment: {
    //         credentials_reference: {
    //           MY_GL_LOCAL_ENV_VAR: {type: 'gitlab'},
    //           MY_GL_LOCAL_ENV_VAR2: {type: 'gitlab'},
    //           MY_GH_LOCAL_ENV_VAR: {type: 'github'},
    //         },
    //         connections: {
    //           'my gitlab conn': {
    //             type: 'gitlab',
    //             settings: {GITLAB: 'https://mygitlab.company.com', GITLAB_TOKEN: 'MY_GL_LOCAL_ENV_VAR'},
    //           },
    //           'my other gitlab conn': {
    //             type: 'gitlab',
    //             settings: {GITLAB: 'https://mygitlab2.company.com', GITLAB_TOKEN: 'MY_GL_LOCAL_ENV_VAR2'},
    //           },
    //         },
    //       },
    //     },
    //   },
    //   {
    //     /* options */
    //   },
    // )

    const connectionsIntegrationsModelBasic = treeify.default(
      {
        'my gitlab conn': {
          org_id: {integration_id: {type: 'gitlab'}},
          org_id2: {integration_id2: {type: 'gitlab'}},
          org_id3: {integration_id3: {type: 'gitlab'}},
          org_id4: {integration_id4: {type: 'gitlab'}},
        },
      },
      {
        /* options */
      },
    )

    const introText = `
    The Universal Broker is redefining how Snyk integrates with various systems, greatly improving the Broker client's deployment scalability, management and monitoring.
    It introduces the following concepts:
    - Deployment
    - Credentials Reference
    - Connection
    - Connection Integration

    The general model can be viewed as follows:
    `
    const introText2 = `
    Define this model once and start up your Broker client with the Deployment ID parameters. It will retrieve the connections the Deployment supports and will be waiting for traffic.
    Once your connections are configured, you can integrate the Connection with any Org of your choice (currently restricted to the same group during Beta), now or later.
    `
    const connectionsIntegrationsIntroText = `
    Once connections are configured, they can be used by organizations' integrations.
    `
    const helpConcepts = {
      deployments: `
    A Deployment represents the running Broker client(s), either as a standalone container or a Kubernetes Deployment with multiple replicas in High Availability Mode. It represents the running code, configured with all the local environment variables required for proxy usage, private certificate authority, custom pod specs, etc.

    It is purposely not including any of the connection specifics which are instead defined remotely in the Snyk platform, this greatly simplifies the local configuration complexity while offering greater flexibility overall.

    A Deployment is meant to be a set and forget component, running code which will handle Creating, Reading, Updating and Deleting Connections.

    The Deployment creation process requires the following parameters:
    - Tenant ID
    - Org ID against which the Broker App was installed
    - The install ID associated
    - [optional] Key/value pairs metadata to help you keeping track of your Deployments

    The "snyk-broker-config workflows connection create" command will walk you through those steps.
    `,
      credentials: `
    In Universal Broker, Credential references are local environment variables expected to be found in a Deployment. Snyk Broker allows you to keep any sensitive value/token local to your network, never sharing them with Snyk. These references are then used in the requests brokering to inject the relevant credentials on the way to the downstream system integrated with Snyk (e.g SCM, Jira, Artifactory, etc).

    Credential references are linked to a Deployment, representing secret values passed into the container/deployment, either via environment variables or by secret mounting into secret files. It avoids hard coding these values in connections registered in the Snyk platform.

    Credential references can be shared across connections of the same type in the same Deployment. It provides flexibility in connections configuration as well as supporting specific use cases where several connections are required (e.g azure-repos integrations with numerous Azure Org names).

    Further improvements will bring the ability to share multiple credential references for a single parameter based on other factors.

    The "snyk-broker-config workflows credentials create" command will walk you through credentials creation steps.
    `,
      connections: `
    Connections are now properly represented in the Snyk platform with a stable identity, distinct from integrations. A Connection represents a connection to a particular system type (github, gitlab, jira, ...) using a particular set of credentials defined as such under a given deployment (see credentials topic for more details).

    Whether this connection is in use by 1 or more integrations/organizations, we still reason about a single connection to a system, which is then integrated against a specific integration in an Org. Since it is most likely to be integrated against more than one org/integration, one can simply 'integrate' an existing connection against the relevant integrationId without having to redefine the connection parameters or credentials.

    Similarly, removing a Connection for an Org is a simple disconnection, not deleting the connection and possibly impacting other organizations' integrations.

    Create a Connection once, and integrate against as many integrations as needed.

    The "snyk-broker-config workflows connections create" command will walk you through the connection creation steps.
    The "snyk-broker-config workflows connections integrate" command will walk you through the integration steps.
    The "snyk-broker-config workflows connections disconnect" command will walk you through the disconnection steps.
      `,
    }

    const helpText: Record<string, any> = {}
    for (const content of Object.entries(helpConcepts)) {
      helpText[content[0]] = {id: content[0], value: content[0], text: wrapText(content[1])}
    }
    helpText['exit'] = {id: 'exit', value: 'exit', text: 'Goodbye.'}

    this.log('\n' + ux.colorize('blueBright', introText))
    this.log(connectionsGraphModelBasic)

    this.log('\n' + ux.colorize('blueBright', introText2))
    this.log('\n' + ux.colorize('blueBright', connectionsIntegrationsIntroText))

    this.log(connectionsIntegrationsModelBasic)
    this.log(ux.colorize('cyan', '______________________________'))
    const choices = Object.values(helpText).map((x) => {
      return {id: x.id, value: x.value}
    })

    let choice
    while (choice !== 'exit') {
      choice = await select({
        message: 'Learn more about >',
        choices: choices,
      })

      const {text} = helpText[choice]
      this.log(ux.colorize('blueBright', text))
    }
  }
}
