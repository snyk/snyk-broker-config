import {Flags} from '@oclif/core'

export const configurationData = {
  configuration: Flags.string({
    char: 'c',
    description: 'Connection configuration',
    required: true,
  }),
}
