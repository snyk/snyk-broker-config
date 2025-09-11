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

interface TenantMembership {
  id: string
  type: 'tenant_membership'
  attributes: {
    created_at: string
  }
  relationships: {
    role: {
      data: {
        id: string
        type: string
        attributes: {
          name: string
        }
      }
    }
    tenant: {
      id: string
      type: 'tenant'
      attributes: {
        name: string
      }
    }
    user: {
      data: {
        id: string
        type: 'user'
        attributes: {
          account_type: string
          active: boolean
          email: string
          login_method: string
          name: string
          username: string
        }
        meta: {
          tenant_owner: boolean
        }
      }
    }
  }
}

interface TenantsMembershipResponse {
  data: Array<TenantMembership>
}

export const isTenantAdmin = async (tenantId: string, userId: string) => {
  const headers = {...commonHeaders, ...getAuthHeader()}
  const apiPath = `rest/tenants/${tenantId}/memberships`
  const config = getConfig()

  const url = new URL(`${config.API_HOSTNAME}/${apiPath}`)
  url.searchParams.append('role_name', 'admin')
  url.searchParams.append('user_id', userId)
  url.searchParams.append('version', config.API_VERSION_TENANTS)

  const req: HttpRequest = {
    url: url.toString(),
    headers: headers,
    method: 'GET',
  }
  try {
    const response = await makeRequest(req)
    logger.debug({url: req.url, statusCode: response.statusCode, response: response.body}, 'Response')

    const parsedResponse = JSON.parse(response.body) as TenantsMembershipResponse
    if (parsedResponse.data.length === 0) {
      throw new Error(`User ${userId} does not have the required permission.`)
    }
  } catch (error: any) {
    throw new Error(error)
  }
}
