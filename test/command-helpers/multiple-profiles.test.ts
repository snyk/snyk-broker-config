import {
  isMissingRequiredIntegrationId,
  supportsMultipleProfiles,
} from '../../src/command-helpers/connections/multiple-profiles'
import {expect} from 'chai'

describe('supportsMultipleProfiles', () => {
  it('is true for a type that supports multiple profiles', () => {
    expect(supportsMultipleProfiles('ecr')).to.be.true
  })

  it('is false for a type with a single integration per Org', () => {
    // An Org holds one github integration, so there is nothing to disambiguate
    // and the guided flow should not ask for an integration id.
    expect(supportsMultipleProfiles('github')).to.be.false
  })

  it('is false for an unknown type', () => {
    expect(supportsMultipleProfiles('not-a-real-type')).to.be.false
  })

  it('covers every type currently listed in the default config', () => {
    const multipleProfileTypes = [
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
    for (const type of multipleProfileTypes) {
      expect(supportsMultipleProfiles(type), type).to.be.true
    }
  })

  it('takes the supported list as an override', () => {
    expect(supportsMultipleProfiles('github', ['github'])).to.be.true
    expect(supportsMultipleProfiles('ecr', [])).to.be.false
  })
})

describe('isMissingRequiredIntegrationId', () => {
  const integrationId = '3a7c1ab9-8914-4f39-a8c0-5752af653a8a'

  it('is true for a multiple-profile type with no, blank or non-UUID id', () => {
    for (const missing of [undefined, null, '', '   ', 'not-a-uuid']) {
      expect(isMissingRequiredIntegrationId('ecr', missing), JSON.stringify(missing)).to.be.true
    }
  })

  it('is false for a multiple-profile type with a UUID, ignoring surrounding whitespace', () => {
    expect(isMissingRequiredIntegrationId('ecr', integrationId)).to.be.false
    expect(isMissingRequiredIntegrationId('ecr', ` ${integrationId} `)).to.be.false
  })

  it('is false for a single-profile type even with no id', () => {
    expect(isMissingRequiredIntegrationId('github')).to.be.false
  })
})
