import {supportsMultipleProfiles} from '../../src/command-helpers/connections/multiple-profiles'
import {expect} from 'chai'

describe('supportsMultipleProfiles', () => {
  it('is true for a container registry type', () => {
    expect(supportsMultipleProfiles('ecr')).to.be.true
  })

  it('is false for an SCM type', () => {
    // An Org holds one github integration, so there is nothing to disambiguate
    // and the guided flow should not ask for an integration id.
    expect(supportsMultipleProfiles('github')).to.be.false
  })

  it('is false for an unknown type', () => {
    expect(supportsMultipleProfiles('not-a-real-type')).to.be.false
  })

  it('covers every container registry type shipped in config', () => {
    const containerRegistryTypes = [
      'acr',
      'artifactory-cr',
      'digitalocean-cr',
      'docker-hub',
      'ecr',
      'gcr',
      'github-cr',
      'gitlab-cr',
      'google-artifact-cr',
      'harbor-cr',
      'nexus-cr',
      'quay-cr',
    ]
    for (const type of containerRegistryTypes) {
      expect(supportsMultipleProfiles(type), type).to.be.true
    }
  })

  it('takes the supported list as an override', () => {
    expect(supportsMultipleProfiles('github', ['github'])).to.be.true
    expect(supportsMultipleProfiles('ecr', [])).to.be.false
  })
})
