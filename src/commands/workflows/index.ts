import {Command, ux} from '@oclif/core'
import {commonApiRelatedArgs, commonUniversalBrokerArgs, getCommonIds} from '../../common/args.js'
import {input, confirm} from '@inquirer/prompts'
import {getAppInstalledOnOrgId, installAppsWorfklow} from '../../workflows/apps.js'
import {getDeployments} from '../../api/deployments.js'
import {printFormattedJSON} from '../../utils/display.js'
import {isValidUUID} from '../../utils/validation.js'

interface SetupParameters {
  installId: string
  tenantId: string
  appInstalledOnOrgId: string
}

export default class Workflows extends Command {
  public static enableJsonFlag = true
  static args = {
    ...commonUniversalBrokerArgs(),
    ...commonApiRelatedArgs,
  }

  static description = 'Universal Broker - workflows'

  static examples = [
    `[with exported TENANT_ID,INSTALL_ID]`,
    `<%= config.bin %> <%= command.id %>`,
    `[inline TENANT_ID,INSTALL_ID]`,
    `<%= config.bin %> <%= command.id %> TENANT_ID INSTALL_ID`,
  ]

  //   static flags = {
  //     from: Flags.string({char: 'f', description: 'Who is saying hello', required: true}),
  //   }

  async setupFlow(): Promise<SetupParameters> {
    const snykToken = process.env.SNYK_TOKEN ?? (await input({message: 'Enter your Snyk Token'}))
    process.env.SNYK_TOKEN = snykToken

    const tenantId = process.env.TENANT_ID ?? (await input({message: 'Enter your tenantID'}))
    process.env.TENANT_ID = tenantId

    let orgId
    let installId
    if (process.env.INSTALL_ID) {
      installId = process.env.INSTALL_ID
    } else if (await confirm({message: 'Have you installed the broker app against an org?'})) {
      installId = await input({message: 'Enter your Broker App Install ID'})
      if (!isValidUUID(installId)) {
        this.error(`Must be a valid UUID.`)
      }
      // process.env.INSTALL_ID = installId
    } else {
      orgId = await input({message: `Enter Org Id to install Broker App. Must be in tenant ${tenantId}`})
      const {install_id, client_id, client_secret} = await installAppsWorfklow(orgId)
      installId = install_id
      this.log(ux.colorize('purple', `App installed. Please store the following credentials securely:`))
      this.log(ux.colorize('purple', `- clientId: ${client_id}`))
      this.log(ux.colorize('purple', `- clientSecret: ${client_secret}`))
      this.log(ux.colorize('purple', `You will need them to run your broker client.`))
    }
    const deployments = await getDeployments(tenantId, installId)
    const parsedDeployments = JSON.parse(deployments)

    const appInstalledOnOrgId = orgId ?? (await getAppInstalledOnOrgId(tenantId, installId))
    return {installId, tenantId, appInstalledOnOrgId}
  }

  async run(): Promise<string> {
    this.log('\n' + ux.colorize('red', Workflows.description))

    const {installId, tenantId, appInstalledOnOrgId} = await this.setupFlow()

    this.log(`Now using Tenant Id ${tenantId} and Install Id ${installId}`)

    const deployments = await getDeployments(tenantId, installId)
    const parsedDeployments = JSON.parse(deployments)
    if (parsedDeployments.errors) {
      this.log(`${parsedDeployments.errors[0].detail}`)
      if (await confirm({message: 'Do you want to create a new deployment?'})) {
        this.log('Creating')
      } else {
        this.error(
          'A deployment is needed to get started. Please create one using the deployment create command or running this workflow again. Exiting.',
        )
      }
    } else {
      const deploymentsList = parsedDeployments.data as Array<any>
      this.log(JSON.stringify(deploymentsList))
    }

    return JSON.stringify('')
  }
}
