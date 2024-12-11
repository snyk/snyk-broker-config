import {getDummyCredentialsForIntegrationType} from '../../src/api/integrations-utils'
import {expect} from 'chai'

describe('Integrations utils', () => {
  it('getDummyCredentialsForIntegrationType gitlab', async () => {
    const dummyGitlabCreds = getDummyCredentialsForIntegrationType('gitlab')
    expect(dummyGitlabCreds).to.deep.equal({token: '', url: ''})
  })
  it('getDummyCredentialsForIntegrationType invalid', async () => {
    try {
      getDummyCredentialsForIntegrationType('non-existent')
      expect(true).to.be.false
    } catch (err) {
      expect(err).to.be.instanceOf(Error)
    }
  })
})
