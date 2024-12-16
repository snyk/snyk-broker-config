import {commonHeaders} from '../common/rest-helpers.js'
import {getConfig} from '../config/config.js'
import {getAuthHeader} from '../utils/auth.js'
import {HttpRequest, makeRequest} from '../utils/http-request.js'
import {isValidUUID} from '../utils/validation.js'
import {createLogger} from '../utils/logger.js'

const logger = createLogger('snyk-broker-config')

export const validateSnykToken = async (snykToken: string): Promise<void> => {
  if (!isValidUUID(snykToken)) {
    throw new Error('Invalid Format.')
  }
  process.env.SNYK_TOKEN = snykToken
  const headers = {...commonHeaders, ...getAuthHeader()}
  const apiPath = `rest/self`
  const config = getConfig()

  const req: HttpRequest = {
    url: `${config.API_HOSTNAME}/${apiPath}?version=${config.APP_INSTALL_API_VERSION}`,
    headers: headers,
    method: 'GET',
  }
  try {
    const response = await makeRequest(req)
    logger.debug({url: req.url, statusCode: response.statusCode, response: response.body}, 'Response')
  } catch (error: any) {
    let errorMessage = error
    if (error.includes('401: Unauthorized.')) {
      errorMessage = `Invalid/stale token? Are you using the right region? (using ${config.API_HOSTNAME}).`
      logger.error({error}, 'Error validating Snyk Token.')
    }
    throw new Error(errorMessage)
  }
}
