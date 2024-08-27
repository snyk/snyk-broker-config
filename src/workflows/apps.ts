import {input} from '@inquirer/prompts'
import {getExistingAppInstalledOnOrgId, installAppIdOnOrgId} from '../api/apps.js'
import {getDeployments} from '../api/deployments.js'
import {AppInstallOutput} from '../api/types.js'
import {isValidUUID} from '../utils/validation.js'

export const installAppsWorfklow = async (orgId: string): Promise<AppInstallOutput | string> => {
  const existingInstall = await getExistingAppInstalledOnOrgId(orgId)
  if (existingInstall) {
    return existingInstall.id
  }
  const installData = await installAppIdOnOrgId(orgId)
  return {
    install_id: installData.data.id,
    client_id: installData.data.attributes.client_id,
    client_secret: installData.data.attributes.client_secret,
  }
}

export const getAppInstalledOnOrgId = async (tenantId: string, installId: string): Promise<string> => {
  let orgId
  const deployments = await getDeployments(tenantId, installId)
  if (deployments.data && deployments.data.length === 0) {
    orgId = await input({message: 'Enter the Org ID where you installed your Broker App'})
    if (!isValidUUID(installId)) {
      throw new Error('Invalid Org ID entered.')
    }
  } else {
    const deploymentsList = deployments.data as Array<any>
    orgId = deploymentsList[0].attributes.broker_app_installed_in_org_id
  }
  return orgId
}
