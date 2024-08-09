import {Flags} from '@oclif/core'

export const deploymentMetadata = {
  data: Flags.string({
    char: 'd',

    description: 'A series of key/value pairs comma separated. Ex: cluster=my_cluster,deployment_name=test',
    required: true,
  }),
}
