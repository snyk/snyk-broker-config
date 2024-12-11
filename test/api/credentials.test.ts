import {
  createCredentials,
  updateCredentials,
  deleteCredentials,
  getCredentialForDeployment,
  getCredentialsForDeployment,
} from '../../src/api/credentials'

import {expect} from 'chai'
import nock from 'nock'
import {CredentialsAttributes} from '../../src/api/types'

describe('Credentials Api calls', () => {
  const credentials: CredentialsAttributes = {
    comment: 'comment',
    environment_variable_name: 'test',
    type: 'github',
  }
  const apiResponseSchema = {data: {}, links: {}}
  before(() => {
    process.env.SNYK_TOKEN = 'dummy'
    nock('https://api.snyk.io')
      .persist()
      .get(
        '/rest/tenants/00000000-0000-0000-0000-000000000000/brokers/installs/00000000-0000-0000-0000-000000000000/deployments/00000000-0000-0000-0000-000000000000/credentials/00000000-0000-0000-0000-000000000000?version=2024-02-08~experimental',
      )
      .reply((uri, body) => {
        const response = apiResponseSchema
        response.data = {
          attributes: credentials,
          id: '00000000-0000-0000-0000-000000000000',
          type: 'deployment_credentials',
          relationships: {
            broker_connections: [{data: {id: '00000000-0000-0000-0000-000000000000', type: 'broker_deployment'}}],
          },
        }
        return [200, response]
      })
      .get(
        '/rest/tenants/00000000-0000-0000-0000-000000000000/brokers/installs/00000000-0000-0000-0000-000000000000/deployments/00000000-0000-0000-0000-000000000000/credentials?version=2024-02-08~experimental',
      )
      .reply((uri, body) => {
        const response = apiResponseSchema
        response.data = [
          {
            attributes: credentials,
            id: '00000000-0000-0000-0000-000000000000',
            type: 'deployment_credentials',
            relationships: {
              broker_connections: [{data: {id: '00000000-0000-0000-0000-000000000000', type: 'broker_deployment'}}],
            },
          },
        ]
        return [200, response]
      })
      .post(
        '/rest/tenants/00000000-0000-0000-0000-000000000000/brokers/installs/00000000-0000-0000-0000-000000000000/deployments/00000000-0000-0000-0000-000000000000/credentials?version=2024-02-08~experimental',
      )
      .reply((uri, body) => {
        const response = apiResponseSchema
        response.data = [
          {
            attributes: credentials,
            id: '00000000-0000-0000-0000-000000000000',
            type: 'deployment_credentials',
            relationships: {
              broker_connections: [{data: {id: '00000000-0000-0000-0000-000000000000', type: 'broker_deployment'}}],
            },
          },
        ]
        return [200, response]
      })
      .patch(
        '/rest/tenants/00000000-0000-0000-0000-000000000000/brokers/installs/00000000-0000-0000-0000-000000000000/deployments/00000000-0000-0000-0000-000000000000/credentials/00000000-0000-0000-0000-000000000000?version=2024-02-08~experimental',
      )
      .reply((uri, body) => {
        const response = apiResponseSchema
        response.data = {
          attributes: JSON.parse(body.toString()).data.attributes,
          id: '00000000-0000-0000-0000-000000000000',
          type: 'deployment_credentials',
          relationships: {
            broker_connections: [{data: {id: '00000000-0000-0000-0000-000000000000', type: 'broker_deployment'}}],
          },
        }
        return [200, response]
      })
      .delete(
        '/rest/tenants/00000000-0000-0000-0000-000000000000/brokers/installs/00000000-0000-0000-0000-000000000000/deployments/00000000-0000-0000-0000-000000000000/credentials/00000000-0000-0000-0000-000000000000?version=2024-02-08~experimental',
      )
      .reply(() => {
        return [204]
      })
  })

  it('getCredentials', async () => {
    const gotCredentials = await getCredentialsForDeployment(
      '00000000-0000-0000-0000-000000000000',
      '00000000-0000-0000-0000-000000000000',
      '00000000-0000-0000-0000-000000000000',
    )
    expect(gotCredentials).to.deep.equal({
      data: [
        {
          attributes: {
            comment: 'comment',
            environment_variable_name: 'test',
            type: 'github',
          },
          id: '00000000-0000-0000-0000-000000000000',
          relationships: {
            broker_connections: [
              {
                data: {
                  id: '00000000-0000-0000-0000-000000000000',
                  type: 'broker_deployment',
                },
              },
            ],
          },
          type: 'deployment_credentials',
        },
      ],
      links: {},
    })
  })

  it('getCredential', async () => {
    const gotCredentials = await getCredentialForDeployment(
      '00000000-0000-0000-0000-000000000000',
      '00000000-0000-0000-0000-000000000000',
      '00000000-0000-0000-0000-000000000000',
      '00000000-0000-0000-0000-000000000000',
    )
    expect(gotCredentials).to.deep.equal({
      data: {
        attributes: {
          comment: 'comment',
          environment_variable_name: 'test',
          type: 'github',
        },
        id: '00000000-0000-0000-0000-000000000000',
        relationships: {
          broker_connections: [
            {
              data: {
                id: '00000000-0000-0000-0000-000000000000',
                type: 'broker_deployment',
              },
            },
          ],
        },
        type: 'deployment_credentials',
      },
      links: {},
    })
  })

  it('createCredentials', async () => {
    const createdCredentials = await createCredentials(
      '00000000-0000-0000-0000-000000000000',
      '00000000-0000-0000-0000-000000000000',
      '00000000-0000-0000-0000-000000000000',
      [credentials],
    )
    expect(createdCredentials).to.deep.equal({
      data: [
        {
          attributes: {
            comment: 'comment',
            environment_variable_name: 'test',
            type: 'github',
          },
          id: '00000000-0000-0000-0000-000000000000',
          relationships: {
            broker_connections: [
              {
                data: {
                  id: '00000000-0000-0000-0000-000000000000',
                  type: 'broker_deployment',
                },
              },
            ],
          },
          type: 'deployment_credentials',
        },
      ],
      links: {},
    })
  })

  it('updateCredentials', async () => {
    const credentialsToUpdate = structuredClone(credentials)
    credentialsToUpdate.comment = 'comment updated'
    const updatedCredentials = await updateCredentials(
      '00000000-0000-0000-0000-000000000000',
      '00000000-0000-0000-0000-000000000000',
      '00000000-0000-0000-0000-000000000000',
      '00000000-0000-0000-0000-000000000000',
      credentialsToUpdate,
    )
    expect(JSON.parse(updatedCredentials)).to.deep.equal({
      data: {
        attributes: {
          comment: 'comment updated',
          environment_variable_name: 'test',
          type: 'github',
        },
        id: '00000000-0000-0000-0000-000000000000',
        relationships: {
          broker_connections: [
            {
              data: {
                id: '00000000-0000-0000-0000-000000000000',
                type: 'broker_deployment',
              },
            },
          ],
        },
        type: 'deployment_credentials',
      },
      links: {},
    })
  })

  it('deleteCredentials', async () => {
    const deletedCredentials = await deleteCredentials(
      '00000000-0000-0000-0000-000000000000',
      '00000000-0000-0000-0000-000000000000',
      '00000000-0000-0000-0000-000000000000',
      '00000000-0000-0000-0000-000000000000',
    )
    expect(deletedCredentials).to.equal(204)
  })
})
