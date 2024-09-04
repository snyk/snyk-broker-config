import {commonHeaders} from '../common/rest-helpers.js'
import {getConfig} from '../config/config.js'
import {getAuthHeader} from '../utils/auth.js'
import {HttpRequest, makeRequest} from '../utils/http-request.js'
import {createLogger} from '../utils/logger.js'

interface Tenant {
  attributes: {
    created_at: string
    name: string
    slug: string
    updated_at: string
  }
  id: string

  relationships: {
    owner: {
      data: {
        id: string
        type: string
      }
    }
  }
  type: string
}
interface TenantsListingResponse {
  data: Array<Tenant>
}

const logger = createLogger('snyk-broker-config')

export const getAccessibleTenants = async () => {
  const headers = {...commonHeaders, ...getAuthHeader()}
  const apiPath = `rest/tenants`
  const config = getConfig()

  const req: HttpRequest = {
    url: `${config.API_HOSTNAME}/${apiPath}?version=${config.API_VERSION_TENANTS}`,
    headers: headers,
    method: 'GET',
  }
  try {
    const response = await makeRequest(req)
    logger.debug({url: req.url, statusCode: response.statusCode, response: response.body}, 'Response')
    return JSON.parse(response.body) as TenantsListingResponse
  } catch (error: any) {
    throw new Error(error)
  }
}
