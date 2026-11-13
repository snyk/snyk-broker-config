import {input} from '@inquirer/prompts'
import {getConfig} from '../../config/config.js'
import {isValidUUID} from '../../utils/validation.js'

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

/**
 * True when binding a Connection of this type would fall back to resolving
 * the integration by type, which can pick (and overwrite) the wrong profile.
 */
export const isMissingRequiredIntegrationId = (connectionType: string, integrationId?: string | null): boolean =>
  supportsMultipleProfiles(connectionType) && !isValidUUID(integrationId?.trim() ?? '')

export const missingIntegrationIdMessage = (connectionType: string): string =>
  `Connection type "${connectionType}" supports multiple profiles, so a valid Integration ID (UUID) of an existing Integration (profile) is required. Create the profile in Snyk first, then pass its ID.`

export const integrationIdPromptMessage =
  'Enter the ID of the existing Integration (profile) to bind this Connection to. Create the profile in Snyk first.'

/**
 * Asks for the Integration ID when the type supports multiple profiles, and
 * re-prompts until a UUID is given. Returns undefined, without asking, for
 * every other type.
 */
export const promptForIntegrationId = async (
  connectionType: string,
  message: string = integrationIdPromptMessage,
): Promise<string | undefined> => {
  if (!supportsMultipleProfiles(connectionType)) {
    return undefined
  }

  const answer = await input({
    message,
    validate: (value: string) => (isValidUUID(value.trim()) ? true : 'Please enter a valid UUID.'),
  })
  return answer.trim()
}
