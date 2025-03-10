import {commonHeaders} from '../common/rest-helpers.js'
import {getConfig} from '../config/config.js'
import {getAuthHeader} from '../utils/auth.js'
import {HttpRequest, makeRequest} from '../utils/http-request.js'
import {createLogger} from '../utils/logger.js'
import {GetInstallIdAndInstalledOrgIdForTenantResponse} from '../workflows/apps.js'
import {AppInstallsApiResponse, CreateOrgV1, CreatedOrgV1, OrgsInstallsResponse, OrgsListResponse} from './types.js'

export const createNewOrg = async (orgData: CreateOrgV1): Promise<CreatedOrgV1> => {
  const body: CreateOrgV1 = {
    name: orgData.name,
  }
  if (orgData.groupId) {
    body.groupId = orgData.groupId
  }

  const headers = {...getAuthHeader(), 'Content-Type': 'application/json'}
  const apiPath = `v1/org`
  const config = getConfig()

  const logger = createLogger('snyk-broker-config')

  const req: HttpRequest = {
    url: `${config.API_HOSTNAME}/${apiPath}`,
    headers: headers,
    method: 'POST',
    body: JSON.stringify(body),
  }
  try {
    const response = await makeRequest(req)
    logger.debug({url: req.url, statusCode: response.statusCode, response: response.body}, 'Response')
    return JSON.parse(response.body) as CreatedOrgV1
  } catch (error: any) {
    throw new Error(error)
  }
}

export const getPossibleExistingBrokerAdminOrgs = async (orgData: CreateOrgV1): Promise<string[]> => {
  const brokerAdminOrgs = await listBrokerAdminOrgs(orgData)
  if (brokerAdminOrgs.data.length === 0) {
    return []
  }
  return brokerAdminOrgs.data.map((x) => x.id)
}

export const listBrokerAdminOrgs = async (orgData: CreateOrgV1): Promise<OrgsListResponse> => {
  const body: CreateOrgV1 = {
    name: orgData.name,
  }
  if (orgData.groupId) {
    body.groupId = orgData.groupId
  }

  const headers = {...commonHeaders, ...getAuthHeader()}
  const apiPath = `rest/orgs`
  const config = getConfig()

  const logger = createLogger('snyk-broker-config')

  const req: HttpRequest = {
    url: `${config.API_HOSTNAME}/${apiPath}?version=${config.API_VERSION}&is_personal=false&name=${encodeURIComponent(orgData.name)}${orgData.groupId ? '&group_id=' + orgData.groupId : ''}`,
    headers: headers,
    method: 'GET',
  }
  try {
    const response = await makeRequest(req)
    logger.debug({url: req.url, statusCode: response.statusCode, response: response.body}, 'Response')
    return JSON.parse(response.body) as OrgsListResponse
  } catch (error: any) {
    throw new Error(error)
  }
}

export const validateSnykInstallId = async (installId: string, orgId: string) => {
  const headers = {...commonHeaders, ...getAuthHeader()}
  const apiPath = `rest/orgs/${orgId}/apps/installs`
  const config = getConfig()

  const logger = createLogger('snyk-broker-config')

  const req: HttpRequest = {
    url: `${config.API_HOSTNAME}/${apiPath}?version=${config.API_VERSION}`,
    headers: headers,
    method: 'GET',
  }
  try {
    const response = await makeRequest(req)
    logger.debug({url: req.url, statusCode: response.statusCode, response: response.body}, 'Response')
    if (response.statusCode && response.statusCode > 299) {
      return false
    }
    const orgsInstalls = JSON.parse(response.body) as OrgsInstallsResponse
    if (orgsInstalls.data.length === 0 || !orgsInstalls.data.some((x) => x.id === installId)) {
      return false
    }
  } catch (error: any) {
    throw new Error(error)
  }
}
