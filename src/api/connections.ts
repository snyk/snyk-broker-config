import {commonHeaders} from '../common/rest-helpers.js'
import {getConfig} from '../config/config.js'
import {getAuthHeader} from '../utils/auth.js'
import {HttpRequest, makeRequest} from '../utils/http-request.js'
import {createLogger} from '../utils/logger.js'
import {ConnectionResponse} from './types.js'

const logger = createLogger('snyk-broker-config')

export const getConnectionsForDeployment = async (tenantId: string, installId: string, deploymentId: string) => {
  const headers = {...commonHeaders, ...getAuthHeader()}
  const apiPath = `rest/tenants/${tenantId}/brokers/installs/${installId}/deployments/${deploymentId}/connections`
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

export const createConnectionForDeployment = async (
  tenantId: string,
  installId: string,
  deploymentId: string,
  friendlyName: string,
  connectionType: string,
  requiredConfigurationAttributes: Record<string, string>,
) => {
  const headers = {...commonHeaders, ...getAuthHeader()}
  const apiPath = `rest/tenants/${tenantId}/brokers/installs/${installId}/deployments/${deploymentId}/connections`
  const config = getConfig()

  const body = {
    data: {
      type: 'broker_connection',
      attributes: {
        name: friendlyName,
        deployment_id: deploymentId,
        configuration: {
          required: {
            ...requiredConfigurationAttributes,
          },
          type: connectionType,
        },
      },
    },
  }
  const req: HttpRequest = {
    url: `${config.API_HOSTNAME}/${apiPath}?version=${config.API_VERSION}`,
    headers: headers,
    method: 'POST',
    body: JSON.stringify(body),
  }
  const response = await makeRequest(req)
  logger.debug({statusCode: response.statusCode, response: response.body}, 'Response')
  return JSON.parse(response.body) as ConnectionResponse
}

export const updateConnectionForDeployment = async (
  tenantId: string,
  installId: string,
  deploymentId: string,
  connectionId: string,
  friendlyName: string,
  connectionType: string,
  requiredConfigurationAttributes: Record<string, string>,
) => {
  const headers = {...commonHeaders, ...getAuthHeader()}
  const apiPath = `rest/tenants/${tenantId}/brokers/installs/${installId}/deployments/${deploymentId}/connections/${connectionId}`
  const config = getConfig()

  const body = {
    data: {
      type: 'broker_connection',
      attributes: {
        name: friendlyName,
        deployment_id: deploymentId,
        configuration: {
          required: {
            ...requiredConfigurationAttributes,
          },
          type: connectionType,
        },
      },
    },
  }
  const req: HttpRequest = {
    url: `${config.API_HOSTNAME}/${apiPath}?version=${config.API_VERSION}`,
    headers: headers,
    method: 'PATCH',
    body: JSON.stringify(body),
  }
  const response = await makeRequest(req)
  logger.debug({statusCode: response.statusCode, response: response.body}, 'Response')
  return response.body
}

export const deleteConnectionForDeployment = async (
  tenantId: string,
  installId: string,
  deploymentId: string,
  connectionId: string,
) => {
  const headers = {...commonHeaders, ...getAuthHeader()}
  const config = getConfig()

  const apiPath = `rest/tenants/${tenantId}/brokers/installs/${installId}/deployments/${deploymentId}/connections/${connectionId}`
  const req: HttpRequest = {
    url: `${config.API_HOSTNAME}/${apiPath}?version=${config.API_VERSION}`,
    headers: headers,
    method: 'DELETE',
  }
  const response = await makeRequest(req)
  logger.debug({statusCode: response.statusCode, response: response.body}, 'Response')

  return response.statusCode
}
