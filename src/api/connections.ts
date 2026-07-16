import {getCommonHeaders} from '../common/rest-helpers.js'
import {getConfig} from '../config/config.js'
import {getAuthHeader} from '../utils/auth.js'
import {HttpRequest, makeRequest} from '../utils/http-request.js'
import {ApiError} from '../utils/errors.js'
import {createLogger} from '../utils/logger.js'
import {
  ConnectionResponse,
  ConnectionsResponse,
  GetOrgsForBulkMigrationResponse,
  applyBulkMigrationResponse,
} from './types.js'

const logger = createLogger()

export const getConnectionsForDeployment = async (tenantId: string, installId: string, deploymentId: string) => {
  const headers = {...getCommonHeaders(), ...getAuthHeader()}
  const apiPath = `rest/tenants/${tenantId}/brokers/installs/${installId}/deployments/${deploymentId}/connections`
  const config = getConfig()

  const req: HttpRequest = {
    url: `${config.API_HOSTNAME}/${apiPath}?version=${config.API_VERSION}`,
    headers: headers,
    method: 'GET',
    operation: 'list connections',
  }
  try {
    const response = await makeRequest(req)
    logger.debug({url: req.url, statusCode: response.statusCode, response: response.body}, 'Response')
    return JSON.parse(response.body) as ConnectionsResponse
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 404) {
      return {data: [], jsonapi: {version: ''}, links: {}}
    }
    throw error
  }
}

export const applyBulkMigration = async (
  tenantId: string,
  installId: string,
  deploymentId: string,
  connectionId: string,
): Promise<applyBulkMigrationResponse> => {
  const headers = {...getCommonHeaders(), ...getAuthHeader()}
  const apiPath = `rest/tenants/${tenantId}/brokers/installs/${installId}/deployments/${deploymentId}/connections/${connectionId}/bulk_migration`
  const config = getConfig()

  const body = {
    data: {
      type: 'broker_migration',
    },
  }

  const req: HttpRequest = {
    url: `${config.API_HOSTNAME}/${apiPath}?version=${config.API_VERSION}`,
    headers: headers,
    method: 'POST',
    body: JSON.stringify(body),
    operation: 'start bulk migration',
  }
  const response = await makeRequest(req)
  logger.debug({url: req.url, statusCode: response.statusCode, response: response.body}, 'Response')
  return JSON.parse(response.body) as applyBulkMigrationResponse
}

export const getBulkMigrationOrgs = async (
  tenantId: string,
  installId: string,
  deploymentId: string,
  connectionId: string,
): Promise<GetOrgsForBulkMigrationResponse> => {
  const headers = {...getCommonHeaders(), ...getAuthHeader()}
  const apiPath = `rest/tenants/${tenantId}/brokers/installs/${installId}/deployments/${deploymentId}/connections/${connectionId}/bulk_migration`
  const config = getConfig()

  const req: HttpRequest = {
    url: `${config.API_HOSTNAME}/${apiPath}?version=${config.API_VERSION}`,
    headers: headers,
    method: 'GET',
    operation: 'list bulk migration orgs',
  }
  const response = await makeRequest(req)
  logger.debug({url: req.url, statusCode: response.statusCode, response: response.body}, 'Response')
  return JSON.parse(response.body) as GetOrgsForBulkMigrationResponse
}

export const createConnectionForDeployment = async (
  tenantId: string,
  installId: string,
  deploymentId: string,
  friendlyName: string,
  connectionType: string,
  requiredConfigurationAttributes: Record<string, string>,
) => {
  const headers = {...getCommonHeaders(), ...getAuthHeader()}
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
    operation: 'create the connection',
  }

  const response = await makeRequest(req)
  logger.debug({url: req.url, statusCode: response.statusCode, response: response.body}, 'Response')
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
  const headers = {...getCommonHeaders(), ...getAuthHeader()}
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
    operation: 'update the connection',
  }
  const response = await makeRequest(req)
  logger.debug({url: req.url, statusCode: response.statusCode, response: response.body}, 'Response')
  return response.body
}

export const deleteConnectionForDeployment = async (
  tenantId: string,
  installId: string,
  deploymentId: string,
  connectionId: string,
) => {
  const headers = {...getCommonHeaders(), ...getAuthHeader()}
  const config = getConfig()

  const apiPath = `rest/tenants/${tenantId}/brokers/installs/${installId}/deployments/${deploymentId}/connections/${connectionId}`
  const req: HttpRequest = {
    url: `${config.API_HOSTNAME}/${apiPath}?version=${config.API_VERSION}`,
    headers: headers,
    method: 'DELETE',
    operation: 'delete the connection',
  }
  const response = await makeRequest(req)
  logger.debug({url: req.url, statusCode: response.statusCode, response: response.body}, 'Response')

  return response.statusCode
}
