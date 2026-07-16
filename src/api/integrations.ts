import {getCommonHeaders} from '../common/rest-helpers.js'
import {getConfig} from '../config/config.js'
import {getAuthHeader} from '../utils/auth.js'
import {HttpRequest, makeRequest} from '../utils/http-request.js'
import {NotFoundError} from '../utils/api-error.js'
import {createLogger} from '../utils/logger.js'
import {getDummyCredentialsForIntegrationType} from './integrations-utils.js'
import {IntegrationResponse, IntegrationsResponse} from './types.js'

const logger = createLogger()

interface IntegrationBody {
  data: {
    integration_id?: string
    type: string
  }
}
export const getIntegrationsForConnection = async (tenantId: string, connectionId: string) => {
  const headers = {...getCommonHeaders(), ...getAuthHeader()}
  const apiPath = `rest/tenants/${tenantId}/brokers/connections/${connectionId}/integrations`
  const config = getConfig()

  const req: HttpRequest = {
    url: `${config.API_HOSTNAME}/${apiPath}?version=${config.API_VERSION}`,
    headers: headers,
    method: 'GET',
    operation: 'list integrations',
  }
  try {
    const response = await makeRequest(req)
    logger.debug({url: req.url, statusCode: response.statusCode, response: response.body}, 'Response')
    return JSON.parse(response.body) as IntegrationsResponse
  } catch (error) {
    if (error instanceof NotFoundError) {
      return {data: [], jsonapi: {version: ''}, links: {}}
    }
    throw error
  }
}

export const deleteIntegrationsForConnection = async (
  tenantId: string,
  connectionId: string,
  orgId: string,
  integrationId: string,
) => {
  const headers = {...getCommonHeaders(), ...getAuthHeader()}
  const apiPath = `rest/tenants/${tenantId}/brokers/connections/${connectionId}/orgs/${orgId}/integrations/${integrationId}`
  const config = getConfig()

  const req: HttpRequest = {
    url: `${config.API_HOSTNAME}/${apiPath}?version=${config.API_VERSION}`,
    headers: headers,
    method: 'DELETE',
    operation: 'delete the integration',
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
  const headers = {...getCommonHeaders(), ...getAuthHeader()}
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
    operation: 'create the integration',
  }
  const response = await makeRequest(req)
  logger.debug({url: req.url, statusCode: response.statusCode, response: response.body}, 'Response')
  return JSON.parse(response.body) as IntegrationResponse
}

export const disconnectIntegrationForOrgIdAndIntegrationId = async (
  orgId: string,
  integrationId: string,
  type: string,
): Promise<void> => {
  const headers = {
    ...getCommonHeaders(),
    'user-agent': 'Hybrid Platform Service',
    'Content-Type': 'application/json; charset=utf-8',
    ...getAuthHeader(),
  }
  const apiPath = `v1/org/${orgId}/integrations/${integrationId}`
  const config = getConfig()

  const integrationCredentials = getDummyCredentialsForIntegrationType(type)

  const body = JSON.stringify({
    type: type,
    broker: {enabled: false},
    credentials: integrationCredentials,
  })

  const req: HttpRequest = {
    url: `${config.API_HOSTNAME}/${apiPath}`,
    headers: headers,
    method: 'PUT',
    body: body,
    operation: 'disconnect the integration',
  }
  const response = await makeRequest(req)
  logger.debug({url: req.url, statusCode: response.statusCode, response: response.body}, 'Response')
}
