import {commonHeaders} from '../common/rest-helpers.js'
import {getConfig} from '../config/config.js'
import {getAuthHeader} from '../utils/auth.js'
import {HttpRequest, makeRequest} from '../utils/http-request.js'
import {createLogger} from '../utils/logger.js'
import {ContextResponse, ContextsResponse} from './types.js'

const logger = createLogger('snyk-broker-config')

export const getContextForForDeployment = async (tenantId: string, installId: string, deploymentId: string) => {
  const headers = {...commonHeaders, ...getAuthHeader()}
  const apiPath = `rest/tenants/${tenantId}/brokers/installs/${installId}/deployments/${deploymentId}/contexts`
  const config = getConfig()

  const req: HttpRequest = {
    url: `${config.API_HOSTNAME}/${apiPath}?version=${config.API_VERSION}`,
    headers: headers,
    method: 'GET',
  }
  try {
    const response = await makeRequest(req)
    logger.debug({url: req.url, statusCode: response.statusCode, response: response.body}, 'Response')
    return JSON.parse(response.body) as ContextsResponse
  } catch (error: any) {
    throw new Error(error)
  }
}

export const createContextForConnection = async (
  tenantId: string,
  installId: string,
  deploymentId: string,
  connectionId: string,
  parameters: Record<string, string>,
) => {
  const headers = {...commonHeaders, ...getAuthHeader()}
  const apiPath = `rest/tenants/${tenantId}/brokers/installs/${installId}/deployments/${deploymentId}/contexts`
  const config = getConfig()

  const body = {
    data: {
      type: 'broker_context',
      attributes: {
        context: parameters,
        connection_id: connectionId,
      },
    },
  }
  const req: HttpRequest = {
    url: `${config.API_HOSTNAME}/${apiPath}?version=${config.API_VERSION}`,
    headers: headers,
    method: 'POST',
    body: JSON.stringify(body),
  }

  try {
    const response = await makeRequest(req)
    logger.debug({url: req.url, statusCode: response.statusCode, response: response.body}, 'Response')
    return JSON.parse(response.body) as ContextResponse
  } catch (error: any) {
    throw new Error(error)
  }
}

export const deleteContextById = async (tenantId: string, installId: string, contextId: string) => {
  const headers = {...commonHeaders, ...getAuthHeader()}
  const config = getConfig()

  const apiPath = `rest/tenants/${tenantId}/brokers/installs/${installId}/contexts/${contextId}`
  const req: HttpRequest = {
    url: `${config.API_HOSTNAME}/${apiPath}?version=${config.API_VERSION}`,
    headers: headers,
    method: 'DELETE',
  }

  const response = await makeRequest(req)
  logger.debug({url: req.url, statusCode: response.statusCode, response: response.body}, 'Response')
  if (!response.statusCode || response.statusCode > 299) {
    throw new Error(`Deleting context ${contextId}. Response code ${response.statusCode ?? 'none'}.`)
  }
  return response.statusCode
}
