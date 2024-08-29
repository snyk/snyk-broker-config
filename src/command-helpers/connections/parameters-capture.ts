import {input, select, confirm} from '@inquirer/prompts'
import {flagConnectionMapping} from './type-params-mapping.js'
import {createCredentials, getCredentialsForDeployment} from '../../api/credentials.js'
import {CredentialsAttributes, CredentialsListResponse} from '../../api/types.js'
import {isValidHostnameWithPort, isValidUrl, isValidUUID} from '../../utils/validation.js'

export const captureConnectionParams = async (
  tenantID: string,
  installId: string,
  deploymentId: string,
  connectionType: string,
): Promise<Record<string, string>> => {
  const requiredParameters = flagConnectionMapping[connectionType]
  for (const [key, value] of Object.entries(requiredParameters)) {
    if (value.skippable) {
      const userWantsToEnterValue = await confirm({
        message: `The ${key} field is optional in connection type ${connectionType}. Do you want to input value (Y) or skip (N)?`,
      })
      if (!userWantsToEnterValue) {
        continue
      }
    }
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
      choices.push({id: 'new', value: 'CreateNew', description: 'Create a new Credential Reference'})

      const choice = await select({
        message: `${key} (Sensitive): ${choices.length > 1 ? 'Which Credential Reference do you want to use? Or create New?' : 'No existing Credential Reference for this Connection type.'}`,
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
          throw new Error('Error selecting existing Credential ID')
        }
        requiredParameters[key].input = selectedCredId.id
      }
    } else {
      let isInputValidated = false
      let message = `${key}: ${value.description}. `
      if (requiredParameters[key].dataType) {
        message += `Must be ${requiredParameters[key].dataType}.`
      }
      while (!isInputValidated) {
        requiredParameters[key].input = await input({
          message: message,
        })
        if (requiredParameters[key].dataType) {
          switch (requiredParameters[key].dataType) {
            case 'hostname': {
              isInputValidated =
                isValidHostnameWithPort(requiredParameters[key].input) || isValidUUID(requiredParameters[key].input)
              break
            }
            case 'url': {
              isInputValidated = isValidUrl(requiredParameters[key].input) || isValidUUID(requiredParameters[key].input)
              break
            }
            default: {
              isInputValidated = true
            }
          }
        } else {
          isInputValidated = true
        }
      }
    }
  }
  const connectionParams: Record<string, string> = {}
  for (const [key, value] of Object.entries(requiredParameters)) {
    if (value.input) {
      connectionParams[key] = value.input
    }
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
