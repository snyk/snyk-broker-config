import {commonHeaders} from '../common/rest-helpers.js'
import {getConfig} from '../config/config.js'
import {getAuthHeader} from '../utils/auth.js'
import {HttpRequest, makeRequest} from '../utils/http-request.js'
import {createLogger} from '../utils/logger.js'
import {AppInstallResponse} from './types.js'

const logger = createLogger('snyk-broker-config')

export const installAppIdOnOrgId = async (orgId: string): Promise<AppInstallResponse> => {
  const appId = process.env.SNYK_BROKER_APP_ID ?? 'cb43d761-bd17-4b44-9b6c-e5b8ad077d33'

  const body = {
    data: {
      type: 'app_install',
    },
    relationships: {
      app: {
        data: {
          id: appId,
          type: 'app',
        },
      },
    },
  }

  const headers = {...commonHeaders, ...getAuthHeader()}
  const apiPath = `rest/orgs/${orgId}/apps/installs`
  const config = getConfig()

  const req: HttpRequest = {
    url: `${config.API_HOSTNAME}/${apiPath}?version=${config.APP_INSTALL_API_VERSION}`,
    headers: headers,
    method: 'POST',
    body: JSON.stringify(body),
  }
  const response = await makeRequest(req)
  logger.debug({statusCode: response.statusCode, response: response.body}, 'Response')
  return response.body
}