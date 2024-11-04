import {Flags} from '@oclif/core'

export const deploymentMetadata = {
  data: Flags.string({
    char: 'd',

    description: 'A series of key/value pairs comma separated. Ex: cluster=my_cluster,deployment_name=test',
    required: true,
  }),
  overwrite: Flags.boolean({
    char: 'o',

    description: 'Overwrite metadata. Use to delete keys from metadata instead of additive metadata keys by default.',
    required: false,
  }),
}
