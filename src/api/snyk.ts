import {getCommonHeaders} from '../common/rest-helpers.js'
import {getConfig} from '../config/config.js'
import {getAuthHeader} from '../utils/auth.js'
import {HttpRequest, makeRequest} from '../utils/http-request.js'
import {isValidUUID} from '../utils/validation.js'
import {createLogger} from '../utils/logger.js'

const logger = createLogger()

interface SelfResponse {
  data: {
    id: string
    type: 'user'
    attributes: {
      avatar_url: string
      default_org_context: string
      email: string
      name: string
      username: string
    }
  }
}

export const validateSnykToken = async (snykToken: string): Promise<string> => {
  if (!isValidUUID(snykToken)) {
    throw new Error('Invalid Format.')
  }
  process.env.SNYK_TOKEN = snykToken
  const headers = {...getCommonHeaders(), ...getAuthHeader()}
  const apiPath = `rest/self`
  const config = getConfig()

  const req: HttpRequest = {
    url: `${config.API_HOSTNAME}/${apiPath}?version=${config.APP_INSTALL_API_VERSION}`,
    headers: headers,
    method: 'GET',
    operation: 'validate the Snyk token',
  }
  const response = await makeRequest(req)
  logger.debug({url: req.url, statusCode: response.statusCode, response: response.body}, 'Response')

  const parsedResponse = JSON.parse(response.body) as SelfResponse
  return parsedResponse.data.id
}
