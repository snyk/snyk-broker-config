import {Flags} from '@oclif/core'

export const credentialsData = {
  comment: Flags.string({
    char: 'c',
    description: 'Comment about credentials reference(s).',
    required: true,
  }),
  env_var_name: Flags.string({
    char: 'n',
    description: 'Env var name(s) of the credentials reference(s). Comma separated to specify more than one at a time.',
    required: true,
  }),
  type: Flags.string({
    char: 't',
    description: 'Connection type',
    required: true,
  }),
}

export const credentialsIds = {
  credentialsIds: Flags.string({
    char: 'c',
    description: 'Credentials reference(s) Id(s).',
    required: true,
  }),
}

export const credentialId = {
  credentialsId: Flags.string({
    char: 'i',
    description: 'Credentials reference Id.',
    required: true,
  }),
}
