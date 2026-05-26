import {expect} from 'chai'
import {stripTrailingSlash} from '../../src/utils/validation'

describe('stripTrailingSlash', () => {
  it('strips a single trailing slash', () => {
    expect(stripTrailingSlash('https://example.com/')).to.equal('https://example.com')
  })

  it('is a no-op when no trailing slash is present', () => {
    expect(stripTrailingSlash('https://example.com')).to.equal('https://example.com')
  })

  it('strips multiple trailing slashes', () => {
    expect(stripTrailingSlash('https://example.com//')).to.equal('https://example.com')
  })

  it('preserves a path while stripping its trailing slash', () => {
    expect(stripTrailingSlash('https://example.com/path/')).to.equal('https://example.com/path')
  })

  it('does not strip the protocol slashes for a bare scheme', () => {
    expect(stripTrailingSlash('https://')).to.equal('https://')
  })

  it('is a no-op for UUID-style strings', () => {
    expect(stripTrailingSlash('123e4567-e89b-42d3-a456-426614174000')).to.equal(
      '123e4567-e89b-42d3-a456-426614174000',
    )
  })
})
