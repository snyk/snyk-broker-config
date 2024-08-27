import {commonHeaders} from '../common/rest-helpers.js'
import {getConfig} from '../config/config.js'
import {getAuthHeader} from '../utils/auth.js'
import {HttpRequest, makeRequest} from '../utils/http-request.js'
import {createLogger} from '../utils/logger.js'
import {IntegrationResponse, IntegrationsResponse} from './types.js'

const logger = createLogger('snyk-broker-config')

interface IntegrationBody {
  data: {
    integration_id?: string
    type: string
  }
}
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
  logger.debug({url: req.url, statusCode: response.statusCode, response: response.body}, 'Response')
  return JSON.parse(response.body) as IntegrationsResponse
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
  logger.debug({url: req.url, statusCode: response.statusCode, response: response.body}, 'Response')
  return response.statusCode
}

export const createIntegrationForConnection = async (
  tenantId: string,
  connectionId: string,
  type: string,
  orgId: string,
  integrationId?: string,
): Promise<IntegrationResponse> => {
  const headers = {...commonHeaders, ...getAuthHeader()}
  const apiPath = `rest/tenants/${tenantId}/brokers/connections/${connectionId}/orgs/${orgId}/integration`
  const config = getConfig()

  const body: IntegrationBody = {
    data: {
      type: type,
    },
  }
  if (integrationId) {
    body.data.integration_id = integrationId
  }
  const req: HttpRequest = {
    url: `${config.API_HOSTNAME}/${apiPath}?version=${config.API_VERSION}`,
    headers: headers,
    method: 'POST',
    body: JSON.stringify(body),
  }
  const response = await makeRequest(req)
  logger.debug({url: req.url, statusCode: response.statusCode, response: response.body}, 'Response')
  return JSON.parse(response.body) as IntegrationResponse
}
