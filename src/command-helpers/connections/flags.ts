import {Flags} from '@oclif/core'
import {allConnectionsParametersFlagsFunc, allRelationshipsFunc} from './type-params-mapping.js'

export const connectionsData = {
  type: Flags.string({
    char: 't',
    description: 'Connection type',
    required: true,
    relationships: allRelationshipsFunc(),
  }),
  name: Flags.string({
    char: 'n',
    description: 'Connection name',
    required: true,
  }),
  ...allConnectionsParametersFlagsFunc(),
}
