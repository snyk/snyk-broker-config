import {validateSnykToken} from '../../src/api/snyk'
import {expect} from 'chai'
import nock from 'nock'

describe('Snyk Token Validation', () => {
  it('Invalid Snyk Token format', async () => {
    try {
      await validateSnykToken('00000000-0000-0000-0000-000000000000')
      expect(true).to.be.false
    } catch (error) {
      expect(error).to.be.instanceOf(Error).with.property('message').that.includes('Invalid Format.')
    }
  })

  it('Invalid Snyk Token tested via api call', async () => {
    try {
      await validateSnykToken('523022f6-33af-4791-a25a-8ade918c3c78')
      expect(true).to.be.false
    } catch (error) {
      expect(error).to.be.instanceOf(Error)
      expect(error)
        .to.be.instanceOf(Error)
        .with.property('message')
        .that.includes('Invalid/stale token? Are you using the right region? (using https://api.snyk.io).')
    }
  })
  it('get installed broker app', async () => {
    nock('https://api.snyk.io')
      .persist()
      .get(`/rest/self?version=2024-05-31`)
      .reply(() => {
        return [200, 'OK']
      })
    try {
      await validateSnykToken('523022f6-33af-4791-a25a-8ade918c3c78')
      expect(true).to.be.true
    } catch (error) {
      expect(error).to.be.undefined
    }
  })
})
