import {input} from '@inquirer/prompts'
import {isValidEmail, isValidEnvVar, isValidUUID} from './validation.js'

export interface InputObject {
  message: string
}
export enum ValidationType {
  UUID = 'uuid',
  ENVVAR = 'envvar',
  EMAIL = 'email',
}

export const validatedInput = async (data: InputObject, typeToValidate?: ValidationType): Promise<string> => {
  let value = ''
  let isInputValidated = false
  let overloadedMessage = `${data.message}. ${typeToValidate ? '(Must be a valid ' + typeToValidate + ').' : ''}`

  while (!isInputValidated) {
    value = await input({message: overloadedMessage})

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
        case ValidationType.EMAIL: {
          isInputValidated = isValidEmail(value)
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
