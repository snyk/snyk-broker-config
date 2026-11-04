import {getConfig} from '../../config/config.js'

/**
 * Whether an Org can hold more than one integration of this Connection type.
 *
 * Only these types need a Connection to name the integration it binds to;
 * for everything else an Org holds one integration per type, so asking would
 * be a question with a single possible answer. The server is authoritative
 * either way — this only decides whether it is worth asking.
 */
export const supportsMultipleProfiles = (
  connectionType: string,
  supportedTypes: string[] = getConfig().MULTIPLE_PROFILE_CONNECTION_TYPES,
): boolean => supportedTypes.includes(connectionType)
