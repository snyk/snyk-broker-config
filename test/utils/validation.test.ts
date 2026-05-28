import {expect} from 'chai'
import {isValidHostnameWithPort, stripTrailingSlash} from '../../src/utils/validation'

describe('validation', () => {
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

  describe('isValidHostnameWithPort', () => {
    describe('valid hostnames', () => {
      const valid = [
        'localhost',
        'example.com',
        'sub.domain.example.com',
        'sub_domain.example.com',
        'sub-domain.example.com',
        'host123.example.com',
        '123host.example.com',
      ]
      for (const host of valid) {
        it(`accepts "${host}"`, () => {
          expect(isValidHostnameWithPort(host)).to.equal(true)
        })
      }
    })

    describe('valid hostnames with port', () => {
      const valid = [
        'example.com:80',
        'sub.domain.example.com:8080',
        'sub_domain.example.com:5555',
        'sub-domain.example.com:7777',
        'host.example.com:65535',
      ]
      for (const host of valid) {
        it(`accepts "${host}"`, () => {
          expect(isValidHostnameWithPort(host)).to.equal(true)
        })
      }
    })

    describe('invalid hostnames', () => {
      const invalid = [
        '',
        '-foo.com',
        'foo-.com',
        'foo..com',
        '.foo.com',
        'foo.com.',
        'foo.com:',
        'foo.com:abc',
        'https://github.com',
        'http://example.com',
        'foo bar.com',
        'foo@bar.com',
      ]
      for (const host of invalid) {
        it(`rejects "${host}"`, () => {
          expect(isValidHostnameWithPort(host)).to.equal(false)
        })
      }
    })

    it('rejects names with label longer than 63 characters', () => {
      expect(isValidHostnameWithPort('a'.repeat(64) + '.com')).to.equal(false)
    })
  })
})
