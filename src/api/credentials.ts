import {commonHeaders} from '../common/rest-helpers.js'
import {getConfig} from '../config/config.js'
import {getAuthHeader} from '../utils/auth.js'
import {HttpRequest, makeRequest} from '../utils/http-request.js'
import {createLogger} from '../utils/logger.js'
import {CredentialsAttributes, CredentialsListResponse, CredentialsResponse, NewCredentialsResponse} from './types.js'

const logger = createLogger('snyk-broker-config')

export const getCredentialsForDeployment = async (tenantId: string, installId: string, deploymentId: string) => {
  const headers = {...commonHeaders, ...getAuthHeader()}
  const apiPath = `rest/tenants/${tenantId}/brokers/installs/${installId}/deployments/${deploymentId}/credentials`
  const config = getConfig()

  const req: HttpRequest = {
    url: `${config.API_HOSTNAME}/${apiPath}?version=${config.API_VERSION}`,
    headers: headers,
    method: 'GET',
  }
  try {
    const response = await makeRequest(req)
    logger.debug({url: req.url, statusCode: response.statusCode, response: response.body}, 'Response')
    return JSON.parse(response.body) as CredentialsListResponse
  } catch (error: any) {
    throw new Error(error)
  }
}

export const getCredentialForDeployment = async (
  tenantId: string,
  installId: string,
  deploymentId: string,
  credentialId: string,
) => {
  const headers = {...commonHeaders, ...getAuthHeader()}
  const apiPath = `rest/tenants/${tenantId}/brokers/installs/${installId}/deployments/${deploymentId}/credentials/${credentialId}`
  const config = getConfig()

  const req: HttpRequest = {
    url: `${config.API_HOSTNAME}/${apiPath}?version=${config.API_VERSION}`,
    headers: headers,
    method: 'GET',
  }
  try {
    const response = await makeRequest(req)
    logger.debug({url: req.url, statusCode: response.statusCode, response: response.body}, 'Response')
    return JSON.parse(response.body) as CredentialsResponse
  } catch (error: any) {
    throw new Error(error)
  }
}

export const createCredentials = async (
  tenantId: string,
  installId: string,
  deploymentId: string,
  attributesArray: CredentialsAttributes[],
) => {
  const headers = {...commonHeaders, ...getAuthHeader()}
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
  }
  try {
    const response = await makeRequest(req)
    logger.debug({url: req.url, statusCode: response.statusCode, response: response.body}, 'Response')
    return JSON.parse(response.body) as NewCredentialsResponse
  } catch (error: any) {
    throw new Error(error)
  }
}

export const deleteCredentials = async (
  tenantId: string,
  installId: string,
  deploymentId: string,
  credentialsId: string,
) => {
  const headers = {...commonHeaders, ...getAuthHeader()}
  const config = getConfig()

  const apiPath = `rest/tenants/${tenantId}/brokers/installs/${installId}/deployments/${deploymentId}/credentials/${credentialsId}`
  const req: HttpRequest = {
    url: `${config.API_HOSTNAME}/${apiPath}?version=${config.API_VERSION}`,
    headers: headers,
    method: 'DELETE',
  }
  try {
    const response = await makeRequest(req)
    logger.debug({url: req.url, statusCode: response.statusCode, response: response.body}, 'Response')
    return response.statusCode
  } catch (error: any) {
    throw new Error(error)
  }
}

export const updateCredentials = async (
  tenantId: string,
  installId: string,
  deploymentId: string,
  credentialsId: string,
  attributes: CredentialsAttributes,
) => {
  const headers = {...commonHeaders, ...getAuthHeader()}
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
  }
  try {
    const response = await makeRequest(req)
    logger.debug({url: req.url, statusCode: response.statusCode, response: response.body}, 'Response')
    return response.body
  } catch (error: any) {
    throw new Error(error)
  }
}
