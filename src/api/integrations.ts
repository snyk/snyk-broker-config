import {commonHeaders} from '../common/rest-helpers.js'
import {getConfig} from '../config/config.js'
import {getAuthHeader} from '../utils/auth.js'
import {HttpRequest, makeRequest} from '../utils/http-request.js'
import {createLogger} from '../utils/logger.js'

const logger = createLogger('snyk-broker-config')

export const getIntegrationsForConnection = async (tenantId: string, connectionId: string) => {
  const headers = {...commonHeaders, ...getAuthHeader()}
  const apiPath = `rest/tenants/${tenantId}/brokers/connections/${connectionId}/integrations`
  const config = getConfig()

  const req: HttpRequest = {
    url: `${config.API_HOSTNAME}/${apiPath}?version=${config.API_VERSION}`,
    headers: headers,
    method: 'GET',
  }
  const response = await makeRequest(req)
  logger.debug({statusCode: response.statusCode, response: response.body}, 'Response')
  return response.body
}

export const deleteIntegrationsForConnection = async (
  tenantId: string,
  connectionId: string,
  orgId: string,
  integrationId: string,
) => {
  const headers = {...commonHeaders, ...getAuthHeader()}
  const apiPath = `rest/tenants/${tenantId}/brokers/connections/${connectionId}/orgs/${orgId}/integrations/${integrationId}`
  const config = getConfig()

  const req: HttpRequest = {
    url: `${config.API_HOSTNAME}/${apiPath}?version=${config.API_VERSION}`,
    headers: headers,
    method: 'DELETE',
  }
  const response = await makeRequest(req)
  logger.debug({statusCode: response.statusCode, response: response.body}, 'Response')
  return response.statusCode
}
