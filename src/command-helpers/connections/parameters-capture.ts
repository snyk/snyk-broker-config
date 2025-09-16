import {input, select, confirm} from '@inquirer/prompts'
import {craConfigType1Types, flagConnectionMapping, TypeMapping, TypeParams} from './type-params-mapping.js'
import {createCredentials, getCredentialsForDeployment} from '../../api/credentials.js'
import {CredentialsAttributes, CredentialsListResponse} from '../../api/types.js'
import {isNotProhibitedValue, isValidHostnameWithPort, isValidUrl, isValidUUID} from '../../utils/validation.js'
import {validatedInput, ValidationType} from '../../utils/input-validation.js'
import {getConfig} from '../../config/config.js'
import {ux} from '@oclif/core'

export const captureConnectionParams = async (
  tenantID: string,
  installId: string,
  deploymentId: string,
  connectionType: string,
  parametersToCapture?: Partial<TypeParams>,
  existingConnectionValues?: Record<string, string>,
): Promise<Record<string, string>> => {
  const requiredParameters = parametersToCapture ?? flagConnectionMapping[connectionType]
  if (!requiredParameters) {
    throw new Error(`Error unable to find connection params for connection type ${connectionType}`)
  }

  const existingValues = existingConnectionValues ?? {}

  for (const [key, value] of Object.entries(requiredParameters)) {
    if (!requiredParameters[key] || !value) {
      throw new Error(`Error unable to find connection param ${key} for connection type ${connectionType}`)
    }
    if (value.skippable) {
      const userWantsToEnterValue = await confirm({
        message: `The ${key} field is optional in connection type ${connectionType}. Do you want to input value (y) or skip (n)?`,
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

      const currentValueMessage = existingValues[key] ? ` (current: ${existingValues[key]})` : ''

      const choice = await select({
        message: `${key} (Sensitive)${currentValueMessage}: ${choices.length > 1 ? 'Which Credential Reference do you want to use? Or create New?' : 'No existing Credential Reference for this Connection type.'}`,
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

      // Set default value if it exists
      let defaultValue = ''
      if (existingValues[key]) {
        // Use existing value from the connection as default
        defaultValue = existingValues[key]
      } else if (key === 'broker_client_url' && !craConfigType1Types.has(connectionType)) {
        // Keep the existing broker_client_url logic for backward compatibility
        defaultValue = `${getConfig().API_HOSTNAME}`
      }

      while (!isInputValidated) {
        requiredParameters[key].input = await input({
          message: message,
          default: defaultValue,
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
    if (value.exampleFormat) {
      console.log(
        ux.colorize(
          'yellow',
          `\nHint! Your credential reference URL value should have the following format: ${value.exampleFormat}.\n`,
        ),
      )
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
