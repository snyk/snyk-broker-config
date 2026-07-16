import {makeRequest, HttpRequest} from '../../src/utils/http-request'
import {ApiError, NetworkError} from '../../src/utils/errors'
import {expect} from 'chai'
import nock from 'nock'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

describe('makeRequest SNYK-REQUEST-ID injection', () => {
  afterEach(() => {
    nock.cleanAll()
  })

  it('injects SNYK-REQUEST-ID as a valid UUID', async () => {
    nock('https://example.com').get('/test').reply(200, '{}')

    const req: HttpRequest = {
      url: 'https://example.com/test',
      headers: {'Content-Type': 'application/json'},
      method: 'GET',
    }

    await makeRequest(req, 0)
    const injectedId = (req.headers as Record<string, string>)['SNYK-REQUEST-ID']
    expect(injectedId).to.match(UUID_REGEX)
  })

  it('uses different SNYK-REQUEST-ID for separate calls', async () => {
    nock('https://example.com').get('/test').times(2).reply(200, '{}')

    const req1: HttpRequest = {
      url: 'https://example.com/test',
      headers: {'Content-Type': 'application/json'},
      method: 'GET',
    }
    const req2: HttpRequest = {
      url: 'https://example.com/test',
      headers: {'Content-Type': 'application/json'},
      method: 'GET',
    }

    await makeRequest(req1, 0)
    await makeRequest(req2, 0)

    const id1 = (req1.headers as Record<string, string>)['SNYK-REQUEST-ID']
    const id2 = (req2.headers as Record<string, string>)['SNYK-REQUEST-ID']
    expect(id1).to.match(UUID_REGEX)
    expect(id2).to.match(UUID_REGEX)
    expect(id1).to.not.equal(id2)
  })

  it('does not overwrite a pre-existing SNYK-REQUEST-ID', async () => {
    const existingId = '11111111-1111-1111-1111-111111111111'
    nock('https://example.com').get('/test').reply(200, '{}')

    const req: HttpRequest = {
      url: 'https://example.com/test',
      headers: {'Content-Type': 'application/json', 'SNYK-REQUEST-ID': existingId},
      method: 'GET',
    }

    await makeRequest(req, 0)
    const id = (req.headers as Record<string, string>)['SNYK-REQUEST-ID']
    expect(id).to.equal(existingId)
  })
})

describe('makeRequest error handling', () => {
  afterEach(() => {
    nock.cleanAll()
  })

  const errorRequest = (): HttpRequest => ({
    url: 'https://example.com/test',
    headers: {'Content-Type': 'application/json'},
    method: 'GET',
  })

  it('rejects with an ApiError carrying status, detail and the server request id from the header', async () => {
    const serverRequestId = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee'
    nock('https://example.com')
      .get('/test')
      .reply(400, {errors: [{id: 'body-id', detail: 'Unknown query parameter'}]}, {'snyk-request-id': serverRequestId})

    try {
      await makeRequest(errorRequest(), 0)
      expect.fail('expected makeRequest to reject')
    } catch (error) {
      expect(error).to.be.instanceOf(ApiError)
      const apiError = error as ApiError
      expect(apiError.statusCode).to.equal(400)
      expect(apiError.requestId).to.equal(serverRequestId)
      expect(apiError.detail).to.equal('Unknown query parameter')
      expect(apiError.message).to.contain('400')
      expect(apiError.message).to.contain('Unknown query parameter')
      expect(apiError.message).to.contain(serverRequestId)
    }
  })

  it('falls back to errors[].id when no snyk-request-id header is present', async () => {
    nock('https://example.com')
      .get('/test')
      .reply(403, {errors: [{id: 'body-request-id', detail: 'Forbidden'}]})

    try {
      await makeRequest(errorRequest(), 0)
      expect.fail('expected makeRequest to reject')
    } catch (error) {
      const apiError = error as ApiError
      expect(apiError.requestId).to.equal('body-request-id')
      expect(apiError.detail).to.equal('Forbidden')
    }
  })

  it('prefixes the error message with the failing operation when one is set', async () => {
    nock('https://example.com')
      .get('/test')
      .reply(400, {errors: [{detail: 'Unknown query parameter'}]})

    try {
      await makeRequest({...errorRequest(), operation: 'create the connection'}, 0)
      expect.fail('expected makeRequest to reject')
    } catch (error) {
      const apiError = error as ApiError
      expect(apiError.operation).to.equal('create the connection')
      expect(apiError.message).to.contain('Failed to create the connection.')
    }
  })

  it('rejects with a NetworkError carrying the operation, code and raw message when the transport fails', async () => {
    nock('https://example.com')
      .get('/test')
      .replyWithError({code: 'ECONNREFUSED', message: 'connect ECONNREFUSED 127.0.0.1:443'})

    try {
      await makeRequest({...errorRequest(), operation: 'list connections'}, 0)
      expect.fail('expected makeRequest to reject')
    } catch (error) {
      expect(error).to.be.instanceOf(NetworkError)
      const networkError = error as NetworkError
      expect(networkError.operation).to.equal('list connections')
      expect(networkError.code).to.equal('ECONNREFUSED')
      expect(networkError.message).to.contain('Failed to list connections.')
      expect(networkError.message).to.contain('ECONNREFUSED: connect ECONNREFUSED')
    }
  })

  it('surfaces a TLS/cert error code even when the message omits it', async () => {
    nock('https://example.com')
      .get('/test')
      .replyWithError({code: 'SELF_SIGNED_CERT_IN_CHAIN', message: 'self signed certificate in certificate chain'})

    try {
      await makeRequest({...errorRequest(), operation: 'list connections'}, 0)
      expect.fail('expected makeRequest to reject')
    } catch (error) {
      const networkError = error as NetworkError
      expect(networkError.code).to.equal('SELF_SIGNED_CERT_IN_CHAIN')
      expect(networkError.message).to.contain('SELF_SIGNED_CERT_IN_CHAIN')
    }
  })

  it('does not throw on a non-JSON error body and still reports the status code', async () => {
    nock('https://example.com').get('/test').reply(502, '<html>Bad Gateway</html>')

    try {
      await makeRequest(errorRequest(), 0)
      expect.fail('expected makeRequest to reject')
    } catch (error) {
      expect(error).to.be.instanceOf(ApiError)
      const apiError = error as ApiError
      expect(apiError.statusCode).to.equal(502)
      expect(apiError.detail).to.contain('Bad Gateway')
    }
  })
})
