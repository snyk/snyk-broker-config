import {getExistingAppInstalledOnOrgId, installAppIdOnOrgId} from '../api/apps.js'
import {getDeployments, getDeploymentsByTenant} from '../api/deployments.js'
import {AppInstallOutput} from '../api/types.js'
import {isValidUUID} from '../utils/validation.js'
import {validatedInput, ValidationType} from '../utils/input-validation.js'
import {listBrokerAdminOrgs} from '../api/orgs.js'

export interface GetInstallIdAndInstalledOrgIdForTenantResponse {
  installId: string
  installedOrgId: string
  comment?: string
}

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
    orgId = await validatedInput({message: 'Enter the Org ID where you installed your Broker App'}, ValidationType.UUID)
    if (!isValidUUID(installId)) {
      throw new Error('Invalid Org ID entered.')
    }
  } else {
    const deploymentsList = deployments.data as Array<any>
    orgId = deploymentsList[0].attributes.broker_app_installed_in_org_id
  }
  return orgId
}

function deduplicateInstalls(
  installs: GetInstallIdAndInstalledOrgIdForTenantResponse[],
): GetInstallIdAndInstalledOrgIdForTenantResponse[] {
  const uniqueMap = new Map<string, GetInstallIdAndInstalledOrgIdForTenantResponse>()

  for (const install of installs) {
    const key = `${install.installId}-${install.installedOrgId}`
    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, install)
    }
  }

  return [...uniqueMap.values()]
}

export const getInstallIdsWithOrgIdForTenant = async (
  tenantId: string,
  defaultOrgName: string,
): Promise<GetInstallIdAndInstalledOrgIdForTenantResponse[]> => {
  const installIdsWithOrgIds: GetInstallIdAndInstalledOrgIdForTenantResponse[] = []
  const getBrokerAdminOrgsId = await listBrokerAdminOrgs({name: defaultOrgName})
  for (const org of getBrokerAdminOrgsId.data) {
    const defaultInstallIdsAndOrgIds = await getExistingAppInstalledOnOrgId(org.id)
    if (defaultInstallIdsAndOrgIds) {
      installIdsWithOrgIds.push({
        installId: defaultInstallIdsAndOrgIds.id,
        installedOrgId: org.id,
        comment: `(recommended) ${defaultOrgName} (${org.id})`,
      })
    }
  }

  const deployments = await getDeploymentsByTenant(tenantId)
  if (deployments.data && deployments.data.length === 0) {
    return installIdsWithOrgIds
  }
  const deploymentsList = deployments.data as Array<any>
  installIdsWithOrgIds.push(
    ...deploymentsList.map((deployment) => {
      return {
        installedOrgId: deployment.attributes.broker_app_installed_in_org_id,
        installId: deployment.attributes.install_id,
        comment: `Used by deployment ${deployment.id}`,
      }
    }),
  )

  return deduplicateInstalls(installIdsWithOrgIds)
}
