import {getCommonHeaders} from '../../src/common/rest-helpers'
import {expect} from 'chai'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

describe('getCommonHeaders', () => {
  it('includes Content-Type', () => {
    const headers = getCommonHeaders()
    expect(headers['Content-Type']).to.equal('application/vnd.api+json')
  })

  it('includes SNYK-INTERACTION-ID as a valid UUID', () => {
    const headers = getCommonHeaders()
    expect(headers['SNYK-INTERACTION-ID']).to.match(UUID_REGEX)
  })

  it('returns the same SNYK-INTERACTION-ID across multiple calls', () => {
    const first = getCommonHeaders()['SNYK-INTERACTION-ID']
    const second = getCommonHeaders()['SNYK-INTERACTION-ID']
    expect(first).to.equal(second)
  })
})
