import {getCommonHeaders} from '../common/rest-helpers.js'
import {getConfig} from '../config/config.js'
import {getAuthHeader} from '../utils/auth.js'
import {HttpRequest, makeRequest} from '../utils/http-request.js'
import {ApiError} from '../utils/errors.js'
import {createLogger} from '../utils/logger.js'
import {
  CredentialsAttributes,
  CredentialsAttributesEnvVarNames,
  CredentialsListResponse,
  CredentialsResponse,
  NewCredentialsResponse,
} from './types.js'

const logger = createLogger()

export const getCredentialsForDeployment = async (tenantId: string, installId: string, deploymentId: string) => {
  const headers = {...getCommonHeaders(), ...getAuthHeader()}
  const apiPath = `rest/tenants/${tenantId}/brokers/installs/${installId}/deployments/${deploymentId}/credentials`
  const config = getConfig()

  const req: HttpRequest = {
    url: `${config.API_HOSTNAME}/${apiPath}?version=${config.API_VERSION}`,
    headers: headers,
    method: 'GET',
    operation: 'list credentials',
  }
  try {
    const response = await makeRequest(req)
    logger.debug({url: req.url, statusCode: response.statusCode, response: response.body}, 'Response')
    return JSON.parse(response.body) as CredentialsListResponse
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 404) {
      return {data: [], jsonapi: {version: ''}, links: {}}
    }
    throw error
  }
}

export const getCredentialForDeployment = async (
  tenantId: string,
  installId: string,
  deploymentId: string,
  credentialId: string,
) => {
  const headers = {...getCommonHeaders(), ...getAuthHeader()}
  const apiPath = `rest/tenants/${tenantId}/brokers/installs/${installId}/deployments/${deploymentId}/credentials/${credentialId}`
  const config = getConfig()

  const req: HttpRequest = {
    url: `${config.API_HOSTNAME}/${apiPath}?version=${config.API_VERSION}`,
    headers: headers,
    method: 'GET',
    operation: 'get the credential',
  }
  const response = await makeRequest(req)
  logger.debug({url: req.url, statusCode: response.statusCode, response: response.body}, 'Response')
  return JSON.parse(response.body) as CredentialsResponse
}

export const createCredentials = async (
  tenantId: string,
  installId: string,
  deploymentId: string,
  attributesArray: CredentialsAttributes[],
) => {
  const headers = {...getCommonHeaders(), ...getAuthHeader()}
  const apiPath = `rest/tenants/${tenantId}/brokers/installs/${installId}/deployments/${deploymentId}/credentials`
  const config = getConfig()
  const body = {
    data: {
      type: 'deployment_credential',
      attributes: attributesArray,
    },
  }
  const req: HttpRequest = {
    url: `${config.API_HOSTNAME}/${apiPath}?version=${config.API_VERSION}`,
    headers: headers,
    method: 'POST',
    body: JSON.stringify(body),
    operation: 'create credentials',
  }
  const response = await makeRequest(req)
  logger.debug({url: req.url, statusCode: response.statusCode, response: response.body}, 'Response')
  return JSON.parse(response.body) as NewCredentialsResponse
}

export const deleteCredentials = async (
  tenantId: string,
  installId: string,
  deploymentId: string,
  credentialsId: string,
) => {
  const headers = {...getCommonHeaders(), ...getAuthHeader()}
  const config = getConfig()

  const apiPath = `rest/tenants/${tenantId}/brokers/installs/${installId}/deployments/${deploymentId}/credentials/${credentialsId}`
  const req: HttpRequest = {
    url: `${config.API_HOSTNAME}/${apiPath}?version=${config.API_VERSION}`,
    headers: headers,
    method: 'DELETE',
    operation: 'delete credentials',
  }
  const response = await makeRequest(req)
  logger.debug({url: req.url, statusCode: response.statusCode, response: response.body}, 'Response')
  return response.statusCode
}

export const updateCredentials = async (
  tenantId: string,
  installId: string,
  deploymentId: string,
  credentialsId: string,
  attributes: CredentialsAttributes,
) => {
  const headers = {...getCommonHeaders(), ...getAuthHeader()}
  const apiPath = `rest/tenants/${tenantId}/brokers/installs/${installId}/deployments/${deploymentId}/credentials/${credentialsId}`
  const config = getConfig()
  const body = {
    data: {
      type: 'deployment_credential',
      attributes: attributes,
    },
  }
  const req: HttpRequest = {
    url: `${config.API_HOSTNAME}/${apiPath}?version=${config.API_VERSION}`,
    headers: headers,
    method: 'PATCH',
    body: JSON.stringify(body),
    operation: 'update credentials',
  }
  const response = await makeRequest(req)
  logger.debug({url: req.url, statusCode: response.statusCode, response: response.body}, 'Response')
  return response.body
}

export const convertCredsToUuid = async (
  tenantId: string,
  installId: string,
  deploymentId: string,
  attributes: CredentialsAttributesEnvVarNames,
  type: string,
): Promise<CredentialsAttributesEnvVarNames> => {
  const credentialsForDeployment = await getCredentialsForDeployment(tenantId, installId, deploymentId)
  const credentialsForDeploymentData = credentialsForDeployment.data.filter((x) => x.attributes.type === type)

  const convertedAttributes: Record<string, string> = {}
  for (const [key, value] of Object.entries(attributes)) {
    const credAttribute = credentialsForDeploymentData.find((x) =>
      value.includes(x.attributes.environment_variable_name),
    )
    if (!credAttribute) {
      continue
    }
    convertedAttributes[key] = credAttribute?.id
  }

  return convertedAttributes
}
