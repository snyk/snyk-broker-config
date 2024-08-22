export type BrokerConnectionConfiguration = {
  required: Record<string, string>
  type: string
}

export type FlagRelationship = string | {name: string; when: (flags: Record<string, unknown>) => Promise<boolean>}
export type Relationship = {
  type: 'all' | 'some' | 'none'
  flags: FlagRelationship[]
}
export type Deprecation = {
  to?: string
  message?: string
  version?: string | number
}
export type AlphabetUppercase =
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'E'
  | 'F'
  | 'G'
  | 'H'
  | 'I'
  | 'J'
  | 'K'
  | 'L'
  | 'M'
  | 'N'
  | 'O'
  | 'P'
  | 'Q'
  | 'R'
  | 'S'
  | 'T'
  | 'U'
  | 'V'
  | 'W'
  | 'X'
  | 'Y'
  | 'Z'
export type AlphabetLowercase =
  | 'a'
  | 'b'
  | 'c'
  | 'd'
  | 'e'
  | 'f'
  | 'g'
  | 'h'
  | 'i'
  | 'j'
  | 'k'
  | 'l'
  | 'm'
  | 'n'
  | 'o'
  | 'p'
  | 'q'
  | 'r'
  | 's'
  | 't'
  | 'u'
  | 'v'
  | 'w'
  | 'x'
  | 'y'
  | 'z'

export type FlagProps = {
  name: string
  char?: AlphabetLowercase | AlphabetUppercase
  /**
   * A short summary of flag usage to show in the flag list.
   * If not provided, description will be used.
   */
  summary?: string
  /**
   * A description of flag usage. If summary is provided, the description
   * is assumed to be a longer description and will be shown in a separate
   * section within help.
   */
  description?: string
  /**
   * The flag label to show in help. Defaults to "[-<char>] --<name>" where -<char> is
   * only displayed if the char is defined.
   */
  helpLabel?: string
  /**
   * Shows this flag in a separate list in the help.
   */
  helpGroup?: string
  /**
   * Accept an environment variable as input
   */
  env?: string
  /**
   * If true, the flag will not be shown in the help.
   */
  hidden?: boolean
  /**
   * If true, the flag will be required.
   */
  required?: boolean
  /**
   * List of flags that this flag depends on.
   */
  dependsOn?: string[]
  /**
   * List of flags that cannot be used with this flag.
   */
  exclusive?: string[]
  /**
   * Exactly one of these flags must be provided.
   */
  exactlyOne?: string[]
  /**
   * Define complex relationships between flags.
   */
  relationships?: Relationship[]
  /**
   * Make the flag as deprecated.
   */
  deprecated?: true | Deprecation
  /**
   * Alternate names that can be used for this flag.
   */
  aliases?: string[]
  /**
   * Alternate short chars that can be used for this flag.
   */
  charAliases?: (AlphabetLowercase | AlphabetUppercase)[]
  /**
   * Emit deprecation warning when a flag alias is provided
   */
  deprecateAliases?: boolean
  /**
   * If true, the value returned by defaultHelp will not be cached in the oclif.manifest.json.
   * This is helpful if the default value contains sensitive data that shouldn't be published to npm.
   */
  noCacheDefault?: boolean
}
