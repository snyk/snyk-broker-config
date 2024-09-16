import {input} from '@inquirer/prompts'
import {isValidEnvVar, isValidUUID} from './validation.js'

export interface InputObject {
  message: string
  default?: string
}
export enum ValidationType {
  UUID = 'uuid',
  ENVVAR = 'envvar',
}

export const validatedInput = async (data: InputObject, typeToValidate?: ValidationType): Promise<string> => {
  let value = ''
  let isInputValidated = false
  let overloadedMessage = `${data.message}. ${typeToValidate ? '(Must be a valid ' + typeToValidate + ').' : ''}`

  while (!isInputValidated) {
    value = await input({message: overloadedMessage, default: data.default ? data.default : ''})

    if (typeToValidate) {
      switch (typeToValidate) {
        case ValidationType.UUID: {
          isInputValidated = isValidUUID(value)
          break
        }
        case ValidationType.ENVVAR: {
          isInputValidated = isValidEnvVar(value)
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

  return value
}