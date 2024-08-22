import {input, select} from '@inquirer/prompts'
import {flagConnectionMapping} from './type-params-mapping.js'
import {createCredentials, getCredentialsForDeployment} from '../../api/credentials.js'
import {CredentialsAttributes, CredentialsListResponse} from '../../api/types.js'

export const captureConnectionParams = async (
  tenantID: string,
  installId: string,
  deploymentId: string,
  connectionType: string,
): Promise<Record<string, string>> => {
  const requiredParameters = flagConnectionMapping[connectionType]
  for (const [key, value] of Object.entries(requiredParameters)) {
    if (value.sensitive) {
      const existingCredentialsByTypeAndDeployment = await getExistingCredentialsReference(
        tenantID,
        installId,
        deploymentId,
        connectionType,
      )
      const choices = existingCredentialsByTypeAndDeployment.data
        .filter((x) => x.attributes.type === connectionType)
        .map((x) => {
          return {id: x.id, value: x.attributes.environment_variable_name, description: x.attributes.comment}
        })
      choices.push({id: 'new', value: 'CreateNew', description: 'Create a new Credentials Reference'})

      const choice = await select({
        message: 'Which credential reference do you want to use? Or create New?',
        choices: choices,
        pageSize: existingCredentialsByTypeAndDeployment.data.length + 1,
      })
      if (choice === 'CreateNew') {
        const envVarName = await input({
          message: `Env Var Name (i.e MY_GITHUB_TOKEN)`,
        })
        const comment = await input({
          message: `Comment`,
        })
        const newCred: CredentialsAttributes = {comment, environment_variable_name: envVarName, type: connectionType}
        const newId = await createCredentials(tenantID, installId, deploymentId, [newCred])
        requiredParameters[key].input = newId.data[0].id
      } else {
        const selectedCredId = choices.find((x) => x.value === choice)
        if (!selectedCredId) {
          throw new Error('Error selecting existing credentials id')
        }
        requiredParameters[key].input = selectedCredId.id
      }
    } else {
      requiredParameters[key].input = await input({
        message: `${key}: ${value.description}`,
      })
    }
  }
  const connectionParams: Record<string, string> = {}
  for (const [key, value] of Object.entries(requiredParameters)) {
    connectionParams[key] = value.input!
  }
  return connectionParams
}

const getExistingCredentialsReference = async (
  tenantID: string,
  installId: string,
  deploymentId: string,
  connectionType: string,
): Promise<CredentialsListResponse> => {
  const existingCredentialsForDeployment = await getCredentialsForDeployment(tenantID, installId, deploymentId)
  const filteredByTypeCredentialsForDeployment = structuredClone(existingCredentialsForDeployment)
  filteredByTypeCredentialsForDeployment.data.filter((x) => x.attributes.type === connectionType)
  return existingCredentialsForDeployment
}
