import {getExistingAppInstalledOnOrgId, installAppIdOnOrgId} from '../api/apps.js'
import {AppInstallOutput} from '../api/types.js'

export const installAppsWorfklow = async (orgId: string): Promise<AppInstallOutput> => {
  const existingInstall = await getExistingAppInstalledOnOrgId(orgId)
  if (existingInstall) {
    return {
      install_id: existingInstall.id,
      client_id: existingInstall.attributes.client_id,
    }
  }
  const installData = await installAppIdOnOrgId(orgId)
  return {
    install_id: installData.data.id,
    client_id: installData.data.attributes.client_id,
    client_secret: installData.data.attributes.client_secret,
  }
}
