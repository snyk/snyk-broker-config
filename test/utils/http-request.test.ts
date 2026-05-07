import {makeRequest, HttpRequest} from '../../src/utils/http-request'
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
