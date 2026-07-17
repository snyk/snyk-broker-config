import {getCommonHeaders} from '../common/rest-helpers.js'
import {getConfig} from '../config/config.js'
import {getAuthHeader} from '../utils/auth.js'
import {HttpRequest, makeRequest} from '../utils/http-request.js'
import {ApiError} from '../utils/errors.js'
import {createLogger} from '../utils/logger.js'
import {AppInstallResponse, AppInstallResponseData, AppInstallsResponse} from './types.js'

const logger = createLogger()

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

  const headers = {...getCommonHeaders(), ...getAuthHeader()}
  const apiPath = `rest/orgs/${orgId}/apps/installs`
  const config = getConfig()

  const req: HttpRequest = {
    url: `${config.API_HOSTNAME}/${apiPath}?version=${config.APP_INSTALL_API_VERSION}`,
    headers: headers,
    method: 'POST',
    body: JSON.stringify(body),
    operation: 'install the Broker App',
  }
  try {
    const response = await makeRequest(req)
    logger.debug({url: req.url, statusCode: response.statusCode, response: response.body}, 'Response')
    return JSON.parse(response.body)
  } catch (error: any) {
    const message = error instanceof Error ? error.message : String(error)
    if (message.includes('app not found')) {
      throw new Error(`Unable to find the app ID.
        For pre-prod environments, set the environment variable SNYK_BROKER_APP_ID=921020b6-b167-426e-867b-3e2856a2f56e.
        For snykgov environments, please contact support.
        `)
    }
    throw error
  }
}

export const getExistingAppInstalledOnOrgId = async (orgId: string): Promise<AppInstallResponseData | undefined> => {
  const appId = process.env.SNYK_BROKER_APP_ID ?? 'cb43d761-bd17-4b44-9b6c-e5b8ad077d33'

  const headers = {...getCommonHeaders(), ...getAuthHeader()}
  const apiPath = `rest/orgs/${orgId}/apps/installs`
  const config = getConfig()

  const req: HttpRequest = {
    url: `${config.API_HOSTNAME}/${apiPath}?version=${config.APP_INSTALL_API_VERSION}`,
    headers: headers,
    method: 'GET',
    operation: 'look up the installed Broker App',
  }
  try {
    const response = await makeRequest(req)
    logger.debug({url: req.url, statusCode: response.statusCode, response: response.body}, 'Response')
    const installs = JSON.parse(response.body) as AppInstallsResponse

    return installs.data.find((x) => x.relationships.app.data.id === appId)
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 404) {
      return undefined
    }
    throw error
  }
}
