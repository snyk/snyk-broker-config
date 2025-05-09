import {input, select, confirm} from '@inquirer/prompts'
import {craConfigType1Types, flagConnectionMapping, TypeMapping, TypeParams} from './type-params-mapping.js'
import {createCredentials, getCredentialsForDeployment} from '../../api/credentials.js'
import {CredentialsAttributes, CredentialsListResponse} from '../../api/types.js'
import {isNotProhibitedValue, isValidHostnameWithPort, isValidUrl, isValidUUID} from '../../utils/validation.js'
import {validatedInput, ValidationType} from '../../utils/input-validation.js'
import {getConfig} from '../../config/config.js'

export const captureConnectionParams = async (
  tenantID: string,
  installId: string,
  deploymentId: string,
  connectionType: string,
  parametersToCapture?: Partial<TypeParams>,
): Promise<Record<string, string>> => {
  const requiredParameters = parametersToCapture ?? flagConnectionMapping[connectionType]
  if (!requiredParameters) {
    throw new Error(`Error unable to find connection params for connection type ${connectionType}`)
  }
  for (const [key, value] of Object.entries(requiredParameters)) {
    if (!requiredParameters[key] || !value) {
      throw new Error(`Error unable to find connection param ${key} for connection type ${connectionType}`)
    }
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
        const envVarName = await validatedInput(
          {
            message: `Env Var Name (e.g MY_${key.toLocaleUpperCase()})`,
          },
          ValidationType.ENVVAR,
        )
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
        message += `Must be ${requiredParameters[key].dataType}${requiredParameters[key].prohibitedValues.length > 0 ? ', excluding ' + requiredParameters[key].prohibitedValues.join(',') : ''}.`
      }
      while (!isInputValidated) {
        requiredParameters[key].input = await input({
          message: message,
          default:
            key === 'broker_client_url' && !craConfigType1Types.has(connectionType)
              ? `${getConfig().API_HOSTNAME}`
              : '',
        })
        if (requiredParameters[key].dataType) {
          switch (requiredParameters[key].dataType) {
            case 'hostname': {
              isInputValidated =
                (isValidHostnameWithPort(requiredParameters[key].input) ||
                  isValidUUID(requiredParameters[key].input)) &&
                isNotProhibitedValue(requiredParameters[key].prohibitedValues, requiredParameters[key].input)
              break
            }
            case 'url': {
              isInputValidated =
                (isValidUrl(requiredParameters[key].input) || isValidUUID(requiredParameters[key].input)) &&
                isNotProhibitedValue(requiredParameters[key].prohibitedValues, requiredParameters[key].input)
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
    if (!requiredParameters[key] || !value) {
      throw new Error(`Error unable to find connection param ${key} for connection type ${connectionType}`)
    }
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
