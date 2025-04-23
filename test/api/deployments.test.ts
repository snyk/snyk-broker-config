import {
  createDeployment,
  deleteDeployment,
  DeploymentAttributesMetadata,
  getDeployments,
  updateDeployment,
} from '../../src/api/deployments'
import {expect} from 'chai'
import nock from 'nock'

describe('Deployments Api calls', () => {
  const apiResponseSchema = {data: {}, links: {}}
  before(() => {
    process.env.SNYK_TOKEN = 'dummy'
    nock('https://api.snyk.io')
      .persist()
      .get(
        '/rest/tenants/00000000-0000-0000-0000-000000000000/brokers/installs/00000000-0000-0000-0000-000000000000/deployments?version=2024-10-15',
      )
      .reply((uri, body) => {
        const response = apiResponseSchema
        response.data = [
          {
            attributes: {
              broker_app_installed_in_org_id: '00000000-0000-0000-0000-000000000000',
              install_id: '00000000-0000-0000-0000-000000000000',
              metadata: {},
            },
            id: '00000000-0000-0000-0000-000000000000',
            type: 'broker_deployment',
          },
        ]
        return [200, response]
      })
      .post(
        '/rest/tenants/00000000-0000-0000-0000-000000000000/brokers/installs/00000000-0000-0000-0000-000000000000/deployments?version=2024-10-15',
      )
      .reply((uri, body) => {
        const response = apiResponseSchema
        response.data = {
          attributes: {
            broker_app_installed_in_org_id: '00000000-0000-0000-0000-000000000000',
            install_id: '00000000-0000-0000-0000-000000000000',
            metadata: {key: 'value'},
          },
          id: '00000000-0000-0000-0000-000000000000',
          type: 'broker_deployment',
        }
        return [200, response]
      })
      .patch(
        '/rest/tenants/00000000-0000-0000-0000-000000000000/brokers/installs/00000000-0000-0000-0000-000000000000/deployments/00000000-0000-0000-0000-000000000000?version=2024-10-15',
      )
      .reply((uri, body) => {
        const response = apiResponseSchema
        const attributes = {
          broker_app_installed_in_org_id: '00000000-0000-0000-0000-000000000000',
          install_id: '00000000-0000-0000-0000-000000000000',
          ...JSON.parse(body.toString()).data.attributes,
        }
        response.data = {
          attributes: attributes,
          id: '00000000-0000-0000-0000-000000000000',
          type: 'broker_deployment',
        }
        return [200, response]
      })
      .delete(
        '/rest/tenants/00000000-0000-0000-0000-000000000000/brokers/installs/00000000-0000-0000-0000-000000000000/deployments/00000000-0000-0000-0000-000000000000?version=2024-10-15',
      )
      .reply(() => {
        return [204]
      })
  })

  it('getDeployments', async () => {
    const gotDeployments = await getDeployments(
      '00000000-0000-0000-0000-000000000000',
      '00000000-0000-0000-0000-000000000000',
    )
    expect(gotDeployments).to.deep.equal({
      data: [
        {
          attributes: {
            broker_app_installed_in_org_id: '00000000-0000-0000-0000-000000000000',
            install_id: '00000000-0000-0000-0000-000000000000',
            metadata: {},
          },
          id: '00000000-0000-0000-0000-000000000000',
          type: 'broker_deployment',
        },
      ],
      links: {},
    })
  })

  it('createDeployments', async () => {
    const deploymentData: DeploymentAttributesMetadata = {
      key: 'value',
    }
    const createdDeployments = await createDeployment(
      '00000000-0000-0000-0000-000000000000',
      '00000000-0000-0000-0000-000000000000',
      deploymentData,
    )
    const expectedResponse = apiResponseSchema
    expectedResponse.data = {
      attributes: {
        broker_app_installed_in_org_id: '00000000-0000-0000-0000-000000000000',
        install_id: '00000000-0000-0000-0000-000000000000',
        metadata: {key: 'value'},
      },
      id: '00000000-0000-0000-0000-000000000000',
      type: 'broker_deployment',
    }

    expect(createdDeployments).to.deep.equal(expectedResponse)
  })

  it('updateDeployments', async () => {
    const updatedDeployment = await updateDeployment(
      '00000000-0000-0000-0000-000000000000',
      '00000000-0000-0000-0000-000000000000',
      '00000000-0000-0000-0000-000000000000',
      {key: 'value updated'},
    )
    const expectedResponse = apiResponseSchema
    expectedResponse.data = {
      attributes: {
        broker_app_installed_in_org_id: '00000000-0000-0000-0000-000000000000',
        install_id: '00000000-0000-0000-0000-000000000000',
        metadata: {key: 'value updated'},
      },
      id: '00000000-0000-0000-0000-000000000000',
      type: 'broker_deployment',
    }
    expect(updatedDeployment).to.deep.equal(expectedResponse)
  })

  it('deleteDeployments', async () => {
    const deletedCredentials = await deleteDeployment(
      '00000000-0000-0000-0000-000000000000',
      '00000000-0000-0000-0000-000000000000',
      '00000000-0000-0000-0000-000000000000',
    )
    expect(deletedCredentials).to.equal(204)
  })
})
